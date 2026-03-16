// pipeline/logic.js — pure functions under test
// All exports must be deterministic: same input → same output, always.
// No API calls, no DOM, no side effects.

'use strict';

// ── CalibrationPhase ─────────────────────────────────────────────────────────

function getCalibrationPrompts() {
  return [
    { step: 1, text: 'Tell us your name and something that happened to you last week' },
    { step: 2, text: 'Describe a room in your home' },
    { step: 3, text: 'Tell us one deliberate lie about something that happened this morning' },
  ];
}

function createBaselineProfile() {
  return { 1: null, 2: null, 3: null };
}

function recordCalibrationStep(profile, step, response) {
  return Object.assign({}, profile, { [step]: response });
}

function isCalibrationComplete(profile) {
  return profile[1] !== null && profile[2] !== null && profile[3] !== null;
}

// ── LandingScreen ────────────────────────────────────────────────────────────

function getSlogans() {
  return [
    "We know when you're lying.",
    "You can't control what you reveal.",
    'Truth is a baseline. Deviation is data.',
    'The test is unreliable. So are you.',
  ];
}

// ── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  getCalibrationPrompts,
  createBaselineProfile,
  recordCalibrationStep,
  isCalibrationComplete,
  getSlogans,
};
