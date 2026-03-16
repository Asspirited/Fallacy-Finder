# Waste Log — The Fallacy Finder / Veritas
# Last updated: 2026-03-15

---

## OPEN ITEMS

| WL# | Item | Urgency |
|---|---|---|
| WL-001 | Wrangler deploy auth fails with 9106 on token — same symptom as cusslab auth fights | Medium |

---

## LOG

### WL-001 — Wrangler deploy 9106 auth failure (fallacy-finder)
- Item: `npx wrangler deploy` fails with `Authentication failed (status: 400) [code: 9106]` on `/memberships` call
- Symptom: Fails regardless of token creation method or export approach. Same result 4+ attempts.
- Root cause: **Identical to cusslab WL-060** — wrangler has a stale cached account ID (`7721964c...`) that differs from the real account (`ce5ebfc9...`). Fix: always pass `CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6` explicitly. Documented in cusslab auth-ops.md — should have been checked at session start.
- Session date: 2026-03-16
- Time lost: ~25 mins
- Cost impact: Medium — blocked BL-017 going live; also caused Rod frustration
- Tags: auth / tooling / cloudflare / wrangler / process-failure
- Status: Open — pending deploy with CLOUDFLARE_ACCOUNT_ID explicit
- Next action: `CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler deploy` then write auth-ops.md for fallacy-finder with this canonical procedure baked in.

---

## Format Reference

```
### WL-NNN — [short title]
- Item: [what went wrong]
- Symptom: [what was observed]
- Suspected cause: [hypothesis]
- Session date: [YYYY-MM-DD]
- Time lost: [estimate]
- Cost impact: [low/medium/high]
- Tags: [bug / process / tooling / design / auth / pipeline / etc]
- Status: Open / Closed (commit: [hash])
- Next action: [if Open]
```
