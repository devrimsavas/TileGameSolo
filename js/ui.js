// Everything that touches the page: board, panel, animations, sounds and windows.

import { ITEMS, POWER_TEXTS, INTRO_TEXT } from "./data.js";
import { TILE_FOLDER, TILE_EXTENSION, BACK_IMAGE, SOUND_FILES, COLUMNS, ROWS, FLY_MS } from "./config.js";
import { pretty, signed, sleep } from "./utils.js";

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
    $("introText").textContent = INTRO_TEXT;
    intro.addEventListener("pointerdown", () => this.playSound("intro"), { once: true });
    $("btnStart").onclick = (event) => {
      event.stopPropagation();
      this.sounds.intro.stop();
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

    game.players.forEach((player, i) => {
      const hero = $(`hero${i}`);
      hero.style.setProperty("--c", player.color);
      hero.innerHTML = `<div class="name">${player.name.toUpperCase()}</div><div class="portrait"></div>`;
      hero.querySelector(".portrait").append(picture(player.image, player.name));
      hero.onclick = () => this.showKingdom(player);
    });
  }

  setFront(card) {
    const front = this.cardElements.get(card).querySelector(".front");
    front.innerHTML = "";
    front.append(picture(tilePath(card.name), pretty(card.name)));
  }

  render(game, extraTurn = false) {
    game.players.forEach((p, i) => {
      $(`hero${i}`).classList.toggle("active", i === game.current && !game.over);
      const low = p.happiness <= 0 && p.pairs.length > 0 ? "low" : "";
      $(`stats${i}`).innerHTML = `
        <div class="pairs">${p.pairs.length} pairs</div>
        <div>Attack Power: ${p.attack}</div>
        <div>Defence Power: ${p.defence}</div>
        <div class="${low}">Happiness: ${p.happiness}</div>`;
    });
    if (!game.over) $("turn").textContent = `${game.player.name}'s turn${extraTurn ? " (again!)" : ""}`;
  }

  /** Show what just happened in the middle of the bottom panel. */
  showEvent(event) {
    let html;
    switch (event.type) {
      case "start":
        html = "Find matching pairs. Every pair strengthens your kingdom.";
        break;
      case "take": {
        const [a, d, h, description] = ITEMS[event.name];
        html = `<b>${event.player.name} takes ${pretty(event.name)}</b><br>${description.replace(/\n/g, " ")}<br>
                Attack ${signed(a)} &nbsp; Defence ${signed(d)} &nbsp; Happiness ${signed(h)}
                ${event.power ? `<br><span class="power">${POWER_TEXTS[event.power]}</span>` : ""}`;
        break;
      }
      case "revolt":
        html = `<b class="bad">REVOLT!</b> ${event.player.name}'s people refuse <b>${pretty(event.name)}</b>.
                Happiness cannot drop below zero, the pair is lost.`;
        break;
      case "steal":
        html = `<b>${event.player.name}</b> captures <b>${pretty(event.name)}</b> from ${event.enemy.name}!`;
        break;
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

  /** Shake the cards, then let them fade away (used for a revolt). */
  async discard(cards) {
    const elements = cards.map((card) => this.cardElements.get(card));
    elements.forEach((el) => el.classList.add("shake"));
    await sleep(700);
    await Promise.all(elements.map((el) =>
      el.animate([{ opacity: 1, filter: "none" }, { opacity: 0, filter: "grayscale(1) blur(2px)" }],
                 { duration: 600 }).finished));
    elements.forEach((el) => el.classList.add("taken"));
  }

  pulseHero(index) {
    $(`hero${index}`).querySelector(".portrait").animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }],
      { duration: 380, easing: "ease-out" });
  }

  reshuffled(cards) {
    cards.forEach((card) => this.setFront(card));
    $("board").animate([{ filter: "none" }, { filter: "hue-rotate(60deg) brightness(1.3)" }, { filter: "none" }],
                       { duration: 700 });
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

  showWinner(title, results) {
    $("turn").textContent = title;
    const line = ({ player, points, damage }) => `<b>${player.name}</b>: ${points} Victory Points
      <br><span style="color: var(--muted)">${player.pairs.length} pairs + ${player.happiness} happiness
      + 2 × ${damage} damage</span>`;
    this.openModal(`<h2>The Final Battle</h2>
      <div class="result"><div class="winner">${title}</div>${results.map(line).join("<br><br>")}</div>
      <div class="actions"><button class="btn" id="again">Play again</button></div>`);
    $("again").onclick = () => { this.closeModal(); this.onPlayAgain?.(); };
  }
}