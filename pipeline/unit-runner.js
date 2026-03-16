// pipeline/unit-runner.js — unit tests for pure functions in pipeline/logic.js
// Run: node pipeline/unit-runner.js

'use strict';

const {
  getCalibrationPrompts,
  createBaselineProfile,
  recordCalibrationStep,
  isCalibrationComplete,
  getSlogans,
  createScoreCard,
  getRayIntro,
  getRayResponse,
  assessTranscript,
  createTranscript,
  addToTranscript,
  buildRayRequest,
} = require('./logic.js');

let passed = 0;
let failed = 0;
const failures = [];

function assert(description, actual, expected) {
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    failures.push(`  FAIL: ${description}\n       expected: ${JSON.stringify(expected)}\n       got:      ${JSON.stringify(actual)}`);
  }
}

function assertDeep(description, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
  } else {
    failed++;
    failures.push(`  FAIL: ${description}\n       expected: ${e}\n       got:      ${a}`);
  }
}

function assertContains(description, array, item) {
  if (Array.isArray(array) && array.includes(item)) {
    passed++;
  } else {
    failed++;
    failures.push(`  FAIL: ${description}\n       expected array to contain: ${JSON.stringify(item)}\n       got: ${JSON.stringify(array)}`);
  }
}

// ── getCalibrationPrompts ────────────────────────────────────────────────────

const prompts = getCalibrationPrompts();

assert('getCalibrationPrompts: returns exactly 3 prompts',
  Array.isArray(prompts) && prompts.length,
  3);

assert('getCalibrationPrompts: step 1 has step number 1',
  prompts && prompts[0] && prompts[0].step,
  1);

assert('getCalibrationPrompts: step 2 has step number 2',
  prompts && prompts[1] && prompts[1].step,
  2);

assert('getCalibrationPrompts: step 3 has step number 3',
  prompts && prompts[2] && prompts[2].step,
  3);

assert('getCalibrationPrompts: step 1 prompt mentions last week',
  prompts && /last week/i.test(prompts[0].text),
  true);

assert('getCalibrationPrompts: step 2 prompt mentions room',
  prompts && /room/i.test(prompts[1].text),
  true);

assert('getCalibrationPrompts: step 3 prompt mentions lie',
  prompts && /lie/i.test(prompts[2].text),
  true);

// ── createBaselineProfile ────────────────────────────────────────────────────

const emptyProfile = createBaselineProfile();

assert('createBaselineProfile: step 1 slot is null',
  emptyProfile && emptyProfile[1],
  null);

assert('createBaselineProfile: step 2 slot is null',
  emptyProfile && emptyProfile[2],
  null);

assert('createBaselineProfile: step 3 slot is null',
  emptyProfile && emptyProfile[3],
  null);

// ── recordCalibrationStep ────────────────────────────────────────────────────

const profile0 = createBaselineProfile();
const profile1 = recordCalibrationStep(profile0, 1, 'My name is Rod');

assert('recordCalibrationStep: stores response at correct step',
  profile1 && profile1[1],
  'My name is Rod');

assert('recordCalibrationStep: other steps remain null',
  profile1 && profile1[2],
  null);

assert('recordCalibrationStep: does not mutate original profile',
  profile0 && profile0[1],
  null);

const profile2 = recordCalibrationStep(profile1, 2, 'The kitchen has a wooden floor');
const profile3 = recordCalibrationStep(profile2, 3, 'I had eggs for breakfast');

assert('recordCalibrationStep: step 2 stores correctly',
  profile2 && profile2[2],
  'The kitchen has a wooden floor');

assert('recordCalibrationStep: step 3 stores correctly',
  profile3 && profile3[3],
  'I had eggs for breakfast');

// ── isCalibrationComplete ────────────────────────────────────────────────────

assert('isCalibrationComplete: false for empty profile',
  isCalibrationComplete(createBaselineProfile()),
  false);

assert('isCalibrationComplete: false with only step 1 recorded',
  isCalibrationComplete(recordCalibrationStep(createBaselineProfile(), 1, 'response')),
  false);

assert('isCalibrationComplete: false with only steps 1 and 2 recorded',
  isCalibrationComplete(
    recordCalibrationStep(
      recordCalibrationStep(createBaselineProfile(), 1, 'r1'),
      2, 'r2'
    )
  ),
  false);

assert('isCalibrationComplete: true when all 3 steps recorded',
  isCalibrationComplete(profile3),
  true);

// ── getSlogans ───────────────────────────────────────────────────────────────

const slogans = getSlogans();

assert('getSlogans: returns exactly 4 slogans',
  Array.isArray(slogans) && slogans.length,
  4);

assertContains('getSlogans: contains "We know when you\'re lying."',
  slogans, "We know when you're lying.");

assertContains('getSlogans: contains "You can\'t control what you reveal."',
  slogans, "You can't control what you reveal.");

assertContains('getSlogans: contains "Truth is a baseline. Deviation is data."',
  slogans, 'Truth is a baseline. Deviation is data.');

assertContains('getSlogans: contains "The test is unreliable. So are you."',
  slogans, 'The test is unreliable. So are you.');

// ── createScoreCard ───────────────────────────────────────────────────────────

const emptyCard = createScoreCard();

assert('createScoreCard: comfortMap is an empty array',
  Array.isArray(emptyCard && emptyCard.comfortMap) && emptyCard.comfortMap.length,
  0);

assert('createScoreCard: summary is an empty string',
  emptyCard && emptyCard.summary,
  '');

assert('createScoreCard: debrief is an empty string',
  emptyCard && emptyCard.debrief,
  '');

// ── getRayIntro ───────────────────────────────────────────────────────────────

const intro = getRayIntro();

assert('getRayIntro: name is Ray',
  intro && intro.name,
  'Ray');

assert('getRayIntro: description is a non-empty string',
  typeof (intro && intro.description) === 'string' && intro.description.length > 0,
  true);

// ── getRayResponse ────────────────────────────────────────────────────────────

assert('getRayResponse: returns a string',
  typeof getRayResponse('Tell me about the car') === 'string',
  true);

assert('getRayResponse: returns a non-empty string',
  getRayResponse('Tell me about the car').length > 0,
  true);

assert('getRayResponse: brake question returns a response',
  typeof getRayResponse('What about the brakes?') === 'string',
  true);

assert('getRayResponse: brake response differs from generic response',
  getRayResponse('What about the brakes?') !== getRayResponse('Tell me about the colour'),
  true);

// ── createTranscript ──────────────────────────────────────────────────────────

const emptyTranscript = createTranscript();

assert('createTranscript: returns an empty array',
  Array.isArray(emptyTranscript) && emptyTranscript.length,
  0);

// ── addToTranscript ───────────────────────────────────────────────────────────

const t0 = createTranscript();
const t1 = addToTranscript(t0, 'user', 'What about the brakes?');

assert('addToTranscript: returns transcript with one entry',
  t1.length,
  1);

assert('addToTranscript: entry has correct role',
  t1[0] && t1[0].role,
  'user');

assert('addToTranscript: entry has correct message',
  t1[0] && t1[0].message,
  'What about the brakes?');

assert('addToTranscript: does not mutate original transcript',
  t0.length,
  0);

const t2 = addToTranscript(t1, 'seller', 'The brakes are absolutely fine, had them checked.');
assert('addToTranscript: second entry appended correctly',
  t2.length,
  2);

// ── assessTranscript ──────────────────────────────────────────────────────────

const baselineForAssess = (() => {
  let p = createBaselineProfile();
  p = recordCalibrationStep(p, 1, 'My name is Alex');
  p = recordCalibrationStep(p, 2, 'The living room has a blue sofa');
  p = recordCalibrationStep(p, 3, 'I had cereal for breakfast');
  return p;
})();

const neutralTranscript = (() => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What colour is it?');
  t = addToTranscript(t, 'seller', 'She\'s a lovely silver, very clean.');
  return t;
})();

const brakeTranscript = (() => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What about the brakes and MOT history?');
  t = addToTranscript(t, 'seller', 'Brakes are absolutely fine, passed the MOT no problem.');
  return t;
})();

const neutralCard = assessTranscript(neutralTranscript, baselineForAssess);
const brakeCard   = assessTranscript(brakeTranscript,  baselineForAssess);

assert('assessTranscript: returns a ScoreCard',
  neutralCard !== null && neutralCard !== undefined,
  true);

assert('assessTranscript: ScoreCard has a summary string',
  typeof (neutralCard && neutralCard.summary) === 'string',
  true);

assert('assessTranscript: ScoreCard has a debrief string',
  typeof (neutralCard && neutralCard.debrief) === 'string',
  true);

assert('assessTranscript: ScoreCard has a comfortMap array',
  Array.isArray(neutralCard && neutralCard.comfortMap),
  true);

assert('assessTranscript: neutral transcript produces empty comfortMap',
  neutralCard && neutralCard.comfortMap.length,
  0);

assert('assessTranscript: brake transcript flags discomfort',
  brakeCard && brakeCard.comfortMap.length > 0,
  true);

assert('assessTranscript: brake discomfort entry topic is service history',
  brakeCard && brakeCard.comfortMap[0] && brakeCard.comfortMap[0].topic,
  'service history');

assert('assessTranscript: brake ScoreCard has non-empty summary',
  brakeCard && brakeCard.summary.length > 0,
  true);

assert('assessTranscript: brake ScoreCard has non-empty debrief',
  brakeCard && brakeCard.debrief.length > 0,
  true);

// ── buildRayRequest ───────────────────────────────────────────────────────────

const reqTranscript = (() => {
  let t = createTranscript();
  t = addToTranscript(t, 'user',   'What about the brakes?');
  t = addToTranscript(t, 'seller', 'Absolutely fine, had them looked at.');
  t = addToTranscript(t, 'user',   'And the MOT?');
  return t;
})();

const req = buildRayRequest(reqTranscript);

assert('buildRayRequest: returns an object with a messages array',
  Array.isArray(req && req.messages),
  true);

assert('buildRayRequest: messages length matches transcript length',
  req && req.messages && req.messages.length,
  3);

assert('buildRayRequest: user entry maps to role "user"',
  req && req.messages && req.messages[0].role,
  'user');

assert('buildRayRequest: seller entry maps to role "assistant"',
  req && req.messages && req.messages[1].role,
  'assistant');

assert('buildRayRequest: user entry maps to role "user" (third entry)',
  req && req.messages && req.messages[2].role,
  'user');

assert('buildRayRequest: content matches original message',
  req && req.messages && req.messages[0].content,
  'What about the brakes?');

assert('buildRayRequest: empty transcript produces empty messages array',
  Array.isArray(buildRayRequest(createTranscript()).messages) &&
    buildRayRequest(createTranscript()).messages.length,
  0);

// ── Summary ──────────────────────────────────────────────────────────────────

if (failures.length) {
  failures.forEach(f => console.log(f));
}
console.log(`\nUnit Tests: ${passed}/${passed + failed} passing`);
process.exit(failed > 0 ? 1 : 0);
