// OPTIONAL proxy for the AI feature.
//
// You only need this if your browser blocks direct calls to the AI provider
// (CORS). It forwards a prompt to Gemini or Groq and returns the text.
//
// Run:
//   cd server && npm install && npm start
// Then in the app's Settings, set "Proxy URL" to http://localhost:8787
//
// You can pass the API key from the app (it's sent in the request body), or set
// GEMINI_API_KEY / GROQ_API_KEY here as environment variables and leave the key
// blank in the app.

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 8787;

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/generate', async (req, res) => {
  try {
    const { provider, model, prompt } = req.body || {};
    const key =
      req.body?.key ||
      (provider === 'gemini' ? process.env.GEMINI_API_KEY : process.env.GROQ_API_KEY);

    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    if (!key) return res.status(400).json({ error: 'Missing API key' });

    let text = '';
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        key,
      )}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
        }),
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
    } else {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.4,
        }),
      });
      if (!r.ok) return res.status(r.status).json({ error: await r.text() });
      const data = await r.json();
      text = data?.choices?.[0]?.message?.content ?? '';
    }

    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => console.log(`ResumeTailor AI proxy listening on http://localhost:${PORT}`));
