// A player's kingdom: the pairs they hold and their stats. No drawing here.

import { ITEMS } from "./data.js";

export class Player {
  constructor({ name, image, color }) {
    this.name = name;
    this.image = image;
    this.color = color;
    this.pairs = [];        // One card name per matched pair, oldest first
    this.attack = 0;
    this.defence = 0;
    this.happiness = 0;
  }

  applyStats(name, sign) {
    const [attack, defence, happiness] = ITEMS[name];
    this.attack += sign * attack;
    this.defence += sign * defence;
    this.happiness += sign * happiness;
  }

  /** True if taking this card would push happiness below zero. */
  wouldRevolt(name) {
    return this.happiness + ITEMS[name][2] < 0;
  }

  addPair(name) {
    this.pairs.push(name);
    this.applyStats(name, +1);
  }

  /** Remove the most recent pair, undo its stats and return its name (undefined if empty). */
  removeLastPair() {
    const name = this.pairs.pop();
    if (name) this.applyStats(name, -1);
    return name;
  }

  /** Pairs + happiness + 2 points for every attack point that gets through the enemy's defence. */
  victoryPoints(enemy) {
    const damage = Math.max(0, this.attack - enemy.defence);
    return { points: this.pairs.length + this.happiness + 2 * damage, damage };
  }
}