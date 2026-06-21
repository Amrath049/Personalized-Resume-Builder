// HTML/CSS resume renderer used as the mobile preview.
// Mirrors the PDF layout so the user can visually check their resume
// before tapping Download — without needing an iframe or PDF.js.

import type { Resume, Settings } from '../types';

interface Props {
  resume: Resume;
  settings: Settings;
}

export function ResumeHtmlPreview({ resume, settings }: Props) {
  const { header } = resume;
  const sc = settings.sectionOverrides;
  const f = settings.fontScale; // scale factor

  // All sizes mirror src/pdf/theme.ts so the HTML preview matches the PDF.
  const px = (n: number) => `${Math.round(n * f)}px`;

  const rule: React.CSSProperties = {
    borderBottom: '1.5px solid #000',
    paddingBottom: px(2),
    marginBottom: px(4),
    marginTop: px(7),
    fontSize: px(9.5),
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  };

  const entryStyle: React.CSSProperties = { marginBottom: px(5) };
  const boldName: React.CSSProperties = { fontWeight: 700, fontSize: px(9.5) };
  const small: React.CSSProperties = { fontSize: px(9), color: '#3a3a3a' };
  const bullet: React.CSSProperties = {
    display: 'flex', gap: px(4), fontSize: px(9), marginBottom: px(2), alignItems: 'flex-start',
  };

  return (
    <div style={{
      fontFamily: 'Calibri, "Carlito", "Segoe UI", Arial, sans-serif',
      fontSize: px(10),
      color: '#1a1a1a',
      lineHeight: 1.35,
      padding: `${px(20)} ${px(22)}`,
      background: '#fff',
    }}>
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: px(4) }}>
        <div style={{ fontSize: px(20), fontWeight: 700, letterSpacing: '1.5px' }}>{header.name}</div>
        {header.title && (
          <div style={{ fontSize: px(10.5), color: '#3a3a3a', marginTop: px(2) }}>{header.title}</div>
        )}
      </div>

      {(header.linkedin || header.github) && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `${px(2)} ${px(10)}`, fontSize: px(9), marginBottom: px(2) }}>
          {header.linkedin && <span>🔗 {header.linkedin}</span>}
          {header.github && <span>⌥ {header.github}</span>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `${px(2)} ${px(10)}`, fontSize: px(9), marginBottom: px(6) }}>
        {header.location && <span>📍 {header.location}</span>}
        {header.email && <span>✉ {header.email}</span>}
        {header.phone && <span>📞 {header.phone}</span>}
      </div>

      {/* ── Summary ── */}
      {sc.summary.enabled && resume.summary.trim() && (
        <>
          <div style={rule}>{sc.summary.label}</div>
          <p style={{ margin: `0 0 ${px(4)}`, fontSize: px(9.5) }}>{resume.summary}</p>
        </>
      )}

      {/* ── Experience ── */}
      {sc.experience.enabled && resume.experience.length > 0 && (
        <>
          <div style={rule}>{sc.experience.label}</div>
          {resume.experience.map((e, i) => (
            <div key={i} style={entryStyle}>
              <div style={boldName}>{e.role}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...small }}>
                <span>{e.company}</span>
                <span>{e.dateRange}</span>
              </div>
              {e.bullets.filter(b => b.trim()).map((b, j) => (
                <div key={j} style={bullet}><span>•</span><span>{b}</span></div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* ── Projects / Portfolio / Campaigns ── */}
      {sc.projects.enabled && resume.projects.length > 0 && (
        <>
          <div style={rule}>{sc.projects.label}</div>
          {resume.projects.map((p, i) => (
            <div key={i} style={entryStyle}>
              <div style={boldName}>{p.name}</div>
              {p.techStack && sc.projects.sublabel && (
                <div style={small}>
                  <strong>{sc.projects.sublabel}: </strong>{p.techStack}
                </div>
              )}
              {p.bullets.filter(b => b.trim()).map((b, j) => (
                <div key={j} style={bullet}><span>•</span><span>{b}</span></div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* ── Skills ── */}
      {sc.skills.enabled && resume.skills.length > 0 && (
        <>
          <div style={rule}>{sc.skills.label}</div>
          {resume.skills.filter(s => s.label || s.value).map((sk, i) => (
            <div key={i} style={{ ...small, marginBottom: px(2) }}>
              <strong>{sk.label}: </strong>{sk.value}
            </div>
          ))}
        </>
      )}

      {/* ── Education ── */}
      {sc.education.enabled && resume.education.length > 0 && (
        <>
          <div style={rule}>{sc.education.label}</div>
          {resume.education.map((ed, i) => (
            <div key={i} style={entryStyle}>
              <div style={boldName}>{ed.degree}</div>
              {ed.institution && <div style={small}>{ed.institution}</div>}
              {ed.detail && <div style={small}>{ed.detail}</div>}
            </div>
          ))}
        </>
      )}

      {/* ── Courses & Certificates ── */}
      {sc.courses.enabled && resume.courses.length > 0 && (
        <>
          <div style={rule}>{sc.courses.label}</div>
          {resume.courses.map((c, i) => (
            <div key={i} style={entryStyle}>
              <span style={{ fontWeight: 700, fontSize: px(9.5) }}>{c.title}</span>
              {c.provider && <span style={small}> — {c.provider}</span>}
              {c.detail && <div style={small}>{c.detail}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
