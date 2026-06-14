// Register the embedded Carlito font (free, metric-identical to Calibri).
// TTFs live in /public/fonts and are served from the app root.

import { Font } from '@react-pdf/renderer';

let registered = false;

export function registerFonts() {
  if (registered) return;
  registered = true;

  const base = import.meta.env.BASE_URL || '/';
  Font.register({
    family: 'Carlito',
    fonts: [
      { src: `${base}fonts/Carlito-Regular.ttf`, fontWeight: 'normal' },
      { src: `${base}fonts/Carlito-Bold.ttf`, fontWeight: 'bold' },
      { src: `${base}fonts/Carlito-Italic.ttf`, fontStyle: 'italic' },
      { src: `${base}fonts/Carlito-BoldItalic.ttf`, fontWeight: 'bold', fontStyle: 'italic' },
    ],
  });

  // Don't hyphenate words across line breaks (resumes read better whole).
  Font.registerHyphenationCallback((word) => [word]);
}
