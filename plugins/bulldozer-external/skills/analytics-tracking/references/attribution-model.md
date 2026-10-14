# Attribution model — what GA4 and Google Ads actually offer in 2026

The tracking plan in the main skill gets events firing correctly and named consistently.
It does not decide which channel gets credit for a conversion — that's the attribution
model, set in GA4 Admin > Attribution Settings, not in GTM.

## The three GA4 property-level models

Google retired first-click, linear, time-decay and position-based attribution in November
2023. GA4's property-level setting now offers three models, not two:

- **Data-Driven Attribution (DDA)** — the default.
- **Paid and Organic Last Click**.
- **Google Paid Channels Last Click** — a Google-Ads-only last-click model that silently
  falls back to Paid and Organic Last Click whenever a conversion path has no Google Ads
  touchpoint in it, so a report assumed to be "Google Ads only" can still be crediting
  email or organic traffic with no warning shown.

In mid-July 2026, Google Ads' own native attribution-model selector (a separate setting
from the one above) dropped the same four legacy models from its own UI, leaving only DDA
and last-click there too — any conversion action still set to a retired model was
auto-migrated, to DDA where the account qualifies, to last-click where it doesn't.

## Volume required to trust DDA — no reliable number exists today

Don't quote a conversion-volume threshold for DDA eligibility on either surface as if it
were settled — as of October 2026 neither Google Ads nor GA4 documents one on a live,
current help page. Numbers circulate (300 conversions + 3,000 interactions/30 days or
~200/2,000 as a fallback for Google Ads; ~400 conversions/action + 20,000/property for
GA4), but every one of them traces back to either a legacy Universal Analytics/MCF page
(400 conversions per type over 28 days with a 2+ touchpoint path, or a separate UA page
citing 600 conversions/30 days — neither is GA4) or a third-party blog with no official
citation — one of which quotes a Google Ads rep saying the requirement was "recently got
rid of," directly contradicting the same post's own headline number. Treat any specific
figure you see elsewhere (including in another Bulldozer skill) as unconfirmed rather than
repeating it as fact.

What to do instead of citing a number: check eligibility directly in the account rather
than against a memorized threshold.

- **Google Ads** — open the account's "Switch to DDA" page; it lists exactly which
  conversion actions are currently eligible, conversion action by conversion action.
- **GA4** — there's no equivalent eligibility page. Low-volume properties fall back
  silently to cross-channel last-click with nothing flagged in the UI, so watch for the
  symptom instead: if Attribution Settings says Data-Driven but credit keeps landing
  entirely on the last touch, volume is the likely reason, not a broken tag.

## Two practical consequences

1. When a channel's reported conversions swing with no GTM/GA4 config change behind it,
   check Attribution Settings and the lookback window before treating it as a broken tag —
   a GA4 report can be quietly running last-click while looking like DDA — see Common
   Issues in the main skill.
2. Don't let this tracking plan get asked to double as an attribution report. If the team
   needs to argue for channel budget, that's a separate, model-aware conversation (see the
   dedicated attribution skill), not a side effect of firing more events.

## A second, distinct cause of the same symptom

In April 2026 Google restructured GA4's data-driven attribution and, on a number of
properties, reset the attribution model back to data-driven even where it had been
manually set to something else — recalibrating how existing conversions get split across
channels in the process. A historical comparison that straddles that boundary can show a
channel losing or gaining credit with the same underlying conversion volume; that's the
model change showing up, not a tracking regression. Check Attribution Settings for the
model actually in effect (not just the lookback-window volume) before diagnosing a swing as
broken tracking.

---

La liste des trois modèles ci-dessus vient d'une convergence de plusieurs guides
spécialisés indépendants, pas d'une lecture directe de la documentation Google
(`support.google.com/analytics/answer/10596866`, toujours injoignable en WebFetch ce
passage — `ENOTFOUND`, même blocage continu documenté depuis fin août 2026) — à
revérifier directement si l'accès redevient possible. L'absence de seuil DDA chiffré
fiable, elle, n'est plus une simple réserve de source : une recherche web standard du
2026-10-14 sur les pages d'aide officielles réelles de Google Ads et GA4 ne retourne
aucun chiffre nulle part — voir ci-dessus. Une source isolée évoque la possibilité de
régler le modèle d'attribution par événement de conversion plutôt qu'au niveau
propriété : non confirmée ailleurs, à ne pas traiter comme acquis.
