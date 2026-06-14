// JD Assistant: keyword coverage (free), copy-prompt (free), optional AI generation.

import { useMemo, useState } from 'react';
import { useStore } from '../store/store';
import { useCurrentResume } from '../store/hooks';
import { analyzeJD, buildPrompt } from './keywords';
import { generateSuggestions, type Suggestion } from './llm';

export function JdAssistant() {
  const resume = useCurrentResume();
  const edit = useStore((s) => s.editResume);
  const settings = useStore((s) => s.settings);

  const [jd, setJd] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sug, setSug] = useState<Suggestion | null>(null);

  const analysis = useMemo(() => (jd.trim() ? analyzeJD(jd, resume) : null), [jd, resume]);

  const scoreColor = (n: number) => (n >= 70 ? '#1a7f37' : n >= 40 ? '#b7791f' : '#c0392b');

  const copyPrompt = async () => {
    const missing = analysis ? analysis.missing.map((m) => m.term) : [];
    await navigator.clipboard.writeText(buildPrompt(jd, resume, missing));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const runAI = async () => {
    setError('');
    setSug(null);
    setLoading(true);
    try {
      const missing = analysis ? analysis.missing.map((m) => m.term) : [];
      const result = await generateSuggestions(settings, jd, resume, missing);
      setSug(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  // ---- apply helpers ----
  const applySummary = () => sug?.summary && edit((r) => (r.summary = sug.summary!));
  const applyExperience = () =>
    sug?.experienceBullets &&
    edit((r) => {
      if (r.experience[0]) r.experience[0].bullets = sug.experienceBullets!.filter(Boolean);
    });
  const applyProjects = () =>
    sug?.projectBullets &&
    edit((r) => {
      for (const ps of sug.projectBullets!) {
        const idx = r.projects.findIndex((p) => p.name.toLowerCase().includes(ps.name.toLowerCase().slice(0, 8)));
        if (idx >= 0 && ps.bullets?.length) r.projects[idx].bullets = ps.bullets.filter(Boolean);
      }
    });
  const applySkills = () =>
    sug?.skills &&
    edit((r) => {
      for (const sk of sug.skills!) {
        const idx = r.skills.findIndex((x) => x.label.toLowerCase() === sk.label.toLowerCase());
        if (idx >= 0) r.skills[idx].value = sk.value;
        else r.skills.push({ label: sk.label, value: sk.value });
      }
    });

  return (
    <div className="jd">
      <p className="jd-intro">
        Paste the job description. You'll get a free ATS keyword check (nothing leaves your
        browser). Optionally generate tailored content with your own free AI key (Settings tab).
      </p>

      <textarea
        className="text-area jd-input"
        rows={8}
        placeholder="Paste the full job description here…"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {analysis && (
        <div className="jd-analysis">
          <div className="score" style={{ color: scoreColor(analysis.score) }}>
            ATS keyword match: <strong>{analysis.score}%</strong>
          </div>

          {analysis.missing.length > 0 && (
            <div className="kw-group">
              <span className="kw-title">Missing keywords (add these where truthful):</span>
              <div className="chips">
                {analysis.missing.slice(0, 24).map((k) => (
                  <span className="chip chip-missing" key={k.term}>
                    {k.term}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="kw-group">
            <span className="kw-title">Already covered:</span>
            <div className="chips">
              {analysis.matched.slice(0, 24).map((k) => (
                <span className="chip chip-matched" key={k.term}>
                  {k.term}
                </span>
              ))}
              {analysis.matched.length === 0 && <span className="muted">none yet</span>}
            </div>
          </div>

          <div className="jd-actions">
            <button className="btn" onClick={copyPrompt} disabled={!jd.trim()}>
              {copied ? 'Copied ✓' : 'Copy prompt for ChatGPT/Claude'}
            </button>
            <button className="btn btn-primary" onClick={runAI} disabled={!jd.trim() || loading}>
              {loading ? 'Generating…' : `Generate with ${settings.aiProvider === 'gemini' ? 'Gemini' : 'Groq'}`}
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {sug && (
        <div className="suggestions">
          <h3>AI suggestions — review, then apply</h3>
          <p className="muted">Review each suggestion. Applying updates the form and the live preview.</p>

          {sug.summary && (
            <div className="sug-block">
              <div className="sug-head">
                <strong>Summary</strong>
                <button className="btn btn-small" onClick={applySummary}>
                  Apply
                </button>
              </div>
              <p>{sug.summary}</p>
            </div>
          )}

          {sug.experienceBullets && sug.experienceBullets.length > 0 && (
            <div className="sug-block">
              <div className="sug-head">
                <strong>Experience bullets (most recent role)</strong>
                <button className="btn btn-small" onClick={applyExperience}>
                  Apply
                </button>
              </div>
              <ul>
                {sug.experienceBullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {sug.projectBullets && sug.projectBullets.length > 0 && (
            <div className="sug-block">
              <div className="sug-head">
                <strong>Project bullets</strong>
                <button className="btn btn-small" onClick={applyProjects}>
                  Apply
                </button>
              </div>
              {sug.projectBullets.map((p, i) => (
                <div key={i}>
                  <em>{p.name}</em>
                  <ul>
                    {p.bullets?.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {sug.skills && sug.skills.length > 0 && (
            <div className="sug-block">
              <div className="sug-head">
                <strong>Skills</strong>
                <button className="btn btn-small" onClick={applySkills}>
                  Apply
                </button>
              </div>
              <ul>
                {sug.skills.map((s, i) => (
                  <li key={i}>
                    <strong>{s.label}:</strong> {s.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sug.notes && <p className="muted">{sug.notes}</p>}
        </div>
      )}
    </div>
  );
}
