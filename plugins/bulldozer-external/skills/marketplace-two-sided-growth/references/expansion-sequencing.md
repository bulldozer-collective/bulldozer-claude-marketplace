# Expansion Sequencing — Detail

**Three expansion waves, each borrowing credibility from the last:**

**Wave 1 — the beachhead.** One category, one geography, narrow enough that the founding team could personally serve every buyer if the platform failed to scale. This is where Steps 1–5 apply in full.

**Wave 2 — adjacent categories.** Segments sharing the same buyer, a similar buying trigger, and supply that already partially overlaps with beachhead suppliers — a fractional-CFO marketplace expanding to fractional controllers, not to graphic design. Buyer trust and much of the supply-recruitment motion transfer; they don't have to be rebuilt from zero.

**Refuse a Wave 2 candidate justified by market size alone.** A category pitched because it "opens up a bigger TAM" without first passing the same-buyer / same-trigger / overlapping-supply test above is a new beachhead wearing an adjacency argument — it inherits none of the trust or supply-recruitment transfer that makes Wave 2 cheaper than Wave 1, and it should be planned and gated like a fresh cold start, not folded into an "adjacent" expansion budget. This is the single most common way a sales team's enthusiasm for a bigger number turns Wave 2 into a second cold-start problem run on the assumption it would be easy.

**Wave 3 — new verticals or geographies.** Only after Wave 2 independently clears the expansion gate above. A new geography resets supply density to zero even inside a proven category — liquidity doesn't travel across geographies, only the playbook does.

**Sequencing *which* geography, not just whether to open one.** Between two Wave 3 candidates, the bigger headline market isn't automatically the right first move — a smaller market close to the beachhead on every dimension that makes a cold start faster to re-run will often clear the expansion gate sooner than a larger, farther one. The CAGE Distance Framework (Pankaj Ghemawat, introduced in his 2001 *Harvard Business Review* article "Distance Still Matters") names four gaps worth checking before picking: Cultural (language, norms, buying customs), Administrative (legal regime, trade blocs, data-localization rules), Geographic (time zones, connectivity, physical distance for anything that ships), Economic (buying power, market development level). A geography that's close on all four re-uses more of the beachhead's supply-recruitment playbook and trust signals than one that's merely bigger on paper — apply the same discipline as the Wave 2 adjacency test above: a bigger-TAM candidate that's also high-CAGE-distance doesn't earn a shortcut just because the number is bigger.

**If this runs inside a Bulldozer OS project, ground the Wave 2/3 choice in real market
analyses instead of a gut feel about "adjacent enough":** `bdzGetProjectOfferStructure`
returns a market-concentration verdict and a top-3 share range for a candidate category —
a fragmented category with no entrenched leader is a better Wave 2 bet than one already
concentrated around an incumbent; `bdzGetProjectDemandIntensity` sanity-checks that real
search demand exists there before committing budget; `bdzGetProjectCompetitionIntensity`
shows whether competitors are already contesting that adjacent space. Read all three as
directional estimates built from public-source data, not verified market figures — they
say where to look harder, not what to put in a board deck.

**Before quoting a narrative field from either analysis in a client-facing deliverable,
check `overridden` first.** On `bdzGetProjectOfferStructure`, the verdict's justification
and the top-3 share range (`verdict.justification`, `verdict.top3Share`) are each returned
as `{value, override, overridden}` — `value` is what the model produced, `override` is a
correction a teammate already made in the OS, to show instead once `overridden` is true.
The same wrapping applies to all four fields `bdzGetProjectDemandIntensity` returns
(`captureScore`, `verdict`, `estimatedCapturableVolume`, `note`). Quoting `value` when
`overridden` is true republishes a reading someone already fixed. `bdzGetProjectCompetitionIntensity`
carries no such structure — its per-channel scores and media-budget range are always the
plain reading, nothing to check there.

**Run these three before the team has committed to a candidate, not after.** Pulled once conviction has already formed around "category X is our obvious Wave 2," they get read selectively — a favorable fragmentation verdict confirms the choice, an unfavorable one gets explained away. Pulled against two or three candidates before any of them is the internal favorite, the same verdicts are a real input to which one gets picked instead of a justification for the one that already was.

**Sequencing discipline: expand one dimension at a time.** New category *or* new geography in a given quarter, never both. Running two cold starts simultaneously is the chicken-and-egg problem twice over, with half the founder attention on each.
