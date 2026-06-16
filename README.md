# Keeper Quest 🛡️

**A 30-day goalkeeper training adventure for kids — turned into a game.**

Keeper Quest takes the daily work of becoming a better goalkeeper and wraps it
in a fantasy quest. Each day is one short "trial" (about 10–15 minutes) of
real, age-appropriate training. Finish the day's trial, earn XP, climb the ranks
from **Initiate** all the way to **Grand Keeper**, and unlock the next day on the
quest map.

It's built to be **hands-free**: prop the phone up on the grass and it calls out
every drill aloud, beeps the timers, and counts for you — so a young keeper can
train on their own without a coach hovering over a screen.

---

## What a day looks like

Every day is the same four "disciplines", in order. The app walks you through
each one and won't let you skip ahead until the previous part is done.

| | Discipline | What it is |
|---|---|---|
| ⚡ | **Reaction Trials** | Set five cones on the grass. The phone calls a cone aloud ("Low left!") — explode to it, touch it, and recover to your set position. Trains reacting before you think. |
| 💪 | **Strength Trials** | A short bodyweight circuit built for goalkeeper power — explosive legs, strong core, lateral push. Tick off each move as you finish it. |
| 🔥 | **Conditioning Gauntlet** | Fitness bursts (push-ups, squats, jog in place…). Go as hard as you can for the timer, then type in how many you got and try to beat your record. |
| ⚽ | **Ball Skills** | Touch work, juggling streaks, and turn-and-go sequences to build a first touch you can trust. |

The drills get a little harder and faster as the 30 days go on.

---

## How to use it

1. **Open the app** (see *Running it* below) and enter a keeper name.
2. **Set up:** find a bit of grass or open space, grab a ball, and lay out five
   cones (or shoes, water bottles — anything) for the reaction drill.
3. **Prop the phone up** where you can hear it, and tap **Begin Trial**.
4. **Follow the voice.** It tells you what to do, beeps the timers, and asks you
   to type in your counts. Just listen and move.
5. **Come back tomorrow** for the next day. One day per day — that's the streak.

### Tracking progress

- **Quest Map** shows all 30 days: ✓ done, today highlighted, the rest locked.
- **Records** keeps your personal best for every counted exercise, plus your
  recent scores, so you can watch the numbers climb over the month.
- **Codex** explains the ranks and the four disciplines.

Progress is saved automatically **on the device** — no account, no internet, no
data leaves the phone.

### Gold 🪙 — a reward you can spend in real life

Beating a personal best on any counted drill earns **one gold coin** (the
first-ever score on a drill just sets the bar — beat it later to earn the coin).
Gold is separate from XP: XP raises your rank forever, gold is a spendable
reward. The running total shows at the top of the hub.

This is designed so a parent can run a real-life "store" — agree on what gold
buys (screen time, a treat, a trip), and deduct it when it's spent.

**Parent console** — open the browser's developer console (on a computer:
right-click → Inspect → Console) and use:

```js
keeper.gold       // see the current balance
keeper.spend(5)   // deduct 5 gold when it's spent in real life
keeper.add(3)     // add 3 gold by hand
keeper.reset()    // set gold back to 0
keeper.help()     // print this list
```

---

## Running it

Keeper Quest is a plain web app (HTML, CSS, and JavaScript) — there's nothing to
install and no build step. Because it's split into modules, it needs to be
*served* over a local web address rather than opened straight from a file.

From this folder, start a tiny local server:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** in a browser (a phone on the same Wi-Fi can
open it too, using the computer's address). On a phone, "Add to Home Screen" makes
it feel like a real app.

> Tip for testing: add `?day=15` to the address to jump straight to a given day.

---

## For developers

The code follows a light MVC-style split — small files, each doing one job. The
goal is that a newcomer can open any file and understand it on its own.

```
index.html              the screens (markup) + <script type="module" src="app/main.js">
style.css               all styling
app/
  main.js               entry point: builds everything, wires the buttons,
                        and picks the opening screen
  SessionController.js  owns one day's flow: reaction → strength →
                        conditioning → ball skills → done (the "controller")
  console.js            window.keeper — the parent gold console

  data/                 pure data — no logic lives here
    config.js             tunable numbers (timings, XP values, beep pitches)
    ranks.js              the rank ladder + two lookups
    exercises.js          the four exercise pools + the reaction cues
    lore.js               the story title + quest text for each day
    days.js               builds one day's plan (which exercises, how many)

  state/                the "model"
    AppState.js           all saved data (day, XP, records) and the only
                          methods allowed to change it; saves itself to storage

  services/             one engine per discipline (the workhorses)
    ReactionService.js    the hands-free cone drill
    StrengthService.js    the strength checklist
    TrackService.js       the timed drill engine (conditioning + ball skills)

  ui/                   the "view" — only paints, never changes saved data
    screens.js            shows one screen / tab / phase at a time; the $ helper
    hub.js                paints the map, codex, records, and complete overlay

  utils/                small, reusable, app-agnostic helpers
    rng.js                seeded shuffle + random pick
    audio.js              beeps and phone vibration
    speech.js             spoken cues
```

### The main idea

- **data** never changes and holds no logic.
- **AppState** is the single source of truth for saved progress. Only its methods
  change saved data, and they persist for you.
- **services** run the timers and logic for one discipline each. They don't know
  about one another — `SessionController` chains them via each service's
  `onComplete` callback.
- **ui** only paints; it reads state but never changes it.
- **utils** are tiny and have no app knowledge.

So the whole day reads top-down in `SessionController`:
`begin()` → reaction → strength → conditioning → ball skills →
`state.completeDay()` → the complete overlay.
