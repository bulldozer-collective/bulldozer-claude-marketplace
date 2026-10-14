# Python Template

## Contents

- Document metadata, page margins
- Core style helpers: `styled_para`, `heading`, `bullet`
- Table helpers: `repeat_header_row`, `prevent_row_split`, `add_table`
- `page_break`, `add_page_number_footer`, `add_signature_block`, `add_image`
- `set_document_language`, `set_table_alt_text`
- Document body (cover page, executive summary, scope, timeline, pricing, signatures, save)

```python
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from datetime import date

doc = Document()

# ── Document metadata ─────────────────────────────────────────────────────────
# Without a real title, a screen reader announces the raw filename
# ("generate acme sow docx") instead of anything a listener can use.
doc.core_properties.title  = "Statement of Work — Acme Inc. GTM Engagement"
doc.core_properties.author = "Bulldozer"
# core_properties.language below is metadata only, not pronunciation — see
# set_document_language() (defined with the other helpers), called near the
# top of the document body, further down.
doc.core_properties.language = "en-US"

# ── Page margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin   = Cm(2.8)
    section.right_margin  = Cm(2.8)

# ── Core style helpers ────────────────────────────────────────────────────────
DARK        = RGBColor(0x0F, 0x17, 0x2A)  # slate-900
ACCENT      = RGBColor(0x63, 0x66, 0xF1)  # indigo-500 — borders and shapes ONLY, never text
ACCENT_TEXT = RGBColor(0x4F, 0x46, 0xE5)  # indigo-600 — use this for any accent-colored text
MUTED       = RGBColor(0x64, 0x74, 0x8B)  # slate-500
BODY        = RGBColor(0x1E, 0x29, 0x3B)  # slate-800
# indigo-500 on white is ~4.47:1 — under the 4.5:1 AA floor for normal text (WCAG SC 1.4.3).
# Fine as a border/shape color (non-text needs only 3:1), never as a text color.
# indigo-600 (ACCENT_TEXT) is ~6.3:1 on white — use it for the cover kicker, callout labels,
# or any other place accent color lands on actual text.

def styled_para(doc, text, style="Normal", bold=False, size=11, color=None,
                align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=6):
    p = doc.add_paragraph(style=style)
    run = p.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.color.rgb = color or BODY
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    return p

def heading(doc, text, level=1):
    """Heading 1 = section title, Heading 2 = subsection"""
    sizes = {1: 16, 2: 13, 3: 11}
    colors = {1: DARK, 2: DARK, 3: BODY}
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(sizes.get(level, 11))
    run.font.color.rgb = colors.get(level, BODY)
    p.paragraph_format.space_before = Pt(18 if level == 1 else 12)
    p.paragraph_format.space_after = Pt(6)
    # Heading 1 gets a colored top border
    if level == 1:
        pPr = p._p.get_or_add_pPr()
        pBdr = OxmlElement("w:pBdr")
        top = OxmlElement("w:top")
        top.set(qn("w:val"), "single")
        top.set(qn("w:sz"), "12")
        top.set(qn("w:color"), "6366F1")
        pBdr.append(top)
        pPr.append(pBdr)
    return p

BULLET_STYLES = {0: "List Bullet", 1: "List Bullet 2", 2: "List Bullet 3"}

def bullet(doc, text, level=0):
    """level 0/1/2 map to the built-in List Bullet / List Bullet 2 / List Bullet 3
    styles — each carries its OWN bullet glyph and indent (verified: Document().styles
    lists all three by default). Indenting a single 'List Bullet' paragraph by hand
    fakes the visual nesting but keeps the same glyph at every depth and isn't a real
    outline level — deeper than level 2, reuse List Bullet 3 rather than inventing a 4th."""
    style = BULLET_STYLES.get(level, "List Bullet 3")
    p = doc.add_paragraph(style=style)
    run = p.add_run(text)
    run.font.size = Pt(10.5)
    run.font.color.rgb = BODY
    p.paragraph_format.space_after = Pt(3)
    return p

def repeat_header_row(row):
    """Mark a row to repeat at the top of every page the table spans.
    No public python-docx API for this (w:tblHeader) — only works on the table's first row."""
    trPr = row._tr.get_or_add_trPr()
    tblHeader = OxmlElement("w:tblHeader")
    tblHeader.set(qn("w:val"), "true")
    trPr.append(tblHeader)

def prevent_row_split(row):
    """Stop a row's content from being cut across a page break (w:cantSplit).
    No public python-docx API for this either — same trPr element as repeat_header_row."""
    trPr = row._tr.get_or_add_trPr()
    trPr.append(OxmlElement("w:cantSplit"))

def add_table(doc, headers, rows, col_widths=None, repeat_header=True):
    """headers: list[str], rows: list[list], col_widths: list[Cm] or None
    repeat_header: re-show the header row on every page — set False only for a table
    you're certain will never span a page (e.g. a 3-row pricing summary)"""
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Header row
    hdr = table.rows[0]
    hdr.height = Cm(0.9)
    if repeat_header:
        repeat_header_row(hdr)
        prevent_row_split(hdr)
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        cell.text = h
        cell.paragraphs[0].runs[0].bold = True
        cell.paragraphs[0].runs[0].font.size = Pt(10)
        cell.paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:fill"), "0F172A")
        shd.set(qn("w:color"), "auto")
        shd.set(qn("w:val"), "clear")
        tcPr.append(shd)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

    # Data rows
    for r_idx, row_data in enumerate(rows, 1):
        row = table.rows[r_idx]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = str(val)
            cell.paragraphs[0].runs[0].font.size = Pt(10)
            cell.paragraphs[0].runs[0].font.color.rgb = BODY

    # Column widths
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in table.rows:
                row.cells[i].width = w

    doc.add_paragraph()  # spacing after table
    return table

def page_break(doc):
    doc.add_page_break()

def add_page_number_footer(doc):
    """Footer 'Page X of Y' on every page except the cover — no high-level API
    (same raw fldChar/instrText technique as the TOC field), but PAGE/NUMPAGES
    update themselves every time Word opens the file, unlike a TOC. Mirrors
    pdf-report's `@page :first { content: none }`: the cover gets no footer,
    and the count isn't reset — the first page after the cover reads "2",
    same behavior as the PDF sibling, not a bug."""
    def field(run, code):
        begin = OxmlElement("w:fldChar"); begin.set(qn("w:fldCharType"), "begin")
        instr = OxmlElement("w:instrText"); instr.set(qn("xml:space"), "preserve"); instr.text = code
        end = OxmlElement("w:fldChar"); end.set(qn("w:fldCharType"), "end")
        for el in (begin, instr, end):
            run._r.append(el)
    section = doc.sections[0]
    section.different_first_page_header_footer = True  # leaves the cover's footer empty
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run("Page ")
    field(p.add_run(), "PAGE")
    p.add_run(" of ")
    field(p.add_run(), "NUMPAGES")

def add_signature_block(doc, parties):
    """parties: [{"name": "Acme Inc.", "title": "CEO"}]"""
    heading(doc, "Signatures", level=2)
    table = doc.add_table(rows=3, cols=len(parties) * 2)
    for i, party in enumerate(parties):
        col = i * 2
        table.cell(0, col).text = party["name"]
        table.cell(1, col).text = party.get("title", "")
        table.cell(2, col).text = "Date: _______________"
        table.cell(0, col + 1).text = "Signature: _______________________________"

def add_image(doc, path_or_stream, alt_text, width=None):
    """Embed an image with real alt text. python-docx has no alt_text/descr property
    on InlineShape — the attribute lives one level below what the library exposes,
    in <wp:docPr descr="…">, reachable only through the raw element (verified: written,
    saved, unzipped, and read back from the produced .docx). alt_text is required, not
    optional — a chart or screenshot with no alt text is invisible to a screen reader,
    not just undescribed."""
    picture = doc.add_picture(path_or_stream, width=width)
    picture._inline.docPr.set("descr", alt_text)
    return picture

def set_document_language(doc, lang_tag="en-US"):
    """Set the language every run inherits unless it overrides it — the value a
    screen reader actually uses to pick pronunciation (WCAG SC 3.1.1 Language of
    Page). doc.core_properties.language is NOT this: verified by execution that
    it only writes docProps/core.xml's Dublin Core dc:language, leaving this
    element untouched. No public API reaches word/styles.xml's docDefaults —
    same one-level-below-the-library pattern as add_image's docPr.set("descr")
    and set_table_alt_text's tblCaption. Call this once, before save(), with the
    actual language of the generated content — "fr-FR" for a French deliverable,
    not whatever this default says."""
    rPrDefault = doc.styles.element.find(qn("w:docDefaults")).find(qn("w:rPrDefault")).find(qn("w:rPr"))
    rPrDefault.find(qn("w:lang")).set(qn("w:val"), lang_tag)

def set_table_alt_text(table, title, description=""):
    """Set the Title/Description a screen reader announces before reading a table's
    cells — same Word feature as Table Properties > Alt Text tab. Table has no
    .alt_text/.title/.description property (verified: full public API inspected) —
    the OOXML elements (w:tblCaption for Title, w:tblDescription for Description) live
    under tblPr, one level below what python-docx exposes, same pattern as add_image's
    docPr.set("descr", ...) one level below InlineShape. Call this on any table a
    client is meant to read, not just ones with information-bearing images —
    "table" with no title is as blind a landing as an unlabeled chart."""
    tblPr = table._tbl.tblPr
    caption = OxmlElement("w:tblCaption")
    caption.set(qn("w:val"), title)
    tblPr.append(caption)
    if description:
        desc = OxmlElement("w:tblDescription")
        desc.set(qn("w:val"), description)
        tblPr.append(desc)

# ── Document body ─────────────────────────────────────────────────────────────

set_document_language(doc, "en-US")  # match the actual content language, not this default
add_page_number_footer(doc)

# Cover page
styled_para(doc, "STATEMENT OF WORK", bold=True, size=9, color=ACCENT_TEXT,
            align=WD_ALIGN_PARAGRAPH.CENTER, space_before=60)
styled_para(doc, "GTM Engagement — Acme Inc.", bold=True, size=22, color=DARK,
            align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=8)
styled_para(doc, f"Prepared by Bulldozer  ·  {date.today().strftime('%B %d, %Y')}",
            size=10, color=MUTED, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
styled_para(doc, "Confidential", size=9, color=MUTED,
            align=WD_ALIGN_PARAGRAPH.CENTER)
page_break(doc)

# Executive Summary
heading(doc, "Executive Summary")
styled_para(doc, "This statement of work defines the scope, deliverables, timeline, "
            "and commercial terms for the GTM engagement between Bulldozer and Acme Inc.")
for item in [
    "3-month engagement covering ICP refinement, outbound build, and pipeline activation",
    "Fixed-fee structure with milestone-based payment",
    "Weekly check-ins and monthly reporting included",
]:
    bullet(doc, item)

# Scope
heading(doc, "Scope of Work")
heading(doc, "Deliverables", level=2)
deliverables_table = add_table(doc,
    headers=["#", "Deliverable", "Description", "Acceptance Criteria"],
    rows=[
        ["1", "ICP Definition", "Researched ICP with firmographic and behavioral profiles", "Signed off by client"],
        ["2", "Outbound Sequence", "5-email cadence per segment", "Delivered in Lemlist"],
        ["3", "Pipeline Report", "Monthly Excel dashboard", "Shared each month-end"],
    ],
    col_widths=[Cm(1.2), Cm(4), Cm(6), Cm(5)]
)
set_table_alt_text(deliverables_table, "Deliverables",
    "Three deliverables with their description and the criteria used to accept each one.")

# Timeline
heading(doc, "Timeline")
add_table(doc,
    headers=["Phase", "Start", "End", "Milestones"],
    rows=[
        ["Phase 1: Discovery", "Week 1", "Week 2", "ICP, positioning brief"],
        ["Phase 2: Build", "Week 3", "Week 8", "Sequences live, first sends"],
        ["Phase 3: Optimize", "Week 9", "Week 12", "Reporting, handoff"],
    ],
    col_widths=[Cm(4), Cm(3), Cm(3), Cm(6.5)]
)

# Pricing
heading(doc, "Pricing and Payment")
add_table(doc,
    headers=["Item", "Amount", "Due"],
    rows=[
        ["Phase 1 — Discovery", "€4,000", "On signature"],
        ["Phase 2 — Build", "€8,000", "Start of Phase 2"],
        ["Phase 3 — Optimize", "€4,000", "Start of Phase 3"],
        ["Total", "€16,000", ""],
    ],
    col_widths=[Cm(7), Cm(4), Cm(5.5)]
)

# Signatures
page_break(doc)
add_signature_block(doc, [
    {"name": "Bulldozer", "title": "Managing Director"},
    {"name": "Acme Inc.", "title": "CEO"},
])

# Save
doc.save("output.docx")
print("Saved output.docx")
```
