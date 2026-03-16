# Auth Ops — The Fallacy Finder / Veritas
# Last updated: 2026-03-15

---

## Cloudflare Account

| Thing | Value |
|---|---|
| Cloudflare account | leanspirited@gmail.com |
| Cloudflare account ID | `ce5ebfc99d1b37a7537a039d0b09d0b6` |
| Worker URL | `https://fallacy-finder-api.leanspirited.workers.dev` |
| Worker name (wrangler.toml) | `fallacy-finder-api` |

---

## The Law (same as cusslab)

**Never suggest `wrangler login` — it opens a browser that always shows the wrong Google account.**

Reason: wrangler has a stale cached account ID (`7721964c...`) that differs from the real account (`ce5ebfc9...`). `wrangler login` opens a browser that cannot resolve it. Never use it.

---

## Deploying / Redeploying the Worker

```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/fallacy-finder
CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler deploy
```

Token: dash.cloudflare.com → My Profile → API Tokens → Create Token → **"Edit Cloudflare Workers" template**.

## Setting the ANTHROPIC_API_KEY secret

```bash
echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY
```

Ask: "Is this a key you just generated right now?" before pushing.

---

## Canary Check

```bash
curl -s -w "\n%{http_code}" -X POST https://fallacy-finder-api.leanspirited.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"ping"}]}'
```

Expected: `200` with a `reply` field. Anything else: session blocked.

---

## Key Rotation Procedure

Same as cusslab:
1. Generate new Anthropic key (console.anthropic.com)
2. Get fresh Cloudflare API token (dash.cloudflare.com)
3. Push: `echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY`
4. Verify canary green

---

## Multi-LLM Note (DECKARD — BL-013)

When DECKARD's separate model is implemented, a second API key or model config will be needed.
This file will need a section for DECKARD's model credentials when that work is scheduled.
Do not implement until BL-013 is formally scoped and Gherkin-approved.
