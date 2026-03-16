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

// ── ScoreCard ─────────────────────────────────────────────────────────────────

function createScoreCard() {
  return { comfortMap: [], summary: '', debrief: '' };
}

// ── Transcript ────────────────────────────────────────────────────────────────

function createTranscript() {
  return [];
}

function addToTranscript(transcript, role, message) {
  return transcript.concat({ role, message });
}

// ── SellerAgent — Ray (Mode C walking skeleton) ───────────────────────────────

const RAY_INTRO = {
  name: 'Ray',
  description: "You're buying a used car. The seller's name is Ray. He seems friendly enough. Ask him anything.",
};

const RAY_BRAKE_KEYWORDS = /brake|mot|service|service history|maintenance|mechanical/i;

const RAY_RESPONSES = {
  brake: "The brakes are absolutely fine — had them looked at not long ago. She passed her MOT, no issues flagged. Previous owner was very particular about upkeep.",
  generic: "She's a great little car. Four years old, fifty-two thousand on the clock, one previous owner — my cousin actually, so I know the full history. Never given me a moment's trouble.",
  colour: "Silver. Lovely condition for her age, barely a mark on her.",
  price: "I'm asking four thousand eight hundred. I think that's very fair given the mileage and condition.",
  default: "Good question. I can tell you've done your homework. She's a solid motor — I wouldn't be selling her if I didn't think she'd serve you well.",
};

function getRayIntro() {
  return RAY_INTRO;
}

function getRayResponse(userMessage) {
  if (RAY_BRAKE_KEYWORDS.test(userMessage)) return RAY_RESPONSES.brake;
  if (/colou?r|look|appear/i.test(userMessage))  return RAY_RESPONSES.colour;
  if (/price|cost|how much|afford/i.test(userMessage)) return RAY_RESPONSES.price;
  if (/tell me about|general|overview|describe/i.test(userMessage)) return RAY_RESPONSES.generic;
  return RAY_RESPONSES.default;
}

// ── ScoringPanel — NAVARRO (stub, walking skeleton) ───────────────────────────

const NAVARRO_DISCOMFORT_TOPICS = /brake|mot|service|mechanical|maintenance/i;

function assessTranscript(transcript, baselineProfile) {
  const card = createScoreCard();
  const fullText = transcript.map(e => e.message).join(' ');

  if (NAVARRO_DISCOMFORT_TOPICS.test(fullText)) {
    card.comfortMap = [{ topic: 'service history', signal: 'discomfort' }];
    card.summary  = 'One topic produced a notable comfort shift.';
    card.debrief  = 'Ray showed a brief hesitation before questions about recent service history, followed by unusual specificity. Classic legalistic pattern — technically accurate, structurally misleading.';
  } else {
    card.summary = 'No significant comfort shifts detected on topics raised.';
    card.debrief = 'No discomfort signals flagged on the topics covered in this exchange.';
  }

  return card;
}

// ── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  getCalibrationPrompts,
  createBaselineProfile,
  recordCalibrationStep,
  isCalibrationComplete,
  getSlogans,
  createScoreCard,
  createTranscript,
  addToTranscript,
  getRayIntro,
  getRayResponse,
  assessTranscript,
};
