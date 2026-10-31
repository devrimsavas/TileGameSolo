// Turn logic and card powers. The game never touches the page directly:
// it asks the view (ui.js) to flip, move and show things.

import { ITEMS, POWERS, POWER } from "./data.js";
import { PAIR_COUNT, PEEK_CARD_COUNT, FLIP_MS, MISMATCH_DELAY_MS, PEEK_DURATION_MS, PLAYER_SETUP } from "./config.js";
import { Player } from "./player.js";
import { sleep, shuffle } from "./utils.js";

export class Game {
  constructor(view) {
    this.view = view;
    this.round = 0;    // Changes on every new game so actions from an old game stop
  }

  get player() { return this.players[this.current]; }
  get enemy() { return this.players[(this.current + 1) % this.players.length]; }

  start() {
    this.round++;
    this.busy = false;     // True while a pair is being resolved; clicks are ignored
    this.over = false;
    this.current = 0;
    this.selected = [];
    this.players = PLAYER_SETUP.map((setup) => new Player(setup));

    const names = shuffle(Object.keys(ITEMS)).slice(0, PAIR_COUNT);
    this.cards = shuffle([...names, ...names]).map((name) => ({ name, open: false, taken: false }));

    this.view.setup(this);
    this.view.showEvent({ type: "start" });
    this.view.render(this);
  }

  flip(card, open) {
    card.open = open;
    this.view.flip(card, open);
  }

  async clickCard(card) {
    if (this.busy || this.over || card.open || card.taken) return;
    this.view.playSound("click");
    this.flip(card, true);
    this.selected.push(card);
    if (this.selected.length < 2) return;

    this.busy = true;
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

    if (this.player.wouldRevolt(first.name)) return this.revolt(first, second, round);
    this.view.playSound("taken");
    return this.takePair(first, second, round);
  }

  async revolt(first, second, round) {
    first.taken = second.taken = true;
    this.view.showEvent({ type: "revolt", player: this.player, name: first.name });
    await this.view.discard([first, second]);
    this.finishTurn(round);
  }

  async takePair(first, second, round) {
    first.taken = second.taken = true;
    await Promise.all([this.view.flyToHero(first, this.current), this.view.flyToHero(second, this.current)]);
    if (round !== this.round) return;

    const power = POWERS[first.name];
    this.player.addPair(first.name);
    this.view.showEvent({ type: "take", player: this.player, name: first.name, power });
    this.view.pulseHero(this.current);
    this.view.render(this);
    await this.applyPower(power, round);
  }

  // ---------- Card powers ----------

  async applyPower(power, round) {
    if (power === POWER.EXTRA_TURN) return this.finishTurn(round, true);

    if (power === POWER.PEEK) {
      const shown = shuffle(this.cards.filter((c) => !c.taken && !c.open)).slice(0, PEEK_CARD_COUNT);
      shown.forEach((c) => this.flip(c, true));
      await sleep(FLIP_MS + PEEK_DURATION_MS);
      if (round !== this.round) return;
      shown.forEach((c) => this.flip(c, false));
      await sleep(FLIP_MS);
      return this.finishTurn(round, true);
    }

    if (power === POWER.STEAL) {
      const stolen = this.enemy.removeLastPair();
      if (stolen) {
        this.player.addPair(stolen);
        this.view.showEvent({ type: "steal", player: this.player, enemy: this.enemy, name: stolen });
      }
      this.view.render(this);
    }

    if (power === POWER.SHUFFLE) {
      // The cards are face down, so swapping their names changes nothing visible
      const remaining = this.cards.filter((c) => !c.taken);
      const names = shuffle(remaining.map((c) => c.name));
      remaining.forEach((c, i) => { c.name = names[i]; });
      this.view.reshuffled(remaining);
    }

    this.finishTurn(round);
  }

  // ---------- End of turn and game ----------

  finishTurn(round, extraTurn = false) {
    if (round !== this.round) return;
    this.selected = [];
    this.busy = false;

    if (this.cards.every((c) => c.taken)) return this.finish();
    if (!extraTurn) this.current = (this.current + 1) % this.players.length;
    this.view.render(this, extraTurn);
  }

  finish() {
    this.over = true;
    const [a, b] = this.players;
    const results = [
      { player: a, ...a.victoryPoints(b) },
      { player: b, ...b.victoryPoints(a) },
    ];
    const [ra, rb] = results;
    const title = ra.points === rb.points
      ? "The battle ends in a draw!"
      : `${(ra.points > rb.points ? a : b).name} wins the battle!`;
    this.view.render(this);
    this.view.showWinner(title, results);
  }
}