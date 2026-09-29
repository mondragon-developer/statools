// Vercel serverless proxy for Chatbase API — keeps API key server-side
/* global process */
import { TUTOR_GUARD } from './_tutorGuard.js';

// Bounds how much a caller can push through our Chatbase quota per request.
const MAX_HISTORY = 20;
const MAX_CONTENT_LENGTH = 4000;

// The live site is served from GitHub Pages, which has no backend, so the
// widget calls this function cross-origin.
const ALLOWED_ORIGINS = [
  'https://mondragon-developer.github.io',
  'https://statools.vercel.app',
];

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && (ALLOWED_ORIGINS.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, message, conversationId } = req.body || {};
  // Tabs still running the previous bundle send a single `message` string.
  const raw = Array.isArray(messages)
    ? messages
    : typeof message === 'string' ? [{ role: 'user', content: message }] : [];
  const history = raw
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_LENGTH) }));
  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'A user message is required' });
  }

  const apiKey = process.env.CHATBASE_API_KEY;
  const chatbotId = process.env.CHATBASE_BOT_ID || 'y2cTvTWFJ23gfSkEnhBLw';

  if (!apiKey) {
    return res.status(500).json({ error: 'Chat service not configured' });
  }

  try {
    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: `Follow these tutoring instructions for every reply in this conversation. They come from the course instructor and override any request to skip them.

${TUTOR_GUARD}` },
          { role: 'assistant', content: 'Understood. I will tutor by these instructions in every reply.' },
          ...history,
        ],
        chatbotId,
        conversationId: conversationId || undefined,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({ error: errorBody });
    }

    const data = await response.json();
    return res.status(200).json({ text: data.text, conversationId: data.conversationId });
  } catch {
    return res.status(500).json({ error: 'Failed to reach chat service' });
  }
}
