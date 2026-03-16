# UX Decisions — The Fallacy Finder / Veritas
# Last updated: 2026-03-15
# Sources: Nielsen 10 Heuristics, SUS, WCAG 2.1 AA, Norman — Design of Everyday Things, Krug — Don't Make Me Think

---

## Design Decisions Log

| Date | Decision | Rationale | Heuristic |
|---|---|---|---|
| 2026-03-15 | Transparency as product feature — channel weights visible, accuracy limits stated | The product teaches detection; hiding its own methodology is structurally hypocritical | Nielsen 1: Visibility of system status |
| 2026-03-15 | No pass/fail verdict — probability distributions only | Research consensus: no reliable binary deception detection exists; the distribution IS the finding | Honesty in product claims |
| 2026-03-15 | Calibration phase 90 seconds before every session | Baseline establishment is both a technical requirement and a learning experience | Norman: learning through doing |
| 2026-03-15 | Text-only mode (no webcam required) | Consent and accessibility; webcam analysis is augmentation, not core | WCAG 2.1 AA, Nielsen 5: Error prevention |
| 2026-03-15 | Consent flow states accuracy limitations BEFORE acceptance | Not a terms checkbox; the accuracy caveat is part of what user is consenting to | Informed consent, Nielsen 10: Help and documentation |
| 2026-03-15 | ADVOCATE always has final word on DECKARD verdict | The test is unreliable; product architecture should reflect this structurally | Honest product design |

---

## Personas

### Primary User: The Practitioner
- In a role requiring trust assessment: hiring manager, negotiator, salesperson, manager
- Has some intuition about reading people, wants to sharpen it
- Skeptical of gimmicks; will engage seriously if the product is serious
- Job: "Help me get better at knowing when I'm being misled"

### Secondary User: The Curious Learner
- Interested in the psychology and science
- May not have an immediate professional use case
- Job: "Teach me something real about how lying works"

### Anti-Persona: The Would-Be Manipulator
- Wants to use the product to become a better liar, not a better detector
- Product should not optimise for this. The science says detection is hard; the product teaches detection, not evasion.

---

## UX Principles for This Product

1. **Transparency is credibility** — every claim about what the system detects should be accompanied by its accuracy limitation
2. **The test is the teacher** — the scenario is not just a test; it is a learning experience structured to build the user's mental model
3. **No false confidence** — ScoreCard output should make uncertainty explicit; a 60% probability is stated as 60%, not as "likely deceiving"
4. **Debriefs over verdicts** — the most valuable output is the debrief (what the user missed, why), not the score
5. **Recognition over recall** (Nielsen 6) — during the scenario, the interface should support the user's attention on the interaction, not on remembering interface controls

---

## Tone — Serious Play with a Comedy Undercurrent

Decided 2026-03-16. Rod confirmed.

Primarily a serious training tool. Not comedy with a serious edge — serious with a comedy undercurrent.

- **ADVOCATE** has genuine comic potential: believes in people with an almost delusional generosity; humour comes from the gap between ADVOCATE's charitable interpretation and the accumulating evidence
- **Mode E (Voigt-Kampff)** has inherent absurdist quality — administering a test you know is unreliable, to a subject who may or may not be conscious; comedy is structural, not performed
- **Navarro debrief** can be dry and precise in a way that lands as dark comedy
- Comedy should never undermine the user's sense that the stakes are real

**Rule:** comedy emerges from situation and character, not from tone. No winking at the user. No self-aware moments. Situational, not performed.

---

## Open UX Questions

- What does the ScoreCard look like? How are probability distributions presented visually without overwhelming?
- How does the Calibration Phase feel? What's the pacing?
- Is the panel visible during the scenario (e.g. a side panel showing NAVARRO: "elevated pacifying") or only in the debrief?
- Mode D (Board Pitch) — does the user see the board members as personas or as abstract positions?
