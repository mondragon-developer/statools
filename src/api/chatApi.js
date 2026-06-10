// Chatbase API client — sends messages through Vercel serverless proxy
const API_URL = '/statools/api/chat';

export async function sendMessage(message, conversationId) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Chat request failed: ${errorText}`);
  }

  const data = await res.json();
  return data.text || 'Sorry, I could not generate a response.';
}
