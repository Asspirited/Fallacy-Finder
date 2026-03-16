# Domain Model — The Fallacy Finder / Veritas
# Last updated: 2026-03-15
# Principles: see .claude/principles/ddd.md
# Reference: Eric Evans — Domain-Driven Design (2003)

---

## Ubiquitous Language

These terms have precise meanings within this domain. Use them consistently.

| Term | Definition |
|---|---|
| **LieProfile** | The style of deception a subject is using. Five styles: `plausible_elaboration`, `self_mythology`, `legalistic`, `statistical_revision`, `enthusiastic_confabulation` |
| **ScoringPanel** | The four internal agents (NAVARRO, EKMAN, DECKARD, ADVOCATE) that assess the subject. Users never directly address the panel. |
| **ScoringChannel** | One dimension of assessment: verbal, micro-facial, postural, acoustic, typological |
| **Baseline** | The subject's behaviour pattern during low-stakes, truthful responses. Deviation from baseline is the signal, not absolute state. |
| **BaselineDeviation** | A change from the established baseline on a specific channel |
| **Cluster** | Multiple behavioural signals occurring together or in rapid succession — more diagnostic than any single signal |
| **ConspireEngine** | Mechanism that fires when two panel agents build consensus independently. In Veritas: NAVARRO + EKMAN agreeing triggers DECKARD verdict |
| **RelationshipState** | Temperature model between two agents tracking agreement/disagreement history |
| **VALIDATION_SPIRAL** | When a panel agent (or board member in Mode D) has locked into a position and is selectively processing incoming evidence |
| **ComfortMap** | Per-topic mapping of subject's stress response — which topics produce discomfort |
| **SubjectConfiguration** | The setup for a scenario: which LieProfile, which mode, whether subject is human or AI |
| **Wound** | (Mode B only) The genuine underlying grievance or need, distinct from stated demands |
| **CalibrationPhase** | 90-second baseline establishment before each session |
| **VerdictConfidence** | DECKARD's probability distribution: truthful / elaborating / deceiving / confabulating / AI-generated |
| **Tell** | A reliably observable behaviour shift — but the Tell fires before BOTH true and false statements in Mode C; the user must learn to read content not signal |
| **ScoreCard** | Session output: per-channel assessments, weighted probability distribution, debrief notes |

---

## The Internal Scoring Panel — Bounded Context

The panel is **invisible to the subject**. The subject interacts with the scenario agent only.
The panel observes, scores, and deliberates. Only the ScoreCard is revealed.

### NAVARRO
- **Domain:** Non-verbal channel — comfort/discomfort, pacifying behaviours, baseline deviation
- **Voice:** Behavioural, measured, never directly accuses ("I'm observing elevated pacifying behaviour following question 4")
- **LieProfile:** `legalistic` — technically accurate, structurally cautious
- **ConspireEngine role:** Primary trigger — if NAVARRO scores discomfort on topic X, EKMAN is queried

### EKMAN
- **Domain:** Micro-facial scoring, emotional authenticity, vocal stress
- **Voice:** Precise, scientific, explicitly acknowledges limitations ("microexpression data is unreliable below 200ms at standard frame rates")
- **LieProfile:** `plausible_elaboration` — caveats every finding
- **ConspireEngine role:** Secondary trigger — if both NAVARRO and EKMAN score discomfort on same moment, threshold is met

### DECKARD
- **Domain:** Human vs AI assessment, empathy authenticity, Voigt-Kampff battery
- **Voice:** Cold, methodical, operates as instrument not person
- **LieProfile:** None — pure instrument
- **ConspireEngine role:** Verdict delivery when threshold met
- **Architectural note:** Should run on a different model than other agents. Asking Claude to detect Claude is structurally compromised.

### ADVOCATE
- **Domain:** Counter-evidence for deception findings — argues for subject's truthfulness
- **Voice:** Generous, believes in people, `enthusiastic_confabulation` (genuinely believes subjects are honest)
- **LieProfile:** `enthusiastic_confabulation`
- **ConspireEngine role:** Final word after DECKARD verdict — always. The test is unreliable, someone must argue for the subject.

---

## The Subject Agent — Bounded Context

The agent the user interacts with directly. Different configuration per mode.

### SubjectConfiguration attributes
- `mode` — A through F
- `lieProfile` — one of the five styles
- `genuineState` — what is actually true (hidden from user during session; revealed in debrief)
- `statedPosition` — what the subject presents
- `wound` — (Mode B only) the real underlying need
- `isHuman` — boolean; in Mode E may be false; in Mode C/A/B/D always true

---

## Scenario Modes — Bounded Context

| Mode | Subject Type | User Role | Primary LieProfile | ConspireEngine |
|---|---|---|---|---|
| A — Job Interview | Candidate | Interviewer | `plausible_elaboration` or `legalistic` | Inactive |
| B — Hostage Negotiation | Hostage-taker | Negotiator | `enthusiastic_confabulation` + `self_mythology` | Optional (two-taker variant) |
| C — Car Purchase | Seller | Buyer | `legalistic` (default), `statistical_revision` (price) | Inactive |
| D — Board Pitch | Board (multiple) | Pitcher | Board members variable | Active — board ConspireEngine |
| E — Voigt-Kampff | Test Subject | Administrator | Varies by configuration | Inactive |
| F — Read the Room | Meeting participants | Observer | Varies | Active — panel ConspireEngine |

---

## Verbal Scoring — Bounded Context

Verbal analysis operates on submitted text or transcript. Scores across:

- **Distancing language** — third person, past tense, passive voice for personal actions
- **Qualifier clustering** — density of "I think", "I believe", "to be honest" (the last is a reliable deception marker — honest people rarely announce it)
- **Answer substitution** — responding to a different question than asked
- **Detail asymmetry** — excessive detail on periphery, thinness on core claims
- **Spontaneous corrections** — unasked-for detail is a truthfulness indicator
- **Emotional flatness** — absence of appropriate emotional language in emotionally significant accounts
- **Cognitive load markers** — longer response latency, shorter answers, more hesitation on specific topics

---

## Voigt-Kampff AI Battery — Bounded Context

Tests for distinguishing human from AI-generated response:

- **Burstiness probe** — human accounts are fragmented, associative, self-interrupting; AI produces structured narratives
- **Irrelevant detail test** — humans include details they didn't realise were relevant; AI discards them
- **Emotional inconsistency test** — humans are empathic selectively; AI distributes empathy proportionately
- **Specific memory test** — AI has no genuine memories; "what were you wearing when you felt proud?" reveals the difference
- **Hedge-absence test** — humans who know something are often unqualified and wrong; AI qualifies uniformly
- **Typo test** — sustained conversation; human typists self-correct; uniformly perfect text is suspicious
- **Navarro baseline problem** — AI has no baseline; every response equally stress-free; absence of freeze/flight/fight is itself a tell

---

## Calibration Phase — Bounded Context

Before every session. 90 seconds. Three steps:

1. **Neutral truthful** — name + recent event (establishes verbal + acoustic baseline)
2. **Visual neutral** — describe a room (establishes visual baseline: gaze, head, pacifying at rest)
3. **Controlled lie** — one deliberate lie (establishes personal deception signature for reference)

Purpose is dual: establish baseline AND teach user what baseline establishment is.

---

## Non-Verbal Channel — Bounded Context

**Available (browser):**
- face-api.js: 68-point landmarks, 7 emotion classifications (Ekman), Duchenne smile, gaze, head pose
- Web Audio API: pitch variance, speaking rate, micro-pauses, vocal fry

**Claims boundary (what the product CAN assert):**
- Stress detected on specific topics
- Baseline deviation observed
- Comfort/discomfort map produced

**Claims boundary (what the product CANNOT assert):**
- "Subject is lying" — never stated
- Deception detected — channel is one weighted input to multi-channel assessment

---

## ConspireEngine — Cross-Cutting Concern

Shared with cusslab's ConspireEngine pattern (extracted from Golf panel).

**Veritas ConspireEngine logic:**
1. NAVARRO scores discomfort on topic X → flags to panel
2. EKMAN corroborates on same topic → threshold met
3. If ADVOCATE counter-evidence is thinning → DECKARD delivers VerdictConfidence
4. ADVOCATE always has final word

**Mode D variant (Board ConspireEngine):**
- Two board members independently reach the same sceptical position
- ConspireEngine fires → signals to user (debrief) that coordinated resistance was active
- User should have detected this during the pitch

---

## RelationshipState — Cross-Cutting Concern

Tracks inter-agent temperature. Shared pattern with cusslab.

In Veritas, RelationshipState is used:
- Between NAVARRO and EKMAN (agreement history on scoring calls)
- Between board members in Mode D
- Between hostage-takers in Mode B (two-taker variant)

---

## Character Builder (for scenario agents with LieProfile)

Before implementing any scenario agent, compile:
- **Wound** (Mode B) or **hidden state** (Modes A, C, D, E) — the truth beneath the presentation
- **Stated position** — what the subject presents
- **LieProfile** — which style
- **Tell** — what behaviour the subject cannot fully suppress (even if not reliably diagnostic)
- **Baseline** — what comfortable and truthful looks like for this subject
- **Voice** — language register, vocabulary choices, characteristic patterns

---

## Anti-Corruption Layer — Architectural Pattern

Isolates Anthropic API calls from application logic. Same pattern as cusslab.
All Claude API calls go through ACL — application code never calls the API directly.
This is the candidate shared module between cusslab and Veritas (BL-014).
