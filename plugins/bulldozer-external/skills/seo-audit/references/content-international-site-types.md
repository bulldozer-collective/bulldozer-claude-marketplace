# Content Quality, International SEO and Common Issues by Site Type

## Content Quality, International SEO and Common Issues by Site Type

### E-E-A-T Signals

**Experience**: First-hand experience demonstrated, original insights, real examples
**Expertise**: Author credentials visible, accurate/detailed information, properly sourced claims
**Authoritativeness**: Cited by others, recognized in the space
**Trustworthiness**: Accurate info, transparent business info, contact details, HTTPS

E-E-A-T comes from Google's Search Quality Rater Guidelines (last major update September 2025, still the operative version). It is not itself a ranking factor and there is no page-level "E-E-A-T score" — human raters use these criteria to judge sample pages, and those judgments train Google's ranking systems. Frame findings here as "this page reads as low-trust because X, Y" rather than "this page fails E-E-A-T," which overstates what the framework actually measures.

### Common Content Quality Failures

- Thin pages: little unique content, mostly duplicated from elsewhere
- AI-generated content with no editing: lacks specificity, uses telltale patterns (em dashes everywhere, "delve," "landscape," excessive hedging)
- Outdated content not refreshed: stale dates, old statistics, deprecated information
- Keyword cannibalization: multiple pages targeting the same keyword and competing with each other. Check with `bdzGetSeoDomainKeywords` (when an SEO domain is registered) — two rows with the same keyword and different URLs is the real signal, not a guess from reading pages. But shared keyword alone isn't proof: check search intent before recommending a merge or redirect. A "what is X" page and a "X pricing" page can legitimately share a keyword while serving different steps of the same buyer's journey — merging them serves neither reader.
- A keyword table inflated by the client's own brand name reads as health that isn't there. `bdzGetSeoDomainKeywords` supports `sortField: branded` — pull it and look at the non-branded rows separately before judging "how well is this site actually ranking." A top-10 keyword list that's mostly the company name isn't a content quality signal, it's navigational search; don't let it hide that the site has little real non-branded visibility.

---

## International SEO (When Applicable)

### Hreflang Requirements

| Requirement | Why it matters |
|-------------|---------------|
| Self-referencing entry on every page | Without it, all hreflang ignored |
| Reciprocal links (A→B, B→A) | One-directional pairs are dropped |
| Valid language codes (e.g., `en-GB`, not `en-UK`) | Invalid codes cause the pair to be discarded |
| `x-default` for fallback URL | Required for proper locale routing |
| All target URLs return 200 and are indexable | Non-canonical targets invalidate the cluster |

**Common hreflang errors**: missing self-reference, no return tag, invalid region codes (en-UK instead of en-GB), hreflang target is 301 redirect.

### Canonicalization for Multilingual Sites

- Each locale page must self-canonical (`/fr/page` → canonical `/fr/page`)
- Never cross-locale canonical (French page canonical to English = French version suppressed entirely)
- Canonical must appear in hreflang set — if not, hreflang is silently ignored

---

## Common Issues by Site Type

**SaaS/Product Sites**: Thin feature pages, no comparison/alternative pages, blog not linked to product, missing glossary/educational content.

**E-commerce**: Thin category pages, duplicate product descriptions from manufacturer, faceted navigation creating duplicate URL crawl traps, out-of-stock pages mishandled (should 301 to category, not 404).

**Content/Blog Sites**: Keyword cannibalization, outdated content not refreshed, no topical clustering, weak internal linking structure.

**Local Business**: Inconsistent NAP (Name, Address, Phone) across directories, missing local schema, no Google Business Profile optimization — check whether a GBP location is already registered and syncing in Bulldozer OS (`bdzListGbpLocations`, `bdzRegisterGbpLocation`, `bdzSyncGbpLocation`) before recommending manual GBP work as if nothing were connected.
