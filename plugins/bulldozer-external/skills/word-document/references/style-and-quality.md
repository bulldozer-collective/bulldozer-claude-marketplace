# Style Rules, Quality Checklist and Common Mistakes

## Style Rules

- **Always use paragraph styles** — never manually bold/size every paragraph; define helpers at top and reuse
- **Heading 1** for top-level sections (visible in Word's Navigation pane)
- **No empty paragraphs** for spacing — use `space_before` / `space_after` on paragraph format
- **Tables**: always set `table.style = "Table Grid"` so borders show in Google Docs too
- **Page breaks**: use `doc.add_page_break()`, never multiple `\n`
- **Any table that can span a page repeats its header row** (`repeat_header_row`) and keeps that
  header row from splitting (`prevent_row_split`) — a deliverables list or a long pricing table
  without this reads as a plain, unlabeled block of text on page 2
- **Every document longer than a cover page gets a footer page number** (`add_page_number_footer`)
  — "Page X of Y", suppressed on the cover only, same behavior as `pdf-report`'s
  `@page :first { content: none }`. Unlike a TOC, a `PAGE`/`NUMPAGES` field needs no caveat: Word
  recalculates it on every open
- **Accent color (indigo) is for shapes and borders, never for text** — `ACCENT` (indigo-500) is
  ~4.47:1 on white, under the 4.5:1 AA floor for normal text (WCAG SC 1.4.3); use `ACCENT_TEXT`
  (indigo-600, ~6.3:1) for any text that carries the accent color
- **Every image that carries information gets alt text** (`add_image`, never bare `add_picture`)
  — a logo repeated for decoration can skip it, a chart or screenshot a client is meant to read
  cannot
- **Every table a client is meant to read gets a Title via `set_table_alt_text`** — a bare
  `add_table` leaves a screen reader announcing "table" with no sense of what it's for before
  it starts reading cells; the Description argument is optional, the Title isn't
- **Set the document's real language with `set_document_language`, not `core_properties.language`**
  — the latter only writes metadata nobody reads for pronunciation; call the former with the
  language the content is actually written in, every time it isn't the template's English default
- **Nested bullets use `List Bullet 2` / `List Bullet 3`, never a single style with fake indent**
  — the built-in styles carry their own glyph per depth; indenting one style by hand looks right
  and isn't
- **No floating shapes or text boxes.** `Document` exposes `add_picture` (inline only) and
  `add_table` — nothing else. A "callout box" is a one-cell table with `w:shd` fill (same
  technique as the table header), never a hand-written `wp:anchor`; a floating shape with no
  library support behind it drifts relative to the text the moment anyone edits around it
- **A brand font named but not shipped with Word/Google Docs is not a font choice, it's a
  silent no-op** — stick to `Calibri`/the template default, or send the client a PDF instead

## Quality Checklist

- [ ] Document opens in Word and Google Docs without layout shifts
- [ ] All tables have a styled header row
- [ ] Any table long enough to span a page repeats that header row and can't split it
- [ ] Footer shows "Page X of Y" on every page except the cover
- [ ] Consistent font sizes (body 10.5pt, h1 16pt, h2 13pt)
- [ ] Page margins set (2.5cm top/bottom, 2.8cm sides)
- [ ] Cover page ends with page break
- [ ] No text uses `ACCENT` (indigo-500) as its color — `ACCENT_TEXT` (indigo-600) only
- [ ] `doc.core_properties.title` set to a real, readable title — not left blank
- [ ] `set_document_language` called with the content's actual language — not just
      `doc.core_properties.language`, which a screen reader doesn't read for pronunciation
- [ ] Every image that isn't purely decorative has alt text via `add_image`
- [ ] Every table a client is meant to read has a Title (and, where useful, a Description)
      via `set_table_alt_text`
- [ ] No hand-rolled floating shape or text box — callouts are a shaded one-cell table
- [ ] No table of contents unless the client asked for one — and if one was added, the summary
      tells them to update it once in Word before they read it
- [ ] Signature blocks have enough blank space for actual signatures
- [ ] No raw Python errors — run and confirm `.docx` is created

## Common Mistakes

- **Text colored with the border/shape accent** — `ACCENT` (indigo-500) reads at ~4.47:1 on
  white, just under the 4.5:1 AA floor for normal text. Fine for a border or a shape; never for
  a kicker, a label, or any run a client is meant to actually read. Use `ACCENT_TEXT` instead.
- **A deliverables or timeline table with no repeating header** — past the first page, the reader
  is looking at unlabeled columns. python-docx has no built-in support for this: without the
  `w:tblHeader` OXML element written explicitly, nothing repeats, and nothing warns you it didn't.
- **Multiple `\n` runs instead of `doc.add_page_break()`** — produces a variable amount of blank
  space depending on the reader's font and zoom, not a real page break.
- **Forgetting `table.style = "Table Grid"`** — the table still renders in Word (default borders
  come from the Normal Table style) but loses its borders entirely when opened in Google Docs.
- **Retrying `pip install python-docx` in a loop after a network failure** — if the sandbox has no
  outbound access, retrying doesn't fix it; say so and check whether the library is already
  available instead of failing silently three times.
- **A chart or screenshot with no alt text** — `add_picture` alone leaves `<wp:docPr descr="">`
  empty; nothing errors, nothing warns, the image is just silently invisible to a screen reader.
- **A table with no Title** — `add_table` alone gives a screen reader nothing but "table" before
  it starts reading raw cells one by one; `Table` has no `.alt_text`/`.title` property at all,
  so nothing warns you it's missing either — same silent gap as the image above, one level up.
- **A table of contents added because the document is long, not because it was asked for** —
  it opens as an empty field until someone updates it manually in Word; shipping one nobody was
  told to update reads as more broken than not having one.
- **No footer page number on a multi-page document** — a deliverables list, a timeline, and a
  pricing table each ran a page or more in the template above; a reader who prints it or flips
  pages out of order has nothing to reorder by. Unlike the TOC, there's no reason to withhold
  this one: `add_page_number_footer` carries no caveat.
- **A brand typeface named in `run.font.name`** — it isn't embedded, isn't checked, and doesn't
  fail loudly: it just silently falls back to whatever the reader's machine has, and the "on
  brand" document opens looking like nobody designed it.
- **Setting `doc.core_properties.language` and calling the job done** — it only writes
  `docProps/core.xml`, metadata a screen reader doesn't consult. The default in
  `word/styles.xml` stays `en-US` regardless, confirmed by writing it and reading the file back —
  a French document generated without `set_document_language` gets read aloud in an English
  voice from the first word to the last, not just mispronounced on isolated terms.
