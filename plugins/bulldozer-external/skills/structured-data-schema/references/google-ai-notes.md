# Merchant Center and AI Citation Notes

**A Google Merchant Center account is not a prerequisite for Product rich results.**
This is a common misconception, likely left over from Google folding the old "merchant
listing" markup docs into the single Product structured-data page a few years back — that
was a documentation merge, not a new requirement. On-page `Product` markup with a genuine,
visible `AggregateRating` is enough on its own to earn the plain star-rating snippet in a
normal search result. Merchant Center only starts to matter for the richer, shopping-style
"merchant listing experience" card — a level above the base rich result this skill covers.
Don't tell a client they need a Merchant Center account before they can get stars in search.

**Schema markup does not, on its own, earn AI citations.** Google says so directly: its
Search Central generative-AI guidance (updated July 10, 2026) states structured data
"isn't required for generative AI search, and there's no special schema.org markup you
need to add" — while still recommending it for ordinary rich-result eligibility. This
lines up with the two strongest independent checks found so far. Ahrefs ran a matched
difference-in-differences study (published May 12, 2026) on 1,885 pages that added
JSON-LD between August 2025 and March 2026 against 4,000 control pages: no meaningful
citation lift on Google AI Mode (+2.4%) or ChatGPT (+2.2%), and a small but statistically
significant *decline* on Google AI Overviews (−4.6%) — both changes too small, in the
positive cases, to separate from noise. Caveat worth keeping: every page in that dataset
already had 100+ AI Overview citations before schema was added, so the study says nothing
about whether schema helps a page get into the AI consideration set in the first place,
only that it doesn't move pages already inside it. Separately, a 2026 preprint analyzing
hundreds of AI citations across commercial queries on ChatGPT and Gemini reached the same
conclusion by a different method — entity clarity and content quality carried far more
weight than the presence of schema (not peer-reviewed, treat as a data point, not the
main evidence now that Google's own guidance and the Ahrefs study back the same
conclusion). Secondary marketing sources claim the opposite with precise-looking figures,
but none trace back to an auditable methodology — don't repeat those numbers. Pitch
schema the same way for AI answer engines as for classic rich results: it makes content
that's already good easier for a machine to parse, it doesn't make weak content get
picked.
