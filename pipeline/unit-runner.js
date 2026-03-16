// pipeline/unit-runner.js — unit tests for pure functions in pipeline/logic.js
// Run: node pipeline/unit-runner.js

'use strict';

const {
  getCalibrationPrompts,
  createBaselineProfile,
  recordCalibrationStep,
  isCalibrationComplete,
  getSlogans,
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

// ── Summary ──────────────────────────────────────────────────────────────────

if (failures.length) {
  failures.forEach(f => console.log(f));
}
console.log(`\nUnit Tests: ${passed}/${passed + failed} passing`);
process.exit(failed > 0 ? 1 : 0);
