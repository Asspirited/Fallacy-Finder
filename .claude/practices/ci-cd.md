# CI/CD — The Fallacy Finder / Veritas
# Last updated: 2026-03-15
# Reference: DORA metrics, Humble/Farley — Continuous Delivery

---

## Status: PIPELINE NOT YET BUILT

This project is in setup phase. The pipeline structure below documents the TARGET state.
Build the pipeline as the first technical act of the project.

---

## Pipeline Design (Target)

Same pattern as cusslab:

```
npm run pipeline
```

Five steps — all must pass. Zero tolerance.

| Step | Check | Purpose |
|---|---|---|
| 0 UI Audit | pipeline/ui-audit.js | Structural HTML/JS checks (single file, module pattern, IIFE returns) |
| 1 Browser Sim | pipeline/browser-sim.js | Behaviour checks (calibration phase loads, scoring outputs) |
| 2 Unit Tests | pipeline/unit-runner.js | Jest unit tests for scoring logic, LieProfile, verbal analysis |
| 3 Gherkin/BDD | pipeline/gherkin-runner.js | Scenario tests |
| 4 Coverage | pipeline/coverage.js | Stmt ≥70%, Branch ≥70% |

Coverage targets are HIGHER than cusslab (40%/30%) — this project has cleaner architecture from the start.

---

## Push Rule

GREEN = commit + push = auto-deploy (GitHub Pages).
Never push red.
No manual deployment steps.

---

## Fast Check (during development)
```bash
npm run check   # ui-audit + browser-sim only, <5 seconds
```

---

## NVM Prefix (all Claude Code bash commands)
```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/fallacy-finder &&
```

---

## Canary
Once the Worker exists, the canary check is:
```bash
curl -s -o /dev/null -w "%{http_code}" https://[worker-url]/canary
```
200 = OK. Anything else = session blocked until fixed.

---

## Recovery Playbook

**Pipeline RED:** Stop. Root cause. Do not commit. Do not push. Fix the failure.
**Canary RED:** Stop. Fix Worker before any other work. See auth-ops.md.
**Test regression:** 5 Whys before fix. See practices/5-whys.md.
**False green discovered:** Waste log entry immediately. WL item stays open until pipeline check added.

---

## SINGLE FILE Rule
```bash
find . -name "index.html" | grep -v node_modules
```
More than one result = stop, flag, do not proceed.

---

## REVERT Rule
Before reverting: check if pipeline/ changed in the commit.
pipeline/ and index.html must stay in sync.

---

## Commit Discipline
- Small commits — one behaviour per commit
- Pipeline green before every commit
- Every session ends pushed
- Message format: `[BL-NNN] short description of behaviour added`
