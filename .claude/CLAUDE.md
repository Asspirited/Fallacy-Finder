# CLAUDE.md — The Fallacy Finder / Veritas
# Last updated: 2026-03-15

---

## Session Start (mandatory, before any code)

Read `.claude/session-startup.md` — follow its sequence in full before doing anything else.
It covers: project separation check, auth check, pipeline, recent waste, backlog, retro findings,
product context, agent/character rules, ways of working, principles, practices.
Do not skip steps. Do not reorder. Do not start work until the sequence is complete.

---

## Backlog — Auto-Capture Rule (MANDATORY)

Whenever a scope enhancement, tech debt fix, bug, or idea surfaces — add it to `.claude/practices/backlog.md` immediately. Do not wait until session end. Do not batch them up.

Schema for new items:
```
### BL-NNN — Short title
- Description: what and why
- CD3: UBV=N TC=N RR=N → CoD=N, Dur=N, **CD3=N.N**
- Status: OPEN
```

CD3 = (User Business Value + Time Criticality + Risk Reduction) / Duration.
Scores 1–10 each. Sort open items by CD3 descending after adding.
Reference: Black Swan Farming / Reinertsen approach.

---

## Session End (mandatory, before closing)

1. Review session for any insights flagged "worth a conversation" or "unactioned"
2. Review for any decisions made but not yet implemented
3. Review for any regression or unexpected behaviour observed
4. Review for any friction that cost tokens or time
5. Commit any new entries to .claude/practices/waste-log.md and backlog.md
6. Push — no session ends without waste-log and backlog committed and pushed

---

## Principles Files (read to think about problems correctly)

- .claude/principles/ddd.md — bounded contexts, ubiquitous language, domain events, aggregates
- .claude/principles/xp.md — simplicity, feedback, courage, four rules of simple design
- .claude/principles/lean.md — eliminate waste, optimise the whole, defer commitment
- .claude/principles/systems-thinking.md — feedback loops, emergence, unintended consequences
- .claude/principles/ux.md — jobs to be done, Norman's principles, Krug's law

---

## Practices Files (read to implement correctly)

- .claude/practices/auth-ops.md — Worker URL, Cloudflare account ID, key procedure, canary
- .claude/practices/bdd.md — Gherkin gate, Given-When-Then, done conditions
- .claude/practices/tdd.md — 7-step cycle, four isolation levels, state factories
- .claude/practices/solid.md — SOLID applied to codebase, clean code rules, refactoring triggers
- .claude/practices/5-whys.md — root cause analysis procedure
- .claude/practices/ci-cd.md — pipeline steps, push rule, recovery playbook
- .claude/practices/dora.md — four metrics, how to measure
- .claude/practices/retrospectives.md — triggers, format, lenses, anti-patterns
- .claude/practices/domain-model.md — domain model, bounded contexts, ubiquitous language
- .claude/practices/ux-decisions.md — design decisions log, personas, UX review checklist
- .claude/practices/architecture-review.md — seam inventory, testing pyramid, SOLID applied
- .claude/practices/hypothesis-driven.md — new feature scoping, outer feedback loop
- .claude/practices/user-stories.md — INVEST, Three C's, SPIDR splitting, epic decomposition

---

## The Integrated Delivery Cycle
Every feature. Every bug fix. Every session. No exceptions.

### Step 1 — Three Amigos (BDD)
Read: principles/ddd.md, principles/ux.md
Rod and Claude agree the behaviour in plain language.
What does the user see? What job does this serve? What domain concept does this touch?

### Step 2 — Gherkin (BDD Gate — enforced)
Read: practices/bdd.md
Write scenario in Given-When-Then. Then:
1. Output COMPLETE literal text of every new or modified scenario
2. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. STOP. Do not run pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or give feedback
5. Only proceed after explicit written approval in this session

Previous session approval does not count.

**BDD GHERKIN QUALITY GATE — run this before outputting any feature file for approval:**

1. **Scenario Outline first** — if two or more scenarios share the same step structure with different data, they MUST be a Scenario Outline + Examples table.
2. **Merge opportunity check** — do any two outlines share the same Given/When with only Examples data different? If yes, merge unless Then steps are materially different.
3. **Examples table scope** — one dimension of variation only.
4. **Scenario count discipline** — if count exceeds 12, review for redundancy before adding more.
5. **Background audit** — if 3+ scenarios share the same Given, it belongs in Background.
6. **No scenario for constants** — one tightly named Scenario, not an outline.

Self-review against this checklist before printing "WAITING FOR ROD'S APPROVAL". Never skip.

**OUTPUT SIZE RULE — non-negotiable**
Never print large blocks of text (code, feature files, agent files, config) to chat for copy-paste. Always write directly to file then commit. Any output >20 lines goes to a file.

### Step 3 — Outside-In Design (SOLID)
Read: principles/ddd.md, practices/solid.md, principles/systems-thinking.md
Design the public interface before writing any code or test.

### Step 4 — Failing Test (TDD Gate — enforced)
Read: practices/tdd.md
Write the unit test. Run it. Confirm: (1) it fails, (2) it fails for the RIGHT reason.

### Step 5 — Minimum Implementation (TDD)
Read: practices/solid.md (clean code rules)
Write least code required to pass the test. No gold plating.

### Step 6 — Refactor (TDD + SOLID)
Run tests — confirm green. Apply refactoring checklist. Run again — must still be green.

### Step 7 — Pipeline
Read: practices/ci-cd.md
Run npm run pipeline. All steps must pass. A partial green is a red.

### Step 8 — Push
GREEN = commit + push = auto-deploy. Rod verifies in browser.

### Step 9 — Retro Trigger Check
Read: practices/retrospectives.md, practices/5-whys.md, practices/dora.md

---

## Non-Negotiable Rules

### PUSH Rule
npm run pipeline after any change.
GREEN = commit + push. Never push red.

### SINGLE FILE Rule
One index.html at repo root only.
```bash
find . -name "index.html" | grep -v node_modules
```
More than one result = stop, flag, do not proceed.

### PROJECT SEPARATION Rule
Three projects. Wrong project = waste log entry.
- `fallacy-finder` / Veritas → `/home/rodent/fallacy-finder/`
- `cusslab` / Heckler and Cox → `/home/rodent/cusslab/`
- `risk-and-impact-assessor` / RIA → `/home/rodent/risk-and-impact-assessor/`

Before touching any file: confirm which project it belongs to.
Grey area → flag it, don't assume.

---

## Architecture Rules

- Single index.html — all HTML, CSS, JS in one file (Phase 1)
- Module pattern: `const ModuleName = (() => { ... })();`
- No framework, no build step, no bundler
- API calls via Cloudflare Worker only — never directly to api.anthropic.com
- No API key ever in frontend code or browser storage
- ScoringPanel is invisible to user — panel deliberation never exposed directly

## Auth Rule
**NEVER suggest `wrangler login`** — stale cached account ID, always fails.
Use Cloudflare API token via dash.cloudflare.com. Full procedure: auth-ops.md.

---

## BASH OUTPUT RULE (inherited from cusslab — WL-021)
Never produce collapsible output. Always pipe to file and cat:
  some-command > /tmp/out.txt && cat /tmp/out.txt

---

## FEATURE BRANCH RULE
Prefer trunk-based delivery. Small, frequent commits to main.
Merge feature branches as soon as work is complete and pipeline is green.

---

## Yak Shaving Rule
Current task drifted from original goal? Name it. 20-minute limit.
Not resolved in 20 minutes: revert, ask a better question.
