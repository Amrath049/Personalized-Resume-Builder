// Live PDF preview + filename + download. One render path: we generate the PDF
// blob (debounced), show it in an iframe, count its real pages, and the Download
// button saves that exact blob.

import { useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useStore } from '../store/store';
import { useCurrentResume } from '../store/hooks';
import { ResumeDocument } from '../pdf/ResumeDocument';
import { ResumeHtmlPreview } from './ResumeHtmlPreview';

function countPages(buf: ArrayBuffer): number {
  // pdfkit (used by react-pdf) writes uncompressed page dictionaries, so we can
  // count "/Type /Page" occurrences (excluding the "/Pages" catalog).
  const text = new TextDecoder('latin1').decode(buf);
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

function safeName(name: string): string {
  const base = (name || '').trim().replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]+/g, '_');
  return (base || 'resume') + '.pdf';
}

export function PreviewPane() {
  const resume = useCurrentResume();
  const settings = useStore((s) => s.settings);
  const filename = useStore((s) => s.filename);
  const setFilename = useStore((s) => s.setFilename);
  const setSettings = useStore((s) => s.setSettings);

  const [url, setUrl] = useState<string>('');
  const [pages, setPages] = useState<number>(0);
  const [busy, setBusy] = useState(false);
  const blobRef = useRef<Blob | null>(null);

  // Regenerate the PDF (debounced) whenever the resume or layout settings change.
  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      setBusy(true);
      try {
        const blob = await pdf(<ResumeDocument resume={resume} settings={settings} />).toBlob();
        if (cancelled) return;
        blobRef.current = blob;
        const buf = await blob.arrayBuffer();
        if (cancelled) return;
        setPages(countPages(buf));
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [resume, settings]);

  // Clean up the last object URL on unmount.
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const download = async () => {
    const blob = blobRef.current ?? (await pdf(<ResumeDocument resume={resume} settings={settings} />).toBlob());
    saveAs(blob, safeName(filename));
  };

  const onePage = pages === 1;

  return (
    <div className="preview">
      <div className="preview-toolbar">
        <input
          className="text-input filename"
          value={filename}
          placeholder="file name"
          onChange={(e) => setFilename(e.target.value)}
        />
        <span className="ext">.pdf</span>
        <button className="btn btn-primary" onClick={download}>
          Download PDF
        </button>
      </div>

      <div className="preview-status">
        {busy ? (
          <span className="muted">Rendering…</span>
        ) : pages === 0 ? (
          <span className="muted">Preview will appear here.</span>
        ) : onePage ? (
          <span className="ok">✓ Fits on one page</span>
        ) : (
          <span className="warn">
            ⚠ {pages} pages — trim content or lower the font scale to fit one page
            <button
              className="btn btn-small"
              style={{ marginLeft: 8 }}
              onClick={() => setSettings({ fontScale: Math.max(0.8, Number((settings.fontScale - 0.03).toFixed(2))) })}
            >
              Shrink a bit
            </button>
          </span>
        )}
      </div>

      {/* Desktop: live PDF iframe */}
      <div className="preview-frame">
        {url ? (
          <iframe title="Resume preview" src={`${url}#view=FitH&toolbar=0`} />
        ) : (
          <div className="preview-empty">Loading preview…</div>
        )}
      </div>

      {/* Mobile: iframe doesn't render in mobile browsers — show HTML preview instead */}
      <div className="preview-mobile-msg">
        <div className="preview-mobile-paper">
          <ResumeHtmlPreview resume={resume} settings={settings} />
        </div>
      </div>
    </div>
  );
}
