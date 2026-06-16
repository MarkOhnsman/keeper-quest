// =======================================================
// MAIN — the entry point. Builds the model + services + controller, wires
// every button to them, and decides which screen to show on load. This is the
// only file that touches both the DOM event wiring and the high-level flow.
// =======================================================
import { state } from "./state/AppState.js";
import { ReactionService } from "./services/ReactionService.js";
import { StrengthService } from "./services/StrengthService.js";
import { TrackService } from "./services/TrackService.js";
import { SessionController } from "./SessionController.js";
import { $, showScreen } from "./ui/screens.js";
import { refreshHub, openTab, hideComplete } from "./ui/hub.js";
import { installConsole } from "./console.js";
import { TOTAL_DAYS } from "./data/config.js";

// ---- build the app ----
const reaction = new ReactionService();
const strength = new StrengthService(state);
const track = new TrackService(state);
const session = new SessionController(state, { reaction, strength, track });

// ---- onboarding ----
function startJourney() {
  const input = $("keeper-name-input");
  const name = input ? input.value.trim() : "";
  state.setKeeperName(name);
  // Dev cheat: the name "test" unlocks all 30 days.
  if (name.toLowerCase() === "test") state.jumpToDay(TOTAL_DAYS);
  enterHub();
}

function enterHub() {
  showScreen("hub");
  refreshHub();
  openTab("map");
}

// ---- wire up the DOM ----
$("begin-quest-btn").addEventListener("click", startJourney);
$("keeper-name-input").addEventListener("keydown", (e) => { if (e.key === "Enter") startJourney(); });

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => openTab(btn.dataset.tab));
});

$("begin-session-btn").addEventListener("click", () => session.begin());
$("skip-reaction-btn").addEventListener("click", () => reaction.skip());
$("strength-done-btn").addEventListener("click", () => strength.complete());

$("cond-start-btn").addEventListener("click", () => track.startCurrent());
$("cond-stop-btn").addEventListener("click", () => track.stopStreak());
$("cond-log-btn").addEventListener("click", () => track.logReps());
$("cond-rep-input").addEventListener("keydown", (e) => { if (e.key === "Enter") track.logReps(); });
$("cond-done-btn").addEventListener("click", () => track.complete());

$("complete-close-btn").addEventListener("click", () => { hideComplete(); openTab("map"); });

// Parent console for managing gold (window.keeper.help()).
installConsole(state, refreshHub);

// ---- decide the opening screen ----
const dayParam = parseInt(new URLSearchParams(location.search).get("day"), 10);
if (Number.isFinite(dayParam)) {
  // Testing helper: ?day=N jumps straight to day N.
  state.jumpToDay(dayParam);
  enterHub();
} else if (state.hasProgress()) {
  enterHub();
} else {
  showScreen("title");
}
