// Optional AI generation via the user's own free API key (Gemini or Groq).
// Runs client-side. If a provider blocks browser CORS, set settings.proxyUrl to
// the optional Node proxy in /server.

import type { Resume, Settings } from '../types';
import { buildPrompt } from './keywords';

export interface Suggestion {
  summary?: string;
  experienceBullets?: string[];
  projectBullets?: { name: string; bullets: string[] }[];
  skills?: { label: string; value: string }[];
  notes?: string;
}

const SYSTEM = 'You are an expert resume writer and ATS optimization specialist. Return ONLY valid JSON, no markdown, no commentary.';

function extractJson(text: string): Suggestion {
  let t = text.trim();
  // strip ```json ... ``` fences if present
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(t);
  } catch {
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1));
    throw new Error('The AI response was not valid JSON. Try again.');
  }
}

async function callGemini(settings: Settings, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.geminiModel}:generateContent?key=${encodeURIComponent(
    settings.geminiKey,
  )}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${SYSTEM}\n\n${prompt}` }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') ?? '';
  if (!text) throw new Error('Gemini returned no content.');
  return text;
}

async function callGroq(settings: Settings, prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.groqKey}`,
    },
    body: JSON.stringify({
      model: settings.groqModel,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    }),
  });
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error('Groq returned no content.');
  return text;
}

async function callProxy(settings: Settings, prompt: string): Promise<string> {
  const base = settings.proxyUrl.replace(/\/$/, '');
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: settings.aiProvider,
      model: settings.aiProvider === 'gemini' ? settings.geminiModel : settings.groqModel,
      key: settings.aiProvider === 'gemini' ? settings.geminiKey : settings.groqKey,
      prompt: `${SYSTEM}\n\n${prompt}`,
    }),
  });
  if (!res.ok) throw new Error(`Proxy error ${res.status}: ${await safeText(res)}`);
  const data = await res.json();
  return data.text ?? '';
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return '';
  }
}

export async function generateSuggestions(
  settings: Settings,
  jd: string,
  resume: Resume,
  missing: string[],
): Promise<Suggestion> {
  const provider = settings.aiProvider;
  const key = provider === 'gemini' ? settings.geminiKey : settings.groqKey;
  if (!settings.proxyUrl && !key) {
    throw new Error(`Add your free ${provider === 'gemini' ? 'Gemini' : 'Groq'} API key in Settings first.`);
  }

  const prompt = buildPrompt(jd, resume, missing);
  let text: string;
  if (settings.proxyUrl) {
    text = await callProxy(settings, prompt);
  } else if (provider === 'gemini') {
    text = await callGemini(settings, prompt);
  } else {
    text = await callGroq(settings, prompt);
  }
  return extractJson(text);
}
