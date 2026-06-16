// =======================================================
// REACTION SERVICE — Phase I: the hands-free cone drill.
// The phone sits on the grass and calls a cone aloud; the keeper explodes to
// it, touches it, and recovers to the set position. It runs on a two-beat loop:
//   SET  — return to your set position and wait
//   GO   — a random direction is called; reach that cone
// Each called cone counts as one "save" automatically — no tapping needed.
//
// Lifecycle: start(plan) ... runs itself ... -> onComplete(saves).
// =======================================================
import { REACTION_SET_MS, TONES } from "../data/config.js";
import { REACTION_CUES } from "../data/exercises.js";
import { randomItem } from "../utils/rng.js";
import { beep, buzz } from "../utils/audio.js";
import { speak, stopSpeech } from "../utils/speech.js";
import { $ } from "../ui/screens.js";

export class ReactionService {
  constructor() {
    this.run = null;
    this.timer = null;
    this.onComplete = function () {}; // set by the controller: receives the save count
  }

  start(plan) {
    this.run = {
      totalReps: plan.reactionReps,
      callMs: plan.reactionMs, // time given to react and reach the cone
      index: 0,
      saves: 0,
    };
    beep(TONES.leadIn, 80); // prime the audio while we're inside the user's tap
    this.paintCount();
    this.setBeat();
  }

  // Beat 1: "SET" — recover to the set position and wait for the call.
  setBeat() {
    if (!this.run) return;
    if (this.run.index >= this.run.totalReps) {
      this.finish();
      return;
    }
    this.paintCue("🧤", "SET", false);
    beep(TONES.set, 90);
    speak("Set");
    this.timer = setTimeout(() => this.goBeat(), REACTION_SET_MS);
  }

  // Beat 2: a random direction — explode to that cone and touch it.
  goBeat() {
    if (!this.run) return;
    const cue = randomItem(REACTION_CUES);
    this.paintCue(cue.arrow, cue.dir, true);

    // Hands-free feedback so the phone can stay on the ground.
    beep(TONES.cue, 110);
    buzz(70);
    speak(cue.say);

    this.run.saves++;
    this.run.index++;
    this.paintCount();

    this.timer = setTimeout(() => this.setBeat(), this.run.callMs);
  }

  finish() {
    const saves = this.run ? this.run.saves : 0;
    this.stop();
    speak("Reaction trial complete");
    this.onComplete(saves);
  }

  // Quit this phase early but still bank what was earned.
  skip() {
    this.finish();
  }

  // Halt the loop (used on finish and on skip).
  stop() {
    clearTimeout(this.timer);
    stopSpeech();
    this.run = null;
  }

  // ---- view helpers (this service owns the reaction screen) ----

  paintCue(arrowText, labelText, animate) {
    const arrow = $("cue-arrow");
    arrow.textContent = arrowText;
    $("cue-label").textContent = labelText;
    arrow.classList.remove("cue-animate");
    if (animate) {
      void arrow.offsetWidth; // reflow so the animation restarts
      arrow.classList.add("cue-animate");
    }
  }

  paintCount() {
    $("rep-counter").textContent = `${this.run.index} / ${this.run.totalReps}`;
    $("reaction-score").textContent = `Cones: ${this.run.saves} / ${this.run.totalReps}`;
  }
}
