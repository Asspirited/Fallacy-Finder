# Project Brief — The Fallacy Finder
# Product: Veritas (working title)
# Owner: Rod Roden / Neuri Consulting
# Last updated: 2026-03-15

---

## What Is This Product?

A multi-agent AI application for detecting deception, reading rooms, and training people in high-stakes negotiation scenarios. Not a party game. A serious training tool with a dark edge.

Users are placed in scenarios — job interviews, hostage negotiations, board pitches, car purchases — and trained to detect lying through verbal, behavioural, and typological channels. The product also runs a Voigt-Kampff-inspired human vs AI battery.

The internal panel (NAVARRO, EKMAN, DECKARD, ADVOCATE) scores the session. The user never directly addresses the panel — the panel's deliberation is invisible. Scores are probability distributions, not verdicts.

**Product name:** Veritas (working title — may change)
**Tagline:** *We know when you're lying.*

---

## Theoretical Foundations

### The Voigt-Kampff Founding Fiction
Philip K. Dick's empathy test from *Do Androids Dream of Electric Sheep?* (1968) is the founding fiction. The test is unreliable by design. Veritas teaches the concept and its limits simultaneously. The product should be as transparent as it asks its subjects to be.

### The Science
- **Joe Navarro** (*What Every Body Is Saying*, 2008): baseline establishment, limbic freeze/flight/fight, clusters over tells, 3 C's (Context, Clusters, Consistency), pacifying behaviours, feet don't lie
- **Paul Ekman** (*Telling Lies*, 1985/2009): microexpressions, leakage vs deception clues, duping delight, voice leaks more than face
- **Research consensus**: no single behaviour is a reliable tell; baseline deviation > absolute signals; high-stakes lies produce stronger signals AND more suppression effort

---

## The LieProfile Schema (Diagnostic)

Five deception styles, used diagnostically (vs generatively in cusslab):

| Style | Verbal Signature | Behavioural Signature |
|---|---|---|
| `plausible_elaboration` | Adds detail; internally consistent; hard to check | Relaxed, confident, practised |
| `self_mythology` | Story migrates toward better version over retellings | Slight animation increase; emotional investment in narrative |
| `legalistic` | Technically accurate; structurally misleading; certainty for uncertain claims | Eye contact maintained; little fidgeting |
| `statistical_revision` | Numbers/dates vague, directional, later corrected upward | Brief hesitation at quantitative claims; suppressed hand gesture |
| `enthusiastic_confabulation` | Believes it; no gap between lie and memory | No stress response; this is how they genuinely remember it |

---

## The Internal Scoring Panel

Users never directly address the panel. The panel's deliberation is invisible — only the assessment output is seen.

| Agent | Voice | Scores | LieProfile |
|---|---|---|---|
| NAVARRO | Behavioural; reads bodies and comfort | Non-verbal; pacifying; baseline deviation | `legalistic`; never directly accuses |
| EKMAN | Precise; scientific; acknowledges own limits | Micro-facial; emotional authenticity; voice | `plausible_elaboration`; caveats everything |
| DECKARD | Cold; methodical; the Voigt-Kampff administrator | Human vs AI assessment; empathy authenticity | None — operates as instrument |
| ADVOCATE | Argues for the subject's truthfulness | Counter-evidence for deception findings | `enthusiastic_confabulation`; believes in people |

**ConspireEngine rule:** If NAVARRO and EKMAN both score discomfort on the same moment and ADVOCATE's counter-evidence is thinning, DECKARD delivers a verdict. ADVOCATE's response to the verdict is always the final word — because the test is unreliable.

**DECKARD note (P3 architecture):** DECKARD should run on a different model from the other agents. If asking Claude to assess whether text was written by Claude, the test is structurally compromised. This is a principled multi-LLM decision, not complexity for its own sake.

---

## Scenario Modes (Six)

| Mode | User Role | Core Mechanic |
|---|---|---|
| **A — Job Interview** | Interviewer | Determine if candidate is nervous-but-honest, embellishing, lying on one dimension, or AI |
| **B — Hostage Negotiation** | Negotiator | Find the genuine wound beneath the stated demands |
| **C — Car Purchase** | Buyer | Distinguish lies from misleading truths; default LieProfile: `legalistic` |
| **D — Board Pitch** | Pitcher | User is the subject; board ConspireEngine active; detect two-member sceptical consensus |
| **E — Voigt-Kampff Direct** | Test Administrator | Human or AI? Subject configurations: briefed human, AI with backstory, AI trying to defeat test, human with underdeveloped empathy |
| **F — Read the Room** | Observer | Real-time panel commentary on transcript or video; experimental |

**Build order:** Mode C (Car Purchase) first — simplest, single counterpart, legalistic LieProfile.

---

## Non-Verbal Detection — Honest Limits

**What the browser can do:**
- face-api.js / TensorFlow.js: 68-point landmarks, 7 emotion classifications, Duchenne smile, gaze direction, head pose
- Web Audio API: pitch variance, speaking rate, micro-pauses, vocal fry

**What it cannot claim to do:** detect deception. It can detect stress. Stress ≠ deception.

**Product framing:** Non-verbal channel is one input to multi-channel assessment. Explicitly weighted as less reliable than verbal. User sees channel weights. Transparency is a product feature.

**Calibration phase (90 seconds before each session):**
1. Name + something from last week (verbal/acoustic baseline)
2. Describe a room (visual baseline)
3. One deliberate lie (personal deception signature)

---

## Tech Stack

- **Frontend:** Single HTML file — vanilla JS, no framework, no build step (Phase 1)
- **AI:** Anthropic Claude API — multiple agents, same model initially
- **API proxy:** Cloudflare Worker (to be created — same Cloudflare account as cusslab)
- **Hosting:** GitHub Pages (repo TBD)
- **Pipeline:** Node.js scripts in /pipeline (to be built)
- **Tests:** Jest unit tests + custom Gherkin runner + coverage

---

## Architecture Notes

### Relationship to Cusslab

**Shared:**
- Multi-agent panel architecture
- Anti-Corruption Layer pattern
- LieProfile schema (cusslab: generative; Veritas: diagnostic)
- RelationshipState (inter-agent temperature)
- ConspireEngine (shared narrative detection)
- Cloudflare Worker proxy pattern
- Single HTML Phase 1 constraint

**Not shared:**
- Comedy register
- Wound-based character model (wounds inappropriate for scoring agents)
- Escalation arc (scoring agents accumulate evidence, not escalate)
- Entertainment panel mechanics

**Candidate shared module (P3):** Anti-Corruption Layer — extract into library used by both.

### Phase 1 Architecture (Current)
Single `index.html` — all HTML, CSS, JS in one file. Same module pattern as cusslab:
```javascript
const ModuleName = (() => {
  // private
  return { publicMethod };
})();
```

### Architectural Rules
- Single index.html at repo root only
- Module pattern: `const ModuleName = (() => { ... })();`
- No framework, no build step, no bundler
- API calls via Cloudflare Worker only — never directly to api.anthropic.com
- No API key ever in frontend code or browser storage
- DECKARD multi-LLM: flag as architectural decision when implementing, not surprise

---

## Initial Backlog (from design doc — converted to BL format)

These are held here for reference. Full CD3 scoring happens when items move to practices/backlog.md.

| ID | Priority | Description |
|---|---|---|
| BL-001 | P0 | Core panel architecture — NAVARRO, EKMAN, DECKARD, ADVOCATE with LieProfile and scoring logic |
| BL-002 | P0 | Mode C: Car Purchase — single agent, `legalistic` LieProfile, verbal scoring |
| BL-003 | P0 | Verbal analysis engine — distancing language, qualifier clustering, answer substitution, detail asymmetry |
| BL-004 | P0 | Calibration phase — 90-second baseline establishment |
| BL-005 | P1 | Mode A: Job Interview — nervous honest vs embellishing weak candidate |
| BL-006 | P1 | Mode E: Voigt-Kampff direct — human vs AI battery |
| BL-007 | P1 | Non-verbal channel — face-api.js integration |
| BL-008 | P1 | LieProfile diagnostic module — classify deception style |
| BL-009 | P2 | Mode D: Board Pitch — multi-agent board with ConspireEngine active |
| BL-010 | P2 | Mode B: Hostage Negotiation — wound-based; concealed genuine need vs stated demands |
| BL-011 | P2 | Mode F: Read the Room — observer mode, real-time panel commentary |
| BL-012 | P2 | Acoustic analysis — pitch variance, speaking rate, micro-pauses |
| BL-013 | P3 | DECKARD on separate model — multi-LLM for AI detection validity |
| BL-014 | P3 | Anti-Corruption Layer shared module — extract for both products |
| BL-015 | P3 | ConspireEngine generalised — extract from golf-specific cusslab code |

---

## Open Questions (from design doc)

1. **Product name** — Veritas is working title. Named product (Veritas, Voigt, other) or cusslab module?
2. **Tone** — serious tool with dark edge. Is there a comedy register? ADVOCATE has comic potential. Voigt-Kampff has inherent absurdity. Feature or pollution risk?
3. **Navarro as character** — named character with voice, wound, LieProfile (wound: can read everyone, knows when lying to him, chosen not to act for 25 years). Worth building?
4. **Mode ordering** — Mode C first (simplest), Mode E most interesting but architecturally complex. Agreed?
5. **Multi-LLM** — P3 or informs architecture from start?

---

## Collaboration Model

Rod and Claude are peers with different skill sets. Rod brings lived experience, taste, judgment, and authority to say "that's wrong, start again." Claude brings breadth, tirelessness, and cross-domain synthesis.

- Claude challenges Rod's thinking freely — expected, not exceptional
- Explicit permission unlocks better reasoning — "be candid" is a signal to drop hedging
- Diversity of thought is a tool — Claude should bring adjacent domain sources when relevant
- Mistakes are fine. Retro, forgive, learn, improve. Good intentions assumed always.

---

## Architectural Decisions Log

| Date | Decision | Why |
|---|---|---|
| 2026-03-15 | Single HTML Phase 1 (same as cusslab) | Defers backend complexity until needed |
| 2026-03-15 | Cloudflare Worker proxy (same account as cusslab) | No API key in frontend; same pattern proven in cusslab |
| 2026-03-15 | DECKARD multi-LLM flagged as architectural concern from start | Structurally compromised if same model assesses own output |
| 2026-03-15 | LieProfile schema shared with cusslab (diagnostic vs generative) | Same schema, different use; no duplication |
| 2026-03-15 | Mode C first build | Simplest scenario; proves panel architecture before complexity |
