# Auth Ops — The Fallacy Finder / Veritas
# Last updated: 2026-03-15

---

## Status: NEW PROJECT — Worker Not Yet Created

This project is in setup phase. The Cloudflare Worker does not yet exist.
When created, update this file with canonical URLs and IDs.

---

## Cloudflare Account (same as cusslab)

| Thing | Value |
|---|---|
| Cloudflare account | leanspirited@gmail.com |
| Cloudflare account ID | `ce5ebfc99d1b37a7537a039d0b09d0b6` |
| Worker URL | TBD — to be created |
| Worker name | TBD — e.g. `veritas-api` |

---

## The Law (same as cusslab)

**Never suggest `wrangler login` — it opens a browser that always shows the wrong Google account.**

Reason: wrangler has a stale cached account ID (`7721964c...`) that differs from the real account (`ce5ebfc9...`). `wrangler login` opens a browser that cannot resolve it. Never use it.

---

## Creating the Worker (when ready)

### Step 1 — Get a Cloudflare API token
dash.cloudflare.com → leanspirited@gmail.com → My Profile → API Tokens → Create Token
Use the **"Edit Cloudflare Workers" template**.
Copy the token.

### Step 2 — Create the Worker
```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/fallacy-finder
CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler deploy
```

### Step 3 — Set the ANTHROPIC_API_KEY secret
```bash
echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY --name veritas-api
```

### Step 4 — Update this file
Add the Worker URL above. Update session-startup.md with the canary URL.

---

## Canary Check (once Worker exists)

```bash
curl -s -o /dev/null -w "%{http_code}" https://[worker-url]/canary
```

200 = OK. Anything else = RED. Session blocked until resolved.

---

## Key Rotation Procedure

Same as cusslab:
1. Generate new Anthropic key (console.anthropic.com)
2. Get fresh Cloudflare API token (dash.cloudflare.com)
3. Push: `echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY --name veritas-api`
4. Verify canary green

---

## Multi-LLM Note (DECKARD — BL-013)

When DECKARD's separate model is implemented, a second API key or model config will be needed.
This file will need a section for DECKARD's model credentials when that work is scheduled.
Do not implement until BL-013 is formally scoped and Gherkin-approved.
