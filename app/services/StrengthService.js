// =======================================================
// STRENGTH SERVICE — Phase II: the bodyweight strength circuit.
// Shows the day's moves as a checklist. The keeper does each move, ticks it
// off, and can optionally log a rep count (which feeds the Records book). The
// "Complete Phase" button stays disabled until every move is checked.
//
// Lifecycle: start(plan) -> (keeper ticks moves) -> complete() -> onComplete(xp).
// =======================================================
import { $ } from "../ui/screens.js";

export class StrengthService {
  constructor(state) {
    this.state = state;
    this.run = null;
    this.onComplete = function () {}; // set by the controller: receives earned XP
  }

  start(plan) {
    this.run = { list: plan.strength, checked: 0, xp: 0 };

    const container = $("strength-exercises");
    container.innerHTML = this.run.list.map((ex, i) => this.cardHtml(ex, i)).join("");

    // Wire each card's check button (no inline onclick).
    this.run.list.forEach((ex, i) => {
      $("ex-check-" + i).addEventListener("click", () => this.toggle(i, ex.xp));
    });

    this.updateDoneButton();
  }

  cardHtml(ex, i) {
    const best = this.state.getCondBest(ex.name);
    const bestNote = best ? `best ${best}` : "";
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
          <div class="ex-check" id="ex-check-${i}">
            <span id="ex-icon-${i}"></span>
          </div>
        </div>
      </div>`;
  }

  // Tick a move on or off, keeping the running checked-count and XP in sync.
  toggle(i, xp) {
    const check = $("ex-check-" + i);
    const icon = $("ex-icon-" + i);
    const isDone = check.classList.contains("done");

    check.classList.toggle("done", !isDone);
    icon.textContent = isDone ? "" : "✓";
    this.run.checked += isDone ? -1 : 1;
    this.run.xp += isDone ? -xp : xp;

    this.updateDoneButton();
  }

  // Enable "Complete Phase" only once every move is checked.
  updateDoneButton() {
    const btn = $("strength-done-btn");
    if (btn) btn.disabled = this.run.checked < this.run.list.length;
  }

  complete() {
    this.logOptionalReps();
    const xp = this.run.xp;
    this.run = null;
    this.onComplete(xp);
  }

  // Save any rep counts the keeper typed, so strength progress shows in Records.
  logOptionalReps() {
    this.run.list.forEach((ex, i) => {
      const input = $("ex-reps-" + i);
      const reps = input ? parseInt(input.value, 10) : NaN;
      if (Number.isFinite(reps) && reps > 0) {
        this.state.recordCondBest(ex.name, reps, "reps");
      }
    });
  }
}
