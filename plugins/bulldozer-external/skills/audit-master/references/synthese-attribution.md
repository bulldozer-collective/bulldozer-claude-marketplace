# Synthèse multi-audits — permissions HubSpot et pièges d'attribution GA4

Détail appelé depuis `SKILL.md` : Step 4 bis (briefing de l'audit CRM) et Step 5
(synthèse). À lire quand on brief le sub-skill CRM sur l'attribution multi-touch, ou
quand on s'apprête à faire entrer une trouvaille dans la synthèse finale.

## Le scope HubSpot qui manque le plus souvent (Step 4 bis)

The multi-touch attribution report needs a separate permission from basic CRM read
access — a `marketing.campaigns.read`-class scope on the HubSpot side — and when that
scope is missing, the report call fails outright with an insufficient-scope error
rather than returning a partial or degraded number; deal and contact records can keep
reading fine in the same session, which makes it look like an auth problem when it's
really one missing permission. Confirm with one real call before briefing the CRM
audit to expect this data, and if it fails, name the exact missing scope to the
client's HubSpot admin instead of treating the discrepancy as a data-quality finding.

## Deux réponses mécaniques à ne pas confondre avec une panne (Step 4 bis)

Two other responses from that same call are mechanical, not permission failures, and
shouldn't be diagnosed as either the scope issue above or a data problem: a first call
in the session that skipped reading the tool's own usage instructions comes back
`READ_TOOL_INSTRUCTION_REQUIRED` instead of a report — retry once with the
instructions read, it isn't a second missing scope; and a heavy query (wide date
range, multiple dimensions) can come back `PROCESSING` with a task ID to poll rather
than the report itself — that's a query still running, not a failure to brief the CRM
audit about.

## Les trois contrôles avant de traiter une trouvaille comme une tendance (Step 5)

Before a finding goes into the synthesis as a trend rather than a data point, check
the three things a rushed sub-skill tends to skip: the lookback window against the
domain's own cycle length (a paid audit citing a CTR drop from a few days of spend, or
a CRM audit crediting revenue on a window shorter than the sales cycle, is measuring
noise and calling it a finding), the underlying volume behind any comparison (a
segment cut by rep, region, or plan tier that leaves only a handful of deals per group
can't support the fix list built on it), and whether the platform's own attribution
model quietly changed rather than the tracking breaking.

Two distinct causes can produce that same silent shift, and a sub-skill should name
which one before the finding is trusted: GA4's data-driven attribution falls back to
last-click with no warning in the interface once a conversion action drops below its
own eligibility bar — several independent secondary sources put that bar at roughly
400 conversions on the action itself and 20,000 total conversions across all actions
within the property's lookback window, never confirmed on an official Google page —
and separately, GA4 went through a data-driven attribution recalibration in April 2026
that reset some properties back onto the data-driven model — and rebalanced channel
credit — even where a different model had been manually selected. A before/after
divergence around that period is as likely to be the reset as the eligibility
fallback; check Attribution Settings for a model change, not only the conversion
volume, before calling either one a real performance shift. A sub-skill that can't
state its own window, volume, and attribution model isn't ready for synthesis — that
gap is itself a fix-list item, not a footnote to wave through.

Don't borrow Google Ads' own published DDA thresholds to fill this gap — they're a
different product's numbers, not GA4's. Google's own Ads Help Center documents an
exact, official bar at the conversion-action level: a Google Ads conversion action
needs at least 300 conversions and 3,000 ad interactions within 30 days to become
eligible for data-driven attribution, and falls back out of it if it drops below 200
conversions and 2,000 interactions in a trailing 30-day window. That's real and
sourced, but it's Google Ads' conversion-action model, not a GA4 property's — GA4 has
no equivalent official number for its own data-driven attribution, officially
documented or otherwise, as of this check. Treat the ~400/20,000 GA4 figure above as
still unconfirmed, and never substitute the Google Ads 300/3,000 or 200/2,000 figures
for it in a GA4-specific finding.

## Le raccourci qui évite de refaire ce calcul à la main (Step 5)

One of those checks doesn't have to be built by hand: Bulldozer OS already runs
anomaly detection on every GA4 report it stores, flagging any metric that deviates
more than two standard deviations from its own history. A sub-skill building a
period-over-period GA4 comparison should read that flag first — `hasAnomaly` on the
lightweight report list, `anomalyDetails` on the full stored report — instead of
eyeballing a percentage change and writing it up as a finding. Treat the two
directions the same way: a swing the OS already flagged is a stronger finding than one
a sub-skill spotted by hand, and a swing that produced a large eyeballed delta without
tripping the flag is itself worth a second look — a volume or window problem more
often than a real trend — before either goes into synthesis.
