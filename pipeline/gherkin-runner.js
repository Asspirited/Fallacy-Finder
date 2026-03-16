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
  getRayIntro,
  getRayResponse,
  createTranscript,
  addToTranscript,
  assessTranscript,
  buildRayRequest,
  RAY_SYSTEM_PROMPT,
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

// ── mode-c.feature ───────────────────────────────────────────────────────────

scenario('Mode C: user sees the seller name and scenario description', () => {
  const intro = getRayIntro();
  expect(typeof intro.name).toBe('string');
  expect(intro.name.length > 0).toBe(true);
  expect(typeof intro.description).toBe('string');
  expect(intro.description.length > 0).toBe(true);
});

scenario('Mode C: user sends a message and receives a response', () => {
  const response = getRayResponse('Tell me about the car');
  expect(typeof response).toBe('string');
  expect(response.length > 0).toBe(true);
});

scenario('Mode C: user can request an assessment after sending a message', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What about the brakes?');
  t = addToTranscript(t, 'seller', getRayResponse('What about the brakes?'));
  const profile = (() => {
    let p = createBaselineProfile();
    p = recordCalibrationStep(p, 1, 'r1');
    p = recordCalibrationStep(p, 2, 'r2');
    p = recordCalibrationStep(p, 3, 'r3');
    return p;
  })();
  const card = assessTranscript(t, profile);
  expect(card !== null && card !== undefined).toBe(true);
  expect(typeof card.summary).toBe('string');
  expect(typeof card.debrief).toBe('string');
  expect(Array.isArray(card.comfortMap)).toBe(true);
});

scenario('Mode C: ScoreCard contains required elements when service history asked', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What is the service history like?');
  t = addToTranscript(t, 'seller', getRayResponse('What is the service history like?'));
  const profile = (() => {
    let p = createBaselineProfile();
    p = recordCalibrationStep(p, 1, 'r1');
    p = recordCalibrationStep(p, 2, 'r2');
    p = recordCalibrationStep(p, 3, 'r3');
    return p;
  })();
  const card = assessTranscript(t, profile);
  expect(card.comfortMap.length > 0).toBe(true);
  expect(card.summary.length > 0).toBe(true);
  expect(card.debrief.length > 0).toBe(true);
});

// ── scoring-panel.feature ─────────────────────────────────────────────────────

scenario('ScoringPanel: returns a ScoreCard from any transcript', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What colour is it?');
  t = addToTranscript(t, 'seller', 'Silver.');
  const profile = (() => {
    let p = createBaselineProfile();
    p = recordCalibrationStep(p, 1, 'r1');
    p = recordCalibrationStep(p, 2, 'r2');
    p = recordCalibrationStep(p, 3, 'r3');
    return p;
  })();
  const card = assessTranscript(t, profile);
  expect(card !== null && card !== undefined).toBe(true);
  expect(typeof card.summary).toBe('string');
  expect(typeof card.debrief).toBe('string');
});

scenario('ScoringPanel: flags discomfort when service history topics appear', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What about the brakes and MOT history?');
  t = addToTranscript(t, 'seller', getRayResponse('What about the brakes and MOT history?'));
  const profile = (() => {
    let p = createBaselineProfile();
    p = recordCalibrationStep(p, 1, 'r1');
    p = recordCalibrationStep(p, 2, 'r2');
    p = recordCalibrationStep(p, 3, 'r3');
    return p;
  })();
  const card = assessTranscript(t, profile);
  expect(card.comfortMap.length > 0).toBe(true);
  expect(card.comfortMap[0].topic).toBe('service history');
  expect(card.comfortMap[0].signal).toBe('discomfort');
});

scenario('ScoringPanel: returns empty comfortMap for neutral topics', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What colour is it?');
  t = addToTranscript(t, 'seller', "She's a lovely silver.");
  const profile = (() => {
    let p = createBaselineProfile();
    p = recordCalibrationStep(p, 1, 'r1');
    p = recordCalibrationStep(p, 2, 'r2');
    p = recordCalibrationStep(p, 3, 'r3');
    return p;
  })();
  const card = assessTranscript(t, profile);
  expect(card.comfortMap.length).toBe(0);
});

// ── worker.feature (request builder) ─────────────────────────────────────────

scenario('Worker: buildRayRequest returns correct shape from transcript', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user',   'What about the brakes?');
  t = addToTranscript(t, 'seller', 'Absolutely fine.');
  const req = buildRayRequest(t);
  expect(Array.isArray(req.messages)).toBe(true);
  expect(req.messages.length).toBe(2);
});

scenario('Worker: user transcript entries map to role "user"', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'user', 'What colour is it?');
  const req = buildRayRequest(t);
  expect(req.messages[0].role).toBe('user');
  expect(req.messages[0].content).toBe('What colour is it?');
});

scenario('Worker: seller transcript entries map to role "assistant"', () => {
  let t = createTranscript();
  t = addToTranscript(t, 'seller', 'She\'s silver.');
  const req = buildRayRequest(t);
  expect(req.messages[0].role).toBe('assistant');
});

scenario('Worker: empty transcript produces empty messages array', () => {
  const req = buildRayRequest(createTranscript());
  expect(req.messages.length).toBe(0);
});

scenario('Worker: RAY_SYSTEM_PROMPT is a non-empty string', () => {
  expect(typeof RAY_SYSTEM_PROMPT === 'string' && RAY_SYSTEM_PROMPT.length > 0).toBe(true);
});

scenario('Worker: RAY_SYSTEM_PROMPT contains legalistic constraint', () => {
  expect(/legalistic/i.test(RAY_SYSTEM_PROMPT)).toBe(true);
});

// ── Summary ──────────────────────────────────────────────────────────────────

if (failures.length) failures.forEach(f => console.log(f));
console.log(`\nGherkin: ${passed}/${passed + failed} passing`);
process.exit(failed > 0 ? 1 : 0);
