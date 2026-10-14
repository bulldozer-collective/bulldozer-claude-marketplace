---
name: |-
  pdf-report
description: |-
  Generate a professionally styled, print-ready PDF report from any content — competitive analysis, client audit, market research, GTM plan. Triggers on 'generate PDF,' 'export as PDF,' 'create a PDF report,' 'client deliverable PDF,' or 'format this as a report.' For Excel output, see excel-dashboard. For Word documents, see word-document. For slide decks, see slides-deck.
when-to-use: |-
  Generate a professionally styled, print-ready PDF report from any content — competitive analysis, client audit, market research, GTM plan. Triggers on 'generate PDF,' 'export as PDF,' 'create a PDF report,' 'client deliverable PDF,' or 'format this as a report.' For Excel output, see excel-dashboard. For Word documents, see word-document. For slide decks, see slides-deck.
argument-hint: |-
  Client competitive analysis for Acme — 8 competitors, need PDF with executive summary, positioning map, and recommendations
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
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

This skill's job stops at the two files above — it does not publish or share them. If the
client needs a link instead of an attachment, that's a separate ask handled by
`bulldozer-hosting`, not a step to add here by default: turning a local file into a shared or
public URL is a write action with its own consequences (a link that stays live, a share that
has to be revoked later), and it deserves its own explicit go-ahead rather than riding along
silently on a "generate the PDF" request.

---

## Approach: HTML → PDF via WeasyPrint

Always use WeasyPrint. It renders CSS properly — including Flexbox and most of Grid — follows the CSS Paged Media spec for running headers/footers and page breaks, and auto-generates a navigable PDF outline from every `h1`–`h6` with no bookmark markup needed. Do not use pdfkit (poor CSS support) or reportlab (requires reimplementing layout from scratch).

### Install

```bash
pip install weasyprint
```

Requires Python 3.10+. WeasyPrint also needs Pango, cairo and GDK-PixBuf — system libraries, not pip packages. If `pip install` succeeds but `import weasyprint` fails, that's almost always the cause: install them through the OS package manager rather than retrying pip.

**Do not run this on a pinned WeasyPrint older than 70.0.** Version 70.0 (2026-09-08, still the latest release as of this writing) is a security release for a high-severity SSRF advisory (CVE-2026-55073 / GHSA-r543-q48m-4c9j) that hits exactly this skill's normal path — a report that links an externally-hosted client logo or screenshot instead of embedding it as base64, letting WeasyPrint's URL fetcher resolve an image or stylesheet URL that ultimately comes from the client's own content. A bare `pip install weasyprint` as shown above already resolves to 70.0 or later, so this only bites a project that pinned an older version in a requirements file before 2026-09-08 — bump it before generating a report that links any client-supplied image URL.

Version 70.0's own changelog also adds a deprecation warning for font subsetting: it now warns at render time when it falls back to `fontTools` instead of `HarfBuzz-Subset`, which has been the default subsetting method since 63.0 (2024-10-29). A render still succeeds either way today — this is a deprecation notice from the library itself, not a bug — but a future WeasyPrint release can drop the `fontTools` fallback entirely. Confirm `HarfBuzz-Subset` (>= 4.1.0) is actually installed in whatever environment renders the final client PDF, not just in a local sandbox used to check the template — a silent switch back to the unsupported path is exactly the kind of thing that only shows up the day a client deliverable needs regenerating and the warning has become a hard failure.

### Convert

```bash
weasyprint report-output.html report-output.pdf
```

For an archival-grade file, call the API with a variant instead — the keyword is `pdf_variant`, not `variant`, and the value takes a slash (`pdf/a-3b`), not a hyphen: `HTML('report.html').write_pdf('report.pdf', pdf_variant='pdf/a-3b')`. Both wrong forms fail differently, confirmed by generating each: `variant=` is silently swallowed — no error, no PDF/A, just an ordinary PDF that looks like it worked — while `pdf_variant='pdf-a-3b'` (hyphen) raises `KeyError` immediately. A tagged, accessible PDF (`pdf_variant='pdf/ua-1'`) is also available; as of WeasyPrint 70.0 it's no longer flagged as experimental anywhere in the library's own source, and a real render of this skill's own document shapes (a heading, a table with `<thead>`, an image with `alt`) produces a correct structure tree (`/Table` → `/THead`/`/TBody` → `/TR` → `/TH`/`/TD`). It still silently drops the PDF's `/Lang` entry if `<html>` has no `lang` attribute — the skeleton below already sets `lang="en"`, don't remove it — and full compliance still depends on the content itself (real `alt` text, a sane heading order), so run the output through a validator (e.g. veraPDF) before promising PDF/UA compliance to a client.

If WeasyPrint is unavailable (e.g., restricted environment), fall back to this browser-print approach and tell the user to open the HTML and print to PDF with Cmd+P → Save as PDF.

---

## Document Structure

Every PDF report must have these sections in order:

| Section | Required | Notes |
|---------|----------|-------|
| Cover page | Yes | Title, client name, date, confidentiality notice |
| Table of contents | If > 4 sections | WeasyPrint already builds a navigable PDF outline from every heading — no markup needed. Add a printed TOC page only if the client expects one on paper (see `.toc` in the CSS template, which lists real page numbers via `target-counter()`) |
| Executive summary | Yes | 3–5 bullets, key findings and recommendation |
| Main content | Yes | Organized sections matching the TOC |
| Appendix | Optional | Raw data, methodology, sources |

---

## CSS Template (copy-paste base)

The copy-paste base stylesheet for the report (palette in `:root`, cover, sections, tables, callouts, page rules) is in `references/css-template.md`; read it and paste it into the `<style>` block of the HTML source, then apply the "Judgment Calls" below to it.

---

## HTML Skeleton

The HTML skeleton (cover, optional table of contents, executive summary, main sections, confidentiality footer) is in `references/html-skeleton.md`; read it and fill in the placeholders to produce `report-{slug}.html`.

---

## Page Break Rules

- `page-break-before: always` on every `.section`
- `page-break-inside: avoid` on tables, callouts, `.exec-summary`
- Never split a heading from its first paragraph — add `page-break-after: avoid` to h1, h2 if needed
- Cover page always ends with `page-break-after: always`
- `.toc` (if you include one) ends with `page-break-after: always`, same as the cover

---

## Judgment Calls a Senior Operator Makes

Generic HTML-to-PDF advice stops at "add page breaks." A few decisions matter more than the
mechanics above, and each has a real threshold — not a vibe — for when you'd do it differently.

- **Widows and orphans, not just `page-break-inside`.** `page-break-inside: avoid` keeps a
  table or callout from splitting, but ordinary body text still breaks wherever the page ends
  — a single stranded line at the top or bottom of a page reads as sloppy typesetting, the kind
  a client's ops lead will notice even if they can't name it. WeasyPrint has supported the CSS
  `orphans` and `widows` properties since its earliest releases (confirmed in its own
  changelog and current API reference). Add `orphans: 3; widows: 3;` to `body` in the CSS
  template above. Don't bother adding it to `.cover`, `.exec-summary`, or callouts — those
  already can't split at all (`page-break-inside: avoid` / `page-break-after: always`), so
  widow/orphan control has nothing to do there.
- **A table that must span pages doesn't need a hand-written repeated header.**
  `page-break-inside: avoid` on `table` only makes sense for a table short enough to plausibly
  fit on one page — a genuinely long one (a full competitor matrix, a raw-data appendix) still
  has to break, and WeasyPrint re-lays-out the `<thead>` row at the top of every continuation
  page on its own; it's native table layout, not something to script or fake with a repeated
  `<tr>`. What it will *not* do is stop an individual row from splitting mid-row. So: keep
  `page-break-inside: avoid` on tables you expect to fit in roughly a page; for a table you
  already know will run several pages, drop that rule there — it does nothing useful on a table
  that large and just makes the whole block fight the layout — and trust the automatic header
  repeat instead of re-deriving it by hand.
- **Refuse a live `@import` for a client-final PDF.** The CSS template's
  `@import url('https://fonts.googleapis.com/...')` makes every render of a "final" deliverable
  depend on live network access to Google's servers at the exact moment the PDF is generated —
  and if that access is blocked (not unusual in a locked-down execution environment), the
  report falls back to the CSS `sans-serif`/`monospace` fallback with no error at all, silently
  shipping a client-facing document in the wrong typeface. WeasyPrint supports `@font-face`
  with a local file `src` for exactly this reason. Two things trip people up when they switch
  to it: you must pass a `weasyprint.text.fonts.FontConfiguration()` instance to `write_pdf()`
  for a custom `@font-face` to take effect at all — omit it and the font fails exactly as
  silently as a blocked `@import` — and a base64 `data:` URI is not a safe substitute for a
  real file path (WeasyPrint has an open issue specifically on `@font-face` + base64 fonts).
  The `@import` in the template above is still the right default while a report is a draft
  being iterated on — it's the fastest way to see changes. The moment a report is about to land
  in a client's inbox as the final file, swap it for a vendored font file plus
  `FontConfiguration()`, not before.
- **Four CSS properties fail silently instead of erroring — know which before reaching for
  them in custom content.** `width: fit-content`, `width: max-content`, and `position: sticky`
  are all accepted by the parser but never actually applied: the element just takes its
  container's full width instead of sizing to content, and nothing ever sticks to a fixed
  position on the printed page. Verified on a real render: a block set to `width: fit-content`
  inside a 400px container came out at 390px wide, not the ~172px its content called for. Give
  the element an explicit width instead, or `display: inline-block` where that alone is enough.
  `aspect-ratio` breaks a different way — it's the *height* that never gets computed from the
  ratio, not the width. An empty block with `aspect-ratio` set keeps a height of 0; an `<img>`
  carrying the same declaration falls back entirely to the file's own intrinsic ratio and
  ignores the CSS value. An explicit width does nothing for this one — compute the height
  yourself from the ratio you want and set it directly, rather than reaching for the same fix
  that works for the other three.
- **This palette is an on-screen deliverable, not a print-shop file — and that's a deliberate,
  not a missing, choice.** WeasyPrint can produce real CMYK output with an embedded ICC profile
  (`device-cmyk()` colors, an `@color-profile` rule, and a PDF/X `variant` at write time) — this
  isn't a gap in the library. But it's opt-in, and the `:root` palette above is plain RGB hex,
  which is exactly right for a report that will be read on a screen or run through an office
  printer. Don't reach for the CMYK path, and don't describe the file to a client as
  "print-ready" for an offset run, unless someone has actually asked for a professional print
  job — that's a distinct decision (new custom properties, a real `.icc` profile file, a
  different `write_pdf` call), not a setting you flip for extra polish.
- **A long report needs rhythm, not just repeated `.section` blocks.** Ten sections that are
  each an `<h1>`, two paragraphs and a table train the reader to stop actually looking by the
  third one. Break the pattern on purpose the same way the executive summary already breaks it
  at the front — a callout that pulls out one number, a divider page between parts of a longer
  report. There's no page count that triggers this: the test is whether page 6 looks different
  from page 5 in peripheral vision, not whether some length threshold has been crossed.
- **A printed TOC can be worth adding even when nobody asked for one.** The rule in
  `Document Structure` above ("if > 4 sections") is about a client's explicit expectation. A
  separate reason to add the page anyway: once a report is long enough that someone is likely
  to print it — double-digit page counts, typically — a reader holding paper has no PDF
  bookmarks panel to fall back on. At that point the printed TOC is doing real navigation work,
  not just performing thoroughness.
- **Never use an emoji as a section or bullet marker.** It reads as decoration, not structure,
  and it doesn't survive a black-and-white print run the way the `.callout-label` convention
  above (a short uppercase text label) does. If a marker is needed, it's a text label, a
  numbered step, or the callout system already in this template — never an emoji standing in
  for a heading.

---

## Quality Checklist

Before handing off, verify:

- [ ] Cover has correct client name, date, and confidentiality notice
- [ ] Executive summary is 3–5 bullets, not paragraphs
- [ ] All tables have a header row and fit within page margins
- [ ] No section breaks mid-sentence or mid-table
- [ ] File is < 5MB (embed images as base64 only if < 200KB each, otherwise link externally — see the version note under Install before linking a client-supplied image URL)
- [ ] PDF opens without errors in both Preview and Adobe Reader
- [ ] Every text color against its background hits at least 4.5:1 — use the roles in `:root`, don't hand-pick a new grey (check with any contrast tool if you do)
- [ ] Rendered PDF actually uses Inter/JetBrains Mono, not a silent fallback — the `@import` needs outbound network access to Google Fonts; if that's blocked in your environment, the CSS `sans-serif`/`monospace` fallback still renders but won't match the brief
- [ ] If this deliverable needs to be accessible, images carry real `alt` text, `<html>` still has its `lang` attribute, and the file was generated with `pdf_variant='pdf/ua-1'` (not `variant=`, which is silently ignored) — plain output does not preserve tags.