# ResumeTailor

**A browser-based resume builder that tailors your resume to each job description in minutes.**

Edit resume sections as form fields, see a live PDF preview, analyse ATS keyword coverage, and download a clean single-page PDF with real selectable text — all running entirely in your browser, no account or backend required.

---

## Features

- **Live WYSIWYG PDF preview** — every edit reflects instantly in the preview pane
- **ATS-friendly PDF** — real selectable text (not an image), so applicant tracking systems can parse it
- **JD Assistant** — paste a job description to see your ATS keyword match %, missing keywords, and a ready-made prompt for ChatGPT / Claude
- **Optional AI generation** — use your own free Gemini or Groq API key to draft improved summaries, bullets, and skills; review each suggestion before applying
- **Multi-profession templates** — presets for Software/Tech, Marketing & Sales, Design & Creative, and General; each adjusts which sections appear and what they're called
- **Section customization** — rename any section heading and toggle sections on or off to match your field
- **Per-company version management** — save a named snapshot per company, duplicate, rename, delete, or switch back to your master resume
- **Export / Import** — back up all your data as a JSON file and restore it on any device
- **No backend, no account** — everything is stored in your browser's localStorage; nothing is uploaded unless you opt into the AI feature

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite + TypeScript |
| PDF generation | `@react-pdf/renderer` (real-text PDF, WYSIWYG) |
| Font | Carlito (metric-identical to Calibri, embedded in PDF) |
| State management | Zustand + localStorage persistence |
| AI integration | Google Gemini API / Groq API (optional, user-supplied key) |
| Deployment | Static site — Netlify, Vercel, or GitHub Pages |

---

## Getting Started

### Run locally

```bash
npm install
npm run dev       # starts at http://localhost:5173
```

### Production build

```bash
npm run build     # output goes to dist/
npm run preview   # preview the build locally
```

### Deploy for free

Upload the `dist/` folder to **Netlify**, **Vercel**, or **GitHub Pages** — drag-and-drop works on Netlify. The AI calls run from each visitor's browser using their own key; no server cost.

---

## How to Use

### 1. Fill in your resume
Open the **Edit resume** tab. Every field updates the live PDF preview on the right. Add, remove, and reorder bullets, roles, projects, and skills with the **+** and **↑ ↓ ✕** controls.

### 2. Choose a template
Go to **Settings → Resume template** and pick the preset that fits your profession. You can further rename section headings or toggle sections off in the **Sections** panel below the template picker.

### 3. Tailor to a job description
Open the **JD Assistant** tab, paste the job description, and review:
- **ATS match %** — how well your current resume covers the JD's keywords
- **Missing keywords** — terms to weave in truthfully
- **Copy prompt** — a ready-made prompt to paste into ChatGPT or Claude
- **Generate** — optional AI-drafted improvements using your free Gemini or Groq key

### 4. Save a version and download
Click **Save as…**, name it after the company, tweak the content, then type a filename in the preview toolbar and click **Download PDF**.

### Keep it to one page
The preview shows **"✓ Fits on one page"** or **"⚠ 2 pages"**. Use **Settings → Font scale** to nudge everything down, or click **Shrink a bit**.

---

## Optional AI Setup (free)

Add a key under **Settings → AI provider**. Your key is stored only in your browser.

| Provider | Where to get a free key | Default model |
|---|---|---|
| Google Gemini (recommended) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | `gemini-2.5-flash` |
| Groq | [console.groq.com/keys](https://console.groq.com/keys) | `llama-3.3-70b-versatile` |

> **Privacy:** the AI option sends your resume + the JD to the provider you choose, using *your* key. The keyword analyzer and PDF generation are 100% local.

If a provider blocks browser requests (CORS), run the included proxy:

```bash
cd server && npm install && npm start   # listens on http://localhost:8787
```

Then set **Settings → Proxy URL** to `http://localhost:8787`.

---

## Project Structure

```
ResumeTailor/
  public/fonts/           # Carlito TTFs — embedded into every downloaded PDF
  src/
    types.ts              # core data model (Resume, Settings, SectionConfig, …)
    data/
      seed.ts             # sample master resume + example tailored version
      templates.ts        # 4 profession template presets
    store/                # Zustand state + localStorage persistence
    pdf/                  # ResumeDocument (react-pdf), theme, fonts, icons
    editor/               # 7-section form editor
    jd/                   # keyword analyzer, prompt builder, Gemini/Groq client
    versions/             # version switcher + export/import
    preview/              # live PDF preview + filename input + download button
    Settings.tsx          # template picker, section toggles, page size, AI keys
    App.tsx               # tab layout
  server/                 # optional Node/Express proxy (only needed if CORS blocks AI calls)
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Preview is blank / fonts look wrong | Hard-refresh; ensure `public/fonts/Carlito-*.ttf` exist |
| "Add your free API key in Settings first" | Paste a Gemini or Groq key under Settings → AI provider |
| AI fails with a network/CORS error | Switch to Gemini, or run the `server/` proxy and set the Proxy URL |
| Resume spills to 2 pages | Trim bullets or lower **Font scale** in Settings |
| Want to start fresh | Settings → **Reset everything to defaults** |

---

## License

MIT — free to use, fork, and deploy.
