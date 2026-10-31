// Settings: change folders, board size, timings and players here.

const ASSETS = "assets";

export const TILE_FOLDER = `${ASSETS}/tiles`;
export const TILE_EXTENSION = ".jpg";
export const BACK_IMAGE = `${ASSETS}/backs/backface.png`;

export const SOUND_FILES = {
  click: `${ASSETS}/sounds/click.wav`,
  taken: `${ASSETS}/sounds/card_taken.mp3`,
  intro: `${ASSETS}/sounds/intro.mp3`,
};

export const PLAYER_SETUP = [
  { name: "Xantor", image: `${ASSETS}/heroes/player1x.png`, color: "var(--red)" },
  { name: "Salom", image: `${ASSETS}/heroes/player2x.png`, color: "var(--blue)" },
];

// Board
export const COLUMNS = 9;
export const ROWS = 4;
export const PAIR_COUNT = (COLUMNS * ROWS) / 2;

// Rules
export const PEEK_CARD_COUNT = 4;

// Timing (milliseconds)
export const FLIP_MS = 200;           // Must match the transition time of .card .inner in style.css
export const MISMATCH_DELAY_MS = 400;
export const PEEK_DURATION_MS = 800;
export const FLY_MS = 450;