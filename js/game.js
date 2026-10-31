// Solo game logic: find all pairs as fast as possible. The game never touches the page
// directly: it asks the view (ui.js) to flip, move and show things.

import { ITEMS, POWERS, POWER } from "./data.js";
import {
  PAIR_COUNT,
  PEEK_CARD_COUNT,
  FLIP_MS,
  MISMATCH_DELAY_MS,
  PEEK_DURATION_MS,
  PLAYER_SETUP,
} from "./config.js";
import { Player } from "./player.js";
import { saveResult } from "./records.js";
import { sleep, shuffle } from "./utils.js";

export class Game {
  constructor(view) {
    this.view = view;
    this.round = 0; // Changes on every new game so actions from an old game stop
  }

  start() {
    this.round++;
    this.busy = false; // True while a pair is being resolved; clicks are ignored
    this.over = false;
    this.selected = [];
    this.moves = 0; // One move = turning over two cards
    this.startTime = null; // Set on the first click
    this.endTime = null;
    this.player = new Player(PLAYER_SETUP[0]);

    const names = shuffle(Object.keys(ITEMS)).slice(0, PAIR_COUNT);
    this.cards = shuffle([...names, ...names]).map((name) => ({
      name,
      open: false,
      taken: false,
    }));

    this.view.setup(this);
    this.view.showEvent({ type: "start" });
    this.view.render(this);
  }

  /** Milliseconds played so far (0 before the first click). */
  get elapsed() {
    if (this.startTime === null) return 0;
    return (this.endTime ?? performance.now()) - this.startTime;
  }

  flip(card, open) {
    card.open = open;
    this.view.flip(card, open);
  }

  async clickCard(card) {
    if (this.busy || this.over || card.open || card.taken) return;

    if (this.startTime === null) {
      this.startTime = performance.now();
      this.view.startClock(this);
    }

    this.view.playSound("click");
    this.flip(card, true);
    this.selected.push(card);
    if (this.selected.length < 2) return;

    this.busy = true;
    this.moves++;
    this.view.render(this);
    const round = this.round;
    const [first, second] = this.selected;
    await sleep(FLIP_MS);
    if (round !== this.round) return;

    if (first.name !== second.name) {
      await sleep(MISMATCH_DELAY_MS);
      if (round !== this.round) return;
      this.flip(first, false);
      this.flip(second, false);
      await sleep(FLIP_MS);
      return this.finishTurn(round);
    }

    this.view.playSound("taken");
    await this.takePair(first, second, round);
  }

  async takePair(first, second, round) {
    first.taken = second.taken = true;
    const done = this.cards.every((c) => c.taken);
    if (done) this.endTime = performance.now(); // Stop the clock at the last match, not after the animation

    await Promise.all([
      this.view.flyToHero(first, 0),
      this.view.flyToHero(second, 0),
    ]);
    if (round !== this.round) return;

    const power = POWERS[first.name] === POWER.PEEK ? POWER.PEEK : null; // Only peek makes sense solo
    this.player.addPair(first.name);
    this.view.showEvent({
      type: "take",
      player: this.player,
      name: first.name,
      power,
    });
    this.view.pulseHero(0);
    this.view.render(this);

    if (power === POWER.PEEK && !done) await this.peek(round);
    this.finishTurn(round);
  }

  /** Torch / Old King: show a few hidden cards for a moment. */
  async peek(round) {
    const shown = shuffle(this.cards.filter((c) => !c.taken && !c.open)).slice(
      0,
      PEEK_CARD_COUNT,
    );
    shown.forEach((c) => this.flip(c, true));
    await sleep(FLIP_MS + PEEK_DURATION_MS);
    if (round !== this.round) return;
    shown.forEach((c) => this.flip(c, false));
    await sleep(FLIP_MS);
  }

  finishTurn(round) {
    if (round !== this.round) return;
    this.selected = [];
    this.busy = false;
    if (this.cards.every((c) => c.taken)) this.finish();
  }

  finish() {
    this.over = true;
    this.view.stopClock();
    const time = Math.round(this.elapsed);
    const result = saveResult(time, this.moves);
    this.view.render(this);
    this.view.showResult({ time, moves: this.moves, ...result });
  }
}
