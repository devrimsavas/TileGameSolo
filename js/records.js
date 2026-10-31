// Best time, saved in this browser only.

const KEY = "veni-vidi-memory-solo-best";

/** Returns { time, moves } or null. */
export function loadBest() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved && typeof saved.time === "number" ? saved : null;
  } catch {
    return null;   // Storage blocked (private window, settings): play without records
  }
}

/** Saves the result if it beats the best time. Returns { isRecord, best }. */
export function saveResult(time, moves) {
  const best = loadBest();
  if (best && best.time <= time) return { isRecord: false, best };
  const record = { time, moves };
  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // Ignore: the record just won't be remembered
  }
  return { isRecord: true, best: record, previous: best };
}