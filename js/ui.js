// Everything that touches the page: board, panel, animations, sounds and windows.

import { ITEMS, POWER_TEXTS } from "./data.js";
import { TILE_FOLDER, TILE_EXTENSION, BACK_IMAGE, SOUND_FILES, COLUMNS, ROWS, FLY_MS, PAIR_COUNT } from "./config.js";
import { loadBest } from "./records.js";
import { pretty, signed, formatTime } from "./utils.js";

const $ = (id) => document.getElementById(id);
const tilePath = (name) => `${TILE_FOLDER}/${name}${TILE_EXTENSION}`;

/** An <img> that turns into a labelled placeholder if the file is missing. */
function picture(src, label, className = "") {
  const img = document.createElement("img");
  img.src = src;
  img.alt = label;
  img.draggable = false;
  if (className) img.className = className;
  img.onerror = () => {
    const box = document.createElement("div");
    box.className = `placeholder ${className}`;
    box.textContent = label;
    img.replaceWith(box);
  };
  return img;
}

function sound(file) {
  const audio = new Audio(file);
  return {
    play() { audio.currentTime = 0; audio.play().catch(() => {}); },  // Missing files stay silent
    stop() { audio.pause(); },
  };
}

const CARD_RATIO = 1.4;          // Card height / width; must match --ch in style.css
const PHONE_COLUMNS = 6;         // 6 x 6 board on a phone held upright

// Phones can report a wider window while the page is still too wide, so never trust more than the screen
const screenWidth = () => Math.min(innerWidth, screen.width);

/** True on a narrow screen held upright. */
const isPhone = () => screenWidth() < 760 && innerHeight > screenWidth();

/** Pick the layout and a card size so the whole table fits the window. */
export function fitToWindow() {
  const phone = isPhone();
  const innerWidth = screenWidth();
  const columns = phone ? PHONE_COLUMNS : COLUMNS;
  const rows = (COLUMNS * ROWS) / columns;
  const gap = 3;

  let byWidth, byHeight;
  if (phone) {
    // On a phone the page may scroll down to the panel, so only the width limits the cards
    byWidth = (innerWidth - 20 - (columns - 1) * gap) / columns;
    byHeight = Infinity;
  } else {
    byWidth = (innerWidth - 60 - (columns - 1) * gap) / (columns + 0.3);
    // Board rows + panel (about 1.75 card widths) + margins
    byHeight = (innerHeight - 70 - (rows - 1) * gap) / (rows * CARD_RATIO + 0.3 + 1.75);
  }

  const cardWidth = Math.max(36, Math.min(150, byWidth, byHeight));
  const root = document.documentElement.style;
  root.setProperty("--cw", `${cardWidth}px`);
  root.setProperty("--cols", columns);
  document.body.classList.toggle("phone", phone);
}

export class View {
  constructor() {
    this.sounds = Object.fromEntries(Object.entries(SOUND_FILES).map(([key, file]) => [key, sound(file)]));
    this.cardElements = new Map();   // card object -> its element on the board

    $("modal").addEventListener("click", (event) => { if (event.target.id === "modal") this.closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") this.closeModal(); });
  }

  playSound(name) { this.sounds[name]?.play(); }

  // ---------- Intro ----------

  showIntro() {
    const intro = $("intro");
    $("btnStart").onclick = (event) => {
      event.stopPropagation();
      intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500 }).finished
        .then(() => { intro.style.display = "none"; });
    };
  }

  // ---------- Board and panel ----------

  setup(game) {
    const board = $("board");
    board.innerHTML = "";
    this.cardElements.clear();

    for (const card of game.cards) {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = '<div class="inner"><div class="face back"></div><div class="face front"></div></div>';
      el.querySelector(".back").append(picture(BACK_IMAGE, "VENI VIDI"));
      el.addEventListener("click", () => game.clickCard(card));
      this.cardElements.set(card, el);
      this.setFront(card);
      board.append(el);
    }

    const player = game.player;
    const hero = $("hero0");
    hero.style.setProperty("--c", player.color);
    hero.innerHTML = `<div class="name">${player.name.toUpperCase()}</div><div class="portrait"></div>`;
    hero.querySelector(".portrait").append(picture(player.image, player.name));
    hero.onclick = () => this.showKingdom(player);

    $("stats1").innerHTML = `
      <div class="clock" id="clock">00:00.0</div>
      <div>Moves: <span id="moves">0</span></div>
      <div>Best: <span id="best"></span></div>`;
    this.showBest();
  }

  setFront(card) {
    const front = this.cardElements.get(card).querySelector(".front");
    front.innerHTML = "";
    front.append(picture(tilePath(card.name), pretty(card.name)));
  }

  render(game) {
    const p = game.player;
    $("hero0").classList.toggle("active", !game.over);
    $("stats0").innerHTML = `
      <div class="pairs">${p.pairs.length} / ${PAIR_COUNT} pairs</div>
      <div>Attack Power: ${p.attack}</div>
      <div>Defence Power: ${p.defence}</div>
      <div>Happiness: ${p.happiness}</div>`;
    $("moves").textContent = game.moves;
    this.updateClock(game);

    if (game.over) $("turn").textContent = "Victory!";
    else if (game.startTime === null) $("turn").textContent = "Turn over a card to start the clock";
    else $("turn").textContent = `${PAIR_COUNT - p.pairs.length} pairs to go`;
  }

  // ---------- Clock ----------

  startClock(game) {
    this.stopClock();
    this.clockTimer = setInterval(() => this.updateClock(game), 100);
  }

  stopClock() {
    clearInterval(this.clockTimer);
  }

  updateClock(game) {
    $("clock").textContent = formatTime(game.elapsed);
  }

  showBest() {
    const best = loadBest();
    $("best").textContent = best ? `${formatTime(best.time)} (${best.moves} moves)` : "none yet";
  }


  /** Show what just happened in the middle of the bottom panel. */
  showEvent(event) {
    let html;
    switch (event.type) {
      case "start":
        html = "Find all the pairs as fast as you can. Every pair strengthens your kingdom.";
        break;
      case "take": {
        const [a, d, h, description] = ITEMS[event.name];
        html = `<b>${event.player.name} takes ${pretty(event.name)}</b><br>${description.replace(/\n/g, " ")}<br>
                Attack ${signed(a)} &nbsp; Defence ${signed(d)} &nbsp; Happiness ${signed(h)}
                ${event.power ? `<br><span class="power">${POWER_TEXTS[event.power]}</span>` : ""}`;
        break;
      }
    }

    const log = $("log");
    log.innerHTML = "";
    if (event.name) log.append(picture(tilePath(event.name), pretty(event.name), "thumb"));
    const text = document.createElement("div");
    text.innerHTML = html;
    log.append(text);
    log.classList.remove("flash");
    void log.offsetWidth;  // Restart the flash animation
    log.classList.add("flash");
  }

  // ---------- Animations ----------

  flip(card, open) {
    this.cardElements.get(card).classList.toggle("open", open);
  }

  /** Fly a copy of the card into the hero portrait, then hide the original. */
  async flyToHero(card, playerIndex) {
    const el = this.cardElements.get(card);
    const from = el.getBoundingClientRect();
    const to = $(`hero${playerIndex}`).querySelector(".portrait").getBoundingClientRect();

    const ghost = el.cloneNode(true);
    Object.assign(ghost.style, {
      position: "fixed", left: `${from.left}px`, top: `${from.top}px`,
      width: `${from.width}px`, height: `${from.height}px`, zIndex: 25, pointerEvents: "none",
    });
    document.body.append(ghost);
    el.classList.add("taken");

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const tilt = dx > 0 ? 6 : -6;
    await ghost.animate([
      { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.12) rotate(${tilt}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.3) rotate(0deg)`, opacity: 0.15 },
    ], { duration: FLY_MS, easing: "cubic-bezier(.45, 0, .55, 1)" }).finished;
    ghost.remove();
  }

  pulseHero(index) {
    $(`hero${index}`).querySelector(".portrait").animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
      { duration: 380, easing: "ease-out" });
  }

  // ---------- Windows ----------

  openModal(html) {
    $("sheet").innerHTML = html;
    $("modal").classList.add("show");
    const close = $("sheet").querySelector("[data-close]");
    if (close) close.onclick = () => this.closeModal();
  }

  closeModal() { $("modal").classList.remove("show"); }

  showText(title, text) {
    this.openModal(`<h2>${title}</h2><pre></pre><div class="actions"><button class="btn" data-close>Close</button></div>`);
    $("sheet").querySelector("pre").textContent = text;
  }

  showKingdom(player) {
    this.openModal(`<h2>${player.name}'s kingdom</h2>
      <p>${player.pairs.length} pairs &nbsp;·&nbsp; ATK ${player.attack} &nbsp;·&nbsp; DEF ${player.defence}
         &nbsp;·&nbsp; HAP ${player.happiness}</p>
      <div class="gallery"></div>
      <div class="actions"><button class="btn" data-close>Close</button></div>`);
    const gallery = $("sheet").querySelector(".gallery");
    if (!player.pairs.length) gallery.textContent = "No cards yet.";
    player.pairs.forEach((name) => gallery.append(picture(tilePath(name), pretty(name), "thumb")));
  }

  showResult({ time, moves, isRecord, best, previous }) {
    this.showBest();
    const recordLine = isRecord
      ? `<div class="record">New record!</div>${previous ? `<div class="muted">Previous best: ${formatTime(previous.time)}</div>` : ""}`
      : `<div class="muted">Best: ${formatTime(best.time)} (${best.moves} moves)</div>`;
    this.openModal(`<h2>Victory!</h2>
      <div class="result">
        <div class="winner">${formatTime(time)}</div>
        <div>${moves} moves</div>
        ${recordLine}
      </div>
      <div class="actions"><button class="btn" id="again">Play again</button></div>`);
    $("again").onclick = () => { this.closeModal(); this.onPlayAgain?.(); };
  }

}