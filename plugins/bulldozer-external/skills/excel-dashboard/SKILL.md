---
name: |
  excel-dashboard
description: |
  Generate an Excel (.xlsx) file with structured data, formulas, conditional formatting, and charts. Triggers on 'create Excel,' 'generate spreadsheet,' 'export to Excel,' 'build a dashboard in Excel,' 'KPI tracker,' or 'pipeline report in Excel.' For PDF output, see pdf-report. For Word documents, see word-document.
when-to-use: |
  Generate an Excel (.xlsx) file with structured data, formulas, conditional formatting, and charts. Triggers on 'create Excel,' 'generate spreadsheet,' 'export to Excel,' 'build a dashboard in Excel,' 'KPI tracker,' or 'pipeline report in Excel.' For PDF output, see pdf-report. For Word documents, see word-document.
argument-hint: |
  Monthly GTM pipeline dashboard — stages: Lead, MQL, SQL, Opp, Closed Won. Input is a CSV of deals. Need conversion rates, revenue by stage, and a waterfall chart.
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Excel Dashboard

> This is a Bulldozer skill. Produce a spreadsheet that someone can actually use — not a flat CSV dump.

You are a Bulldozer operator generating a working Excel file. The output should be structured, formula-driven, and immediately usable. No raw data dumps without headers. No unlabeled columns.

## Input

`$ARGUMENTS` — what data to include, what the file should enable (tracking, reporting, analysis), and any specific sheets or metrics required. If not provided, read available CSV/JSON/context files first. Only ask if you cannot determine the data structure and purpose.

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

```python
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, numbers
)
from openpyxl.styles.numbers import FORMAT_NUMBER_COMMA_SEPARATED1
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.chart.series import DataPoint
from openpyxl.formatting.rule import ColorScaleRule, DataBarRule, CellIsRule
from openpyxl.utils import get_column_letter

wb = Workbook()

# ── Color palette ─────────────────────────────────────────────────────────────
DARK   = "0F172A"  # slate-900 — header backgrounds
MID    = "1E293B"  # slate-800
ACCENT = "6366F1"  # indigo — primary accent
GREEN  = "22C55E"  # positive values
RED    = "EF4444"  # negative / warning
LIGHT  = "F8FAFC"  # alternate row fill
BORDER = "E2E8F0"  # cell borders

def header_style(cell, bg=DARK, fg="FFFFFF", size=11, bold=True):
    cell.font = Font(name="Calibri", size=size, bold=bold, color=fg)
    cell.fill = PatternFill("solid", fgColor=bg)
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

def data_style(cell, number_format=None, bold=False, color=None):
    cell.font = Font(name="Calibri", size=10, bold=bold, color=color or "1E293B")
    cell.alignment = Alignment(horizontal="left", vertical="center")
    if number_format:
        cell.number_format = number_format

def thin_border():
    s = Side(style="thin", color=BORDER)
    return Border(left=s, right=s, top=s, bottom=s)

def set_col_widths(ws, widths: dict):
    """widths = {"A": 20, "B": 15, ...}"""
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

# ── Dashboard sheet ───────────────────────────────────────────────────────────
ws_dash = wb.active
ws_dash.title = "Dashboard"
ws_dash.sheet_view.showGridLines = False

# KPI block example (row 2-4, cols B-E)
kpis = [
    ("Total Revenue", "$2.4M", "+12% MoM"),
    ("Pipeline", "$8.1M", "3.4x coverage"),
    ("Win Rate", "34%", "-2pts MoM"),
    ("Avg Deal Size", "$18K", "+$2K MoM"),
]
for i, (label, value, delta) in enumerate(kpis):
    col = i + 2  # B, C, D, E
    cl = get_column_letter(col)
    # Label
    cell = ws_dash[f"{cl}2"]
    cell.value = label
    header_style(cell, bg=DARK, size=9)
    # Value
    cell = ws_dash[f"{cl}3"]
    cell.value = value
    cell.font = Font(name="Calibri", size=18, bold=True, color=ACCENT)
    cell.alignment = Alignment(horizontal="center", vertical="center")
    # Delta
    cell = ws_dash[f"{cl}4"]
    cell.value = delta
    cell.font = Font(name="Calibri", size=9, color="64748B")
    cell.alignment = Alignment(horizontal="center")

# ── Data sheet ────────────────────────────────────────────────────────────────
ws_data = wb.create_sheet("Data")
ws_data.sheet_view.showGridLines = False

# Example: pipeline data
headers = ["Deal ID", "Company", "Stage", "Owner", "Amount", "Close Date", "Created"]
ws_data.row_dimensions[1].height = 30
for col, h in enumerate(headers, 1):
    cell = ws_data.cell(row=1, column=col, value=h)
    header_style(cell)
    ws_data.column_dimensions[get_column_letter(col)].width = 16

# Freeze header row
ws_data.freeze_panes = "A2"

# Conditional formatting: green/red on Amount column (E)
ws_data.conditional_formatting.add(
    "E2:E1000",
    DataBarRule(start_type="min", start_value=0, end_type="max", end_value=None,
                color=ACCENT)
)

# ── Calculations sheet ────────────────────────────────────────────────────────
ws_calc = wb.create_sheet("Calculations")

# Stage funnel summary (reading from Data sheet via COUNTIF/SUMIF)
stages = ["Lead", "MQL", "SQL", "Opportunity", "Closed Won"]
ws_calc["A1"] = "Stage"
ws_calc["B1"] = "Count"
ws_calc["C1"] = "Revenue"
ws_calc["D1"] = "Conv. Rate"
header_style(ws_calc["A1"]); header_style(ws_calc["B1"])
header_style(ws_calc["C1"]); header_style(ws_calc["D1"])

for i, stage in enumerate(stages, 2):
    ws_calc[f"A{i}"] = stage
    ws_calc[f"B{i}"] = f'=COUNTIF(Data!C:C,"{stage}")'
    ws_calc[f"C{i}"] = f'=SUMIF(Data!C:C,"{stage}",Data!E:E)'
    ws_calc[f"C{i}"].number_format = '"$"#,##0'
    if i > 2:
        ws_calc[f"D{i}"] = f"=IFERROR(B{i}/B{i-1},0)"
        ws_calc[f"D{i}"].number_format = "0%"

# ── Chart: funnel bar chart ───────────────────────────────────────────────────
chart = BarChart()
chart.type = "col"
chart.title = "Pipeline Funnel"
chart.style = 10
chart.y_axis.title = "Count"
chart.x_axis.title = "Stage"

data_ref = Reference(ws_calc, min_col=2, min_row=1, max_row=len(stages) + 1)
cats = Reference(ws_calc, min_col=1, min_row=2, max_row=len(stages) + 1)
chart.add_data(data_ref, titles_from_data=True)
chart.set_categories(cats)
chart.shape = 4
ws_dash.add_chart(chart, "B6")

# ── Config sheet ──────────────────────────────────────────────────────────────
ws_cfg = wb.create_sheet("Config")
ws_cfg["A1"] = "Parameter"
ws_cfg["B1"] = "Value"
header_style(ws_cfg["A1"]); header_style(ws_cfg["B1"])
config_rows = [
    ("Start Date", "2024-01-01"),
    ("End Date", "2024-12-31"),
    ("Revenue Target", 3000000),
    ("Win Rate Target", 0.35),
]
for i, (k, v) in enumerate(config_rows, 2):
    ws_cfg[f"A{i}"] = k
    ws_cfg[f"B{i}"] = v

# ── Save ──────────────────────────────────────────────────────────────────────
wb.save("output.xlsx")
print("Saved output.xlsx")
```

---

## Formula Reference

| Use case | Formula |
|----------|---------|
| Count rows matching criteria | `=COUNTIF(C:C,"MQL")` |
| Sum matching criteria | `=SUMIF(C:C,"MQL",E:E)` |
| Multi-criteria sum | `=SUMIFS(E:E,C:C,"MQL",D:D,"Alice")` |
| Safe division | `=IFERROR(B2/B1,0)` |
| Percentage change | `=(B2-B1)/B1` |
| Running total | `=SUM($E$2:E2)` |
| Last non-empty cell | `=LOOKUP(2,1/(A:A<>""),A:A)` |
| Rank within group | `=RANK(E2,$E$2:$E$100,0)` |

---

## Number Formats

| Type | Format string |
|------|--------------|
| Currency | `"$"#,##0` |
| Currency + cents | `"$"#,##0.00` |
| Percentage | `0%` |
| Percentage 1dp | `0.0%` |
| Thousands | `#,##0` |
| Date | `YYYY-MM-DD` |
| Positive green / negative red | Use `CellIsRule` conditional formatting |

---

## Quality Checklist

- [ ] Dashboard tab is tab 0 (first sheet, named "Dashboard")
- [ ] Header row frozen on all data sheets
- [ ] All currency columns have number format (not stored as text)
- [ ] Formulas reference named sheets explicitly (`Data!C:C`, not `C:C`)
- [ ] No merged cells in data ranges (they break COUNTIF/SUMIF)
- [ ] File opens without errors and calculated values are correct
- [ ] Column widths set — no truncated headers visible