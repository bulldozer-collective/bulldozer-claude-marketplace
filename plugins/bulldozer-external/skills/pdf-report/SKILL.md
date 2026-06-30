---
name: |
  pdf-report
description: |
  Generate a professionally styled, print-ready PDF report from any content — competitive analysis, client audit, market research, GTM plan. Triggers on 'generate PDF,' 'export as PDF,' 'create a PDF report,' 'client deliverable PDF,' or 'format this as a report.' For Excel output, see excel-dashboard. For Word documents, see word-document. For slide decks, see slides-deck.
when-to-use: |
  Generate a professionally styled, print-ready PDF report from any content — competitive analysis, client audit, market research, GTM plan. Triggers on 'generate PDF,' 'export as PDF,' 'create a PDF report,' 'client deliverable PDF,' or 'format this as a report.' For Excel output, see excel-dashboard. For Word documents, see word-document. For slide decks, see slides-deck.
argument-hint: |
  Client competitive analysis for Acme — 8 competitors, need PDF with executive summary, positioning map, and recommendations
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# PDF Report

> This is a Bulldozer skill. Produce a clean, professional deliverable the client can open immediately.

You are a Bulldozer operator generating a client-ready PDF. The output should look like it came from a senior consultant — not a ChatGPT printout.

## Input

`$ARGUMENTS` — report type, content or source data, branding requirements, and audience. If not provided, read available context files. Only ask if you cannot determine the subject and content of the report.

## Output

1. A `report-{slug}.html` source file (the content + styling)
2. A `report-{slug}.pdf` generated via the conversion command below
3. A one-line summary of what was generated

**Produce output on first invocation. Do not ask for confirmation before generating.**

---

## Approach: HTML → PDF via WeasyPrint

Always use WeasyPrint. It renders CSS properly, handles page breaks, headers, and footers. Do not use pdfkit (poor CSS support) or reportlab (requires reimplementing layout from scratch).

### Install

```bash
pip install weasyprint
```

### Convert

```bash
weasyprint report-output.html report-output.pdf
```

If WeasyPrint is unavailable (e.g., restricted environment), fall back to this browser-print approach and tell the user to open the HTML and print to PDF with Cmd+P → Save as PDF.

---

## Document Structure

Every PDF report must have these sections in order:

| Section | Required | Notes |
|---------|----------|-------|
| Cover page | Yes | Title, client name, date, confidentiality notice |
| Table of contents | If > 4 sections | Auto-generated via anchor links |
| Executive summary | Yes | 3–5 bullets, key findings and recommendation |
| Main content | Yes | Organized sections matching the TOC |
| Appendix | Optional | Raw data, methodology, sources |

---

## CSS Template (copy-paste base)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

@page {
  size: A4;
  margin: 20mm 18mm 22mm 18mm;
  @top-right { content: string(section-title); font-size: 8pt; color: #94a3b8; }
  @bottom-center { content: counter(page) " / " counter(pages); font-size: 8pt; color: #94a3b8; }
}

@page :first { @top-right { content: none; } @bottom-center { content: none; } }

body {
  font-family: 'Inter', sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #1e293b;
  background: white;
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
.cover-tag { font-size: 9pt; letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1; margin-bottom: 16px; }
.cover-title { font-size: 28pt; font-weight: 700; color: #0f172a; line-height: 1.2; margin-bottom: 12px; }
.cover-subtitle { font-size: 13pt; color: #475569; margin-bottom: 32px; }
.cover-meta { font-size: 9pt; color: #94a3b8; }
.cover-bar { width: 48px; height: 4px; background: #6366f1; margin: 24px 0; }

/* Section pages */
h1 { font-size: 18pt; font-weight: 700; color: #0f172a; margin: 0 0 8px; string-set: section-title content(); }
h2 { font-size: 13pt; font-weight: 600; color: #1e293b; margin: 24px 0 8px; }
h3 { font-size: 11pt; font-weight: 600; color: #334155; margin: 16px 0 6px; }

p { margin-bottom: 10px; }
ul, ol { padding-left: 20px; margin-bottom: 10px; }
li { margin-bottom: 4px; }

/* Section break */
.section { page-break-before: always; padding-top: 8mm; }
.section:first-of-type { page-break-before: avoid; }

/* Executive summary */
.exec-summary {
  background: #f8fafc;
  border-left: 4px solid #6366f1;
  padding: 16px 20px;
  margin: 16px 0 24px;
  page-break-inside: avoid;
}
.exec-summary li { margin-bottom: 6px; }

/* Tables */
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; page-break-inside: avoid; }
thead { background: #0f172a; color: white; }
thead th { padding: 8px 10px; text-align: left; font-weight: 600; font-size: 9pt; letter-spacing: 0.04em; }
tbody tr:nth-child(even) { background: #f8fafc; }
tbody td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; }

/* Callout blocks */
.callout { border-radius: 6px; padding: 12px 16px; margin: 12px 0; page-break-inside: avoid; }
.callout-info { background: #eff6ff; border-left: 3px solid #3b82f6; }
.callout-warn { background: #fffbeb; border-left: 3px solid #f59e0b; }
.callout-key { background: #f0fdf4; border-left: 3px solid #22c55e; }
.callout-label { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }

/* Code / mono */
code { font-family: 'JetBrains Mono', monospace; font-size: 9pt; background: #f1f5f9; padding: 1px 5px; border-radius: 3px; }
pre { background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 6px; font-size: 9pt; overflow-x: auto; page-break-inside: avoid; margin: 12px 0; }
pre code { background: none; padding: 0; color: inherit; }

/* Confidentiality footer */
.confidential { font-size: 8pt; color: #94a3b8; margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
```

---

## HTML Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{REPORT_TITLE}}</title>
  <style>/* paste CSS template above */</style>
</head>
<body>

  <!-- COVER -->
  <div class="cover">
    <div class="cover-tag">Prepared for {{CLIENT_NAME}}</div>
    <div class="cover-bar"></div>
    <div class="cover-title">{{REPORT_TITLE}}</div>
    <div class="cover-subtitle">{{REPORT_SUBTITLE}}</div>
    <div class="cover-meta">{{DATE}} · Confidential</div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div class="section">
    <h1>Executive Summary</h1>
    <ul class="exec-summary">
      <li>{{KEY_FINDING_1}}</li>
      <li>{{KEY_FINDING_2}}</li>
      <li>{{KEY_FINDING_3}}</li>
    </ul>
    <p>{{2-3 sentence context}}</p>
  </div>

  <!-- MAIN SECTIONS -->
  <div class="section">
    <h1>{{SECTION_TITLE}}</h1>
    <!-- content, tables, callouts -->
  </div>

  <div class="confidential">
    Confidential — prepared exclusively for {{CLIENT_NAME}}. Do not distribute.
  </div>

</body>
</html>
```

---

## Page Break Rules

- `page-break-before: always` on every `.section`
- `page-break-inside: avoid` on tables, callouts, `.exec-summary`
- Never split a heading from its first paragraph — add `page-break-after: avoid` to h1, h2 if needed
- Cover page always ends with `page-break-after: always`

---

## Quality Checklist

Before handing off, verify:

- [ ] Cover has correct client name, date, and confidentiality notice
- [ ] Executive summary is 3–5 bullets, not paragraphs
- [ ] All tables have a header row and fit within page margins
- [ ] No section breaks mid-sentence or mid-table
- [ ] File is < 5MB (embed images as base64 only if < 200KB each, otherwise link externally)
- [ ] PDF opens without errors in both Preview and Adobe Reader