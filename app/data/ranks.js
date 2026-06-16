// =======================================================
// RANKS — the Keeper progression ladder, plus two pure lookups.
// A rank is unlocked once total XP reaches its `minXP`.
// =======================================================

export const RANKS = [
  { level: 1, name: "Initiate",     minXP: 0    },
  { level: 2, name: "Apprentice",   minXP: 300  },
  { level: 3, name: "Sentinel",     minXP: 700  },
  { level: 4, name: "Guardian",     minXP: 1400 },
  { level: 5, name: "Warden",       minXP: 2400 },
  { level: 6, name: "Keeper",       minXP: 3800 },
  { level: 7, name: "Grand Keeper", minXP: 5600 },
];

// The highest rank reached at the given XP.
export function getRank(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
}

// The next rank up, or null if already at the top.
export function getNextRank(currentLevel) {
  return RANKS.find((r) => r.level === currentLevel + 1) || null;
}
