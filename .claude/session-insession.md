# In-Session Protocol — The Fallacy Finder / Veritas
# Trigger map and delivery discipline
# Last updated: 2026-03-15
# Sources: Evans (DDD), Martin (Clean Code, SOLID), Fowler (Refactoring),
#          Meszaros (xUnit Patterns), Smart (BDD in Action),
#          Adzic/Evans (Fifty Quick Ideas to Improve Your Tests),
#          Cohn — User Stories Applied (2004), Wake — INVEST,
#          Nielsen (10 Usability Heuristics), SUS, WCAG 2.1 AA,
#          DORA metrics, OWASP, Beck — XP Explained,
#          Poppendieck — Lean Software Development,
#          Navarro — What Every Body Is Saying (2008),
#          Ekman — Telling Lies (1985/2009),
#          Dick — Do Androids Dream of Electric Sheep? (1968),
#          Meadows — Thinking in Systems (2008)

## TRIGGER MAP

### TRIGGER: "new feature" / "new mode" / "new mechanic" / "new agent"
→ Run: FEATURE SEQUENCE

### TRIGGER: "write the tests" / "unit tests" / "make it fail"
→ Run: TDD SEQUENCE

### TRIGGER: "implement" / "wire it up" / "build it"
→ Check: Gherkin approved? Unit tests red? DDD RED done? If not — stop and say why.
→ If yes: Run: IMPLEMENTATION SEQUENCE

### TRIGGER: "deploy" / "wrangler" / "worker" / "secret put"
→ STOP. Read `.claude/practices/auth-ops.md` IN FULL before any wrangler command.
→ Always include `CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6` — never omit it.
→ Then: Run: DEPLOY SEQUENCE

### TRIGGER: "commit" / "push" / "ship it"
→ Run: COMMIT SEQUENCE

### TRIGGER: "agent file" / "write the agent" / "build [name]"
→ Check: domain-model.md read this session? If not — fetch it first.
→ Check: Gherkin approved for this agent? If not — Gherkin first.
→ Run: AGENT SEQUENCE

### TRIGGER: "run the scenario" / "let's hear them" / "test it live"
→ Check: domain-model.md read this session? If not — stop.
→ Check: pipeline green? If not — stop.
→ Proceed.

### TRIGGER: "research" / "find out about" / "who is" / "what is the science on"
→ Run: AGENT RESEARCH PROTOCOL (for scenario subject agents)
→ Or: read the relevant section in domain-model.md (for scoring agents)

### TRIGGER: "something just went wrong" / "that's broken" / "wtf" / pipeline RED
→ Run: INVESTIGATE AND RESOLVE SEQUENCE

### TRIGGER: any new persistent artefact
→ Run: DEVOPS DESIGN CHECK before writing it

### RULE: Automatic waste logging — always on
Any time a bug, broken flow, missing behaviour, or quality gap is discovered — log a WL entry immediately.

**Report timing:**
- **Immediately** if issue blocks current work or is user-visible
- **At end of each TDD/BDD/DDD cycle**
- **At each forcing function checkpoint** (3 BL items closed or 5 pipeline runs)
- **At session closedown**

### TRIGGER: any new idea surfaces — CAPTURE IMMEDIATELY
Signal: Rod says "what if…" / "could we…" / "one day…" / "I wonder if…"
→ Add to `.claude/practices/ideas.md` UNREVIEWED section
→ Write snapshot to `/mnt/c/Users/roden/Downloads/idea-[slug]-[YYYY-MM-DD].md`
→ Announce: "Added to ideas board: [name] — idea file in Downloads" — one line
→ Do NOT interrupt current work. Do NOT raise BL item yet.

### TRIGGER: RAISE NEW WORK — fires on any of these signals:
- Bug, gap, or quality issue spotted
- Pipeline fails and reveals structural gap
- Rod mentions something in passing
- Any review surfaces an improvement
→ Run: RAISE NEW WORK SEQUENCE — immediately, before returning to current work

### RULE: CONTINUE — message queue handling
Default: queue messages, work through them after current task completes.
Override signals: `INTERRUPT` / `THIS 1st` / `FIRST` / `STOP` → address that message first.
Never silently drop a queued message.

### TRIGGER: user pastes a Claude.ai conversation or design transcript
→ FIRST ACTION before anything else: extract design decisions, agent specs, named mechanics, BL items
→ Write to: `/notes/YYYY-MM-DD-[topic].md`
→ Announce: "Capturing [topic] design session to notes/[filename]"
→ Then address the user's actual request.

### RULE: Windows Downloads folder is accessible
Never ask Rod to paste file contents — always read directly:
  cat "/mnt/c/Users/roden/Downloads/<filename>" > /tmp/out.txt && cat /tmp/out.txt
Convert Windows paths (C:\Users\roden\...) to /mnt/c/Users/roden/...

### SEQUENCE: Proactive session close — never let auto-compact fire
FORCING FUNCTIONS — observable checkpoints:
Stop at whichever comes first:
- After 3 BL items closed in a single session
- After 5 or more pipeline runs in a single session
- Any time Rod says "pause" / "stop there" / "let's take stock"

WHAT IS A CLEAN SEAM:
1. After COMMIT SEQUENCE completes (pipeline green, pushed, hash confirmed)
2. After a BDD CLOSE or DDD CLEAN step
3. After Rod confirms a decision but before the next sequence starts
4. After a BL item is fully closed

Never stop mid-Gherkin, mid-TDD, mid-investigation, mid-commit.

---

## THE LOOPS — how they nest

PRODUCT FEEDBACK LOOP (outermost — weeks to months)
  Did what we built produce the intended outcome?
  Read: .claude/practices/hypothesis-driven.md

Inside that frame, three delivery loops nest:
DDD is the design loop.
BDD is the contract loop.
TDD is the inner loop.

---

## SEQUENCES

### FEATURE SEQUENCE — DDD RED + BDD first gate
0. OUTER LOOP CHECK — before anything else:
   - Does this item have a hypothesis card?
   - Which AARRR stage does this target?
   - What would falsify this hypothesis?
   - Is this the highest-value thing we can do right now? (CD3 triage)
   - What job is Rod hiring this feature to do?
1. Confirm scope — INVEST check. If fails Small: split (SPIDR).
2. DEVOPS DESIGN CHECK — for every new artefact
3. DDD RED — new concepts? Bounded context conflicts? Ubiquitous language defined?
4. PRE-IMPLEMENTATION REVIEW — run checklist (see below)
5. Draft Gherkin to specs/
6. Present for approval — STOP
7. On approval → TDD SEQUENCE

### PRE-IMPLEMENTATION REVIEW CHECKLIST
(Same as cusslab — see CLAUDE.md for full list)

Key additions for Veritas:
- [ ] Is this scoring agent or subject agent? (Different design constraints)
- [ ] Does this change expose panel deliberation to the user? (Must not)
- [ ] Does this claim detect "lying"? (Must say "stress" or "baseline deviation" only)
- [ ] Does DECKARD architecture need to be accommodated? (Flag if relevant)

### INVESTIGATE AND RESOLVE SEQUENCE — DMAIC within PDCA
Same as cusslab session-insession.md. D-M-A-I-C:
D: Define + bound. WL entry NOW.
M: Measure impact.
A: Analyze root cause (5 Whys / Fishbone / FTA / Systems Thinking).
I: Improvement hypothesis. Fix order: impact first. Minimum fix.
C: Check — pipeline green. Verify defect gone.
A: Act — WL closed. Pipeline check added. Class of defects?

### RAISE NEW WORK SEQUENCE
1. Classify: WL (went wrong) or BL (new capability)
2. Assign next number
3. Write minimum viable entry (WL: symptom + cause; BL: name + CD3)
4. Story quality check (BL only): INVEST
5. Announce: "Raised as BL-NNN: [name]" or "Raised as WL-NNN: [symptom]"
6. Return to current work

### TDD SEQUENCE — red → green → clean
1. Identify unit assertions from approved Gherkin
2. Write unit tests to pipeline/unit-runner.js — red
3. Run pipeline — confirm failing for right reason
4. Report which tests are red and why
5. On Rod's go → IMPLEMENTATION SEQUENCE
6. GAP CHECK after tests green: every export in logic.js has a behavioural test?

### IMPLEMENTATION SEQUENCE
1. Minimum implementation to green unit tests
2. Run pipeline — unit tests green
3. Write Gherkin step defs to pipeline/gherkin-runner.js — red
4. Wire to steps — Gherkin green
5. Run pipeline — full green
6. TDD CLEAN
7. → BDD CLOSE

### TDD CLEAN — REFACTOR CHECKLIST
- Function does more than one thing? Extract.
- Names inconsistent with ubiquitous language? Rename.
- Duplication? Extract.
- Magic numbers or hardcoded strings? Extract to constants.
- Module longer than needed? SRP check.
- Tests testing behaviour or implementation? If implementation — rewrite.
- LEAN: does this refactor eliminate waste or create it?

### BDD CLOSE — Gherkin retrospective
1. All scenarios passing against real implementation
2. Step defs calling real logic
3. Scenario drift check
4. Redundancy check
5. Coverage check
6. Run pipeline — full green
7. → DDD CLEAN

### DDD CLEAN — domain model harvest
1. New concepts not yet in domain-model.md? Add them.
2. New patterns general enough for other modes? Name them.
3. New functions candidates for extraction? Flag.
4. Update domain-model.md
5. SYSTEMS THINKING: second-order effects?
6. → COMMIT SEQUENCE

### COMMIT SEQUENCE
1. Pipeline green: `bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt`
2. Output >20 lines → file, not chat
3. git add → git commit → git push
4. Confirm origin/main updated — report hash
5. WL entry if anything went wrong

### DEVOPS DESIGN CHECK — for every new artefact
- Single Responsibility: one thing? Name it in one sentence.
- Well-bounded interface: what goes in, out, failure modes?
- Detectable failure: does failure exit 1? Can pipeline detect it?
- Reuse over reinvention: check .claude/scripts/, pipeline/, src/ first
- Small and deployable independently
- Persistence decision: docs/ (agent files), specs/ (Gherkin), pipeline/ (checks), .claude/scripts/ (ops), src/ (app logic)

### AGENT SEQUENCE — research → Gherkin → file
1. Run AGENT RESEARCH PROTOCOL (subject agents only)
2. Draft agent summary — hidden state, voice, LieProfile, Tell, baseline
3. Gherkin for agent behaviour — apply BDD quality gate
4. Write agent .md to docs/
5. Wire into scenario configuration
6. → COMMIT SEQUENCE

### AGENT RESEARCH PROTOCOL (for scenario subject agents — Modes A-F counterparts)
Compile before writing any agent file:
- **Hidden state** — the truth the subject knows but is not stating
- **Stated position** — what the subject presents
- **LieProfile** — which of the five styles
- **Tell** — what behaviour cannot be fully suppressed
- **Baseline** — what comfortable truthful looks like for this subject
- **Voice** — language register, vocabulary, characteristic patterns
- **Wound** (Mode B) — the genuine underlying need

Real scenarios and real negotiation cases always richer than invented ones.
Source: domain-model.md → Character Builder section.

---

## DESIGN PRINCIPLES SUMMARY

OUTER PHILOSOPHICAL FRAME:
Lean: value flows or it doesn't — eliminate what blocks it
Systems Thinking: fix the system, not the symptom

DELIVERY LOOPS:
DDD: domain model is the bounded context — Evans
SOLID: single responsibility first, always — Martin
Clean Code: names reveal intent, functions do one thing — Martin
XP: simplest thing that passes all tests — Beck/Jeffries
Test design: test behaviour not implementation — Meszaros/Smart/Adzic
DevOps: small changes, pipeline green, trunk-based — DORA

USER / PRODUCT LAYER:
Usability: recognition over recall, consistency, visibility — Nielsen
Accessibility: WCAG 2.1 AA minimum
Jobs to be done: design serves the job, not the feature — Christensen/Norman/Krug
Security: no keys client-side, ever — OWASP
**Honesty: product cannot claim to detect lying; it detects stress and baseline deviation — Navarro/Ekman research consensus**

---

## REFERENCE FILES
.claude/practices/domain-model.md  — agent/subject work + ubiquitous language
.claude/CLAUDE.md                  — ways of working, BDD quality gate
.claude/practices/waste-log.md     — append after mistakes
.claude/practices/auth-ops.md      — auth/deploy work ⚠️ READ BEFORE ANY WRANGLER COMMAND
specs/                             — all Gherkin lives here
docs/                              — all agent files live here
pipeline/unit-runner.js            — all unit tests
pipeline/logic.js                  — pure functions under test
pipeline/gherkin-runner.js         — Gherkin step definitions
.claude/practices/hypothesis-driven.md — outer loop
.claude/practices/user-stories.md     — INVEST, SPIDR splitting
