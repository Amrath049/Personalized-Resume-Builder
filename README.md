# ResumeTailor — ATS-Friendly Resume Builder

Tailor your resume to each job description (JD) by editing **form fields** instead of a Word
document, then download a clean **single-page PDF** (with a filename you type) that ATS systems
can actually read. Includes a **JD Assistant** that checks keyword coverage for free and can
optionally draft improved content using your own free AI key.

> Built with React + Vite + TypeScript. Runs entirely in your browser — no server required, free
> to run and free to host. See [PLAN.md](PLAN.md) for the design.

---

## Why this exists

Windows/Word editing per company is slow, and ATS filters mostly match **keywords**. ResumeTailor
keeps your 7 sections — **Header, Professional Summary, Experience, Projects, Skills, Education,
Courses** — as editable fields, renders a pixel-consistent PDF using **Carlito** (a free font
identical to Calibri), and shows you exactly which JD keywords you're missing.

It comes **pre-loaded with your real resume** (master) plus a **"Wells Fargo (example)"** version
so you can see how tailoring works immediately.

---

## 1. Requirements

- **Node.js 18+** (you have v24). Check: `node --version`

## 2. Install & run

```bash
cd d:\ProjectsRecent\ResumeTailor
npm install        # already done once
npm run dev        # start the app
```

Open the URL it prints (usually <http://localhost:5173>).

To create an optimized production build:

```bash
npm run build      # output goes to dist/
npm run preview    # preview the production build locally
```

---

## How to use

### Edit your resume
- Use the **Edit resume** tab. Every field updates the **live PDF preview** on the right.
- Add / remove / reorder bullets, roles, projects, skills, etc. with the **+** and **↑ ↓ ✕** buttons.

### Keep it to one page
- The preview tells you **"✓ Fits on one page"** or **"⚠ 2 pages"**.
- If it spills over, trim content or open **Settings → Font scale** and nudge it down (or click
  **Shrink a bit**).

### Download the PDF
- In the preview toolbar, type your **filename** and click **Download PDF**.
- The PDF has **real, selectable text** (not an image), so ATS can parse it.

### Save a version per company
Use the **Version** dropdown and buttons in the top bar:
- **Save as…** — snapshot the current resume under a company name.
- **Duplicate / Rename / Delete** — manage versions.
- **★ Master** — your base resume.
- **Export / Import** — download or restore everything as a `.json` backup file.

Everything is saved automatically in your browser (localStorage).

### JD Assistant (tailor to a job)
Open the **JD Assistant** tab and paste the job description:

1. **Keyword check (free, always on, nothing leaves your browser):** see your **ATS match %**,
   the keywords you already cover, and the **missing** ones to weave in (truthfully).
2. **Copy prompt (free):** click **Copy prompt for ChatGPT/Claude** to get a ready-made prompt
   bundling your resume + the JD — paste it into your usual chat and copy the result back.
3. **Generate with AI (optional, your free key):** click **Generate** to have the app draft an
   improved summary, experience bullets, project bullets, and skills. Review each block and click
   **Apply** to insert it into the form (and preview).

---

## Using the optional AI (free)

You need a **free API key** from one provider. Add it under **Settings → AI provider**.

### Option A — Google Gemini (recommended; works directly in the browser)
1. Go to <https://aistudio.google.com/apikey> and create a free API key.
2. In **Settings**, choose **Google Gemini**, paste the key. (Default model: `gemini-2.0-flash`.)

### Option B — Groq (also free, very fast)
1. Go to <https://console.groq.com/keys> and create a free API key.
2. In **Settings**, choose **Groq**, paste the key. (Default model: `llama-3.3-70b-versatile`.)

> **Privacy:** the AI option sends your resume + the JD to the provider you pick, using *your* key.
> The keyword analyzer and the PDF never leave your browser. Your key is stored only in your
> browser's localStorage.

### If a provider blocks browser calls (CORS)
Some providers (often Groq) reject direct browser requests. Run the tiny included proxy:

```bash
cd server
npm install
npm start            # listens on http://localhost:8787
```

Then in **Settings → Proxy URL**, enter `http://localhost:8787`. (You can also set
`GEMINI_API_KEY` / `GROQ_API_KEY` as environment variables for the server and leave the key blank
in the app.)

---

## Matching your old resume's look

The PDF uses **Carlito**, which is metrically identical to **Calibri**, so it matches a Word/Calibri
resume closely. Exact pixel-matching to your original isn't guaranteed (we don't have its source
file), but it's very close. To fine-tune sizes, spacing, and colors, edit
[`src/pdf/theme.ts`](src/pdf/theme.ts). Page size (A4 / US Letter) is in **Settings**.

---

## Deploy for free (optional)

Because it's a static site, you can host it free:

```bash
npm run build        # produces dist/
```

Upload `dist/` to **Netlify**, **Vercel**, or **GitHub Pages** (drag-and-drop works on Netlify).
The AI calls still run from the visitor's browser with their own key.

---

## Troubleshooting

| Problem | Fix |
| ------- | --- |
| Preview is blank / fonts look wrong | Hard-refresh the page; ensure `public/fonts/Carlito-*.ttf` exist. |
| "Add your free API key in Settings first" | Paste a Gemini or Groq key under Settings. |
| AI fails with a network/CORS error | Switch to Gemini, or run the `server/` proxy and set the Proxy URL. |
| Resume spills to 2 pages | Trim bullets or lower **Font scale** in Settings. |
| Want to start over | Settings → **Reset everything to defaults** (re-seeds your resume + example version). |

---

## Project structure

```
ResumeTailor/
  PLAN.md                 # design document
  README.md               # this file
  public/fonts/           # Carlito TTFs (embedded into the PDF)
  src/
    types.ts              # resume data model
    data/seed.ts          # your real resume (master) + Wells Fargo example
    store/                # zustand state + localStorage persistence
    pdf/                  # ResumeDocument, theme, fonts, icons (the PDF)
    editor/               # the 7-section form editor
    jd/                   # keyword analyzer + prompt builder + Gemini/Groq client
    versions/             # version switcher + export/import
    preview/              # live PDF preview + filename + download
    Settings.tsx          # page size, font scale, AI keys
    App.tsx               # layout
  server/                 # OPTIONAL Node proxy for AI (only if CORS blocks the browser)
```

## Notes & scope (v1)

- One faithful single-page template (no multi-template switching yet).
- Data is local; use **Export/Import** for backup or to move between machines.
- AI suggestions always require your **review + Apply** — nothing is changed automatically.
