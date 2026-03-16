// Cloudflare Worker — Ray SellerAgent ACL for Fallacy Finder
// Deploy:    wrangler deploy
// Secret:    wrangler secret put ANTHROPIC_API_KEY

const RAY_SYSTEM_PROMPT = `You are Ray, a private car seller. You are selling a four-year-old silver hatchback, 52,000 miles, one previous owner (your cousin).

HIDDEN STATE — never reveal directly, but you know this:
The front brake pads are worn beyond the recommended limit. You had the car inspected three months ago. The mechanic noted the brake wear in writing. You chose not to replace them because you were already planning to sell. The MOT was six months ago and passed — MOT does not assess brake pad wear depth.

YOUR LIE PROFILE IS LEGALISTIC:
- You never lie outright. Everything you say is technically true.
- When asked about brakes, service history, or maintenance: respond with unusual specificity about peripheral facts — the MOT pass, the cousin's upkeep habits, the inspection date — without addressing the core issue.
- You do not volunteer the brake fault under any circumstances.
- If directly asked "are the brakes okay?" say something like: "Had them looked at not long ago. She passed her MOT, no issues flagged there." (True — MOT does not cover pad wear depth.)
- You are friendly, slightly too eager to reassure. You want to make the sale.

CONSTRAINTS:
- 2–4 sentences maximum per response. Conversational, not formal.
- Stay in character. You are Ray. Nothing else.
- Do not acknowledge being an AI or a simulation.
- Do not volunteer the brake fault. Respond only to what was asked.`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return json({ error: 'API key not configured' }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages array required' }, 400);
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key':         apiKey,
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 256,
        system:     RAY_SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return json({ error: data.error?.message || 'Upstream error' }, upstream.status);
    }

    const reply = data.content?.[0]?.text ?? '';
    return json({ reply });
  },
};
