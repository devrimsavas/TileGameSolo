# Veni Vidi Memory — Solo

A medieval memory game against the clock. Find all 18 pairs as fast as you can, build up your kingdom on the way, and try to beat your own best time.

<!-- Add the live link here, e.g. **Play online:** https://your-site.onrender.com -->

## The story behind it

In May 1990 I bought my first computer magazine and saw an Amiga game called _Turn It_. In 2023 I wrote my own memory game in Python with Tkinter, with a medieval twist: every card adds attack, defence or happiness to your kingdom. In 2026 I gave that old game a new face and a new platform: it now runs in the browser, with new AI-generated card art.

This repository is the **solo** version: one player, one clock.

## How to play

- Turn over two cards. If they match, the pair flies to your hero and its values are added to your kingdom.
- The clock starts with your first card and stops the moment the last pair is found.
- **Torch** and **Old King** reveal four hidden cards for a moment. Remember them well!
- Your best time and number of moves are saved in your browser. Beat it to see **New record!**

## Features

- 36 cards picked at random from 58 medieval items, so every game is different
- 3D card flips and cards flying to the hero, made with CSS transitions and the Web Animations API
- Timer, move counter and best time (stored with `localStorage`)
- Adapts to the screen: a 9 × 4 board on desktop, a 6 × 6 board on a phone held upright
- Sound effects, a title screen, and rules / kingdom overview windows
- A labelled placeholder appears instead of a broken image if a card picture is missing

## Tech

Plain HTML, CSS and JavaScript (ES modules). No framework, no build step, no dependencies.

The game logic does not touch the page. `game.js` asks the view (`ui.js`) to flip, move and show things, so the same rules could later run somewhere else, for example on a server for an online multiplayer version.

## Project structure

```
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js      startup, menu buttons, resize
│   ├── config.js    settings: asset folders, board size, timings, player
│   ├── data.js      items, card powers and rules text
│   ├── game.js      solo game logic: turns, timer, peek power
│   ├── player.js    the player's kingdom: pairs and stats
│   ├── records.js   best time, saved in the browser
│   ├── ui.js        board, panel, animations, sounds and windows
│   └── utils.js     small helpers
└── assets/
    ├── tiles/        card fronts (one image per item in data.js)
    ├── backs/        card back
    ├── heroes/       hero portrait
    ├── backgrounds/  page and intro backgrounds
    └── sounds/       sound effects
```

## Run locally

The game uses ES modules, which browsers do not load from `file://`. Open it through a local web server instead of double-clicking `index.html`:

- **VS Code:** the _Live Server_ extension, then "Go Live", or
- **Terminal:** `npx serve` in the project folder (runs without installing anything globally)

## Configuration

Most settings live at the top of `js/config.js`: asset folders, the card image extension, board size, animation timings and the player's name and portrait.

To add a card, add an entry to `ITEMS` in `js/data.js` and put an image with the same name in `assets/tiles/` (for example `windmill` → `windmill.jpg`). File names are case-sensitive on most web hosts, so keep them lowercase.

## Deploy

It is a static site. On Render, create a **Static Site** from this repository, leave the build command empty and set the publish directory to `.`.

## Credits

- Program: Devrim Savas Yilmaz
- Original design and graphics (2023 Python version): Devrim Savas Yilmaz & Malin Nilsen
- Card, hero and background art in this version: generated with AI (Gemini)

