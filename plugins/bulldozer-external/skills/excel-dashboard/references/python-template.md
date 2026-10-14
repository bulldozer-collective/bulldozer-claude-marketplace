# Python Template

## Contents

- Color palette
- Style helpers: `header_style`, `data_style`, `thin_border`, `set_col_widths`
- Dashboard sheet
- Data sheet
- Calculations sheet
- Chart: funnel bar chart
- Config sheet
- Save

```python
from datetime import date
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import DataBarRule, CellIsRule, IconSetRule
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.comments import Comment
from openpyxl.utils import get_column_letter

wb = Workbook()

# Workbook title and language — announced by a screen reader on open instead
# of the raw filename and the reader's default voice/pronunciation rules (see
# "Document Metadata" below). Cheap to set, easy to forget.
wb.properties.title = "GTM Pipeline Dashboard"
wb.properties.creator = "Bulldozer"
wb.properties.language = "en-US"

# ── Color palette ─────────────────────────────────────────────────────────────
DARK   = "0F172A"  # slate-900 — header backgrounds
MID    = "1E293B"  # slate-800
ACCENT = "6366F1"  # indigo — primary accent (≈4.5:1 on white, fine for bold ≥14pt)
GREEN  = "15803D"  # positive values, as TEXT — checked ≥4.5:1 on white (a brighter
                    # green like #22C55E reads well as a fill but fails as small text)
RED    = "B91C1C"  # negative / warning, as TEXT — same reason, ≥4.5:1 on white
LIGHT  = "F8FAFC"  # alternate row fill
BORDER = "E2E8F0"  # cell borders

# Contrast is a number, not an impression: check any custom palette with a
# relative-luminance calculator (e.g. webaim.org/resources/contrastchecker) —
# ≥4.5:1 for body text, ≥3:1 for large text (18pt, or 14pt bold, and up).

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
    # Delta — an arrow carries the direction, not the color alone
    # (red/green-only deltas are unreadable to color-blind viewers)
    cell = ws_dash[f"{cl}4"]
    is_up = delta.strip().startswith("+")
    is_down = delta.strip().startswith("-")
    arrow = "▲ " if is_up else "▼ " if is_down else ""
    cell.value = f"{arrow}{delta}"
    cell.font = Font(name="Calibri", size=9, color=GREEN if is_up else RED if is_down else "64748B")
    cell.alignment = Alignment(horizontal="center")

# One line per KPI, attached as a comment, heads off "wait, does that
# include X?" — two readers of "34% win rate" should be counting the same thing
ws_dash["B2"].comment = Comment(
    "Total Revenue = closed-won deal amount, from the CRM. Excludes open pipeline.",
    "Dashboard generator"
)

# A snapshot file has no other way to tell a reader how stale it is, and no
# other cell says what fraction of the data behind it is actually filled in —
# both are easy to skip and both are the first thing a data reviewer asks for.
# Placed off to the side (column H) so they don't compete with the KPI band
# or sit under the chart anchored at B6.
ws_dash["H2"] = '="Generated " & Config!B2'
ws_dash["H2"].font = Font(name="Calibri", size=8, italic=True, color="64748B")
ws_dash["H3"] = '="Amount populated: " & TEXT(COUNTA(DealsTable[Amount])/COUNTA(DealsTable[Deal ID]),"0%")'
ws_dash["H3"].font = Font(name="Calibri", size=8, italic=True, color="64748B")

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

# Native Excel table (not just a styled range): gives the client filter
# dropdowns and banded rows for free, and lets Calculations use structured
# references (DealsTable[Stage]) that survive a column being reordered.
# Call this AFTER all data rows are written — ref must cover every row,
# header included. openpyxl only writes the table's metadata: it does not
# filter or sort anything itself, Excel does that when the file is opened.
table = Table(displayName="DealsTable", ref=f"A1:G{ws_data.max_row}")
table.tableStyleInfo = TableStyleInfo(
    name="TableStyleMedium9", showRowStripes=True, showColumnStripes=False
)
ws_data.add_table(table)

# Data bar on the Amount column (E) — a magnitude cue, not pass/fail, so
# color alone is not a readability problem here
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
    # Structured references into the DealsTable — they keep working if a
    # column gets inserted or reordered on the Data sheet, unlike Data!C:C
    ws_calc[f"B{i}"] = f'=COUNTIF(DealsTable[Stage],"{stage}")'
    ws_calc[f"C{i}"] = f'=SUMIF(DealsTable[Stage],"{stage}",DealsTable[Amount])'
    ws_calc[f"C{i}"].number_format = '"$"#,##0'
    if i > 2:
        ws_calc[f"D{i}"] = f"=IFERROR(B{i}/B{i-1},0)"
        ws_calc[f"D{i}"].number_format = "0%"

# Icon set on the conversion-rate column: an accessible alternative/complement
# to a plain color scale — the icon still reads the value when red and green
# look alike to the viewer
ws_calc.conditional_formatting.add(
    f"D3:D{len(stages) + 1}",
    IconSetRule(icon_style="3TrafficLights1", type="percent", values=[0, 33, 67])
)

# The icon set above is a generic "how healthy is this ratio" cue for every
# stage. The one rate the business actually set a target for is the last —
# flag it against the real target cell, not a number retyped into the rule:
# whoever changes the target next quarter edits Config once, they don't go
# hunting through conditional-formatting rules for every place 0.35 was typed.
last_row = len(stages) + 1
ws_calc.conditional_formatting.add(
    f"D{last_row}",
    CellIsRule(operator="lessThan", formula=["Config!$B$6"],
               fill=PatternFill("solid", fgColor="FEE2E2"))  # pale red — text stays legible
)

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
# No chart.shape here: `shape` (cylinder/cone/box/pyramid) only exists on
# BarChart3D, not on this 2D BarChart — setting it on a 2D chart is a no-op.
ws_dash.add_chart(chart, "B6")

# ── Config sheet ──────────────────────────────────────────────────────────────
ws_cfg = wb.create_sheet("Config")
ws_cfg["A1"] = "Parameter"
ws_cfg["B1"] = "Value"
header_style(ws_cfg["A1"]); header_style(ws_cfg["B1"])
config_rows = [
    ("Generated", date.today().isoformat()),  # stamped at build time — the only
                                               # signal a static snapshot carries
                                               # of its own age
    ("Start Date", "2024-01-01"),
    ("End Date", "2024-12-31"),
    ("Revenue Target", 3000000),
    ("Win Rate Target", 0.35),  # referenced by Config!$B$6 in the conditional
                                # format above — row 6 because "Generated" now
                                # sits above it; keep the two in sync
]
for i, (k, v) in enumerate(config_rows, 2):
    ws_cfg[f"A{i}"] = k
    ws_cfg[f"B{i}"] = v

# ── Save ──────────────────────────────────────────────────────────────────────
wb.save("output.xlsx")
print("Saved output.xlsx")
```
