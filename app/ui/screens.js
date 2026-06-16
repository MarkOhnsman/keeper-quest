// =======================================================
// SCREENS — the view router. Only one top-level screen is visible at a time
// (title / hub), the hub has tabs, and an active session has phases.
// All DOM lookups in the app go through the `$` helper here.
// =======================================================

// Shorthand for document.getElementById — used everywhere we touch the DOM.
export function $(id) {
  return document.getElementById(id);
}

// ---- top-level screens (title, hub) ----
export function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("screen-" + id).classList.add("active");
}

// ---- hub tabs (map, session, records, scroll) ----
const TABS = ["map", "session", "records", "scroll"];

export function showTab(tab, hooks = {}) {
  document.querySelectorAll(".tab-content").forEach((t) => { t.style.display = "none"; });
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));

  const content = $("tab-" + tab);
  if (content) content.style.display = "block";

  const idx = TABS.indexOf(tab);
  if (idx >= 0) document.querySelectorAll(".tab-btn")[idx].classList.add("active");

  // Let the caller refresh a tab's contents when it opens.
  if (hooks[tab]) hooks[tab]();
}

// ---- session phases (reaction → strength → conditioning → ballskills) ----
const SESSION_PHASES = ["reaction", "strength", "conditioning", "ballskills"];
const PHASE_LABELS = ["⚡ React", "💪 Strength", "🔥 Condition", "⚽ Ball"];

// Show one phase's block (conditioning + ball skills share the "drill" block)
// and repaint the little phase-progress dots.
export function showPhase(phase) {
  const blockFor = (p) => (p === "conditioning" || p === "ballskills") ? "drill" : p;
  ["reaction", "strength", "drill"].forEach((block) => {
    const el = $("phase-" + block);
    if (el) el.style.display = block === blockFor(phase) ? "block" : "none";
  });
  renderPhaseDots(phase);
}

function renderPhaseDots(phase) {
  const el = $("phase-dots");
  if (!el) return;
  const current = SESSION_PHASES.indexOf(phase);
  el.innerHTML = SESSION_PHASES.map((p, i) => {
    const cls = i < current ? "done" : i === current ? "active" : "idle";
    return `<div class="phase-dot ${cls}">${PHASE_LABELS[i]}</div>`;
  }).join("");
}
