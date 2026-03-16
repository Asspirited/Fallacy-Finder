# Architecture Review — The Fallacy Finder / Veritas
# Last updated: 2026-03-15
# Sources: Evans (DDD), Martin (SOLID), Fowler (Refactoring), Newman (Microservices), Feathers (WELC)

---

## Current Architecture Phase: 1 — Single File

Phase 1 constraint: single `index.html` — all HTML, CSS, JS.
Same rationale as cusslab: defer backend complexity until needed.
This is a deliberate, time-bounded constraint — not a mistake.

---

## Seam Inventory

Seams are the boundaries between modules. Document each interface as it is designed.

| Seam | Interface | Status |
|---|---|---|
| Anti-Corruption Layer | All Anthropic API calls routed through ACL module | Not built |
| ScoringPanel | Panel agents isolated from UI; panel receives transcript, returns ScoreCard | Not built |
| VerbalAnalysisEngine | Pure function: text → VerbalScore | Not built |
| LieProfileDiagnostic | Pure function: VerbalScore → LieProfileAssessment | Not built |
| CalibrationPhase | Module manages baseline capture; returns BaselineProfile | Not built |
| SubjectAgent | Per-mode agent wrapper; receives user input, returns subject response | Not built |
| ConspireEngine | Pure function: ScoringPanelHistory → ConspiracySignal | Not built |
| RelationshipState | State object per agent pair; updated by ConspireEngine | Not built |
| ScoreCard | Aggregates all channel scores into output | Not built |

---

## Testing Pyramid (Target)

```
                [E2E]
             [Integration]
          [Unit — logic.js]
```

- Unit tests: all pure functions in pipeline/logic.js
- Integration: scoring pipeline (input → verbal analysis → LieProfile → ScoreCard)
- E2E / Gherkin: user-facing scenarios (calibration → session → debrief)

---

## Extraction Order (Phase 1 → Phase 2)

If Phase 1 outgrows single-file constraint, extract in this order:
1. Anti-Corruption Layer → shared library (cusslab + Veritas, BL-014)
2. VerbalAnalysisEngine → isolated module (most logic-heavy, benefits most from isolation)
3. ScoringPanel → serverless function (natural API boundary)
4. SubjectAgent configs → data files (separate from behaviour logic)

---

## SOLID Applied to This Codebase

### Single Responsibility
- VerbalAnalysisEngine: scores verbal signals only. Does not classify LieProfile.
- LieProfileDiagnostic: classifies style only. Does not score verbal signals.
- ScoringPanel: orchestrates agents, does not implement scoring directly.
- CalibrationPhase: captures baseline only. Does not score deviations.

### Open/Closed
- New LieProfile styles: add to enum and training data without modifying scoring logic
- New scenario modes: add new SubjectAgent config without modifying panel architecture
- New scoring channels: implement channel interface, wire to ScoreCard without modifying other channels

### Liskov
- All scoring agents implement same interface: `score(transcript, baseline) → ChannelScore`
- SubjectAgent configurations are interchangeable (same interface, different behaviour)

### Interface Segregation
- ScoringPanel does not expose internal agent deliberation to UI — only ScoreCard
- ConspireEngine has a minimal interface: takes history array, returns signal boolean + evidence

### Dependency Inversion
- UI depends on ScoreCard interface, not on specific scoring agent implementations
- ScoringPanel depends on agent interface, not on NAVARRO/EKMAN/DECKARD/ADVOCATE directly

---

## Key Architectural Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-03-15 | Single HTML Phase 1 | Defers backend complexity; same proven pattern as cusslab |
| 2026-03-15 | DECKARD on separate model (BL-013, deferred to P3) | Same model cannot reliably detect its own output; principled not cosmetic |
| 2026-03-15 | LieProfile schema shared with cusslab (diagnostic use) | Single source of truth; cusslab uses generatively, Veritas uses diagnostically |
| 2026-03-15 | ConspireEngine to be extracted from cusslab (BL-015) | Don't copy, extract. Wait until ConspireEngine is stable in cusslab. |
| 2026-03-15 | Panel invisible to user (scoring only) | Product framing: users see scenario + ScoreCard, not panel deliberation |

---

## Known Technical Risks

| Risk | Severity | Mitigation |
|---|---|---|
| face-api.js bundle size | Medium | Lazy-load; only initialise if user opts into webcam mode |
| Web Audio API browser support | Low | Graceful degradation to text-only mode |
| Multi-LLM coordination (DECKARD) | Medium | Defer to P3; architecture must accommodate it without surprise |
| Single-file size at scale | Medium | Monitor; Phase 2 trigger if file exceeds comfortable editing in context |
