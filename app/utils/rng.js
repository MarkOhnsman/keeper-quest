// =======================================================
// Small pure helpers for randomness. No DOM, no app state —
// safe to import anywhere.
// =======================================================

// Pick one random item from an array.
export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle a COPY of `arr` deterministically from a numeric `seed`.
// Same seed -> same order every time, so a given day always builds the same
// workout, but different days differ. (Mulberry32 PRNG + Fisher-Yates.)
export function seededShuffle(arr, seed) {
  const copy = arr.slice();
  const rand = makeRandom(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Build a seeded pseudo-random generator (Mulberry32).
function makeRandom(seed) {
  let s = seed >>> 0;
  return function next() {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
