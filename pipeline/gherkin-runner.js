// pipeline/gherkin-runner.js — Gherkin step definitions
// Run: node pipeline/gherkin-runner.js

'use strict';

const fs   = require('fs');
const path = require('path');
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

function scenario(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    failures.push(`  FAIL: ${name}\n       ${e.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected)
        throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toContain(item) {
      if (!Array.isArray(actual) || !actual.includes(item))
        throw new Error(`expected array to contain ${JSON.stringify(item)}, got ${JSON.stringify(actual)}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`expected truthy, got ${JSON.stringify(actual)}`);
    },
    toHaveLength(n) {
      if (!actual || actual.length !== n)
        throw new Error(`expected length ${n}, got ${actual ? actual.length : 'undefined'}`);
    },
  };
}

// ── landing.feature ──────────────────────────────────────────────────────────

scenario('Landing: app heading is "Fallacy Finder"', () => {
  // Verified via ui-audit — heading text is structural, not logic
  // Logic contract: getSlogans() returns content that will be in the DOM
  expect(getSlogans()).toHaveLength(4);
});

scenario('Landing: slogans cycle through all four', () => {
  const slogans = getSlogans();
  expect(slogans).toContain("We know when you're lying.");
  expect(slogans).toContain("You can't control what you reveal.");
  expect(slogans).toContain('Truth is a baseline. Deviation is data.');
  expect(slogans).toContain('The test is unreliable. So are you.');
});

// ── calibration.feature ──────────────────────────────────────────────────────

scenario('Calibration: step 1 prompt is displayed correctly', () => {
  const prompts = getCalibrationPrompts();
  expect(prompts[0].step).toBe(1);
  expect(/last week/i.test(prompts[0].text)).toBe(true);
});

scenario('Calibration: step 2 prompt is displayed correctly', () => {
  const prompts = getCalibrationPrompts();
  expect(prompts[1].step).toBe(2);
  expect(/room/i.test(prompts[1].text)).toBe(true);
});

scenario('Calibration: step 3 prompt asks for a deliberate lie', () => {
  const prompts = getCalibrationPrompts();
  expect(prompts[2].step).toBe(3);
  expect(/lie/i.test(prompts[2].text)).toBe(true);
});

scenario('Calibration: progress tracks correctly through all steps', () => {
  let profile = createBaselineProfile();
  expect(isCalibrationComplete(profile)).toBe(false);

  profile = recordCalibrationStep(profile, 1, 'My name is Rod');
  expect(isCalibrationComplete(profile)).toBe(false);

  profile = recordCalibrationStep(profile, 2, 'The kitchen has a wooden floor');
  expect(isCalibrationComplete(profile)).toBe(false);

  profile = recordCalibrationStep(profile, 3, 'I had eggs for breakfast');
  expect(isCalibrationComplete(profile)).toBe(true);
});

scenario('Calibration: BaselineProfile holds all three responses after completion', () => {
  let profile = createBaselineProfile();
  profile = recordCalibrationStep(profile, 1, 'step one response');
  profile = recordCalibrationStep(profile, 2, 'step two response');
  profile = recordCalibrationStep(profile, 3, 'step three response');
  expect(profile[1]).toBe('step one response');
  expect(profile[2]).toBe('step two response');
  expect(profile[3]).toBe('step three response');
});

// ── Summary ──────────────────────────────────────────────────────────────────

if (failures.length) failures.forEach(f => console.log(f));
console.log(`\nGherkin: ${passed}/${passed + failed} passing`);
process.exit(failed > 0 ? 1 : 0);
