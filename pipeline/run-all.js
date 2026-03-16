// pipeline/run-all.js — pipeline orchestrator
// Run: node pipeline/run-all.js

'use strict';

const { spawnSync } = require('child_process');
const path          = require('path');

const ROOT = path.join(__dirname, '..');

const STEPS = [
  { label: 'Unit Tests', script: 'pipeline/unit-runner.js' },
  { label: 'Gherkin',    script: 'pipeline/gherkin-runner.js' },
];

let overallPass = true;

for (const step of STEPS) {
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`  ${step.label}`);
  console.log('─'.repeat(40));

  const proc = spawnSync('node', [path.join(ROOT, step.script)], {
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf8',
  });

  if (proc.stdout) process.stdout.write(proc.stdout);
  if (proc.stderr) process.stderr.write(proc.stderr);

  if (proc.status !== 0) {
    overallPass = false;
    break;
  }
}

console.log(`\n${'═'.repeat(40)}`);
console.log(`  Pipeline ${overallPass ? '✓ GREEN' : '✗ RED'}`);
console.log('═'.repeat(40));
process.exit(overallPass ? 0 : 1);
