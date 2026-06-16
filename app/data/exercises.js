// =======================================================
// EXERCISE POOLS — the moves each day draws from. Pure data.
// Every cue is written so an 11-year-old can do it alone, with no coach.
// =======================================================

// Phase II — equipment-free strength, leaning plyometric (explosive).
// `xp` is the reward for completing the move.
export const STRENGTH_POOL = [
  // — Plyometric (explosive) —
  { name: "Squat Jumps",         detail: "3×10 — Sink into a squat, then explode straight up as high as you can. Land soft and quiet, like a cat.", xp: 30 },
  { name: "Tuck Jumps",          detail: "3×8 — Jump up and pull both knees toward your chest, then land softly and reset before the next one.", xp: 30 },
  { name: "Broad Jumps",         detail: "3×6 — Swing your arms back, then jump forward as far as you can. Land on two feet and hold your balance.", xp: 30 },
  { name: "Skater Jumps",        detail: "3×12 each side — Leap sideways off one foot and land on the other, like a speed skater. Stick the landing.", xp: 30 },
  { name: "Jumping Lunges",      detail: "3×8 each leg — Start in a lunge. Jump up, switch your legs in the air, and land softly back in a lunge.", xp: 30 },
  { name: "Pogo Hops",           detail: "3×20 — Bounce fast on the balls of your feet with knees almost straight. Quick off the ground, like a pogo stick.", xp: 20 },
  { name: "Single-Leg Hops",     detail: "3×8 each leg — Hop forward on one foot, landing softly and balancing before the next hop. Then switch feet.", xp: 30 },
  { name: "Plyo Push-Ups",       detail: "3×6 — Do a push-up and push hard enough that your hands leave the floor. Land with soft elbows. (Hard — do normal push-ups if you need to.)", xp: 30 },
  // — Strength & core (bodyweight) —
  { name: "Wall Sit",            detail: "3×40 sec — Sit with your back flat against a wall and knees bent at 90°, like an invisible chair. Hold still.", xp: 25 },
  { name: "Single-Leg Deadlift", detail: "3×8 each leg — Stand on one leg, reach your hands toward the floor as your other leg lifts behind you, then stand tall again.", xp: 25 },
  { name: "Glute Bridge March",  detail: "3×30 sec — Lie on your back and push your hips up. Slowly lift one knee at a time without letting your hips drop.", xp: 20 },
  { name: "Hollow Body Hold",    detail: "3×25 sec — Lie on your back, press your lower back into the floor, and lift your arms and legs slightly. Hold.", xp: 25 },
  { name: "Superman Hold",       detail: "3×20 sec — Lie face down and lift your arms, chest, and legs off the floor at once. Squeeze your back and hold.", xp: 20 },
  { name: "Russian Twists",      detail: "3×16 — Sit with your feet off the floor and lean back a little. Twist your hands from one side to the other.", xp: 20 },
  { name: "Bear Crawl",          detail: "3×20 sec — On hands and feet with knees just off the floor, crawl forward and back. Keep your back flat and hips low.", xp: 25 },
  { name: "Donkey Kicks",        detail: "3×12 each leg — On your hands and knees, kick one heel up toward the ceiling and squeeze. Then switch legs.", xp: 20 },
  { name: "Calf Raises",         detail: "3×15 — Push up onto your tiptoes as high as you can, then lower down slowly. Hold a wall for balance if needed.", xp: 20 },
  // — Keeper-specific —
  { name: "Lateral Shuffle",     detail: "4×20 sec — Stay low in your keeper stance and shuffle quickly side to side, five steps each way. Don't cross your feet.", xp: 30 },
  { name: "Dive & Recover",      detail: "3×6 each side — From your knees, fall to one side onto your forearm like making a save, then push straight back up to your stance.", xp: 35 },
];

// Phase III — Conditioning Gauntlet. Simple AMRAP movements: go max effort for
// the timer, then log how many you got. `unit` is what you count.
export const CONDITIONING_POOL = [
  { name: "Push-ups",          detail: "Chest to the ground, full lockout at the top each rep",    xp: 35, unit: "reps"  },
  { name: "Sit-ups",           detail: "Shoulder blades touch the ground each rep",                xp: 30, unit: "reps"  },
  { name: "Bodyweight Squats", detail: "Thighs to parallel, drive up through your heels",          xp: 35, unit: "reps"  },
  { name: "Jumping Jacks",     detail: "Full arm and leg extension, steady rhythm",                xp: 30, unit: "reps"  },
  { name: "Jog in Place",      detail: "Knees high — count every time your right foot lands",      xp: 30, unit: "steps" },
  { name: "Mountain Climbers", detail: "Drive your knees to your chest — count each knee",         xp: 35, unit: "reps"  },
  { name: "Lunges",            detail: "Alternate legs, back knee toward the ground — count each", xp: 35, unit: "reps"  },
  { name: "Burpees",           detail: "Chest to the ground, jump with hands overhead at the top", xp: 40, unit: "reps"  },
  { name: "High Knees",        detail: "Knees to waist height, fast — count each knee",            xp: 30, unit: "reps"  },
  { name: "Glute Bridges",     detail: "Squeeze your glutes hard at the top, full hip extension",  xp: 30, unit: "reps"  },
];

// Phase IV — Ball Skills (a ball is needed). `mode` drives the UI:
//   'amrap'  — go for the timer, then log how many touches/reps you got
//   'streak' — no timer; do it, then log your best unbroken streak
//   'skill'  — prescribed technique sequence; mark done, rep log optional
export const BALL_SKILL_POOL = [
  { name: "Toe Taps",          detail: "On your toes, tap the top of the ball with alternating feet — count each tap.",            xp: 30, unit: "touches", mode: "amrap"  },
  { name: "Bell Touches",      detail: "Push the ball side to side between the insides of your feet — count each touch.",          xp: 30, unit: "touches", mode: "amrap"  },
  { name: "Sole Rolls",        detail: "Roll the ball across with the sole of one foot, stop it with the other — count each roll.", xp: 30, unit: "rolls",   mode: "amrap"  },
  { name: "Inside-Outside",    detail: "Push the ball with the inside then the outside of the same foot — count each touch.",      xp: 35, unit: "touches", mode: "amrap"  },
  { name: "V-Pulls",           detail: "Sole pull-back, then push out at an angle with your instep to make a V — count each rep.",  xp: 35, unit: "reps",    mode: "amrap"  },
  { name: "Juggling",          detail: "Keep the ball off the ground with any part of your body. Log your best unbroken streak.",  xp: 45, unit: "streak",  mode: "streak" },
  { name: "Pull-Back Combo",   detail: "Each foot: pull back + instep push, pull a V, pull & roll behind. Sequence ×4 each foot.",  xp: 35, unit: "reps",    mode: "skill"  },
  { name: "Turn & Accelerate", detail: "Moderate pace, turn 180° (pull turn, drag-back, inside chop, Cruyff…) and explode 3 touches. ×4 each foot.", xp: 40, unit: "reps", mode: "skill" },
];

// Phase I — ground-level cone drill cues. All reachable by a keeper moving
// along the grass to a cone — no "high" dives. `say` is spoken aloud.
export const REACTION_CUES = [
  { arrow: "⬅️", dir: "LEFT",      say: "Left"      },
  { arrow: "➡️", dir: "RIGHT",     say: "Right"     },
  { arrow: "↙️", dir: "LOW LEFT",  say: "Low left"  },
  { arrow: "↘️", dir: "LOW RIGHT", say: "Low right" },
  { arrow: "⬆️", dir: "FORWARD",   say: "Forward"   },
];
