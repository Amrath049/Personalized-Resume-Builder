// Settings: page size, font scale, AI provider + API key, optional proxy URL.

import { useStore } from './store/store';
import { Card, Field, TextInput } from './editor/controls';

export function Settings() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const resetAll = useStore((s) => s.resetAll);

  return (
    <div className="settings">
      <Card title="Page & layout">
        <div className="grid-2">
          <Field label="Page size">
            <select
              className="text-input"
              value={settings.pageSize}
              onChange={(e) => setSettings({ pageSize: e.target.value as 'A4' | 'LETTER' })}
            >
              <option value="A4">A4</option>
              <option value="LETTER">US Letter</option>
            </select>
          </Field>
          <Field label={`Font scale (${settings.fontScale.toFixed(2)}×)`} hint="Nudge down to fit one page">
            <input
              type="range"
              min={0.8}
              max={1.1}
              step={0.01}
              value={settings.fontScale}
              onChange={(e) => setSettings({ fontScale: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Card>

      <Card title="AI provider (optional)">
        <p className="muted">
          Used only by the JD Assistant's "Generate" button. Get a <strong>free</strong> key, paste it
          here (stored only in your browser). With this on, your resume + JD are sent to the provider
          you pick. The keyword analyzer works without any of this.
        </p>

        <Field label="Provider">
          <select
            className="text-input"
            value={settings.aiProvider}
            onChange={(e) => setSettings({ aiProvider: e.target.value as 'gemini' | 'groq' })}
          >
            <option value="gemini">Google Gemini (works in browser)</option>
            <option value="groq">Groq (may need the proxy)</option>
          </select>
        </Field>

        {settings.aiProvider === 'gemini' ? (
          <>
            <Field label="Gemini API key" hint="Free at aistudio.google.com/apikey">
              <TextInput value={settings.geminiKey} onChange={(v) => setSettings({ geminiKey: v })} placeholder="AIza…" />
            </Field>
            <Field label="Gemini model">
              <TextInput value={settings.geminiModel} onChange={(v) => setSettings({ geminiModel: v })} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Groq API key" hint="Free at console.groq.com/keys">
              <TextInput value={settings.groqKey} onChange={(v) => setSettings({ groqKey: v })} placeholder="gsk_…" />
            </Field>
            <Field label="Groq model">
              <TextInput value={settings.groqModel} onChange={(v) => setSettings({ groqModel: v })} />
            </Field>
          </>
        )}

        <Field
          label="Proxy URL (optional)"
          hint="Only if a provider blocks browser calls. Run /server and put e.g. http://localhost:8787"
        >
          <TextInput value={settings.proxyUrl} onChange={(v) => setSettings({ proxyUrl: v })} placeholder="http://localhost:8787" />
        </Field>
      </Card>

      <Card title="Danger zone">
        <button
          className="btn danger"
          onClick={() => {
            if (window.confirm('Reset ALL data back to the seeded resume? This deletes your versions and edits.'))
              resetAll();
          }}
        >
          Reset everything to defaults
        </button>
      </Card>
    </div>
  );
}
