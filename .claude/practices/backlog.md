# The Fallacy Finder / Veritas — Persistent Backlog

Items here survive session resets. Each entry has enough context to pick up without re-research.
New items are added here automatically as they emerge.

## CD3 Scoring (Black Swan Farming / Reinertsen)

Every open item is scored when possible:
- **UBV** — User Business Value (1–10): what it delivers to user/product
- **TC** — Time Criticality (1–10): cost of waiting; does delay compound?
- **RR** — Risk Reduction (1–10): reduces technical or business risk
- **CoD** = UBV + TC + RR
- **Dur** — Duration (1–10): relative effort/size
- **CD3** = CoD / Dur (rank descending — highest = do first)
- **Epic** — (optional) group label for related items
- **Feature** — canonical label for feature-activity reporting

## Hypothesis Card (optional — for product bets)

For items that represent a product hypothesis, add after the CD3 line:
- **Actor:** who must change behaviour
- **AARRR:** Acquisition / Activation / Retention / Referral / Revenue
- **Signal:** what moves — specific and observable
- **Falsifier:** what result means we were wrong
- **Window:** sessions or days before assessment

---

## OPEN — Sorted by CD3

### BL-001 — Core panel architecture: NAVARRO, EKMAN, DECKARD, ADVOCATE
- Description: Agent definitions with LieProfile, scoring logic, ConspireEngine wiring, RelationshipState. The foundation everything else sits on.
- CD3: UBV=9 TC=9 RR=9 → CoD=27, Dur=5, **CD3=5.4**
- Status: OPEN
- Epic: Foundation

### BL-002 — Mode C: Car Purchase scenario
- Description: Single seller agent with `legalistic` LieProfile, full verbal scoring pipeline, calibration phase, ScoreCard output. Simplest mode — proves full stack.
- CD3: UBV=8 TC=8 RR=8 → CoD=24, Dur=5, **CD3=4.8**
- Status: OPEN
- Epic: Foundation

### BL-003 — Verbal analysis engine
- Description: Distancing language, qualifier clustering, answer substitution, detail asymmetry detection. Core scoring logic.
- CD3: UBV=8 TC=8 RR=7 → CoD=23, Dur=5, **CD3=4.6**
- Status: OPEN
- Epic: Foundation

### BL-004 — Calibration phase
- Description: 90-second baseline establishment. Three steps: neutral truthful, visual neutral, controlled lie. Teaches the user what baseline is.
- CD3: UBV=7 TC=7 RR=7 → CoD=21, Dur=3, **CD3=7.0**
- Status: OPEN
- Epic: Foundation

### BL-005 — Mode A: Job Interview
- Description: Dual configuration — nervous honest candidate vs embellishing weak candidate. Interviewer scores include question sequencing, baseline establishment, push-back on timeline gaps.
- CD3: UBV=7 TC=5 RR=4 → CoD=16, Dur=4, **CD3=4.0**
- Status: OPEN
- Epic: Scenario Modes

### BL-006 — Mode E: Voigt-Kampff direct test
- Description: Human vs AI battery. Subject configurations: briefed human, AI with backstory, AI trying to defeat test, human with underdeveloped empathy.
- CD3: UBV=8 TC=5 RR=4 → CoD=17, Dur=6, **CD3=2.8**
- Status: OPEN
- Epic: Scenario Modes

### BL-007 — Non-verbal channel: face-api.js integration
- Description: Emotion probability stream, comfort/discomfort overlay, Duchenne smile detection, gaze pattern, head pose. With consent flow and honest accuracy disclosure.
- CD3: UBV=7 TC=4 RR=5 → CoD=16, Dur=7, **CD3=2.3**
- Status: OPEN
- Epic: Non-Verbal

### BL-008 — LieProfile diagnostic module
- Description: Classifies which deception style is being used, not just presence of deception. Must accurately distinguish all five styles.
- CD3: UBV=8 TC=6 RR=6 → CoD=20, Dur=5, **CD3=4.0**
- Status: OPEN
- Epic: Foundation

### BL-009 — Mode D: Board Pitch
- Description: Multi-agent board with RelationshipState and ConspireEngine active. User is the subject. VALIDATION_SPIRAL detection. McGinley pattern (escalating self-reference).
- CD3: UBV=7 TC=3 RR=3 → CoD=13, Dur=6, **CD3=2.2**
- Status: OPEN
- Epic: Scenario Modes

### BL-010 — Mode B: Hostage Negotiation
- Description: Wound-based counterpart. `enthusiastic_confabulation` + `self_mythology`. User must find genuine need beneath stated demands.
- CD3: UBV=7 TC=3 RR=3 → CoD=13, Dur=6, **CD3=2.2**
- Status: OPEN
- Epic: Scenario Modes

### BL-011 — Mode F: Read the Room (observer mode)
- Description: Experimental. Panel watches transcript or video feed, provides real-time commentary. Panel's own ConspireEngine must be monitored.
- CD3: UBV=6 TC=2 RR=2 → CoD=10, Dur=7, **CD3=1.4**
- Status: OPEN
- Epic: Scenario Modes

### BL-012 — Acoustic analysis channel
- Description: Pitch variance, speaking rate, micro-pause detection via Web Audio API. Requires consent + calibration.
- CD3: UBV=6 TC=3 RR=4 → CoD=13, Dur=6, **CD3=2.2**
- Status: OPEN
- Epic: Non-Verbal

### BL-013 — DECKARD on separate model
- Description: Multi-LLM implementation. DECKARD runs on a different model than other agents. Principled reason: same model cannot reliably detect its own output.
- CD3: UBV=6 TC=3 RR=8 → CoD=17, Dur=7, **CD3=2.4**
- Status: OPEN
- Epic: Architecture

### BL-014 — Anti-Corruption Layer shared module
- Description: Extract ACL from cusslab into shared library for both products. Requires coordination with cusslab project.
- CD3: UBV=4 TC=2 RR=6 → CoD=12, Dur=5, **CD3=2.4**
- Status: OPEN
- Epic: Architecture

### BL-015 — ConspireEngine generalised
- Description: Extract ConspireEngine from golf-specific cusslab code. Wire to Veritas board mode and read-the-room.
- CD3: UBV=5 TC=2 RR=5 → CoD=12, Dur=5, **CD3=2.4**
- Status: OPEN
- Epic: Architecture

---

## CLOSED

*(None yet — project start 2026-03-15)*
