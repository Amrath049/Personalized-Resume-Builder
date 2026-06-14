// Zero-cost ATS keyword analysis — runs entirely in the browser.
// Extracts likely keywords/phrases from a JD and checks resume coverage.

import type { Resume } from '../types';

const STOPWORDS = new Set(
  (
    'a an the and or but if then else for to of in on at by with from as is are was were be been being ' +
    'this that these those it its we you your our their they them he she his her i me my mine ours yours ' +
    'will would should could can may might must shall do does did done have has had having not no nor so ' +
    'than too very just about into over under again further once here there all any both each few more most ' +
    'other some such only own same up down out off above below who whom which what when where why how ' +
    'work working experience job role team teams company strong ability able etc using use used across ' +
    'including include includes new help helping ensure ensuring within per via plus also within based ' +
    'years year months month day days time good great well years required preferred responsibilities ' +
    'qualifications skills knowledge understanding looking seeking candidate candidates position role ' +
    'you will we are our the a an join build building develop developing design designing'
  ).split(/\s+/),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, '')) // strip stray leading/trailing dots
    .filter(Boolean);
}

function isCandidate(tok: string): boolean {
  if (tok.length < 2) return false;
  if (STOPWORDS.has(tok)) return false;
  if (/^\d+$/.test(tok)) return false; // pure numbers
  return true;
}

export interface KeywordHit {
  term: string;
  count: number;
  matched: boolean;
}

export interface Analysis {
  score: number; // 0..100 coverage of the top JD keywords
  matched: KeywordHit[];
  missing: KeywordHit[];
  all: KeywordHit[];
}

export function resumeToText(resume: Resume): string {
  const parts: string[] = [
    resume.header.title,
    resume.summary,
    ...resume.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...resume.projects.flatMap((p) => [p.name, p.techStack, ...p.bullets]),
    ...resume.skills.flatMap((s) => [s.label, s.value]),
    ...resume.education.flatMap((e) => [e.degree, e.institution, e.detail]),
    ...resume.courses.flatMap((c) => [c.title, c.provider, c.detail]),
  ];
  return parts.join(' ').toLowerCase();
}

export function analyzeJD(jd: string, resume: Resume): Analysis {
  const tokens = tokenize(jd);
  const counts = new Map<string, number>();

  // unigrams
  for (const t of tokens) {
    if (isCandidate(t)) counts.set(t, (counts.get(t) || 0) + 1);
  }
  // bigrams (both parts meaningful) — captures "rest apis", "data structures", etc.
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (isCandidate(a) && isCandidate(b)) {
      const bg = `${a} ${b}`;
      counts.set(bg, (counts.get(bg) || 0) + 1);
    }
  }

  const resumeText = resumeToText(resume);
  const matchesResume = (term: string): boolean => {
    if (term.includes(' ')) return resumeText.includes(term);
    // word-ish boundary match for single tokens
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`).test(resumeText);
  };

  const all: KeywordHit[] = [...counts.entries()]
    .map(([term, count]) => ({ term, count, matched: matchesResume(term) }))
    // prefer multi-word phrases and frequent terms
    .sort((x, y) => y.count - x.count || y.term.length - x.term.length)
    .slice(0, 60);

  const matched = all.filter((k) => k.matched);
  const missing = all.filter((k) => !k.matched);

  // Score over the 30 strongest signals in the JD.
  const top = all.slice(0, 30);
  const topMatched = top.filter((k) => k.matched).length;
  const score = top.length ? Math.round((topMatched / top.length) * 100) : 0;

  return { score, matched, missing, all };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build a copy-paste prompt for ChatGPT/Claude (the free, manual path).
export function buildPrompt(jd: string, resume: Resume, missing: string[]): string {
  return `You are an expert resume writer and ATS optimization specialist.

Below is my current resume (as structured text) and a job description (JD). Rewrite ONLY the
content of these sections to better match the JD and pass ATS keyword screening, while staying
truthful to my real experience: Professional Summary, Experience bullet points, Project bullet
points, and Skills.

Rules:
- Keep it concise enough to fit a SINGLE page.
- Naturally weave in relevant keywords from the JD (do not keyword-stuff).
- Do not invent experience I don't have; rephrase and emphasize what's already there.
- Return the result as JSON with keys: summary (string), experienceBullets (string[] for my most
  recent role), projectBullets (array of {name, bullets[]}), skills (array of {label, value}).

High-value keywords currently MISSING from my resume: ${missing.join(', ') || '(none detected)'}

=== MY CURRENT RESUME ===
${JSON.stringify(resume, null, 2)}

=== JOB DESCRIPTION ===
${jd}
`;
}
