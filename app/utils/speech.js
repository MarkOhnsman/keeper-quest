// =======================================================
// SPEECH — spoken cues so a training session is hands-free
// (the phone can sit on the grass and call the drills aloud).
// =======================================================

// Speak `text` aloud. Cancels anything already speaking so cues never pile up.
export function speak(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  } catch (e) { /* speech unsupported — silent fallback */ }
}

// Stop anything currently being spoken (used when a phase ends or is skipped).
export function stopSpeech() {
  try {
    if (window.speechSynthesis) speechSynthesis.cancel();
  } catch (e) { /* nothing to stop */ }
}
