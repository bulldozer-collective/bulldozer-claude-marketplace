---
name: |-
  excel-dashboard
description: |-
  Generate an Excel (.xlsx) file with structured data, formulas, conditional formatting, and charts. Triggers on 'create Excel,' 'generate spreadsheet,' 'export to Excel,' 'build a dashboard in Excel,' 'KPI tracker,' or 'pipeline report in Excel.' For PDF output, see pdf-report. For Word documents, see word-document.
when-to-use: |-
  Generate an Excel (.xlsx) file with structured data, formulas, conditional formatting, and charts. Triggers on 'create Excel,' 'generate spreadsheet,' 'export to Excel,' 'build a dashboard in Excel,' 'KPI tracker,' or 'pipeline report in Excel.' For PDF output, see pdf-report. For Word documents, see word-document.
argument-hint: |-
  Monthly GTM pipeline dashboard — stages: Lead, MQL, SQL, Opp, Closed Won. Input is a CSV of deals. Need conversion rates, revenue by stage, and a waterfall chart.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Excel Dashboard

> This is a Bulldozer skill. Produce a spreadsheet that someone can actually use — not a flat CSV dump.

You are a Bulldozer operator generating a working Excel file. The output should be structured, formula-driven, and immediately usable. No raw data dumps without headers. No unlabeled columns.

## Input

`$ARGUMENTS` — what data to include, what the file should enable (tracking, reporting, analysis), and any specific sheets or metrics required. If not provided, read available CSV/JSON/context files first. Only ask if you cannot determine the data structure and purpose.

If the project already has a CRM or analytics connector configured (HubSpot, Google Analytics), check whether the numbers can come from there before asking for a manual CSV export — a dashboard that has to be re-exported by hand every week is the one that gets abandoned. Three things to hold onto when you do: revenue lives in the CRM, spend in the ad platform, traffic in analytics — never add them into one blended figure; CRM attribution numbers are usually scoped to closed-won deals only, so they answer a narrower question than "how is this channel doing overall"; and if the revenue figure comes from HubSpot deals, sum `amount_in_home_currency`, not `amount` — on a multi-currency portal the raw `amount` skips currency conversion and silently blends currencies into one meaningless total. Pulling that revenue by SQL (`query_crm_data`) commonly fails on a missing scope even for a plain read, on most portals, closed-won-only or not — treat `search_crm_objects` (filter by stage/date, paginate, aggregate client-side) as the default path instead of the SQL tool. `get_crm_objects` is not an interchangeable substitute for that path: it only fetches records whose IDs you already have, which is why HubSpot's own tool guidance pairs it with `search_crm_objects` for sampling a handful of records to learn the data model — not for pulling the full set of deals a revenue figure needs.

## Output

1. A Python script `generate-{slug}.py` that produces `{slug}.xlsx`
2. The `.xlsx` file itself (run the script immediately after writing it)
3. A one-line summary of sheets and key formulas used

**Generate on first invocation. Do not ask for approval before running.**

---

## Library: openpyxl

Always use openpyxl. It handles formatting, formulas, charts, and conditional formatting without Excel installed.

```bash
pip install openpyxl
```

For data manipulation before writing, use pandas if available:

```bash
pip install pandas openpyxl
```

---

## Standard Workbook Structure

| Sheet | Purpose |
|-------|---------|
| `Dashboard` | Summary KPIs, charts, key metrics — always the first sheet (tab 0) |
| `Data` | Raw or imported data — the source of truth |
| `Calculations` | Intermediate formulas, pivot-like aggregations |
| `Config` | Editable parameters (date ranges, targets, rate assumptions) |

Only create sheets that are needed. A simple export can be just `Data`.

---

## Python Template

The full openpyxl template (color palette, style helpers, and the Dashboard, Data, Calculations and Config sheets, the funnel bar chart and the save step) is in `references/python-template.md`. Read it in full before writing any workbook script, and start from it.

---

## Formula Reference

| Use case | Formula |
|----------|---------|
| Count rows matching criteria | `=COUNTIF(C:C,"MQL")` — or `=COUNTIF(TableName[Column],"MQL")` on a native table |
| Sum matching criteria | `=SUMIF(C:C,"MQL",E:E)` — or `=SUMIF(TableName[Stage],"MQL",TableName[Amount])` |
| Multi-criteria sum | `=SUMIFS(E:E,C:C,"MQL",D:D,"Alice")` |
| Safe division | `=IFERROR(B2/B1,0)` |
| Percentage change | `=(B2-B1)/B1` |
| Running total | `=SUM($E$2:E2)` |
| Look up a value | `=XLOOKUP(id,A:A,E:E,"not found")` — current default; only fall back to `VLOOKUP`/`LOOKUP` for a client still on Excel 2019 or older |
| Last non-empty cell | `=LOOKUP(2,1/(A:A<>""),A:A)` |
| Rank within group | `=RANK.EQ(E2,$E$2:$E$100,0)` — `RANK` still works but is listed by Microsoft as a compatibility function |

A sheet built as a native `Table` (see the Python template) gets structured references — `TableName[Column]` instead of `Data!C:C`. They read like a column name and don't silently shift if someone inserts a column.

---

## Number Formats

| Type | Format string |
|------|--------------|
| Currency (USD) | `"$"#,##0` |
| Currency + cents (USD) | `"$"#,##0.00` |
| Currency (EUR, French display) | `#,##0.00" €"` |
| Percentage | `0%` |
| Percentage 1dp | `0.0%` |
| Thousands | `#,##0` |
| Date | `YYYY-MM-DD` |
| Positive green / negative red | `CellIsRule` conditional formatting — pair it with an icon set or a +/- prefix (see Python template), never color alone |

`number_format` is a literal mask, not a locale setting: openpyxl does not detect the client's country and switch `$` to `€` for you, and it won't turn a period into a comma either. Write the format the client actually expects — `"$"#,##0` for a US deliverable, `#,##0.00" €"` for a French one — rather than defaulting to USD out of habit.

---

## Print & PDF Export

Only worth doing when the file's actual destination is a printed page or a PDF —
a pipeline review pulled up on a laptop, or a workbook that never leaves Excel,
needs none of this. Ask which one it is before adding it: setting page setup
unconditionally on every generated file is code nobody asked for.

```python
ws_dash.print_area = "A1:H30"
ws_dash.print_title_rows = "1:1"           # header row repeats on every printed page
ws_dash.page_setup.orientation = "landscape"
ws_dash.page_setup.fitToWidth = 1
ws_dash.page_setup.fitToHeight = 0         # 0 = as many pages tall as it takes
ws_dash.sheet_properties.pageSetUpPr.fitToPage = True  # required — Excel silently
                                                        # ignores fitToWidth/
                                                        # fitToHeight without this
```

`fitToHeight = 0` means "constrain width only" — the usual choice for a dashboard
that's wider than it is tall. Set both to `1` only for a document short enough to
force onto a single page without shrinking the text past legibility.

---

## Chart & Sparkline Limits

What openpyxl cannot do for charts (real waterfall charts, native sparklines) and the workarounds are in `references/charts-limits-and-alt-text.md` (section "Chart & Sparkline Limits"). Read it before promising a waterfall chart or sparklines.

---

## Chart Accessibility (Alt Text)

How to write alt text (`descr`) on charts, which openpyxl does not write by itself, is in `references/charts-limits-and-alt-text.md` (section "Chart Accessibility (Alt Text)"). Read it whenever the workbook contains a chart.

---

## Document Metadata (Accessibility)

Unlike the chart, this one doesn't need a patch — openpyxl already exposes it,
the template above just never calls it. `wb.properties` (`title`, `creator`,
`subject`, `description`, `language`) writes straight to `docProps/core.xml`;
without a title set, a saved workbook carries only its filename. Same fix
already made on `word-document` (`doc.core_properties.title`, confirmed
2026-09-07): a screen reader announces that raw filename on open, not a
readable title, when the field is left blank. `language` matters for the same
reason a `lang` attribute matters on a web page: it's what tells the screen
reader which pronunciation rules and voice to use, and it's silently absent
by default — openpyxl writes no `dc:language` unless the script sets one. Set
all of it once, right after `wb = Workbook()`:

```python
wb.properties.title = "GTM Pipeline Dashboard — Q3 2026"
wb.properties.creator = "Bulldozer"
wb.properties.language = "en-US"  # or "fr-FR" — match the client's deliverable
```

Confirmed by a real round trip in this sandbox (openpyxl 3.1.5): `wb.save()`
→ unzip → `docProps/core.xml` shows `<dc:title>`, `<dc:creator>` and
`<dc:language>` all populated as soon as `wb.properties` is set before
`save()`. Not verified inside Excel or a real screen reader — same reserve
already carried above for the chart alt-text patch.

One checklist item some accessibility guides list for a hand-edited workbook
— placing the cursor on cell A1 of every sheet before saving, since a screen
reader lands on whatever cell was last active — does not apply here: checked
by the same round trip above, a sheet built by this template already defaults
its saved `activeCell`/`sqref` to `A1` without the script doing anything,
because nothing in the generation process ever moves the selection elsewhere.
That default only breaks if a script explicitly sets `ws.sheet_view.selection`
or scrolls `topLeftCell` to something else — don't add either without a
reason.

---

## Judgment Calls

A senior build differs from a generic one less in what it adds than in what it
refuses.

- **One accent color, not a palette.** The template above uses exactly one
  accent (indigo) for the number that matters and slate for everything else.
  A second "modern" accent added without a distinct role is the fastest way to
  make every KPI look equally important — which means none of them do.
- **A rate built on a handful of records doesn't get the same visual
  confidence as one built on hundreds.** A Closed Won stage with 3 deals
  showing a crisp "67%" reads as precise when it isn't. Flag it — a footnote,
  a greyed-out cell — rather than format it identically to a rate with real
  volume behind it.
- **A threshold lives in one cell, never typed twice.** The conditional format
  above reads `Config!$B$6`; it does not repeat `0.35` inside the rule.
  Whoever changes the target next quarter edits Config once — they don't go
  hunting through conditional-formatting rules for every place the old number
  was typed by hand.
- **Print/PDF setup is a yes/no question, not a default.** See above: add it
  when the file is meant to be printed or exported, skip it when it stays in
  Excel.
- **Don't claim a feature the library doesn't have.** See Chart & Sparkline
  Limits — a clearly-labeled stacked-bar substitute beats a summary line that
  says "waterfall chart" over something else.

---

## Quality Checklist

- [ ] Dashboard tab is tab 0 (first sheet, named "Dashboard")
- [ ] Header row frozen on all data sheets
- [ ] All currency columns have number format (not stored as text), and the currency/locale matches the client, not a default `$`
- [ ] Formulas reference named sheets explicitly (`Data!C:C`) or, better, use structured references on a native table (`TableName[Column]`) — never a bare `C:C`
- [ ] No merged cells in data ranges (they break COUNTIF/SUMIF)
- [ ] File opens without errors and calculated values are correct
- [ ] Column widths set — no truncated headers visible
- [ ] Positive/negative or good/bad values carry more than color (an icon, an arrow, a +/- prefix) — a reader who can't distinguish red from green still gets the message
- [ ] Every KPI on the Dashboard has a definition somewhere in the file (a note on the cell, or a row on the Config sheet) — two people reading "34% win rate" should be counting the same thing
- [ ] If the numbers come from more than one system (CRM, ad platform, analytics), each figure says which one it's from — never a total that blends more than one source of data
- [ ] A rate or ratio built on a small number of records is visually flagged as such (a footnote, a greyed-out cell) — not styled with the same confidence as one built on real volume
- [ ] Every threshold used in a conditional format references a cell on the Config sheet — none is typed a second time directly into the rule
- [ ] The Dashboard says when the file was generated (a stamped date, not left implicit) — a static snapshot has no other way to signal its own age
- [ ] Print/page setup (print area, repeating header row, fit-to-width) is present only if the file is actually meant to be printed or exported as PDF — not added by default on a file that stays in Excel
- [ ] The Dashboard chart has real alt text patched in after save (see Chart Accessibility) — openpyxl writes none of its own, and never a generic placeholder in its place
- [ ] `wb.properties.title` and `wb.properties.language` are set before `save()` (see Document Metadata) — otherwise the file carries only its filename, and a screen reader falls back to its default voice instead of the deliverable's actual language
- [ ] Chart alt text names the takeaway (the drop, the gap to target), not just the chart type and axes — a sighted reader gets the shape of the bars for free, the alt text is what replaces that
- [ ] If revenue is pulled from HubSpot deals, the figure sums `amount_in_home_currency`, not `amount` — never a raw multi-currency total