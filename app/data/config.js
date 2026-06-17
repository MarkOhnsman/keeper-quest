// =======================================================
// CONFIG — all the tunable numbers in one place. Pure data, no logic.
// =======================================================

export const TOTAL_DAYS = 30;

// localStorage key (bump the version to invalidate old saves).
export const STORAGE_KEY = "keeperquest_v3";

// ---- Phase I: Reaction cone drill ----
export const REACTION_SET_MS = 2000; // time to recover to the set position between calls

// ---- Phase III/IV: timed drills (Conditioning + Ball Skills) ----
export const AMRAP_SECONDS = 40;     // seconds of "as many reps as possible" work
export const RING_CIRCUMFERENCE = 264; // matches the SVG countdown ring (2πr, r=42)
export const GO_PAUSE_MS = 450;      // pause after "GO!" before the clock starts

// ---- Beep pitches (Hz) for the hands-free cues ----
export const TONES = {
  set: 440,     // the "set" beat
  cue: 660,     // a direction call
  leadIn: 523,  // the 3 · 2 · 1 countdown
  go: 784,      // "GO!"
  timeUp: 440,  // a timed drill finishing
  warning: 523, // the final few seconds ticking down
};

// ---- Experience points ----
export const REACTION_BASE_XP = 50;     // for completing the reaction phase
export const REACTION_PER_SAVE_XP = 5;  // bonus per cone reached
export const RECORD_BONUS_XP = 25;      // bonus for beating a personal best
export const EFFORT_CAP = 60;           // most "effort" XP a single drill can add

// ---- Gold (a spendable reward, separate from XP) ----
// Earned each time a logged count beats an EXISTING personal best. A first-ever
// score just sets the bar, so it earns nothing. Spendable in real life.
export const GOLD_PER_RECORD = 1;

// A light "parent gate" on manual gold edits (the Add/Remove buttons in the
// Records tab) — just enough to stop the keeper from quietly topping up their
// own balance. It is not real security; the value lives in the page source.
export const PARENT_PASSWORD = "goldcoin";
