// =======================================================
// SESSION CONTROLLER — owns one day's training flow and chains the four
// services together. The services don't know about each other; this is the
// only place that says "reaction → strength → conditioning → ball skills → done".
//
// Each service reports back through a callback; the controller tallies the XP
// from every phase and, at the end, asks AppState to bank the day.
// =======================================================
import { buildDay } from "./data/days.js";
import { REACTION_BASE_XP, REACTION_PER_SAVE_XP } from "./data/config.js";
import { showPhase, $ } from "./ui/screens.js";
import { showComplete } from "./ui/hub.js";

export class SessionController {
  constructor(state, services) {
    this.state = state;
    this.reaction = services.reaction;
    this.strength = services.strength;
    this.track = services.track;
    this.run = null; // { dayNum, plan, xp } while a session is active

    this.wirePhaseHandoffs();
  }

  // Connect each service's "I'm done" callback to the next phase.
  wirePhaseHandoffs() {
    this.reaction.onComplete = (saves) => {
      this.addXp(REACTION_BASE_XP + saves * REACTION_PER_SAVE_XP);
      this.startStrength();
    };
    this.strength.onComplete = (xp) => {
      this.addXp(xp);
      this.startConditioning();
    };
  }

  // ---- the day flow ----

  begin() {
    const dayNum = this.state.currentDay;
    this.run = { dayNum, plan: buildDay(dayNum), xp: 0 };

    $("session-not-started").style.display = "none";
    $("session-active").style.display = "block";

    showPhase("reaction");
    this.reaction.start(this.run.plan);
  }

  startStrength() {
    showPhase("strength");
    this.strength.start(this.run.plan);
  }

  startConditioning() {
    showPhase("conditioning");
    this.track.start({
      list: this.run.plan.conditioning,
      sectionLabel: "Phase III — Conditioning Gauntlet",
      doneLabel: "Ball Skills →",
      onComplete: (xp) => {
        this.addXp(xp);
        this.startBallSkills();
      },
    });
  }

  startBallSkills() {
    showPhase("ballskills");
    this.track.start({
      list: this.run.plan.ballSkills,
      sectionLabel: "Phase IV — Ball Skills",
      doneLabel: "Finish Trial ⚔️",
      onComplete: (xp) => {
        this.addXp(xp);
        this.finish();
      },
    });
  }

  finish() {
    const { dayNum, xp } = this.run;
    this.state.completeDay(dayNum, xp);
    showComplete(dayNum, xp, this.state.totalXP);
    this.run = null;
  }

  addXp(amount) {
    if (this.run) this.run.xp += amount;
  }
}
