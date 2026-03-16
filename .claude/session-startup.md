# Session Startup — The Fallacy Finder / Veritas
# Read this first. Everything else is referenced from here.
# Last updated: 2026-03-15

---

## SEQUENCE — follow in order, do not skip or reorder

---

### 0. PRE-FLIGHT — prime Downloads for Claude.ai (run first, no exceptions)

```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/fallacy-finder && cat .claude/session-startup.md .claude/shared-session-state.md .claude/practices/domain-model.md .claude/practices/backlog.md .claude/practices/ideas.md .claude/practices/waste-log.md > /mnt/c/Users/roden/Downloads/session-ref.md && echo "session-ref.md ready"
```

Creates `Downloads/session-ref.md` — one file Claude.ai uploads to get full context.
Update the cat list above if new reference files are added.

---

### 0b. PROJECT SEPARATION CHECK (run before anything else)

⚠️ **THREE PROJECTS EXIST. Wrong project = waste log entry.**

| Signal | Project | Local Path |
|---|---|---|
| Deception, detection, negotiation, LieProfile, Veritas, VK-test | **Fallacy Finder** `/home/rodent/fallacy-finder/` |
| Characters, panels, comedy, banter, Heckler, cusslab | **Cusslab** `/home/rodent/cusslab/` |
| Risks, issues, RAID, quality tools, project context | **RIA** `/home/rodent/risk-and-impact-assessor/` |
| Grey area | Flag it — do not assume |

Confirm you are in `/home/rodent/fallacy-finder/` before touching any file.

---

### 1. AUTH CHECK (before pipeline, before anything)

Read `.claude/practices/auth-ops.md` in full.

**Status as of 2026-03-15:** Worker not yet created. Auth check = N/A until Worker exists.
When Worker is live: check canary before any work. Canary RED = session blocked.
Never suggest `wrangler login`. See auth-ops.md for full procedure.

---

### 1b. LIVE BUG CHECK (before any feature work — ask Rod)

Ask Rod: **"Any live bugs since last session? Anything broken or wrong in the product right now?"**

If yes: INVESTIGATE AND RESOLVE SEQUENCE before any planned feature work. Log WL entry immediately.
If no: proceed.

---

### 2. PIPELINE (confirm green before any work)

**Status as of 2026-03-15:** Pipeline not yet built. First session task is pipeline setup.

Once pipeline exists:
```bash
bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt
```

Scorecard:
```
Tests:      N/N passing
Coverage:   statements N% | branches N%
Gherkin:    N/N scenarios passing
Canary:     OK / RED
```

If any check fails: root cause before proceeding.

---

### 2b. NOTES DIRECTORY SCAN (mandatory)

```bash
ls /home/rodent/fallacy-finder/notes/
```

For each file: read it, confirm whether promoted to spec or BL item. If yes, delete or archive. If no, treat as active context.

Log: "Notes pending: N"

---

### 3. SHARED STATE + RECENT WASTE (cross-Claude sync — read both)

**First:** Read `.claude/shared-session-state.md` — written by whichever Claude closed last.
Report: what shipped, open WL items, protocol status, carry-forward notes.
If file doesn't exist: note it and continue.

**Then:** Read `.claude/practices/waste-log.md` — read the `## OPEN ITEMS` block at the top.
Report all items listed there.

---

### 4. BACKLOG + OUTER LOOP CHECK (top 3 by CD3 — agree focus before any code)

Read `.claude/practices/backlog.md` — report top 3 open items by CD3.

Current top 3 as of 2026-03-15 (project start):
- BL-004: Calibration phase (CD3=7.0) — Three Amigos needed
- BL-001: Core panel architecture (CD3=5.4) — Three Amigos needed
- BL-002: Mode C Car Purchase (CD3=4.8) — Three Amigos needed

For each open product-bet item, ask:
- Does it have a hypothesis card?
- Which AARRR stage does it target?
- Is there a falsifier?

Agree with Rod which item is being worked this session BEFORE opening any code file.

---

### 4b. IDEAS BOARD REVIEW (promote or park — 2 minutes max)

Read `.claude/practices/ideas.md` — UNREVIEWED section only.

For each idea: has it ripened? Has a "so that" clause? Informal Three Amigos done? Session-sized?
If yes to all → promote to backlog.
If no → leave UNREVIEWED.
If dead → archive.

Report: "Ideas board: N unreviewed, N promoted, N archived."

---

### 4c. COMBINED OPEN ITEMS — BL + WL, sorted by CD3

Read open BL items from `.claude/practices/backlog.md` and open WL items from `.claude/practices/waste-log.md`.

Produce one combined table:
- **BL items**: `CD3 | BL-NNN — title | note`
- **WL items**: `WL-NNN — title | urgency`

Flag blockers that have been resolved.

---

### 5. LAST RETROSPECTIVE (findings carry forward until next retro)

No retro run yet — project start 2026-03-15.
Check `.claude/retrospectives/` at session start from session 2 onwards.

---

### 6. PRODUCT CONTEXT (what we're building)

Read `.claude/project-brief.md` for full context. Summary:

**The Fallacy Finder / Veritas** — multi-agent AI deception detection and negotiation training tool.
Users placed in scenarios (car purchase, job interview, board pitch, hostage negotiation, Voigt-Kampff).
Internal scoring panel (NAVARRO, EKMAN, DECKARD, ADVOCATE) assesses — invisible to subject.
Outputs: probability distributions, not verdicts. Debrief > score.

Theoretical foundations: Navarro (*What Every Body Is Saying*), Ekman (*Telling Lies*), Dick (*Do Androids Dream...*).
LieProfile schema: `plausible_elaboration`, `self_mythology`, `legalistic`, `statistical_revision`, `enthusiastic_confabulation`.

**Build order:** Mode C (Car Purchase) first — simplest, proves full stack.

---

### 7. AGENT RULES (read before any agent work)

Never implement an agent without reading domain-model.md first.
- Scoring agents → `.claude/practices/domain-model.md`
- Subject agents (scenario counterparts) → `docs/` (when created)

Key rules:
- DECKARD should eventually run on a different model (BL-013 — deferred, but architecture must accommodate it)
- Panel is INVISIBLE to user — deliberation never exposed directly
- ADVOCATE always has final word on DECKARD verdict
- No scoring agent has a wound (wounds are Subject Agent territory only)
- LieProfile schema is DIAGNOSTIC here, not generative (vs cusslab)

---

### 8. WAYS OF WORKING (delivery cycle — non-negotiable)

Full detail in `.claude/CLAUDE.md`. The integrated cycle for every change:

1. **Three Amigos** — agree behaviour in plain language before any code
2. **Gherkin gate** — write scenario, output full text, print WAITING FOR ROD'S APPROVAL, STOP
3. **Outside-in design** — SOLID interface design before test
4. **Failing test** — write test, confirm it fails for the right reason, STOP
5. **Minimum implementation** — least code to pass the test
6. **Pipeline** — must pass before commit
7. **Commit + push** — small, frequent; never end session without pushing

BDD gate: previous session approval does not count. Gherkin must be approved in this session.

---

### 9. PRINCIPLES (how to think about problems)

| File | When to read |
|---|---|
| `.claude/principles/ddd.md` | Before domain model changes, new concepts |
| `.claude/principles/xp.md` | Before any design decision — simplicity, four rules |
| `.claude/principles/lean.md` | When deciding what to build, scope questions, waste |
| `.claude/principles/systems-thinking.md` | Before refactoring, when something has side effects |
| `.claude/principles/ux.md` | Before UI changes, new interactions, jobs-to-be-done |
| `.claude/practices/hypothesis-driven.md` | New feature scoping — outer product feedback loop |

---

### 10. PRACTICES (how to do the work)

| File | When to read |
|---|---|
| `.claude/practices/auth-ops.md` | Any Cloudflare / Worker / API key operation |
| `.claude/practices/bdd.md` | Step 2 (Gherkin gate) |
| `.claude/practices/tdd.md` | Step 4 (failing test) |
| `.claude/practices/solid.md` | Step 3 (outside-in design), refactoring |
| `.claude/practices/5-whys.md` | Every bug — root cause before fix |
| `.claude/practices/ci-cd.md` | Pipeline failures, push/deploy operations |
| `.claude/practices/dora.md` | Metrics reporting |
| `.claude/practices/architecture-review.md` | Extraction decisions, seam design |
| `.claude/practices/domain-model.md` | Domain language, bounded contexts, new aggregates |
| `.claude/practices/retrospectives.md` | Session end, retro triggers |
| `.claude/practices/ux-decisions.md` | UI changes, new design decisions |

---

### 11. PROJECT SEPARATION (know which repo before touching code)

Three projects. Wrong project = waste log entry.

| Signal | Project | Path |
|---|---|---|
| Deception, detection, negotiation, LieProfile, scoring, Veritas, Voigt-Kampff | **Fallacy Finder** | `/home/rodent/fallacy-finder/` |
| Characters, panels, comedy, banter, Heckler and Cox | **Cusslab** | `/home/rodent/cusslab/` |
| Risks, issues, RAID, quality tools, project context | **RIA** | `/home/rodent/risk-and-impact-assessor/` |

Grey area → flag it, don't assume.

---

## NON-NEGOTIABLE RULES (violation = waste log entry)

- Canary RED → fix before any other work (once Worker exists). No exceptions.
- Gherkin before code. Every time. Previous session approval does not count.
- Failing test before implementation. Every time.
- Pipeline green before commit.
- Commit + push after every change. No session ends with unpushed work.
- Waste log entry for every bug and every failure. At session end at minimum.
- Never suggest `wrangler login`.
- Check which project you are in before touching any file.
