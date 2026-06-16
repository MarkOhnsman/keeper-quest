// =======================================================
// DAYS — builds one day's training plan on demand.
// The plan is deterministic: a seeded shuffle means Day 7 always picks the
// same exercises, but every day differs from the next. Difficulty ramps up
// with the day number (more drills, faster reaction calls).
// =======================================================
import { STRENGTH_POOL, CONDITIONING_POOL, BALL_SKILL_POOL } from "./exercises.js";
import { DAY_LORE } from "./lore.js";
import { seededShuffle } from "../utils/rng.js";

// How many exercises each block gets on a given day (grows over the 30 days).
const STRENGTH_PER_DAY = 2;
function conditioningCount(day) { return 2 + Math.floor(day / 8);  } // 2 → 5
function ballSkillCount(day)   { return 2 + Math.floor(day / 10); } // 2 → 5

// Reaction phase: more cone calls and a faster pace as the days go on.
function reactionReps(day) { return 8 + Math.floor(day * 0.5); }
// Time per call: long enough to react, move to the cone, touch it, and recover.
// Eases from ~4s (day 1) down to a floor of 2.2s (day 30+).
function reactionMs(day) { return Math.max(4000 - day * 62, 2200); }

// Build the full plan for `day` (1–30).
export function buildDay(day) {
  const strength = seededShuffle(STRENGTH_POOL, day * 7);
  const conditioning = seededShuffle(CONDITIONING_POOL, day * 13);
  const ballSkills = seededShuffle(BALL_SKILL_POOL, day * 17);

  return {
    day,
    lore: DAY_LORE[day - 1],
    strength: strength.slice(0, STRENGTH_PER_DAY),
    conditioning: conditioning.slice(0, conditioningCount(day)),
    ballSkills: ballSkills.slice(0, ballSkillCount(day)),
    reactionReps: reactionReps(day),
    reactionMs: reactionMs(day),
  };
}
