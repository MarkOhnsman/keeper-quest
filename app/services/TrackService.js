// =======================================================
// TRACK SERVICE — Phases III & IV: a generic "drill track" engine.
// A track is a list of exercises run one at a time. Each exercise has a `mode`
// that changes how it runs:
//   'amrap'  — a timed "as many reps as possible" set, then log the count
//   'streak' — no clock (e.g. juggling); do it, then log your best streak
//   'skill'  — a prescribed technique sequence; mark done, logging optional
// Conditioning and Ball Skills both use this same engine.
//
// Lifecycle: start(cfg) -> (per-exercise run + log) -> complete() -> cfg.onComplete(xp).
// =======================================================
import {
  AMRAP_SECONDS, RING_CIRCUMFERENCE, GO_PAUSE_MS, TONES, EFFORT_CAP, RECORD_BONUS_XP,
} from "../data/config.js";
import { beep, buzz } from "../utils/audio.js";
import { speak } from "../utils/speech.js";
import { $ } from "../ui/screens.js";

export class TrackService {
  constructor(state) {
    this.state = state;
    this.run = null;
    this.timer = null; // shared by the lead-in and the main countdown
  }

  // cfg: { list, sectionLabel, doneLabel, onComplete }
  start(cfg) {
    this.run = {
      list: cfg.list,
      index: 0,
      xp: 0,
      doneLabel: cfg.doneLabel,
      onComplete: cfg.onComplete,
    };
    $("drill-section-label").textContent = cfg.sectionLabel;
    this.showExercise();
  }

  current() { return this.run.list[this.run.index]; }
  modeOf(ex) { return ex.mode || "amrap"; }

  // Lay out the current exercise: name, detail, best-so-far, and a Start button
  // whose label matches the drill type. Hides the timer/entry until it begins.
  showExercise() {
    const ex = this.current();
    const mode = this.modeOf(ex);

    $("cond-name").textContent = ex.name;
    $("cond-detail").textContent = ex.detail;
    $("cond-set-label").textContent =
      `Exercise ${this.run.index + 1} of ${this.run.list.length} · ${this.tagFor(mode)}`;

    const best = this.state.getCondBest(ex.name);
    $("cond-best").textContent = best ? `Your best: ${best} ${ex.unit}` : "First time — set a record!";

    const startBtn = $("cond-start-btn");
    startBtn.textContent = this.startLabelFor(mode);
    startBtn.style.display = "inline-block";

    $("countdown-num").textContent = mode === "amrap" ? AMRAP_SECONDS : "•";
    this.setRing(1, 1); // full ring
    $("cond-stop-btn").style.display = "none";
    $("cond-rep-entry").style.display = "none";
    $("cond-done-btn").style.display = "none";
  }

  tagFor(mode) {
    if (mode === "amrap") return `AMRAP ${AMRAP_SECONDS}s`;
    if (mode === "streak") return "Best streak";
    return "Skill drill";
  }

  startLabelFor(mode) {
    if (mode === "amrap") return "Start AMRAP ▶";
    if (mode === "streak") return "Start ▶";
    return "Begin Drill ▶";
  }

  // The Start button: dispatch on the drill type.
  startCurrent() {
    $("cond-start-btn").style.display = "none";
    const mode = this.modeOf(this.current());
    if (mode === "amrap") return this.startAmrap();
    if (mode === "streak") return this.startStreak();
    return this.beginSkill();
  }

  // ---- amrap: spoken 3·2·1·GO lead-in, then the timed set ----
  startAmrap() {
    let n = 3;
    this.setRing(1, 1);
    $("countdown-num").textContent = n;
    beep(TONES.leadIn, 90);
    speak(String(n));

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      n--;
      if (n >= 1) {
        $("countdown-num").textContent = n;
        beep(TONES.leadIn, 90);
        speak(String(n));
      } else {
        clearInterval(this.timer);
        $("countdown-num").textContent = "GO";
        beep(TONES.go, 220);
        speak("Go");
        setTimeout(() => this.runCountdown(AMRAP_SECONDS, () => this.onAmrapDone()), GO_PAUSE_MS);
      }
    }, 1000);
  }

  onAmrapDone() {
    const ex = this.current();
    beep(TONES.timeUp, 300);
    buzz(200);
    speak(`Time. How many ${ex.unit}?`);
    $("countdown-num").textContent = "✓";
    this.revealRepEntry();
  }

  // ---- streak: no clock (e.g. juggling) ----
  startStreak() {
    const ex = this.current();
    beep(TONES.cue, 120);
    speak(`${ex.name}. Go!`);
    $("countdown-num").textContent = "GO";
    $("cond-stop-btn").style.display = "inline-block";
  }

  stopStreak() {
    $("cond-stop-btn").style.display = "none";
    $("countdown-num").textContent = "✓";
    this.revealRepEntry();
  }

  // ---- skill: prescribed technique sequence ----
  beginSkill() {
    speak(this.current().name);
    $("countdown-num").textContent = "✓";
    this.revealRepEntry();
  }

  // Show the count input, with a prompt + unit that fit the drill type.
  revealRepEntry() {
    const ex = this.current();
    const mode = this.modeOf(ex);
    $("cond-rep-prompt").textContent =
        mode === "streak" ? "What was your best streak?"
      : mode === "skill"  ? "How many reps? (optional)"
      :                     "How many did you do?";
    $("cond-rep-unit").textContent = ex.unit;

    const input = $("cond-rep-input");
    input.value = "";
    $("cond-rep-entry").style.display = "block";
    input.focus();
  }

  // Log the typed count, award XP, then advance (or show the Finish button).
  logReps() {
    const ex = this.current();
    const reps = Math.max(0, parseInt($("cond-rep-input").value, 10) || 0);
    const prevBest = this.state.getCondBest(ex.name);

    // Skill drills may be left blank — only persist a real count.
    if (reps > 0) this.state.recordCondBest(ex.name, reps, ex.unit);

    this.run.xp += this.xpFor(ex, reps, prevBest);
    if (this.beatRecord(reps, prevBest)) speak("New record!");

    this.run.index++;
    if (this.run.index >= this.run.list.length) {
      this.showFinishButton();
    } else {
      this.showExercise();
    }
  }

  // Base reward + a little for effort (capped) + a bonus for a new record.
  xpFor(ex, reps, prevBest) {
    const bonus = this.beatRecord(reps, prevBest) ? RECORD_BONUS_XP : 0;
    return ex.xp + Math.min(reps, EFFORT_CAP) + bonus;
  }

  beatRecord(reps, prevBest) {
    return reps > prevBest && prevBest > 0;
  }

  showFinishButton() {
    $("cond-rep-entry").style.display = "none";
    const doneBtn = $("cond-done-btn");
    doneBtn.textContent = this.run.doneLabel;
    doneBtn.style.display = "inline-block";
  }

  // Finish the whole track and hand its XP back to the controller.
  complete() {
    clearInterval(this.timer);
    const xp = this.run.xp;
    const onComplete = this.run.onComplete;
    this.run = null;
    onComplete(xp);
  }

  // ---- the SVG countdown ring (this service owns the timer screen) ----

  runCountdown(seconds, onDone) {
    clearInterval(this.timer);
    let remaining = seconds;
    const paint = () => {
      $("countdown-num").textContent = remaining;
      this.setRing(remaining, seconds);
    };
    paint();

    this.timer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(this.timer);
        remaining = 0;
        paint();
        onDone();
        return;
      }
      if (remaining <= 3) beep(TONES.warning, 80); // final-seconds ticks
      paint();
    }, 1000);
  }

  // Draw the ring with `remaining` of `total` left (full ring = nothing elapsed).
  setRing(remaining, total) {
    const offset = RING_CIRCUMFERENCE * (1 - remaining / total);
    $("ring-fill").style.strokeDashoffset = offset;
  }
}
