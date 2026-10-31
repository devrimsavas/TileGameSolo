// Small helpers used by several modules.

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Shuffle a list in place (Fisher-Yates) and return it. */
export function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

/** "irondoor" -> "Irondoor" */
export const pretty = (name) => name.charAt(0).toUpperCase() + name.slice(1);

/** 2 -> "+2", -1 -> "-1" */
export const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);

/** 83456 -> "01:23.4" */
export function formatTime(ms) {
  const tenths = Math.floor(ms / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths % 10}`;
}
