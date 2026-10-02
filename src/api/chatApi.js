// Chatbase API client — sends messages through Vercel serverless proxy
// Absolute so the local dev server (vite on localhost) also reaches the deployed function.
const API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://statools.mdragonsolutions.com/api/chat';

// Chatbase's chat endpoint is stateless, so the whole history goes with every
// request; conversationId only groups the exchange in the Chatbase dashboard.
// `context` (optional) describes the calculator the student is using; see CalculatorTutor.
export async function sendMessage(messages, conversationId, context, adultConfirmed = false) {
  if (adultConfirmed !== true) throw new Error("The AI tutor is available only to users who confirm they are 18 or older.");
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, conversationId, context, adultConfirmed }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Chat request failed: ${errorText}`);
  }

  const data = await res.json();
  return data.text || 'Sorry, I could not generate a response.';
}
