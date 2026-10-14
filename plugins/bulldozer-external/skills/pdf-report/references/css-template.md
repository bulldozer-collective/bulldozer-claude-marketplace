# CSS Template (copy-paste base)

## Contents

- CSS Template

## CSS Template

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  /* one role per color — swap these, not the rules below, to reskin the report */
  --paper: #ffffff;
  --ink: #0f172a;      /* strongest heading color, dark table header fill */
  --body: #1e293b;     /* base text */
  --h3: #334155;
  --muted: #475569;    /* cover subtitle — still text, needs real contrast */
  --subtle: #64748b;   /* secondary text: page numbers, dates, footer — see note below */
  --line: #e2e8f0;     /* rules and borders */
  --surface: #f8fafc;  /* light fill backgrounds */
  --accent: #4f46e5;   /* accent used AS TEXT (cover label) */
  --accent-soft: #6366f1; /* same accent, decorative-only use (bars, left-borders) — never on text */
  --info: #3b82f6;
  --warn: #f59e0b;
  --key: #22c55e;
}
/* --subtle replaces the slate-400 (#94a3b8) this template used everywhere for small text:
   #94a3b8 on white is ~2.8:1, well under the WCAG AA 4.5:1 floor for body-size text.
   --accent (#4f46e5) replaces the original indigo-500 (#6366f1, ~4.47:1) for the same reason —
   keep --accent-soft for anything that isn't a text color. */

* { box-sizing: border-box; margin: 0; padding: 0; }

@page {
  size: A4;
  margin: 20mm 18mm 22mm 18mm;
  @top-right { content: string(section-title); font-size: 8pt; color: var(--subtle); }
  @bottom-center { content: counter(page) " / " counter(pages); font-size: 8pt; color: var(--subtle); }
}

@page :first { @top-right { content: none; } @bottom-center { content: none; } }

body {
  font-family: 'Inter', sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: var(--body);
  background-color: var(--paper);
  orphans: 3;  /* keep at least 3 lines of a paragraph together at a page break, not just tables/callouts */
  widows: 3;
}

/* Cover */
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 40mm 0 20mm;
  page-break-after: always;
}
.cover-tag { font-size: 9pt; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
.cover-title { font-size: 28pt; font-weight: 700; color: var(--ink); line-height: 1.2; margin-bottom: 12px; }
.cover-subtitle { font-size: 13pt; color: var(--muted); margin-bottom: 32px; }
.cover-meta { font-size: 9pt; color: var(--subtle); }
.cover-bar { width: 48px; height: 4px; background-color: var(--accent-soft); margin: 24px 0; }

/* Table of contents — optional, only if the client expects a printed one (see Document Structure) */
.toc { page-break-after: always; }
.toc-list { list-style: none; }
.toc-entry {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px dotted var(--line);
  font-size: 10.5pt;
  color: var(--body);
  text-decoration: none;
}
.toc-entry::after { content: target-counter(attr(href), page); color: var(--subtle); }

/* Section pages */
h1 { font-size: 18pt; font-weight: 700; color: var(--ink); margin: 0 0 8px; string-set: section-title content(); }
h2 { font-size: 13pt; font-weight: 600; color: var(--body); margin: 24px 0 8px; }
h3 { font-size: 11pt; font-weight: 600; color: var(--h3); margin: 16px 0 6px; }

p { margin-bottom: 10px; }
ul, ol { padding-left: 20px; margin-bottom: 10px; }
li { margin-bottom: 4px; }

/* Section break */
.section { page-break-before: always; padding-top: 8mm; }
.section:first-of-type { page-break-before: avoid; }

/* Executive summary */
.exec-summary {
  background-color: var(--surface);
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: var(--accent-soft);
  padding: 16px 20px;
  margin: 16px 0 24px;
  page-break-inside: avoid;
}
.exec-summary li { margin-bottom: 6px; }

/* Tables */
/* page-break-inside:avoid only makes sense for a table you expect to fit in about a page —
   see "Judgment Calls" below for the multi-page table case, where WeasyPrint repeats <thead>
   on its own and this rule should be dropped instead of fought. */
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; page-break-inside: avoid; }
thead { background-color: var(--ink); color: var(--paper); }
thead th { padding: 8px 10px; text-align: left; font-weight: 600; font-size: 9pt; letter-spacing: 0.04em; }
tbody tr:nth-child(even) { background-color: var(--surface); }
tbody td { padding: 7px 10px; border-bottom: 1px solid var(--line); }

/* Callout blocks */
.callout { border-radius: 6px; padding: 12px 16px; margin: 12px 0; page-break-inside: avoid; }
.callout-info { background-color: #eff6ff; border-left-width: 3px; border-left-style: solid; border-left-color: var(--info); }
.callout-warn { background-color: #fffbeb; border-left-width: 3px; border-left-style: solid; border-left-color: var(--warn); }
.callout-key { background-color: #f0fdf4; border-left-width: 3px; border-left-style: solid; border-left-color: var(--key); }
.callout-label { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }

/* Code / mono */
code { font-family: 'JetBrains Mono', monospace; font-size: 9pt; background-color: #f1f5f9; padding: 1px 5px; border-radius: 3px; }
pre { background-color: var(--ink); color: var(--line); padding: 14px 16px; border-radius: 6px; font-size: 9pt; overflow-x: auto; page-break-inside: avoid; margin: 12px 0; }
pre code { background-color: transparent; padding: 0; color: inherit; }

/* Confidentiality footer */
.confidential { font-size: 8pt; color: var(--subtle); margin-top: 32px; padding-top: 12px; border-top: 1px solid var(--line); }
```

A CSS variable used to evaluate unreliably inside a shorthand property in WeasyPrint — verified fixed as of WeasyPrint 70.0 by a direct render test: `border: 2px solid var(--x)` and `background: var(--x)` now produce pixel-identical output to their `-width`/`-style`/`-color` and `background-color` longhand equivalents. The template above still splits every `border` into `-width` / `-style` / `-color` and uses `background-color` rather than the `background` shorthand — that split is no longer required for correctness on a current WeasyPrint, but it's a harmless habit and worth keeping if a report might ever render on an older pinned version. No need to reproduce it for something new you add to the template.
