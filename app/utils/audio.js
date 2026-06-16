// =======================================================
// AUDIO — short beeps and phone vibration, used for hands-free cues.
// The Web Audio context is created lazily because browsers only allow audio
// to start after a user gesture (the "Begin Trial" tap unlocks it).
// =======================================================

let ctx = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { /* audio unsupported — stays null */ }
  }
  return ctx;
}

// Play a short sine-wave blip at `freq` Hz for `ms` milliseconds.
export function beep(freq = 660, ms = 120) {
  try {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + ms / 1000);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + ms / 1000);
  } catch (e) { /* silent fallback */ }
}

// Vibrate the phone for `ms` milliseconds, where supported.
export function buzz(ms = 60) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch (e) { /* vibration unsupported */ }
}
