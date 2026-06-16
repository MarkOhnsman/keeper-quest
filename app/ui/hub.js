// =======================================================
// HUB — everything that paints the home screen and its tabs:
// the header (rank + XP bar), the Quest Map grid, the Codex, the pre-session
// preview, the Records book, and the "day complete" overlay.
//
// This is the view layer: it only READS state, never changes it.
// =======================================================
import { state } from "../state/AppState.js";
import { TOTAL_DAYS } from "../data/config.js";
import { RANKS, getRank, getNextRank } from "../data/ranks.js";
import { DAY_LORE, DAY_QUESTS } from "../data/lore.js";
import { buildDay } from "../data/days.js";
import { $, showTab } from "./screens.js";

// Open a hub tab and refresh its contents (the map cells link here too).
export function openTab(tab) {
  showTab(tab, {
    session: refreshSessionPreview,
    records: renderRecords,
  });
}

// Repaint the whole hub for the current state.
export function refreshHub() {
  renderHeader();
  buildDayGrid();
  buildCodex();
  refreshSessionPreview();
}

// ---- header: rank badge + XP bar ----
function renderHeader() {
  const rank = getRank(state.totalXP);
  const nextRank = getNextRank(rank.level);
  const xpInLevel = state.totalXP - rank.minXP;
  const xpRange = (nextRank ? nextRank.minXP : rank.minXP + 500) - rank.minXP;
  const pct = Math.min(100, Math.round((xpInLevel / xpRange) * 100));

  $("hub-keeper-name").textContent = state.keeperName;
  $("hub-level-badge").textContent = `Lvl ${rank.level} — ${rank.name}`;
  $("hub-xp-text").textContent = `${state.totalXP} XP`;
  $("xp-bar").style.width = pct + "%";
  $("hub-day-num").textContent = state.currentDay;
}

// ---- Quest Map: the 30-day grid ----
function buildDayGrid() {
  const grid = $("day-grid");
  if (!grid) return;
  grid.innerHTML = "";

  for (let day = 1; day <= TOTAL_DAYS; day++) {
    grid.appendChild(buildDayCell(day));
  }
}

function buildDayCell(day) {
  const done = state.isDayComplete(day);
  const isToday = day === state.currentDay;
  const locked = day > state.currentDay;

  const cell = document.createElement("div");
  cell.className = "day-cell " + (done ? "completed" : isToday ? "today" : locked ? "locked" : "available");
  cell.innerHTML = done ? '<span class="day-icon">✓</span>' : String(day);

  if (!locked) {
    cell.title = `Day ${day}: ${DAY_LORE[day - 1]}`;
    if (!done) cell.addEventListener("click", () => openTab("session"));
  }
  return cell;
}

// ---- Codex: the rank ladder ----
function buildCodex() {
  const list = $("rank-list");
  if (!list) return;
  const currentRank = getRank(state.totalXP);

  list.innerHTML = RANKS.map((r) => {
    const unlocked = state.totalXP >= r.minXP;
    const isCurrent = r.level === currentRank.level;
    return `
      <div class="rank-row ${isCurrent ? "current-rank" : ""}">
        <span>${unlocked ? "⚔️" : "🔒"}</span>
        <span>Lvl ${r.level}: <strong>${r.name}</strong>${isCurrent ? " ← you" : ""}</span>
        <span class="rank-xp">${r.minXP} XP</span>
      </div>`;
  }).join("");
}

// ---- pre-session preview ----
function refreshSessionPreview() {
  const day = state.currentDay;
  const plan = buildDay(day);
  if (!plan) return;

  $("session-day-label").textContent = `Day ${day} — ${plan.lore}`;
  $("session-quest").textContent = DAY_QUESTS[day - 1] || "";

  const overview = $("session-overview");
  const btn = $("begin-session-btn");

  if (state.isDayComplete(day)) {
    overview.innerHTML = '<span style="color:#7fc8a0;">✓ Trial complete for today. Return tomorrow.</span>';
    btn.disabled = true;
    btn.textContent = "Quest Complete ✓";
  } else {
    overview.innerHTML = renderOverview(plan);
    btn.disabled = false;
    btn.textContent = "Begin Trial ⚔️";
  }

  // Always start on the preview, not a half-finished session.
  $("session-not-started").style.display = "block";
  $("session-active").style.display = "none";
}

function renderOverview(plan) {
  const bullets = (list) => list.map((e) => `• ${e.name}`).join("<br>");
  return `
    <p class="mb-8"><strong>⚡ Reaction:</strong> ${plan.reactionReps} cues</p>
    <p class="mb-8"><strong>💪 Strength:</strong><br>${bullets(plan.strength)}</p>
    <p class="mb-8"><strong>🔥 Conditioning:</strong><br>${bullets(plan.conditioning)}</p>
    <p><strong>⚽ Ball Skills:</strong><br>${bullets(plan.ballSkills)}</p>
  `;
}

// ---- Records book: personal bests + recent history ----
function renderRecords() {
  const body = $("records-body");
  if (!body) return;

  const history = state.condHistory || [];
  if (history.length === 0) {
    body.innerHTML = `<div class="parchment center" style="color:var(--ink);">
      No AMRAP work logged yet. Finish a Conditioning Gauntlet to start your record book!</div>`;
    return;
  }

  const byName = groupByName(history);
  body.innerHTML = Object.keys(byName).sort()
    .map((name) => renderRecordCard(name, byName[name]))
    .join("");
}

function groupByName(history) {
  const byName = {};
  history.forEach((h) => {
    (byName[h.name] = byName[h.name] || []).push(h);
  });
  return byName;
}

function renderRecordCard(name, entries) {
  const unit = entries[entries.length - 1].unit || "reps";
  const best = state.getCondBest(name) || Math.max(...entries.map((e) => e.reps));
  // Most recent 6 attempts, newest first.
  const chips = entries.slice(-6).reverse()
    .map((e) => `<span class="record-chip">D${e.day}: <strong>${e.reps}</strong></span>`)
    .join("");

  return `<div class="parchment mb-12">
      <div class="record-head">
        <span class="record-name">${name}</span>
        <span class="record-best">🏆 ${best} ${unit}</span>
      </div>
      <div class="record-chips">${chips}</div>
    </div>`;
}

// ---- "day complete" overlay ----
export function showComplete(day, sessionXP, totalXP) {
  $("complete-title").textContent = `Day ${day} Complete! ⚔️`;
  $("complete-sub").textContent = `+${sessionXP} XP earned · ${totalXP} total XP`;
  $("complete-overlay").classList.add("show");
  refreshHub();
}

export function hideComplete() {
  $("complete-overlay").classList.remove("show");
  $("session-active").style.display = "none";
  $("session-not-started").style.display = "block";
}
