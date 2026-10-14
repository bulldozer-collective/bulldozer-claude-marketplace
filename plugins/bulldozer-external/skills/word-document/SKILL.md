---
name: |-
  word-document
description: |-
  Generate a formatted Word (.docx) document — proposals, statements of work, contracts, client reports, or internal documentation. Triggers on 'create a Word doc,' 'generate a .docx,' 'write a proposal,' 'draft an SOW,' 'make a contract,' or 'client documentation.' For PDF output, see pdf-report. For presentations, see slides-deck.
when-to-use: |-
  Generate a formatted Word (.docx) document — proposals, statements of work, contracts, client reports, or internal documentation. Triggers on 'create a Word doc,' 'generate a .docx,' 'write a proposal,' 'draft an SOW,' 'make a contract,' or 'client documentation.' For PDF output, see pdf-report. For presentations, see slides-deck.
argument-hint: |-
  Statement of work for a 3-month GTM engagement with Acme — deliverables, timeline, pricing, payment terms
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Word Document

> This is a Bulldozer skill. Generate a clean, properly styled .docx that the recipient can open in Word or Google Docs and edit without reformatting everything.

You are a Bulldozer operator producing a professional Word document. Use paragraph styles, not manual formatting. Keep the document editable by the client.

## Input

`$ARGUMENTS` — document type, content or outline, audience, and any specific sections required. If not provided, read available context files first. Only ask if document type and subject are completely absent.

## Output

1. A Python script `generate-{slug}.py` that produces `{slug}.docx`
2. The `.docx` file (run the script immediately)
3. A one-line summary of sections and document type

**Generate on first invocation. Do not ask before running.**

---

## Library: python-docx

```bash
python3 -c "import docx" 2>/dev/null || pip install python-docx
```

Check first, install only if missing. A runtime that already has python-docx pre-installed (or has no outbound network at all) shouldn't pay a network round trip on every single invocation — and in a fully offline runtime, the check-first form is the only one that doesn't fail before the script even starts.

python-docx handles paragraph styles, tables, headers/footers, sections, and inline formatting. It produces `.docx` compatible with Word 2010+ and Google Docs. Current stable release is still 1.2.0 (June 2025) — reconfirmed on 2026-10-12 directly against the PyPI release record, no version bump since it was first checked for this skill; nothing in this skill depends on anything past 1.2.0. The project itself is slow but not abandoned: 380 open issues and 159 open pull requests on the upstream repo as of 2026-10-12, same dormant-but-standard profile already tracked for python-pptx on the sibling `slides-deck` skill — not a reason to look elsewhere. The full template was re-run against this same version on 2026-10-06 and still produces a `.docx` that reopens cleanly, with the language override, the repeating table headers, and the table caption all present in the real output XML — not just in the script that's supposed to write them. `add_image` specifically was re-verified on 2026-10-12 with an actual embedded image (the demo template itself has none): the produced `document.xml` carries the real alt text in `descr="…"`, confirming the helper below, not just the mechanism it's based on.

**What python-docx does *not* expose** (confirmed by writing and inspecting real output, not by reading the docs):

- Repeating a table header row on every page (`w:tblHeader`) and preventing a row from splitting across a page break (`w:cantSplit`) have no high-level API — `TableRow` only exposes `cells`, `height`, and `height_rule`. Both require writing the raw OOXML element into the row's `trPr` via `OxmlElement`, same low-level technique the template uses below for header-cell shading. If a document has any table that can plausibly run past one page (a deliverables list, a timeline, a pricing table with many lines), skip this and the header repeats nowhere — the reader loses the column labels on page 2.
- Image alt text. `InlineShape` has no `.alt_text` or `.descr` property — confirmed by inspecting its full public API. The alt text lives in `<wp:docPr descr="…">`, one level below what python-docx exposes; reachable only via `picture._inline.docPr.set("descr", "…")`. Skip this on any image that carries information (a chart, a screenshot, a diagram) and the document fails WCAG 1.1.1 for a sighted-only reason no proofreading catches — a screen reader announces nothing where the image is.
- Table alt text (Title/Description). Same gap as the image above, one level up: `Table` has no `.alt_text`, `.title`, or `.description` property at all — confirmed by inspecting its full public API (`add_column`, `add_row`, `alignment`, `autofit`, `cell`, `columns`, `part`, `row_cells`, `rows`, `style`, `table`, `table_direction`, nothing else). Word exposes this under Table Properties → **Alt Text** tab, one field for Title, one for Description; the two map directly to the raw OOXML elements `w:tblCaption` and `w:tblDescription`, both children of `w:tblPr` — confirmed by writing both with `OxmlElement`, saving, unzipping, and reading them back from `word/document.xml`. The underlying python-docx feature request (`python-openxml/python-docx` issue #921) has sat open for years, same story as the TOC. Skip this on a deliverables or pricing table and a screen reader announces only "table" before reading raw cells — no sense of what the table is *for* until the reader has already parsed every cell.
- The document's language, for pronunciation. `doc.core_properties.language` looks like the fix — it isn't one. Confirmed by execution: setting it to `"fr-FR"`, saving, and unzipping only ever changes `<dc:language>` in `docProps/core.xml`, a Dublin Core metadata field nothing reads to choose a voice. What a screen reader actually uses is `word/styles.xml`'s `w:docDefaults/w:rPrDefault/w:rPr/w:lang`, which stayed hardcoded at `en-US` in the same test regardless of what `core_properties.language` said. No public API reaches it — not on `Document`, not on `Styles`, not even a `.language_id` on `Font` (`Run.font`'s full public API has no such attribute in 1.2.0) — only walking `doc.styles.element` down to that `w:lang` element and setting it does. Skip this on a French (or any non-English) document and a screen reader reads every sentence in an English voice, wrong pronunciation throughout, not a missing label on one paragraph — WCAG SC 3.1.1 Language of Page (Level A) exists for exactly this failure mode.
- A table of contents. Not a partial gap — no support at all (open since python-docx issue #723, still unresolved as of this writing — reconfirmed against the current release, 1.2.0, still the latest as of this writing). A TOC is a raw `SIMPLE`/`fldChar` field sequence, and even written correctly it opens **empty**: Word only populates it once someone updates fields (`Ctrl+A` then `F9`, or right-click → Update Field). A generated document is never opened by the tool that made it — so a TOC nobody is told to update ships broken by default. See *Table of Contents* below for when this is worth the caveat and when it isn't.
- Page numbers in a footer. No `add_page_number` method on `Header`/`Footer` — only `add_paragraph`/`add_table`, same gap as the table above. The mechanism is the *same* raw field-code trick as the TOC (`w:fldChar` begin/`w:instrText`/`w:fldChar` end), but a `PAGE` field is nothing like a TOC field once opened: Word recalculates it on every open, no manual update required — confirmed by writing, saving, unzipping, and reading back a produced `.docx` with `PAGE`/`NUMPAGES` fields in the footer. Unlike the TOC, this one carries no caveat and no reason to make it opt-in — every document longer than a cover page should have one.

If `pip install` fails because this environment has no outbound network access, don't retry silently or fall back to hand-built XML — say so and ask whether python-docx is already available in the runtime.

---

## Document Types and Standard Structure

### Proposal / SOW

| Section | Content |
|---------|---------|
| Cover | Client name, project title, date, prepared by |
| Executive Summary | Problem, proposed solution, expected outcome (max 1 page) |
| Scope of Work | Deliverables list with acceptance criteria |
| Timeline | Phases with start/end dates and milestones |
| Pricing | Fee table, payment schedule, what's excluded |
| Terms | Payment terms, IP ownership, confidentiality, termination |
| Signatures | Client and provider signature blocks |

### Client Report

| Section | Content |
|---------|---------|
| Cover | Report title, client, date, period covered |
| Summary | 3–5 bullet findings |
| Findings | Numbered sections with data, analysis, charts |
| Recommendations | Prioritized action items |
| Next Steps | Who does what by when |

### Internal Documentation

Cover + Sections + Appendix. No cover page needed for internal docs.

---

## Python Template

The full python-docx template (document metadata, margins, style and table helpers, footer page numbers, signature block, image and accessibility helpers, and the document body skeleton) is in `references/python-template.md`. Read it in full before writing any `generate-{slug}.py`, and start every script from it.

---

## Table of Contents — only when asked, and only with a caveat

Default to **no TOC**. python-docx has no native support for one (confirmed: no `add_toc`
method anywhere on `Document`, and the open python-docx issue tracking this request has
sat unresolved for years) — the only way to add one is a raw field-code sequence, and even
built correctly it renders **empty** until a human opens the file in Word and updates fields
(`Ctrl+A` → `F9`, or right-click the field → Update Field). A generated document is handed
straight to the recipient, never opened by the tool that made it — so an unrequested TOC
ships as a blank box with the word "Contents" above it, which reads as more broken than no
TOC at all.

If the client explicitly asks for one — a long report with several numbered findings, a
multi-phase SOW someone will navigate rather than read start to end — add the field code and
say so out loud in the summary: *"Contents table added — right-click it and choose Update
Field once the document is open, or Word will show it empty."* Never claim it will "just
work" on open. A 2–3 section brief doesn't need one regardless of length; a TOC exists to let
someone skip around, not to look complete.

## Fonts — nothing you specify is guaranteed to render

`run.font.name` sets a font **name string**, not an embedded font — python-docx has no font
embedding API, and even Word's own embedding feature (File → Options → Save → Embed fonts) is
never triggered by anything this skill does. Every font named in this template (`Calibri`,
Word's own default) is safe because it ships with Word and renders identically in Google Docs'
web view. Naming an actual brand typeface here doesn't fail loudly — it fails silently: the
reader's machine substitutes its own fallback, the document opens looking like nothing was
designed at all, and there's no error to catch it. If a brand font is genuinely required,
that's a PDF job (`pdf-report`, which can embed via WeasyPrint) — not this skill. Don't try to
route around it with a font name and a hope.

---

## Style Rules

The detailed style rules are in `references/style-and-quality.md` (section "Style Rules"). Read them before building the document.

---

## Quality Checklist

The pre-delivery checklist is in `references/style-and-quality.md` (section "Quality Checklist"). Run through it before calling the document done.

---

## Common Mistakes

The list of known pitfalls (colors, language, tables, accessibility) is in `references/style-and-quality.md` (section "Common Mistakes"). Read it when a document looks wrong or before delivering.

---

## Rules

- **One document, one Python script.** Regenerate from the script on every revision — never
  hand-edit the `.docx` and lose the ability to reproduce it.
- **Every color used on text passes 4.5:1 against its background.** Check the actual pair used,
  not just the darkest color on the page — a light card or shaded cell changes the background.
- **A table with more than a handful of rows repeats its header row.** If you can't tell whether
  a table will span a page, treat it as if it will.
- **Every table a client is meant to read gets a Title, not just its images.** The Title is what
  a screen reader announces before the cells — treat a table without one the same as an image
  without alt text, not as an optional extra.
- **Run the script and open the file before calling the document done.** A script that completes
  without a Python traceback is not the same as a `.docx` that opens cleanly.
- **Don't invent a python-docx API.** `TableRow` has no `.tblHeader` or `.cant_split` property,
  `InlineShape` has no `.alt_text`, `Table` has no `.alt_text`/`.title`, `Document` has no
  `.add_toc`, `Font` has no `.language_id` — when the library has no high-level method for
  something, it's raw OXML (`OxmlElement`, `docPr.set(...)`) or it doesn't happen. Check the
  object's real public API before promising a feature it doesn't have.
- **A property that writes metadata isn't the same as a property that changes behavior.**
  `core_properties.language` is real and does something — it just doesn't do the thing its name
  suggests. Verify what a setter actually touches (unzip the output, don't trust the name) before
  relying on it for anything beyond the metadata field itself.
- **Word is for what will be edited; PDF is for what won't.** The tell isn't document type, it's
  what happens next: a proposal the client will redline, a contract they'll counter-sign in, an
  internal doc a teammate will extend — that's this skill. A report meant to be read once and
  not touched, where layout has to survive exactly as designed — that's `pdf-report`. Building a
  Word doc and then fighting to make it *look* uneditable (locked styles, a hand-rolled TOC, a
  font nobody has) is a sign the output format was the wrong call, not that the document needs
  more polish.
- **A table of contents is opt-in, not a length threshold.** Default to none; add one only when
  asked, and only with the caveat that it opens empty until updated once in Word.
- **A footer page number is on by default, not opt-in.** It uses the identical raw field-code
  mechanism as the TOC above, but a `PAGE`/`NUMPAGES` field recalculates itself every time Word
  opens the file — there's no empty-on-open failure mode to gate behind a caveat, so don't treat
  it like the TOC.