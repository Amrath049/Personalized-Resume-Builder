import type { Resume, Settings } from '../types';

interface Props {
  resume: Resume;
  settings: Pick<Settings, 'fontScale'>;
}

export function ResumeHtmlPreview({ resume, settings }: Props) {
  const s = settings.fontScale ?? 1;
  const base = 11 * s;

  const style: React.CSSProperties = {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: `${base}pt`,
    color: '#1a1a1a',
    padding: '36px 42px',
    lineHeight: 1.4,
    maxWidth: '100%',
  };

  const h = resume.header;

  return (
    <div style={style}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: `${Math.round(18 * s)}pt`, fontWeight: 700, letterSpacing: 1 }}>
          {h.name}
        </div>
        {h.title && (
          <div style={{ fontSize: `${Math.round(11 * s)}pt`, color: '#444', marginTop: 2 }}>
            {h.title}
          </div>
        )}
        <div style={{ fontSize: `${Math.round(9.5 * s)}pt`, color: '#555', marginTop: 4 }}>
          {[h.location, h.email, h.phone, h.linkedin, h.github].filter(Boolean).join('  •  ')}
        </div>
      </div>

      <HRule />

      {/* Summary */}
      {resume.summary && (
        <>
          <Section title="Professional Summary" s={s} />
          <p style={{ margin: '4px 0 8px', fontSize: `${base}pt` }}>{resume.summary}</p>
          <HRule />
        </>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <>
          <Section title="Experience" s={s} />
          {resume.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: `${Math.round(10.5 * s)}pt` }}>
                  {exp.role}
                </span>
                <span style={{ fontSize: `${Math.round(9 * s)}pt`, color: '#555' }}>{exp.dateRange}</span>
              </div>
              <div style={{ fontSize: `${Math.round(9.5 * s)}pt`, color: '#444', marginBottom: 3 }}>
                {exp.company}
              </div>
              <ul style={{ margin: '2px 0', paddingLeft: 18 }}>
                {exp.bullets.filter(Boolean).map((b, j) => (
                  <li key={j} style={{ marginBottom: 2, fontSize: `${base}pt` }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
          <HRule />
        </>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <>
          <Section title="Projects" s={s} />
          {resume.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: `${Math.round(10.5 * s)}pt` }}>{proj.name}</span>
              {proj.techStack && (
                <div style={{ fontSize: `${Math.round(9.5 * s)}pt`, color: '#444', marginBottom: 2 }}>
                  <strong>Tech Stack: </strong>{proj.techStack}
                </div>
              )}
              <ul style={{ margin: '2px 0', paddingLeft: 18 }}>
                {proj.bullets.filter(Boolean).map((b, j) => (
                  <li key={j} style={{ marginBottom: 2, fontSize: `${base}pt` }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
          <HRule />
        </>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <>
          <Section title="Skills" s={s} />
          <div style={{ marginBottom: 8 }}>
            {resume.skills.map((sk, i) => (
              <div key={i} style={{ marginBottom: 3, fontSize: `${base}pt` }}>
                {sk.label && <strong>{sk.label}: </strong>}
                {sk.value}
              </div>
            ))}
          </div>
          <HRule />
        </>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <>
          <Section title="Education" s={s} />
          {resume.education.map((ed, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: `${Math.round(10.5 * s)}pt` }}>{ed.degree}</div>
              <div style={{ fontSize: `${Math.round(9.5 * s)}pt`, color: '#444' }}>{ed.institution}</div>
              {ed.detail && (
                <div style={{ fontSize: `${Math.round(9 * s)}pt`, color: '#555' }}>{ed.detail}</div>
              )}
            </div>
          ))}
          <HRule />
        </>
      )}

      {/* Courses & Certificates */}
      {resume.courses.length > 0 && (
        <>
          <Section title="Courses and Certificates" s={s} />
          {resume.courses.map((c, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: `${Math.round(10.5 * s)}pt` }}>{c.title}</span>
              {c.provider && (
                <span style={{ fontSize: `${Math.round(9.5 * s)}pt`, color: '#444' }}> — {c.provider}</span>
              )}
              {c.detail && (
                <div style={{ fontSize: `${Math.round(9 * s)}pt`, color: '#555' }}>{c.detail}</div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function Section({ title, s }: { title: string; s: number }) {
  return (
    <div style={{
      fontSize: `${Math.round(9 * s)}pt`,
      fontWeight: 700,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      borderBottom: '2px solid #1a1a1a',
      marginBottom: 5,
      paddingBottom: 2,
    }}>
      {title}
    </div>
  );
}

function HRule() {
  return <div style={{ marginBottom: 8 }} />;
}
