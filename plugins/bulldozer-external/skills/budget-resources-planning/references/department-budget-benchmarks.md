# Department Budget Allocation

## Step 2: Department Budget Allocation

**Benchmarks by stage for B2B SaaS (% of ARR or % of total operating budget):**

**Series A (€1–5M ARR):**
| Department | % of total opex | Notes |
|------------|----------------|-------|
| Engineering / Product | 35–45% | Heaviest spend — product is the moat |
| Sales & Marketing | 35–45% | Build the GTM engine |
| G&A (Finance, HR, Ops) | 10–15% | Keep lean — no office overhead |
| Customer Success | 8–12% | 1 CSM per €1M–1.5M ARR managed |

**Series B (€5–20M ARR):**
| Department | % of total opex | Notes |
|------------|----------------|-------|
| Engineering / Product | 30–40% | Still dominant but GTM catching up |
| Sales & Marketing | 40–50% | Primary scaling investment |
| G&A | 12–18% | More infrastructure required |
| Customer Success | 10–15% | NRR becomes critical at this stage |

**Healthy structure check:** Engineering + Sales/Marketing should account for 65–80% of total opex at every stage. If G&A exceeds 20%, overhead is too high.

**Refuse to force a department's line to match the table.** These bands are a sanity check, not a target — a company with a genuinely lean support load or a specific compliance headcount requirement (regulated industry, a certification the market demands) can sit outside the table for a real reason. Interrogate the reason before trimming or padding a line to make the percentages look right for the board.

**Before adding a marketing headcount line, ask what the money would do as media instead.** A department budget defaults to allocating growth spend as salaries, but the real choice at every stage is hire vs. spend: a marketer hired to run paid campaigns competes for the same euro as the media budget that marketer would manage. Write the tradeoff down — the headcount line and the media line should be sized together, not one after the other as if they were unrelated.

*Same reserve as the growth-rate table above: these splits recur across several 2026 SaaS spend-benchmark write-ups (a commonly cited shorthand is roughly 25–30% R&D / 45–50% S&M / 20–22% G&A of opex at scale), but the underlying studies mix % of revenue and % of opex inconsistently and none is a single named, methodology-published source. Checked again 2026-09-12: SaaS Capital's 2026 spending-benchmark survey now has real numbers reachable through it, confirmed by two independently-worded WebSearch queries that converged on the same five figures (the report page itself is still blocked by this environment's egress proxy, as on 2026-09-08) — but as **% of ARR**, not % of opex like the table above: Sales 15%, Marketing 8%, Customer Success/Support 9%, R&D 22%, G&A 15% (combined S&M ≈ 23% of ARR), all medians across its full private-SaaS sample. Equity-backed companies run well above bootstrapped ones on every line (roughly +70% sales, +100% marketing, +56% R&D, +100% customer success, +64% G&A) — checked again 2026-09-25, unchanged since 2026-09-20 (WebSearch; the report page itself is still blocked by this environment's egress proxy, as on 2026-09-08/09-12/09-20): total spend reads as a single reconciled figure per group, 96% of ARR for bootstrapped companies and 101% for equity-backed, resolving the earlier range that two independent queries didn't agree on as of 2026-09-12. Don't convert these straight into the % of opex table above — the denominators differ, and doing that would repeat the exact reconciliation error this note already warns against. Use them instead as a second, independently-sourced anchor: if a department's real % of ARR sits far from these medians, that's worth a question even before checking it against the % of opex bands.*

**Ground the marketing line in real spend, not just the benchmark.** If ad accounts are connected in the Bulldozer project, pull actual spend and cost-per-conversion by platform (`bdzListRegisteredAdAccounts` + `bdzGetAdAnalytics`) before setting next year's marketing allocation. A department percentage from a benchmark table is a starting point — what the account is actually spending and getting back per euro is what should move the number.

**Check the signal before the number.** `bdzGetAdAnalytics`'s `conversions`/`costPerConversion` fields count only terminal events (purchase, lead, completed registration and similar) — a separate `conversionsPerType` breakdown lists upper-funnel events (view content, add to cart, initiate checkout) that are reported but not included in `conversions`. A third bucket, `custom_pixel_events`, aggregates the account's unnamed custom pixel events for the same reason — also excluded from `conversions`, checked again 2026-09-30, unchanged since 2026-09-12 (ToolSearch). A fourth case is easy to miss because it doesn't show up as its own bucket: a Meta Events Manager custom conversion still appears under the advertiser's own name in the account, but it's counted through whichever standard event it's defined over — so it can be silently excluded from `conversions` the same way, including when the standard event it rides on is itself an upper-funnel one (checked again 2026-09-30, unchanged since 2026-09-25, ToolSearch). A named custom conversion looking present in the account is not proof it's landing in the terminal-events total. A marketing allocation built by summing every event in `conversionsPerType` (or adding in `custom_pixel_events`), or by assuming a named custom conversion is always counted, looks like more proof of ROI than the account actually produced. The bias isn't only one-directional, either: `conversions` becomes an upper bound, not just a possible under-count, when an advertiser fires a custom pixel event alongside the standard event it duplicates — Meta exposes no link between the two, so both get counted. The effect is small (observed at 0.3–2.9% of the total) but real, and in the opposite direction from every other nuance in this paragraph — checked 2026-10-11 (ToolSearch, tool description). And the call defaults to a 180-day lookback when `from`/`to` are omitted — fine for a stable trend, but it means an unqualified call blends six months together and can hide a channel whose cost-per-conversion has been rising for the last month. Pass `from`/`to` explicitly (30–60 days) when the question is "is this channel working right now," not "how has it performed on average."

**Fully-loaded cost multiplier:** Budget 1.25–1.40x base salary for every hire (employer taxes, benefits, equipment, tools, onboarding). A €60K base salary costs €75–85K fully loaded.
