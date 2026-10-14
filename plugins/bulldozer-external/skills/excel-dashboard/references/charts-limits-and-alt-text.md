# Chart & Sparkline Limits and Chart Accessibility (Alt Text)

## Contents

- Chart & Sparkline Limits
- Chart Accessibility (Alt Text)

## Chart & Sparkline Limits

openpyxl cannot produce two things Excel itself offers natively, confirmed
against the library's own source (openpyxl 3.1.5): a real **waterfall chart**
(Excel's is a "modern" chart type the library's writer never implemented) and
native **sparklines** (they need the `x14:sparklineGroups` extension block,
which openpyxl silently drops on both read and write — no error, the sparkline
just isn't there). Don't promise either in the one-line summary handed back to
the user — say what was actually built instead.

**Waterfall substitute** (e.g. an ARR bridge: start → new → expansion → churn →
end): a 2-series stacked `BarChart` with an invisible "base" series holds each
bar at the right height without the base ever being seen.

```python
waterfall = BarChart()
waterfall.type = "col"
waterfall.grouping = "stacked"
waterfall.overlap = 100
# base_ref: a running-total helper column (invisible) — same Reference()
# pattern as data_ref/cats above, pointed at a helper column on Calculations
waterfall.add_data(base_ref, titles_from_data=True)
waterfall.add_data(delta_ref, titles_from_data=True)  # the value that actually shows
waterfall.series[0].graphicalProperties.noFill = True
```

**Sparkline substitute**: the `DataBarRule` already used on the `Amount` column
above, or a small embedded `LineChart`, gets close for a single trend — but
neither lives inside one cell the way a real sparkline does. Call it a trend
indicator, not a sparkline.

If a client specifically insists on a real, in-cell sparkline (not a
substitute), the write-only library `XlsxWriter` does implement one natively
— `worksheet.add_sparkline(cell, {"range": ..., "type": "line"})` — confirmed
by actually generating one (real `pip install xlsxwriter`, `add_sparkline()`,
unzip the result): the worksheet XML carries a genuine
`<x14:sparklineGroups>` extension block, not a placeholder. That's a genuine
feature gap between the two libraries, not a version lag: XlsxWriter cannot
read or modify an existing `.xlsx` (it only writes new files, confirmed in
its own README) and has no waterfall chart either (same three-way check as
openpyxl above, against its supported chart-type list) — so it's a full
library swap for the one sheet that needs it, not a drop-in addition to the
template above. Worth raising as a choice with whoever's asking, not
defaulting into silently.

One consequence, confirmed the same way: a sparkline only survives as long
as XlsxWriter is the last thing to touch the file. Re-opening that same
`.xlsx` with `openpyxl.load_workbook()` — the only way to add anything from
the template above (a table, a formula, a chart) to a workbook built by
XlsxWriter — strips the sparkline back out, with an explicit warning
(`Sparkline Group extension is not supported and will be removed`) rather
than a silent drop on that side. So this isn't a step to bolt onto the
existing template: it's two disjoint deliverables. Build the sparkline sheet
with XlsxWriter last, hand it over as its own file, and never re-open it
with openpyxl afterward — anything that needs both a sparkline and this
template's tables/formulas/charts has to live in two separate workbooks, or
drop the sparkline for the `DataBarRule`/`LineChart` substitute above.

## Chart Accessibility (Alt Text)

openpyxl never writes `descr` — the OOXML attribute a screen reader reads as
alt text, WCAG 1.1.1 — on a chart. Confirmed by reading the library's own
source (openpyxl 3.1.5, `openpyxl/drawing/spreadsheet_drawing.py`,
`_chart_frame`): it sets `name="Chart N"` on the chart's `cNvPr` element but
never `descr`, and neither `BarChart` nor `add_chart` takes an argument to
supply one before `save()`. (An inserted picture *does* get a `descr` from
openpyxl — but hardcoded to the literal string `"Picture"` on every image,
which isn't a real description either — same gap, worse default.)

The only route that works — verified by an actual round trip in this
sandbox: save, unzip, patch, then reopen with `load_workbook()` without
error — is to patch the saved drawing XML:

```python
import zipfile, os

def set_chart_alt_text(xlsx_path, drawing_file, chart_name, description):
    """Patch descr onto a chart's cNvPr after save() — openpyxl doesn't
    expose one itself. drawing_file is e.g. "xl/drawings/drawing1.xml":
    each worksheet that has a chart gets its own drawingN.xml, and the
    id/name counter restarts at "Chart 1" inside every one of them — with
    more than one chart in the workbook, unzip the saved file once and look
    in xl/drawings/ for the right one rather than assuming N matches sheet
    order. chart_name is the exact name openpyxl wrote, e.g. "Chart 1".
    """
    tmp = xlsx_path + ".tmp"
    needle = f'name="{chart_name}" />'.encode()
    replacement = f'name="{chart_name}" descr="{description}" />'.encode()
    with zipfile.ZipFile(xlsx_path) as zin, \
         zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == drawing_file:
                data = data.replace(needle, replacement)
            zout.writestr(item, data)
    os.replace(tmp, xlsx_path)

wb.save("output.xlsx")
set_chart_alt_text("output.xlsx", "xl/drawings/drawing1.xml", "Chart 1",
                    "Bar chart: deal count drops sharply from MQL to SQL (62 to 24), "
                    "the steepest fall in the funnel")
```

Write the `description` as the takeaway, not a restatement of the axes — "bar
chart of deal count by stage" tells a screen-reader user what type of object
they're looking at but not what it says; naming the one thing worth noticing
(the steep drop, the stage lagging target) is what a sighted reader gets for
free from glancing at the shape of the bars.

Same underlying gap already found on python-docx and python-pptx (neither
exposes alt text through its object model either — same OOXML-by-hand fix):
a third Office format where a real alt text needs a post-save patch, not a
library parameter.
