# Keyword Strategy and Negative Keywords

**Finding keywords — don't guess volumes.** If the account is registered in Bulldozer OS, `bdzGenerateSeaKeywordIdeas` calls Google's own Keyword Planner for up to 100 seed keywords (or a landing page URL) in a single call, returning average monthly searches, a competition level, low/high CPC bid estimates in the account's own currency (never assume USD — it comes from the Google Ads account, not a default), and a month-by-month seasonality breakdown. Send every seed keyword in one call: the server batches them by 20 for Google internally, but looping one keyword per call burns through the account's shared Keyword Planner quota and gets it rate-limited (HTTP 429).

**Match types**:

| Match type | How it works | When to use |
|-----------|-------------|-------------|
| Exact [keyword] | Shows for that query and Google's own "close variants" of it — same intent, different wording (plural/singular, word order, synonyms, some paraphrases). Not a literal string match anymore. | Brand terms, high-value bottom-funnel |
| Phrase "keyword" | Shows when the phrase's meaning is included in the query | Specific products, competitor terms |
| Broad keyword | Shows for related queries, matched by intent/context rather than keyword text | Discovery; only with strong negative list |

**Match type progression**:
- Start with phrase and exact match
- Add broad match only after building negative keyword list
- Never run broad match without conversion data — Google's definition of "related" is very loose, and exact match itself already casts a wider net than the keyword text suggests

**A keyword's text and match type are immutable once created.** Widening a phrase-match keyword to broad, or fixing a typo, isn't an edit — Bulldozer OS's keyword update (`bdzUpdateSeaL3`) can only pause/resume it or change its bid; the text and match type themselves can't move. Changing either means pausing the old keyword (`bdzUpdateSeaL3`, status paused) and creating a replacement (`bdzCreateSeaL3`).

**When broad match is actually safe to trust**: it needs four things true at once — verified conversion tracking, Smart Bidding genuinely engaged (not still on Manual CPC), an active negative-keyword habit (not a one-time list), and enough conversion volume to give the algorithm something to learn from. Missing any one of the four, broad match burns spend on tangential queries faster than the negative list can catch it. **Lead-gen accounts are the highest-risk case** — a loose match doesn't just waste budget, it floods the CRM with junk leads that look like pipeline until someone qualifies them. Treat "we're on Smart Bidding" alone as insufficient justification to open up broad match.

**AI Max for Search**: no longer purely opt-in. Since September 1, 2026 Google has been auto-upgrading eligible Search campaigns to AI Max, with the rollout expected to finish by the end of September 2026 — the trigger is either of two existing settings (Automatically Created Assets, or broad match at the account or campaign level), not a request from the advertiser. AI Max extends your keywords automatically and can generate/complete RSA assets from the query itself. Once a campaign has been auto-upgraded, Final URL expansion can no longer be turned off entirely — only constrained, via page feeds and URL exclusions. A structure built around tightly-controlled exact match and pinned messaging should check for Automatically Created Assets and broad match now, before the account is upgraded on Google's timeline instead of its own, and plan to lean on page-feed/URL exclusions as the fallback once it is.

### Negative Keywords (Build This Before Launch)

**Always exclude**:
- Job-related: jobs, careers, hiring, salary, resume
- Education: course, certification, degree, training (unless you offer these)
- Competitors (in non-competitor campaigns)
- Irrelevant use cases specific to your product
- Free versions (if you don't have one): "free," "open source"

Build a 50–100 term negative list before launch. Add from search terms report weekly for the first month.
