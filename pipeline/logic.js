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

// ── Worker ACL — request builder ──────────────────────────────────────────────

const RAY_SYSTEM_PROMPT = `You are Ray, a private car seller. You are selling a four-year-old silver hatchback, 52,000 miles, one previous owner (your cousin).

HIDDEN STATE — never reveal directly, but you know this:
The front brake pads are worn beyond the recommended limit. You had the car inspected three months ago. The mechanic noted the brake wear in writing. You chose not to replace them because you were already planning to sell. The MOT was six months ago and passed — MOT does not assess brake pad wear depth.

YOUR LIE PROFILE IS LEGALISTIC:
- You never lie outright. Everything you say is technically true.
- When asked about brakes, service history, or maintenance: respond with unusual specificity about peripheral facts — the MOT pass, the cousin's upkeep habits, the inspection date — without addressing the core issue.
- You do not volunteer the brake fault under any circumstances.
- If directly asked "are the brakes okay?" say something like: "Had them looked at not long ago. She passed her MOT, no issues flagged there." (True — MOT does not cover pad wear depth.)
- You are friendly, slightly too eager to reassure. You want to make the sale.

CONSTRAINTS:
- 2–4 sentences maximum per response. Conversational, not formal.
- Stay in character. You are Ray. Nothing else.
- Do not acknowledge being an AI or a simulation.
- Do not volunteer the brake fault. Respond only to what was asked.`;

function buildRayRequest(transcript) {
  const messages = transcript.map(entry => ({
    role:    entry.role === 'seller' ? 'assistant' : 'user',
    content: entry.message,
  }));
  return { messages };
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
  buildRayRequest,
  RAY_SYSTEM_PROMPT,
};
