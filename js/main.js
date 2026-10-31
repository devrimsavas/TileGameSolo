// Startup: connects the game logic to the view and the menu buttons.

import { View, fitToWindow } from "./ui.js";
import { Game } from "./game.js";
import { RULES_TEXT, ABOUT_TEXT } from "./data.js";

const view = new View();
const game = new Game(view);
view.onPlayAgain = () => game.start();

document.getElementById("btnNew").onclick = () => { view.closeModal(); game.start(); };
document.getElementById("btnRules").onclick = () => view.showText("Game Rules", RULES_TEXT);
document.getElementById("btnAbout").onclick = () => view.showText("About", ABOUT_TEXT);

addEventListener("resize", fitToWindow);
addEventListener("load", fitToWindow);   // Phones may report their final size only after loading
fitToWindow();
view.showIntro();
game.start();