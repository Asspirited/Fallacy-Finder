# Session Closedown — The Fallacy Finder / Veritas
# Run in full at every session end. No exceptions.
# Last updated: 2026-03-15

---

## SEQUENCE — follow in order

---

### 1. PIPELINE (final green before closing)

```bash
bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt
```

Report final scorecard. If RED: fix before closing. No session ends on a red pipeline.
**Status:** pipeline not yet built — skip step 1 until pipeline exists. Note in session summary.

---

### 2. WASTE LOG (mandatory — append before closing)

Read `.claude/practices/waste-log.md` — last entry number.
For every failure, bug, wrong turn, or friction point this session:
- Add a new WL entry with correct next number
- Include: Item, Symptom, Suspected cause, Session date, Time lost, Cost impact, Tags, Status

**After adding entries:** update the `## OPEN ITEMS` index block at the top.
- Add new Open items
- Remove items closed this session

If nothing went wrong: write one line confirming that. Do not skip the step.

---

### 3. BACKLOG (capture anything that surfaced)

Read `.claude/practices/backlog.md`.
For every scope idea, tech debt item, bug, or enhancement that came up:
- Add a BL entry with correct next number
- Score CD3 immediately
- Insert in CD3 order

---

### 3a. IDEAS BOARD REVIEW (capture and confirm — 60 seconds)

Read `.claude/practices/ideas.md`.

1. **Capture check**: any ideas discussed this session not yet in ideas.md? Add them.
2. **Promotion check**: did any idea ripen enough to move to backlog? If yes — assign BL-NNN.
3. **Nothing?** Write one line: "Ideas board: nothing new, nothing promoted."

---

### 3b. HYPOTHESIS REVIEW (outer loop — 60 seconds)

For any feature shipped with a hypothesis card:
- Did the falsifier become testable?
- Has the window passed?

Nothing to review? Write one line confirming that.

---

### 4. DECISIONS REVIEW (nothing left floating)

Were any design decisions made this session not yet in a file?
- Architecture decisions → `.claude/practices/architecture-review.md`
- UX decisions → `.claude/practices/ux-decisions.md`
- Domain model changes → `.claude/practices/domain-model.md`
- Agent decisions → relevant `docs/` file

If yes: write them now. Decisions not in files do not exist next session.

---

### 4b. STANDARDS REVIEW (before writing any update to process files)

Before writing any change to `.claude/` files — stop and run the lens checklist:

| Lens | Question |
|---|---|
| **Lean / Muda** | Does this rule add value or add steps? |
| **SMART** | Specific, Measurable, Achievable, Relevant, observable? |
| **Clean code** | Simplest version of the rule? |
| **Tech debt** | Eliminates a class of future waste — or adds queue? |
| **Reinertsen / Cost of Delay** | Reduces cycle time or slows delivery? |
| **DORA metrics** | Improves DF, LT, CFR, or MTTR — or introduces friction? |
| **Agile Manifesto** | Working software over process? |
| **Removal of future WL items** | Would this have prevented a past WL entry? |

Output: `[ ] <change> — <lens> — WRITE / SKIP`

If no process changes proposed: write one line confirming that.

---

### 5. GHERKIN INVENTORY (pending scenarios)

Check `specs/` for feature files with scenarios not yet implemented.
Report: pending count at session end vs session start.
If went up: explain why.

---

### 5b. NEXT SESSION FEATURES (agree before closing — write to session-startup.md)

Ask Rod: "What do you want to work on next session?"
For each agreed feature: confirm BL number, dependencies met, Gherkin gate status.

Write agreed features to `.claude/session-startup.md` under section 4 BACKLOG.
Format:
```
Agreed next session (from [date] closedown):
- BL-NNN: [title] — Gherkin ready / Gherkin needed
```

If Rod didn't specify: "No features agreed — start next session from CD3 backlog top 3."

---

### 6. SESSION-STARTUP UPDATE (if anything changed)

If any of the following changed, update `.claude/session-startup.md`:
- Backlog top 3
- Last retrospective
- Product context (new modes, new agents)
- Agent rules (new canonical rules)
- Open waste items

---

### 6b. CONCEPTUAL CAPTURE (mandatory)

Scan the full conversation for any of the following not yet in a file:
- New mode concepts or agent ideas
- Named mechanics discussed but not specced
- Design decisions made in conversation
- BL items referenced but not logged
- Any named concept coined this session

For each found: create `/notes/YYYY-MM-DD-[topic].md`. Bullet points acceptable.

If nothing found: log "Conceptual capture: nothing unfiled."

---

### 7. COMMIT AND PUSH (nothing unpushed at close)

```bash
cd /home/rodent/fallacy-finder && git status
```

If anything unstaged or uncommitted: commit it now.
No session ends with unpushed work. Ever.

```bash
git add -p
git commit -m "Session closedown — [date]"
git push
```

Report final commit hash.

---

### 8. SHARED SESSION STATE (cross-Claude sync — write before closing)

Write `.claude/shared-session-state.md` — overwrite completely each close:

```
# Shared Session State
Last updated: [DATE] by Claude [Code|.ai]
Last commit: [HASH] — [message]

## What shipped this session
- [brief list]

## Open waste items (WL numbers)
- WL-NNN: [one line] — Status: Open

## Backlog top 3 by CD3
- BL-NNN (CD3=N): [title]

## Protocol status this session
- Session startup: [followed / skipped steps N,N]
- Gherkin gate: [followed / bypassed on: feature name]
- TDD: [followed / bypassed on: feature name]
- Pipeline: [GREEN / RED — reason / N/A — not yet built]

## Carry-forward notes
- [anything the next Claude must know that isn't in a file yet]
```

Ensure `.claude/shared-session-state.md` is in the pre-flight cat list in session-startup.md step 0.

---

### 9. RETROSPECTIVE TRIGGER (check — do not skip)

Read `.claude/practices/retrospectives.md` for trigger conditions.

Ask: does this session meet any trigger?
- 3+ pipeline failures
- Same mistake made twice
- Significant time lost to process (not feature) work
- Rod flagged "this keeps happening"

If yes: run retrospective (Derby & Larsen sequence). Write to `retrospectives/session-retro-[date].md`. Commit.
If no: state which triggers were checked and why none fired.

---

## NON-NEGOTIABLE

- Pipeline must be green before closing (once it exists).
- Waste log must have an entry (even "nothing went wrong").
- Nothing unpushed at close.
- session-startup.md updated if anything changed.
- Decisions not in files do not exist next session.
