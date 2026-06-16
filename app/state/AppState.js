// =======================================================
// APP STATE — the "model". Owns every piece of saved data (progress, XP,
// personal-best counts) and is the ONLY place allowed to change it. It loads
// from and saves to localStorage itself, so callers just call its methods.
//
// Exported as a single shared instance (`state`) used across the app.
// =======================================================
import { STORAGE_KEY, TOTAL_DAYS } from "../data/config.js";

// Keep a value inside [min, max].
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// The shape (and defaults) of a brand-new save.
function freshState() {
  return {
    keeperName: "Guardian",
    currentDay: 1,
    completedDays: [],  // [1, 2, 3, ...] days finished
    totalXP: 0,
    condBests: {},      // { exerciseName: bestReps } — personal records
    condHistory: [],    // [{ day, name, reps, unit }] — every AMRAP logged
  };
}

class AppState {
  constructor() {
    Object.assign(this, freshState());
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) Object.assign(this, JSON.parse(raw));
    } catch (e) { /* corrupt or empty — keep the fresh defaults */ }

    // Forward-compatible defaults for fields older saves may not have.
    if (!this.condBests) this.condBests = {};
    if (!this.condHistory) this.condHistory = [];
  }

  save() {
    try {
      // Persist only the data fields (no methods).
      const { keeperName, currentDay, completedDays, totalXP, condBests, condHistory } = this;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        keeperName, currentDay, completedDays, totalXP, condBests, condHistory,
      }));
    } catch (e) { /* storage full or unavailable — ignore */ }
  }

  // True once the player has started training (used to skip the title screen).
  hasProgress() {
    return this.completedDays.length > 0 || this.totalXP > 0;
  }

  setKeeperName(name) {
    this.keeperName = name || "Guardian";
    this.save();
  }

  // Jump straight to a day (used by the ?day= test link and "test" cheat).
  jumpToDay(day) {
    this.currentDay = clamp(day | 0, 1, TOTAL_DAYS);
    this.save();
  }

  isDayComplete(day) {
    return this.completedDays.includes(day);
  }

  // ---- personal-best tracking ----

  getCondBest(name) {
    return this.condBests[name] || 0;
  }

  // Record one logged count: add it to the history and update the best.
  recordCondBest(name, reps, unit) {
    this.condHistory.push({ day: this.currentDay, name, reps, unit });
    if (reps > this.getCondBest(name)) this.condBests[name] = reps;
    this.save();
  }

  // Mark a day finished, bank its XP, and unlock the next day.
  completeDay(day, xp) {
    if (!this.isDayComplete(day)) {
      this.completedDays.push(day);
      this.totalXP += xp;
    }
    if (this.currentDay <= day) this.currentDay = Math.min(day + 1, TOTAL_DAYS);
    this.save();
  }
}

export const state = new AppState();
