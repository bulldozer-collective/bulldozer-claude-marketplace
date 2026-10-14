# Bulldozer OS analyses used by this skill

Detail moved here from the main text to keep `SKILL.md` under its length cap — every
sentence below is unchanged from the original, just regrouped by analysis. The main
text names each of these at the point where it matters; come here for the mechanics.

## Competitor tracking (Category Map)

**If competitors are already tracked for this client's project in Bulldozer OS, pull that list first instead of typing "Typical Alternatives" from memory.** Each tracked competitor links to a real company record; if a true alternative isn't tracked yet, look it up by its website and add it rather than guessing at names. This only covers named competitors, though — Bulldozer OS has no dedicated way to track a non-software alternative (the spreadsheet, the incumbent process, doing nothing). That row of the table still comes from sales conversations and win/loss notes, not from the tool: the most frequent "competitor" in B2B is rarely a competitor at all.

## Competition-intensity (Five Forces — "Existing rivals")

**If a competition-intensity analysis has completed for this client's project in Bulldozer OS, use it to score "Existing rivals" instead of an eyeball call:** it rates each tracked competitor channel by channel (SEO, paid search, CRO, GEO, Meta, LinkedIn, organic social) on a 0–100 scale, alongside an estimated monthly media budget range — real inputs for "how entrenched," not an impression. Regenerating it is an async job scoped to the whole project (it always recovers every tracked, non-inspiration competitor at once, never a single one on demand), so judge freshness from when the run started, not when the record was first created — re-runs reuse the same record.

## Offer-structure (Category Structure — Fragmented/Consolidated)

**Bulldozer OS can ground the Fragmented/Consolidated read instead of leaving it to judgment.** An offer-structure analysis, when run for this client's project, returns a market-organization verdict (on a scale from a tight monopoly through to a fully atomized field), a written justification, an estimated top-3 combined share expressed as a range, 2–4 competitor categories, and 8–15 named competitors with estimated revenue and headcount. Those revenue and headcount figures come from partial public sources (Crunchbase, LinkedIn, company registries) and the tool says so explicitly — cite them as directional order-of-magnitude, never as verified numbers in front of a client. The verdict only measures concentration, though: it doesn't distinguish "Emerging" from "Declining," so that half of the table stays a qualitative call. Running it requires a company with a website already linked to the project, and it's an async job like the competition-intensity analysis above.

**The justification and the top-3 share aren't plain text — read the correction, not the AI draft, when one exists.** Bulldozer OS returns the verdict's justification, its top-3 share, and the analysis' note as `{value, override, overridden}`, not as a bare string: `value` is what the model produced, `override` is a teammate's correction. Show `override` whenever `overridden` is true, `value` otherwise — otherwise a client who already fixed the AI's read sees it resurface unchanged in your deliverable. The same {value, override, overridden} shape carries through to the positioning-map (each axis's `label`, `lowLabel`, and `highLabel`, plus the synthesis note) and demand-intensity fields (verdict, capture score, capturable-volume estimate, note) cited later in this document; check it every time you quote one of these analyses verbatim.

## Positioning-map (Positioning Recommendation)

**If this client's project already has a completed value-proposition analysis, a completed market-perception analysis, and at least one tracked competitor in Bulldozer OS, a positioning-map analysis can plot the whitespace directly** — a two-axis map with every tracked competitor and the company itself placed and justified, plus a synthesis note on where the defensible quadrant sits. Use it as the starting map instead of filling the axes from a blank table. Missing any one of the three prerequisites triggers a hard error rather than a partial result, and a run still in progress or errored means falling back to building the map by hand for now.

**Same read-the-override rule as offer-structure above — and it applies three times per axis, not once.** Each axis (axisX/axisY) wraps `label`, `lowLabel`, and `highLabel` independently as `{value, override, overridden}`, alongside the synthesis note — a teammate can correct the axis's name without touching its low/high anchor text, or the reverse. Check `overridden` on all three sub-fields before citing an axis, never just the one that's easiest to read, and show `override` wherever it's true.
