// Vercel serverless proxy for Chatbase API — keeps API key server-side
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationId } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
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
        messages: [{ role: 'user', content: message }],
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
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach chat service' });
  }
}
