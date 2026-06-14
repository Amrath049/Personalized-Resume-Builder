# ResumeTailor — Plan / Design Document

> *"What I'm going to build"* — written before the code.

## 1. The Problem

Every job has a different Job Description (JD). To get past **ATS** (Applicant Tracking
Systems) and resume filters — which mostly match keywords — the resume needs small,
JD-specific tweaks each time. Doing that in Word means re-editing a document, fixing the
formatting, and re-exporting a PDF with a chosen filename for *every* application. Slow and
repetitive.

## 2. The Solution

**ResumeTailor** — a website where, instead of editing Word, you:

1. Fill in **form fields** for the 7 fixed resume sections.
2. See a **live, exact preview** of the resume.
3. Type a **filename** and **download a single-page PDF** with real, selectable text
   (image-based PDFs get rejected by ATS — this one is fully parseable).
4. Save **multiple named versions** (one per company) and switch between them.
5. Use the **JD Assistant**: paste a JD to see your ATS keyword coverage and what's missing,
   and (optionally) have a **free AI** draft improved section content you can apply in one click.

The 7 sections (structure is constant, content is editable):
**Header**, **Professional Summary**, **Experience**, **Projects**, **Skills**, **Education**,
**Courses**.

## 3. Technology

| Choice | Why |
| ------ | --- |
| **React + Vite + TypeScript** | Your preferred stack; fast dev; deployable as a free static site. |
| **`@react-pdf/renderer`** | Generates **real-text** PDFs with precise layout + custom filename. The live preview *is* the PDF (WYSIWYG). |
| **Carlito font (embedded)** | Free, **metric-identical to Calibri**, so the output matches your current resume. |
| **Zustand + localStorage** | Saves your master + named versions in the browser; export/import as a file. |
| **No backend required** | Runs 100% in the browser → free to host. (A tiny optional Node proxy exists only for AI if a provider blocks browser calls.) |

## 4. Features

- ✅ Form-driven editing of all 7 sections (add / remove / reorder bullets, projects, skills, etc.).
- ✅ Live WYSIWYG PDF preview.
- ✅ One-click **Download PDF** with a **filename you type**, single page, selectable text.
- ✅ **Multiple named versions** (per company) + JSON **export/import** for backup.
- ✅ **JD Assistant**:
  - **Keyword analyzer** (always free, nothing leaves your browser): ATS match score + missing keywords.
  - **Copy optimized prompt** to paste into ChatGPT/Claude yourself (free, manual).
  - **Optional in-app AI** via your own free **Gemini** or **Groq** API key — drafts improved
    content you review and apply.
- ✅ Pre-loaded with your real resume as the master, plus a "Wells Fargo" example version.

## 5. Architecture

```
 React app (browser only)
 ┌─────────────────────────────────────────────────────────────┐
 │  Zustand store  ── persisted to localStorage                 │
 │   master resume · named versions · settings (AI key, page)   │
 └───────────────┬───────────────────────────┬─────────────────┘
                 │ current resume            │
        ┌────────▼─────────┐        ┌────────▼──────────┐
        │  Editor (forms)  │        │  Preview pane     │
        │  7 section panels │───────▶│  <PDFViewer> =    │
        └────────┬─────────┘        │  ResumeDocument   │
                 │                   │  + filename +     │
                 │                   │  Download (.pdf)  │
        ┌────────▼─────────┐        └───────────────────┘
        │  JD Assistant    │
        │  keyword analyzer (pure JS, free)                      │
        │  prompt copier   │
        │  optional LLM ──▶ Gemini / Groq  (your key, optional)  │
        └──────────────────┘                 │ (if CORS blocked)
                                              ▼
                                   optional Node proxy (server/)
```

## 6. Data Model

```ts
Resume = {
  header: { name, title, location, email, phone, linkedin, github },
  summary: string,
  experience: { role, company, dateRange, bullets: string[] }[],
  projects:   { name, techStack, bullets: string[] }[],
  skills:     { label, value }[],
  education:  { degree, institution, detail }[],
  courses:    { title, provider, detail }[],
}
SavedVersion = { id, name, updatedAt, resume: Resume }
```

Persisted: the **master** resume, the list of **versions**, which one is being **edited**,
**settings** (AI provider + key, page size A4/Letter), and the current **filename**.

## 7. How ATS-friendliness is achieved

- The PDF contains **selectable text** (not a screenshot), so ATS can parse it.
- Standard single-column layout, standard section headings, embedded standard font.
- The **keyword analyzer** shows exactly which JD terms are missing so you can add them truthfully.

## 8. Out of Scope (v1)

- Multiple templates / multi-page layouts (one faithful single-page template for now).
- Cloud accounts / sync (data is local; use export/import for backup).
- Auto-applying AI text without review (you always approve before it changes your resume).

## 9. Privacy

- The keyword analyzer and PDF generation are **100% local** — nothing is uploaded.
- The **optional** AI feature sends your resume + the JD to the provider *you* choose (Gemini or
  Groq), using *your own* API key. Skip it and use the keyword analyzer + copy-prompt instead.
