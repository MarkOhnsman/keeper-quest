'use strict';

/* ══════════════════════════════════════
   DATA — Ranks, Days, Exercise Pools
══════════════════════════════════════ */

const RANKS = [
  { level: 1, name: 'Initiate',     minXP: 0    },
  { level: 2, name: 'Apprentice',   minXP: 300  },
  { level: 3, name: 'Sentinel',     minXP: 700  },
  { level: 4, name: 'Guardian',     minXP: 1400 },
  { level: 5, name: 'Warden',       minXP: 2400 },
  { level: 6, name: 'Keeper',       minXP: 3800 },
  { level: 7, name: 'Grand Keeper', minXP: 5600 },
];

// Equipment-free, plyometric-leaning strength for an 11-year-old. Real,
// searchable names; every cue is written so he can do it without a coach.
const STRENGTH_POOL = [
  // — Plyometric (explosive) —
  { name: 'Squat Jumps',        detail: '3×10 — Sink into a squat, then explode straight up as high as you can. Land soft and quiet, like a cat.', xp: 30 },
  { name: 'Tuck Jumps',         detail: '3×8 — Jump up and pull both knees toward your chest, then land softly and reset before the next one.',     xp: 30 },
  { name: 'Broad Jumps',        detail: '3×6 — Swing your arms back, then jump forward as far as you can. Land on two feet and hold your balance.',  xp: 30 },
  { name: 'Skater Jumps',       detail: '3×12 each side — Leap sideways off one foot and land on the other, like a speed skater. Stick the landing.', xp: 30 },
  { name: 'Jumping Lunges',     detail: '3×8 each leg — Start in a lunge. Jump up, switch your legs in the air, and land softly back in a lunge.',     xp: 30 },
  { name: 'Pogo Hops',          detail: '3×20 — Bounce fast on the balls of your feet with knees almost straight. Quick off the ground, like a pogo stick.', xp: 20 },
  { name: 'Single-Leg Hops',    detail: '3×8 each leg — Hop forward on one foot, landing softly and balancing before the next hop. Then switch feet.',  xp: 30 },
  { name: 'Plyo Push-Ups',      detail: '3×6 — Do a push-up and push hard enough that your hands leave the floor. Land with soft elbows. (Hard — do normal push-ups if you need to.)', xp: 30 },
  // — Strength & core (bodyweight) —
  { name: 'Wall Sit',           detail: '3×40 sec — Sit with your back flat against a wall and knees bent at 90°, like an invisible chair. Hold still.', xp: 25 },
  { name: 'Single-Leg Deadlift',detail: '3×8 each leg — Stand on one leg, reach your hands toward the floor as your other leg lifts behind you, then stand tall again.', xp: 25 },
  { name: 'Glute Bridge March', detail: '3×30 sec — Lie on your back and push your hips up. Slowly lift one knee at a time without letting your hips drop.', xp: 20 },
  { name: 'Hollow Body Hold',   detail: '3×25 sec — Lie on your back, press your lower back into the floor, and lift your arms and legs slightly. Hold.', xp: 25 },
  { name: 'Superman Hold',      detail: '3×20 sec — Lie face down and lift your arms, chest, and legs off the floor at once. Squeeze your back and hold.', xp: 20 },
  { name: 'Russian Twists',     detail: '3×16 — Sit with your feet off the floor and lean back a little. Twist your hands from one side to the other.',   xp: 20 },
  { name: 'Bear Crawl',         detail: '3×20 sec — On hands and feet with knees just off the floor, crawl forward and back. Keep your back flat and hips low.', xp: 25 },
  { name: 'Donkey Kicks',       detail: '3×12 each leg — On your hands and knees, kick one heel up toward the ceiling and squeeze. Then switch legs.',  xp: 20 },
  { name: 'Calf Raises',        detail: '3×15 — Push up onto your tiptoes as high as you can, then lower down slowly. Hold a wall for balance if needed.', xp: 20 },
  // — Keeper-specific —
  { name: 'Lateral Shuffle',    detail: '4×20 sec — Stay low in your keeper stance and shuffle quickly side to side, five steps each way. Don\'t cross your feet.', xp: 30 },
  { name: 'Dive & Recover',     detail: '3×6 each side — From your knees, fall to one side onto your forearm like making a save, then push straight back up to your stance.', xp: 35 },
];

// AMRAP-style conditioning: simple movements a kid can do alone for time, then
// enter how many they got. `unit` is what they count. `xp` is the base reward.
const CONDITIONING_POOL = [
  { name: 'Push-ups',        detail: 'Chest to the ground, full lockout at the top each rep',     xp: 35, unit: 'reps'  },
  { name: 'Sit-ups',         detail: 'Shoulder blades touch the ground each rep',                 xp: 30, unit: 'reps'  },
  { name: 'Bodyweight Squats', detail: 'Thighs to parallel, drive up through your heels',         xp: 35, unit: 'reps'  },
  { name: 'Jumping Jacks',   detail: 'Full arm and leg extension, steady rhythm',                 xp: 30, unit: 'reps'  },
  { name: 'Jog in Place',    detail: 'Knees high — count every time your right foot lands',       xp: 30, unit: 'steps' },
  { name: 'Mountain Climbers', detail: 'Drive your knees to your chest — count each knee',        xp: 35, unit: 'reps'  },
  { name: 'Lunges',          detail: 'Alternate legs, back knee toward the ground — count each',  xp: 35, unit: 'reps'  },
  { name: 'Burpees',         detail: 'Chest to the ground, jump with hands overhead at the top',  xp: 40, unit: 'reps'  },
  { name: 'High Knees',      detail: 'Knees to waist height, fast — count each knee',             xp: 30, unit: 'reps'  },
  { name: 'Glute Bridges',   detail: 'Squeeze your glutes hard at the top, full hip extension',   xp: 30, unit: 'reps'  },
];

// Soccer ball-skill drills (need a ball). `mode` drives the UI:
//   'amrap'  — go for the timer, then log how many touches/reps you got
//   'streak' — no timer; do it, then log your best unbroken streak
//   'skill'  — prescribed technique sequence; mark done, rep log optional
const BALL_SKILL_POOL = [
  { name: 'Toe Taps',          detail: 'On your toes, tap the top of the ball with alternating feet — count each tap.',           xp: 30, unit: 'touches', mode: 'amrap' },
  { name: 'Bell Touches',      detail: 'Push the ball side to side between the insides of your feet — count each touch.',         xp: 30, unit: 'touches', mode: 'amrap' },
  { name: 'Sole Rolls',        detail: 'Roll the ball across with the sole of one foot, stop it with the other — count each roll.', xp: 30, unit: 'rolls',   mode: 'amrap' },
  { name: 'Inside-Outside',    detail: 'Push the ball with the inside then the outside of the same foot — count each touch.',     xp: 35, unit: 'touches', mode: 'amrap' },
  { name: 'V-Pulls',           detail: 'Sole pull-back, then push out at an angle with your instep to make a V — count each rep.', xp: 35, unit: 'reps',    mode: 'amrap' },
  { name: 'Juggling',          detail: 'Keep the ball off the ground with any part of your body. Log your best unbroken streak.', xp: 45, unit: 'streak',  mode: 'streak' },
  { name: 'Pull-Back Combo',   detail: 'Each foot: pull back + instep push, pull a V, pull & roll behind. Sequence ×4 each foot.', xp: 35, unit: 'reps',  mode: 'skill' },
  { name: 'Turn & Accelerate', detail: 'Moderate pace, turn 180° (pull turn, drag-back, inside chop, Cruyff…) and explode 3 touches. ×4 each foot.', xp: 40, unit: 'reps', mode: 'skill' },
];

// Ground-level cone drill cues. All reachable by a keeper moving along the
// grass to a cone — no "high" dives. `say` is what gets spoken aloud.
const REACTION_CUES = [
  { arrow: '⬅️', dir: 'LEFT',      say: 'Left'      },
  { arrow: '➡️', dir: 'RIGHT',     say: 'Right'     },
  { arrow: '↙️', dir: 'LOW LEFT',  say: 'Low left'  },
  { arrow: '↘️', dir: 'LOW RIGHT', say: 'Low right' },
  { arrow: '⬆️', dir: 'FORWARD',   say: 'Forward'   },
];

const DAY_LORE = [
  'The Gate Awaits',    'The First Step',       'Blood and Mud',       'Iron Will',
  'Swift as Shadow',    "The Guardian's Burden", 'Edge of the Abyss',  'Through Storm',
  'Trial of Strength',  'Faster than Fear',     'No Ground Given',     'The Unbroken',
  'Breath of Flame',    'The Longest Mile',     'Walls of Stone',      'Thunder and Iron',
  'The Night Trial',    'When Legs Fail',       "The Keeper's Vow",    'Rising Steel',
  'Never Yield',        'Shattered Limits',     'The Elite Path',      'Champions Burn Here',
  'The Grand Trial',    'Almost There',         'One More Time',       'The Final Gate',
  'Tears of Gold',      'The Keeper Ascends',
];

// A short quest narrative for each day, tied to its DAY_LORE title — flavour to
// set up the training as the trial of a goalkeeper-in-training.
const DAY_QUESTS = [
  "Every great Keeper was once an unproven youth standing before the gate. Today you take your first watch — the goal behind you is yours to guard. Step up and prove you belong here.",
  "Greatness is never won in a day; it is built one step at a time, and today is that first step. Move well, and the path will open before you.",
  "The grass is wet and the work is hard, but Keepers are forged in the mess. Throw yourself into the mud today and rise dirtier, stronger, and unafraid.",
  "Your body will beg you to stop. Your will must answer, 'not yet.' Today you train the muscle no one can see — the one between your ears.",
  "A shot flies faster than thought, so your feet must move faster than fear. Today you chase speed itself — be there before the ball even decides where to go.",
  "When ten attackers charge, one stands alone behind them all — and that one is you. The goal is a weight only a Keeper can carry. Pick it up today, and learn that it makes you strong.",
  "Every Keeper meets the moment when quitting feels easy, and you stand at that edge now. Don't look down. Push through, and discover what waits on the other side.",
  "Rain, noise, pressure — none of it moves a true Keeper. Today you train in the storm, so that on game day the storm trains for you.",
  "A Keeper's power lives in the hips, the core, and the spring of the legs. Today tests that engine. Build it now, and later it will launch you clear across the goal.",
  "Fear is just your body moving slower than the moment. Today you outrun it — quick feet, quick hands — and leave fear standing where you used to be.",
  "A Keeper guards every inch of the goal as though it were home. Today you give up nothing. Hold your ground, and make the goal a fortress.",
  "Falls, misses, tired legs — none of it breaks a Keeper who refuses to break. Today you prove you can bend without snapping. Get up. Again.",
  "Your lungs are the secret weapon. When others gasp in the final minutes, you will be breathing fire. Today you stoke that flame.",
  "The hardest part of any journey is the middle, where the start is far behind and the end is further ahead. You are in it now. Keep moving — legends are made right here.",
  "Halfway. You are no longer a beginner. Today you become a wall — solid, steady, impossible to move — until strikers dread the very sight of you.",
  "Power in your legs, thunder in your jump, iron in your core. Today everything explodes. Train like the storm and land like the mountain.",
  "True Keepers train when no one is watching and there is no glory to win. This is that day. Do the work in the dark, so you can shine in the light.",
  "There comes a moment your legs say 'no more' — and a Keeper finds one more anyway. Today you meet that moment. The extra rep is where champions live.",
  "Speak it today: 'I will not be beaten easily.' A vow is only words until your training makes it true. Earn the right to mean it.",
  "Two-thirds of the way, and you are not the player who started. You are being forged into steel. Today you rise — sharper, harder, ready.",
  "The best strikers alive will try to break you, and your answer is simple and unshakeable: never yield. Today you practise saying no.",
  "The limit you believed in last week? Today you shatter it. What felt impossible at the start is now your warm-up. Go and find the new edge.",
  "Most players never make it this far. You have stepped onto the elite path now — the road of the few. Walk it like you belong, because you do.",
  "Champions are not born; they are burned into shape by days exactly like this one. Feel the fire today — it is the sign you are becoming one.",
  "This is a milestone worthy of the name, young Keeper. Everything you have built comes together today. Show the goal who guards it now.",
  "The summit is in sight, and this is no time to ease up — it's the time to climb hardest. Almost there is not there yet. Push.",
  "Some days the only quest is to show up and do it one more time. That is today. The discipline to repeat is the rarest strength of all.",
  "The last gate stands before you, and beyond it waits the Keeper you set out to become. Do not slow now. Charge it.",
  "When the work is nearly done, even the ache feels golden. You are so close you can taste it. Pour out everything you have left today.",
  "Thirty days ago you stood before the gate, unproven. Today you walk through it as a Keeper, forged in sweat and steel. The goal is yours now — guard it like the guardian you have become.",
];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */

let state = {
  keeperName:    'Guardian',
  currentDay:    1,
  completedDays: [],
  totalXP:       0,
  condBests:     {},   // { exerciseName: bestReps } — personal records
  condHistory:   [],   // [{ day, name, reps, unit }] — every AMRAP logged
};

const STORAGE_KEY = 'keeperquest_v3';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch (e) { /* fresh start */ }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ══════════════════════════════════════
   DAY DATA — generated once on load
══════════════════════════════════════ */

const DAYS_DATA = [];

function buildDaysData() {
  // Use a seeded shuffle so days are consistent across sessions
  for (let d = 1; d <= 30; d++) {
    const strengthPool = seededShuffle([...STRENGTH_POOL], d * 7);
    const condPool     = seededShuffle([...CONDITIONING_POOL], d * 13);
    const ballPool     = seededShuffle([...BALL_SKILL_POOL], d * 17);
    const condCount    = 2 + Math.floor(d / 8);  // 2–5 conditioning exercises
    const ballCount    = 2 + Math.floor(d / 10); // 2–5 ball-skill drills
    DAYS_DATA.push({
      day:          d,
      lore:         DAY_LORE[d - 1],
      strength:     strengthPool.slice(0, 2),
      conditioning: condPool.slice(0, Math.min(condCount, condPool.length)),
      ballSkills:   ballPool.slice(0, Math.min(ballCount, ballPool.length)),
      reactionReps: 8 + Math.floor(d * 0.5),
      // Time per call: long enough to react, move to the cone, touch it, and
      // recover to the set position. Eases from ~4s (day 1) to ~2.2s (day 30).
      reactionMs:   Math.max(4000 - d * 62, 2200),
    });
  }
}

// Simple seeded shuffle (Mulberry32 + Fisher-Yates)
function seededShuffle(arr, seed) {
  let s = seed >>> 0;
  const rand = () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */

function getRank(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
}

function getNextRank(currentLevel) {
  return RANKS.find(r => r.level === currentLevel + 1) || null;
}

function $(id) { return document.getElementById(id); }

/* ══════════════════════════════════════
   SCREEN ROUTING
══════════════════════════════════════ */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
}

/* ══════════════════════════════════════
   TITLE SCREEN
══════════════════════════════════════ */

function startJourney() {
  const inp  = $('keeper-name-input');
  const name = inp ? inp.value.trim() : '';
  state.keeperName = name || 'Guardian';
  // Dev cheat: name "test" unlocks all 30 days.
  if (name.toLowerCase() === 'test') state.currentDay = 30;
  saveState();
  showScreen('hub');
  refreshHub();
  showTab('map');
}

/* ══════════════════════════════════════
   HUB
══════════════════════════════════════ */

function refreshHub() {
  const rank     = getRank(state.totalXP);
  const nextRank = getNextRank(rank.level);
  const xpInLevel   = state.totalXP - rank.minXP;
  const xpRange     = (nextRank ? nextRank.minXP : rank.minXP + 500) - rank.minXP;
  const pct         = Math.min(100, Math.round((xpInLevel / xpRange) * 100));

  $('hub-keeper-name').textContent   = state.keeperName;
  $('hub-level-badge').textContent   = `Lvl ${rank.level} — ${rank.name}`;
  $('hub-xp-text').textContent       = `${state.totalXP} XP`;
  $('xp-bar').style.width            = pct + '%';
  $('hub-day-num').textContent       = state.currentDay;

  buildDayGrid();
  buildCodex();
  refreshSessionPreview();
}

/* ══════════════════════════════════════
   TAB SWITCHING
══════════════════════════════════════ */

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => { t.style.display = 'none'; });
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const tabEl = $('tab-' + tab);
  if (tabEl) tabEl.style.display = 'block';
  const tabLabels = ['map', 'session', 'records', 'scroll'];
  const idx = tabLabels.indexOf(tab);
  if (idx >= 0) document.querySelectorAll('.tab-btn')[idx].classList.add('active');
  if (tab === 'session') refreshSessionPreview();
  if (tab === 'records') renderRecords();
}

// Show each AMRAP exercise's personal best plus its recent history, so he can
// watch his counts climb over the 30 days.
function renderRecords() {
  const body = $('records-body');
  if (!body) return;
  const history = state.condHistory || [];
  if (history.length === 0) {
    body.innerHTML = `<div class="parchment center" style="color:var(--ink);">
      No AMRAP work logged yet. Finish a Conditioning Gauntlet to start your record book!</div>`;
    return;
  }
  // Group history by exercise name.
  const byName = {};
  history.forEach(h => {
    (byName[h.name] = byName[h.name] || []).push(h);
  });
  body.innerHTML = Object.keys(byName).sort().map(name => {
    const entries = byName[name];
    const unit = entries[entries.length - 1].unit || 'reps';
    const best = state.condBests[name] || Math.max(...entries.map(e => e.reps));
    // Most recent 6 attempts, newest first.
    const recent = entries.slice(-6).reverse()
      .map(e => `<span class="record-chip">D${e.day}: <strong>${e.reps}</strong></span>`)
      .join('');
    return `<div class="parchment mb-12">
      <div class="record-head">
        <span class="record-name">${name}</span>
        <span class="record-best">🏆 ${best} ${unit}</span>
      </div>
      <div class="record-chips">${recent}</div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   DAY GRID
══════════════════════════════════════ */

function buildDayGrid() {
  const grid = $('day-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let d = 1; d <= 30; d++) {
    const el    = document.createElement('div');
    const done  = state.completedDays.includes(d);
    const today = d === state.currentDay;
    const locked= d > state.currentDay;

    el.className = 'day-cell ' + (done ? 'completed' : today ? 'today' : locked ? 'locked' : 'available');
    if (done) {
      el.innerHTML = '<span class="day-icon">✓</span>';
    } else {
      el.textContent = d;
    }
    if (!locked) {
      el.title = `Day ${d}: ${DAY_LORE[d - 1]}`;
      if (!done) el.addEventListener('click', () => showTab('session'));
    }
    grid.appendChild(el);
  }
}

/* ══════════════════════════════════════
   CODEX
══════════════════════════════════════ */

function buildCodex() {
  const list = $('rank-list');
  if (!list) return;
  const currentRank = getRank(state.totalXP);
  list.innerHTML = RANKS.map(r => `
    <div class="rank-row ${r.level === currentRank.level ? 'current-rank' : ''}">
      <span>${state.totalXP >= r.minXP ? '⚔️' : '🔒'}</span>
      <span>Lvl ${r.level}: <strong>${r.name}</strong>${r.level === currentRank.level ? ' ← you' : ''}</span>
      <span class="rank-xp">${r.minXP} XP</span>
    </div>
  `).join('');
}

/* ══════════════════════════════════════
   SESSION PREVIEW
══════════════════════════════════════ */

function refreshSessionPreview() {
  const day  = state.currentDay;
  const dd   = DAYS_DATA[day - 1];
  if (!dd) return;

  $('session-day-label').textContent = `Day ${day} — ${dd.lore}`;
  $('session-quest').textContent = DAY_QUESTS[day - 1] || '';
  const done = state.completedDays.includes(day);
  const btn  = $('begin-session-btn');
  const ov   = $('session-overview');

  if (done) {
    ov.innerHTML = '<span style="color:#7fc8a0;">✓ Trial complete for today. Return tomorrow.</span>';
    btn.disabled    = true;
    btn.textContent = 'Quest Complete ✓';
  } else {
    const sHtml = dd.strength.map(e => `• ${e.name}`).join('<br>');
    const cHtml = dd.conditioning.map(e => `• ${e.name}`).join('<br>');
    const bHtml = dd.ballSkills.map(e => `• ${e.name}`).join('<br>');
    ov.innerHTML = `
      <p class="mb-8"><strong>⚡ Reaction:</strong> ${dd.reactionReps} cues</p>
      <p class="mb-8"><strong>💪 Strength:</strong><br>${sHtml}</p>
      <p class="mb-8"><strong>🔥 Conditioning:</strong><br>${cHtml}</p>
      <p><strong>⚽ Ball Skills:</strong><br>${bHtml}</p>
    `;
    btn.disabled    = false;
    btn.textContent = 'Begin Trial ⚔️';
  }

  $('session-not-started').style.display = 'block';
  $('session-active').style.display      = 'none';
}

/* ══════════════════════════════════════
   SESSION ENGINE
══════════════════════════════════════ */

let sess = {};
let reactionTimer  = null;
let countdownTimer = null;

// ── Start Session ──────────────────────

function startSession() {
  const day = state.currentDay;
  const dd  = DAYS_DATA[day - 1];
  sess = {
    day,
    dd,
    phase:            'reaction',
    reactionIndex:    0,
    reactionSaves:    0,
    strengthChecked:  0,
    strengthXP:       0,
    track:            null,  // generic drill track (conditioning / ball skills)
    sessionXP:        0,
  };
  $('session-not-started').style.display = 'none';
  $('session-active').style.display      = 'block';
  startReactionPhase();
}

// ── Phase Dots ──────────────────────────

function updatePhaseDots() {
  const phases = ['reaction', 'strength', 'conditioning', 'ballskills'];
  const labels = ['⚡ React', '💪 Strength', '🔥 Condition', '⚽ Ball'];
  const el = $('phase-dots');
  if (!el) return;
  const current = phases.indexOf(sess.phase);
  el.innerHTML = phases.map((p, i) => {
    const cls = i < current ? 'done' : i === current ? 'active' : 'idle';
    return `<div class="phase-dot ${cls}">${labels[i]}</div>`;
  }).join('');
}

function showPhase(phase) {
  // Conditioning and Ball Skills share one DOM block (#phase-drill).
  const blockFor = p => (p === 'conditioning' || p === 'ballskills') ? 'drill' : p;
  ['reaction', 'strength', 'drill'].forEach(block => {
    const el = $('phase-' + block);
    if (el) el.style.display = block === blockFor(phase) ? 'block' : 'none';
  });
  sess.phase = phase;
  updatePhaseDots();
}

// ── PHASE I: Reaction ──────────────────

// ── Hands-free cue feedback: spoken word + beep + vibration ──
let audioCtx = null;

function beep(freq = 660, ms = 120) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + ms / 1000);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + ms / 1000);
  } catch (e) { /* audio unsupported — silent fallback */ }
}

function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 1.0;
    u.volume = 1.0;
    speechSynthesis.speak(u);
  } catch (e) { /* speech unsupported — silent fallback */ }
}

function buzz(ms = 60) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

// Time given to recover to the set position between direction calls.
const REACTION_SET_MS = 2000;

function startReactionPhase() {
  showPhase('reaction');
  sess.reactionIndex = 0;
  sess.reactionSaves = 0;
  // Prime the audio context on the user gesture that launched the session.
  beep(523, 80);
  $('rep-counter').textContent = `0 / ${sess.dd.reactionReps}`;
  updateReactionScore();
  // Begin with a "Set" beat so he can get to his set position.
  setReactionBeat();
}

// Beat 1: "Set" — return to the set position and wait for the direction.
function setReactionBeat() {
  if (sess.reactionIndex >= sess.dd.reactionReps) {
    endReactionPhase();
    return;
  }
  const arrowEl = $('cue-arrow');
  const labelEl = $('cue-label');
  arrowEl.textContent = '🧤';
  labelEl.textContent = 'SET';
  arrowEl.classList.remove('cue-animate');
  beep(440, 90);
  speak('Set');

  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(goReactionBeat, REACTION_SET_MS);
}

// Beat 2: a random direction — explode to that cone and touch it.
function goReactionBeat() {
  const cue = REACTION_CUES[Math.floor(Math.random() * REACTION_CUES.length)];
  sess.currentCue = cue;

  const arrowEl = $('cue-arrow');
  const labelEl = $('cue-label');
  arrowEl.textContent = cue.arrow;
  labelEl.textContent = cue.dir;
  arrowEl.classList.remove('cue-animate');
  void arrowEl.offsetWidth; // reflow to restart animation
  arrowEl.classList.add('cue-animate');

  // Hands-free feedback so the phone can sit on the ground.
  beep(660, 110);
  buzz(70);
  speak(cue.say);

  // Each called cue he completes counts as a save — no tap needed.
  sess.reactionSaves++;
  sess.reactionIndex++;
  $('rep-counter').textContent = `${sess.reactionIndex} / ${sess.dd.reactionReps}`;
  updateReactionScore();

  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(setReactionBeat, sess.dd.reactionMs);
}

function updateReactionScore() {
  const el = $('reaction-score');
  if (el) el.textContent = `Cones: ${sess.reactionSaves} / ${sess.dd.reactionReps}`;
}

// Kept for backwards-compat (old tap/key handlers may still fire); now a no-op.
function registerReactionHit() {}

function skipReactionPhase() {
  clearTimeout(reactionTimer);
  speechSynthesis && speechSynthesis.cancel();
  endReactionPhase();
}

function endReactionPhase() {
  clearTimeout(reactionTimer);
  speechSynthesis && speechSynthesis.cancel();
  speak('Reaction trial complete');
  const xp = 50 + sess.reactionSaves * 5;
  sess.sessionXP += xp;
  startStrengthPhase();
}

// ── PHASE II: Strength ─────────────────

function startStrengthPhase() {
  showPhase('strength');
  sess.strengthChecked = 0;
  sess.strengthXP      = 0;
  const container = $('strength-exercises');
  container.innerHTML = sess.dd.strength.map((ex, i) => {
    const best = getCondBest(ex.name);
    const bestNote = best ? `best ${best}` : '';
    return `
    <div class="exercise-card" id="ex-card-${i}">
      <div class="exercise-card-inner">
        <div style="flex:1;">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-detail">${ex.detail}</div>
          <div class="ex-log-row">
            <input class="strength-rep-input" id="ex-reps-${i}" type="number"
                   inputmode="numeric" min="0" placeholder="log reps" />
            <span class="ex-log-best">${bestNote}</span>
          </div>
        </div>
        <div class="ex-check" id="ex-check-${i}" onclick="toggleExCheck(${i}, ${ex.xp})">
          <span id="ex-icon-${i}"></span>
        </div>
      </div>
    </div>`;
  }).join('');
  checkStrengthComplete();
}

function toggleExCheck(i, xp) {
  const chk  = $('ex-check-' + i);
  const icon = $('ex-icon-' + i);
  if (chk.classList.contains('done')) {
    chk.classList.remove('done');
    icon.textContent = '';
    sess.strengthChecked--;
    sess.strengthXP -= xp;
  } else {
    chk.classList.add('done');
    icon.textContent = '✓';
    sess.strengthChecked++;
    sess.strengthXP += xp;
  }
  checkStrengthComplete();
}

function checkStrengthComplete() {
  const btn = $('strength-done-btn');
  if (btn) btn.disabled = sess.strengthChecked < sess.dd.strength.length;
}

function completeStrengthPhase() {
  // Log any optional rep counts so strength progress shows in the Records tab.
  sess.dd.strength.forEach((ex, i) => {
    const input = $('ex-reps-' + i);
    const reps  = input ? parseInt(input.value, 10) : NaN;
    if (Number.isFinite(reps) && reps > 0) {
      recordCondBest(ex.name, reps, 'reps');
    }
  });
  sess.sessionXP += sess.strengthXP;
  startConditioningPhase();
}

// ── PHASE III: Conditioning ────────────

// Seconds of AMRAP work per exercise.
const AMRAP_SECONDS = 40;

// ── AMRAP progress tracking (persisted across sessions) ──
function getCondBest(name) {
  return (state.condBests && state.condBests[name]) || 0;
}

function recordCondBest(name, reps, unit) {
  if (!state.condBests)   state.condBests = {};
  if (!state.condHistory) state.condHistory = [];
  state.condHistory.push({ day: sess.day, name, reps, unit });
  if (reps > (state.condBests[name] || 0)) state.condBests[name] = reps;
  saveState();
}

// ── Generic drill track engine (used by Conditioning and Ball Skills) ──
// A track is a list of exercises run one at a time: start → (timer / do it) →
// log a count. Each exercise has a `mode`: 'amrap' (timed), 'streak' (juggling,
// no clock), or 'skill' (prescribed sequence, optional log).

function trackEx() { return sess.track.list[sess.track.index]; }
function exMode(ex) { return ex.mode || 'amrap'; }

function startConditioningPhase() {
  startTrack({
    list:        sess.dd.conditioning,
    phase:       'conditioning',
    section:     'Phase III — Conditioning Gauntlet',
    doneLabel:   'Ball Skills →',
    onComplete:  startBallSkillsPhase,
  });
}

function startBallSkillsPhase() {
  startTrack({
    list:        sess.dd.ballSkills,
    phase:       'ballskills',
    section:     'Phase IV — Ball Skills',
    doneLabel:   'Finish Trial ⚔️',
    onComplete:  finishSession,
  });
}

function startTrack(cfg) {
  sess.track = { list: cfg.list, index: 0, xp: 0, log: [],
                 doneLabel: cfg.doneLabel, onComplete: cfg.onComplete };
  showPhase(cfg.phase);
  $('drill-section-label').textContent = cfg.section;
  showTrackExercise();
}

function showTrackExercise() {
  const ex   = trackEx();
  const mode = exMode(ex);
  $('cond-name').textContent   = ex.name;
  $('cond-detail').textContent = ex.detail;

  const tag = mode === 'amrap'  ? `AMRAP ${AMRAP_SECONDS}s`
            : mode === 'streak' ? 'Best streak'
            : 'Skill drill';
  $('cond-set-label').textContent =
    `Exercise ${sess.track.index + 1} of ${sess.track.list.length} · ${tag}`;

  // Show your best so far so he can chase it.
  const best = getCondBest(ex.name);
  $('cond-best').textContent = best ? `Your best: ${best} ${ex.unit}` : 'First time — set a record!';

  // Start button label fits the drill type.
  const startBtn = $('cond-start-btn');
  startBtn.textContent = mode === 'amrap'  ? 'Start AMRAP ▶'
                       : mode === 'streak' ? 'Start ▶'
                       : 'Begin Drill ▶';

  // Reset the ring and show the Start button; hide stop, rep entry + finish.
  $('countdown-num').textContent = mode === 'amrap' ? AMRAP_SECONDS : '•';
  $('ring-fill').style.strokeDashoffset = '0';
  startBtn.style.display          = 'inline-block';
  $('cond-stop-btn').style.display = 'none';
  $('cond-rep-entry').style.display = 'none';
  $('cond-done-btn').style.display  = 'none';
}

// Start button dispatches based on the drill type.
function startCondExercise() {
  const ex = trackEx();
  $('cond-start-btn').style.display = 'none';
  const mode = exMode(ex);
  if (mode === 'amrap')  return startAmrap();
  if (mode === 'streak') return startStreak();
  return beginSkill();
}

function startAmrap() {
  // Spoken 3-2-1 lead-in so he can get into position before the clock starts.
  let n = 3;
  $('ring-fill').style.strokeDashoffset = '0';
  $('countdown-num').textContent = n;
  beep(523, 90);
  speak(String(n));
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    n--;
    if (n >= 1) {
      $('countdown-num').textContent = n;
      beep(523, 90);
      speak(String(n));
    } else {
      clearInterval(countdownTimer);
      $('countdown-num').textContent = 'GO';
      beep(784, 220);
      speak('Go');
      setTimeout(() => startCountdown(AMRAP_SECONDS, onAmrapComplete), 450);
    }
  }, 1000);
}

// Juggling-style: no clock — do it, then tap done and log your best streak.
function startStreak() {
  const ex = trackEx();
  beep(660, 120);
  speak(`${ex.name}. Go!`);
  $('countdown-num').textContent = 'GO';
  $('cond-stop-btn').style.display = 'inline-block';
}

function stopStreak() {
  $('cond-stop-btn').style.display = 'none';
  $('countdown-num').textContent = '✓';
  revealRepEntry();
}

// Technique sequence: he does the prescribed reps, then logs (optional).
function beginSkill() {
  const ex = trackEx();
  speak(ex.name);
  $('countdown-num').textContent = '✓';
  revealRepEntry();
}

function onAmrapComplete() {
  const ex = trackEx();
  beep(440, 300);
  buzz(200);
  speak(`Time. How many ${ex.unit}?`);
  $('countdown-num').textContent = '✓';
  revealRepEntry();
}

// Show the count input, with a prompt + unit that fit the drill type.
function revealRepEntry() {
  const ex   = trackEx();
  const mode = exMode(ex);
  $('cond-rep-prompt').textContent =
      mode === 'streak' ? 'What was your best streak?'
    : mode === 'skill'  ? 'How many reps? (optional)'
    : 'How many did you do?';
  $('cond-rep-unit').textContent = ex.unit;
  const input = $('cond-rep-input');
  input.value = '';
  $('cond-rep-entry').style.display = 'block';
  input.focus();
}

function logCondReps() {
  const ex   = trackEx();
  const reps = Math.max(0, parseInt($('cond-rep-input').value, 10) || 0);

  const prevBest = getCondBest(ex.name);
  // Only log an actual count (skill drills can be left blank).
  if (reps > 0) {
    sess.track.log.push({ name: ex.name, reps, unit: ex.unit });
    recordCondBest(ex.name, reps, ex.unit);   // persist progress for next time
  }
  // XP: base reward for the exercise plus a little for effort (capped).
  // Beating a previous record earns a bonus.
  const beatRecord = reps > prevBest && prevBest > 0;
  sess.track.xp += ex.xp + Math.min(reps, 60) + (beatRecord ? 25 : 0);
  if (beatRecord) speak('New record!');
  sess.track.index++;

  if (sess.track.index >= sess.track.list.length) {
    $('cond-rep-entry').style.display = 'none';
    const doneBtn = $('cond-done-btn');
    doneBtn.textContent = sess.track.doneLabel;
    doneBtn.style.display = 'inline-block';
  } else {
    showTrackExercise();
  }
}

// Finish the current track and advance (to ball skills, or session complete).
function completeCondPhase() {
  clearInterval(countdownTimer);
  sess.sessionXP += sess.track.xp;
  sess.track.onComplete();
}

// ── Countdown ring ─────────────────────

function startCountdown(seconds, onComplete) {
  clearInterval(countdownTimer);
  let remaining = seconds;
  const circumference = 264;
  const update = () => {
    $('countdown-num').textContent = remaining;
    const offset = circumference * (1 - remaining / seconds);
    $('ring-fill').style.strokeDashoffset = offset;
  };
  update();
  countdownTimer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      remaining = 0;
      update();
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    // Beep on the final 3-second lead-in so he knows time is almost up.
    if (remaining <= 3) beep(523, 80);
    update();
  }, 1000);
}

// ── Finish ──────────────────────────────

function finishSession() {
  const day = sess.day;
  if (!state.completedDays.includes(day)) {
    state.completedDays.push(day);
    state.totalXP += sess.sessionXP;
  }
  if (state.currentDay <= day) state.currentDay = Math.min(day + 1, 30);
  saveState();

  $('complete-title').textContent = `Day ${day} Complete! ⚔️`;
  $('complete-sub').textContent   = `+${sess.sessionXP} XP earned · ${state.totalXP} total XP`;
  $('complete-overlay').classList.add('show');
  refreshHub();
}

function closeComplete() {
  $('complete-overlay').classList.remove('show');
  $('session-active').style.display      = 'none';
  $('session-not-started').style.display = 'block';
  showTab('map');
}

/* ══════════════════════════════════════
   KEYBOARD CONTROLS (reaction phase)
══════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
  if (sess.phase !== 'reaction') return;
  const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (arrowKeys.includes(e.key)) {
    e.preventDefault();
    registerReactionHit();
  }
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  buildDaysData();
  loadState();

  // Testing helper: ?day=N jumps to a day and unlocks up to it.
  // e.g. open  index.html?day=15
  const dayParam = parseInt(new URLSearchParams(location.search).get('day'), 10);
  if (Number.isFinite(dayParam)) {
    // Set the active day exactly so the session loads THAT day (for testing).
    state.currentDay = Math.min(Math.max(dayParam, 1), 30);
    saveState();
    showScreen('hub');
    refreshHub();
    showTab('map');
    return;
  }

  // If a save exists, go straight to hub
  if (state.completedDays.length > 0 || state.totalXP > 0) {
    showScreen('hub');
    refreshHub();
    showTab('map');
  } else {
    showScreen('title');
  }
});
