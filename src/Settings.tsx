// Settings: template picker, section customization, page layout, AI provider.

import { useStore } from './store/store';
import { Card, Field, TextInput } from './editor/controls';
import { TEMPLATES } from './data/templates';
import type { SectionId } from './types';

const SECTION_IDS: SectionId[] = ['summary', 'experience', 'projects', 'skills', 'education', 'courses'];

export function Settings() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const applyTemplate = useStore((s) => s.applyTemplate);
  const setSectionConfig = useStore((s) => s.setSectionConfig);
  const resetAll = useStore((s) => s.resetAll);

  return (
    <div className="settings">
      {/* ---- Template picker ---- */}
      <Card title="Resume template">
        <p className="muted">Choose the preset that fits your field. You can fine-tune individual sections below.</p>
        <div className="template-grid">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`template-card${settings.templateId === t.id ? ' template-card--active' : ''}`}
              onClick={() => applyTemplate(t.id)}
            >
              <strong>{t.name}</strong>
              <span>{t.description}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* ---- Section customization ---- */}
      <Card title="Sections">
        <p className="muted">
          Toggle sections on/off and rename headings to fit your profession. For the portfolio/projects
          section, the second field sets the subtitle label (e.g. "Tech Stack", "Tools", "Key Results") — leave
          it blank to hide that line entirely.
        </p>
        {SECTION_IDS.map((key) => {
          const cfg = settings.sectionOverrides[key];
          return (
            <div key={key} className="section-row">
              <input
                type="checkbox"
                checked={cfg.enabled}
                onChange={(e) => setSectionConfig(key, { enabled: e.target.checked })}
                title={cfg.enabled ? 'Visible in resume' : 'Hidden from resume'}
              />
              <TextInput
                value={cfg.label}
                onChange={(v) => setSectionConfig(key, { label: v })}
                placeholder="Section heading"
              />
              {key === 'projects' && (
                <TextInput
                  value={cfg.sublabel ?? ''}
                  onChange={(v) => setSectionConfig(key, { sublabel: v })}
                  placeholder="Subtitle label"
                />
              )}
            </div>
          );
        })}
      </Card>

      {/* ---- Page & layout ---- */}
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

      {/* ---- AI provider ---- */}
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

      {/* ---- Danger zone ---- */}
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
