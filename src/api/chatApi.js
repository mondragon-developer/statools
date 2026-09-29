// Chatbase API client — sends messages through Vercel serverless proxy
// Absolute URL because the GitHub Pages build has no /api route of its own.
const API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://statools.vercel.app/api/chat';

// Chatbase's chat endpoint is stateless, so the whole history goes with every
// request; conversationId only groups the exchange in the Chatbase dashboard.
export async function sendMessage(messages, conversationId) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, conversationId }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Chat request failed: ${errorText}`);
  }

  const data = await res.json();
  return data.text || 'Sorry, I could not generate a response.';
}
