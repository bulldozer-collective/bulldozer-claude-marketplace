# Platform Format Patterns

Reference for `ad-creative-brief` Step 4 (Visual Direction) and the hand-off to
`video-ad-production`. One concept, adapted per platform — never resize a shot blindly;
recompose it for the new aspect ratio.

## Image and video dimensions by platform

| Platform | Placement | Ratio | Typical size |
|---|---|---|---|
| Meta (Facebook/Instagram) | Feed (image or video) | 1:1 or 4:5 | 1080×1080 / 1080×1350 |
| Meta | Stories / Reels | 9:16 | 1080×1920 |
| Meta | Carousel card | 1:1 | 1080×1080 — keep every card in the same ratio |
| Meta | Link ad (legacy feed) | 1.91:1 | 1200×628 |
| TikTok | In-Feed / Spark Ads | 9:16 | 1080×1920 |
| LinkedIn | Single image, landscape | 1.91:1 | 1200×628 |
| LinkedIn | Single image, square | 1:1 | 1200×1200 — LinkedIn's own spec treats square as a first-class size, not a fallback |
| LinkedIn | Vertical (mobile feed) | 9:16 | 1080×1920 |
| Pinterest | Standard Pin | 2:3 | 1000×1500 |
| Pinterest | Square Pin | 1:1 | 1000×1000 |
| YouTube | In-stream / display video | 16:9 | 1920×1080 |
| YouTube | Thumbnail | 16:9 | 1280×720 |
| Programmatic display (IAB) | Medium Rectangle | — | 300×250 |
| Programmatic display (IAB) | Leaderboard | — | 728×90 |
| Programmatic display (IAB) | Skyscraper / Half Page | — | 160×600 / 300×600 |
| Programmatic display (IAB) | Billboard | — | 970×250 |
| Programmatic display (IAB) | Mobile banner | — | 320×50 |

These are the sizes third-party platform guides converge on as of 2026 — platforms adjust
supported ratios often, and sources disagree on edge cases (for instance, whether a 4:5
image is accepted inside a Meta carousel card). Treat this table as a starting point for
the visual direction, and confirm the exact current spec in the platform's own ads manager
before a production run — never promise a size to a designer without that check.

## Adapting one concept across platforms

Start from a single platform-agnostic concept (angle, headline, visual direction, CTA)
from Step 4, then adapt it per placement:

- **Simplify for small formats.** A 320×50 mobile banner or a display rectangle needs
  roughly half the words of a feed post — cut to the headline and one supporting line.
- **Compose for the ratio, don't crop into it.** A 9:16 Reel and a 1:1 feed post need
  different framing of the same subject, not the same shot resized after the fact —
  reframe before handing off to production.
- **Respect safe zones on vertical formats.** Stories, Reels and TikTok overlay UI
  elements (profile, CTA button, captions) near the top and bottom of the frame. Meta
  consolidated its Stories/Reels placements into a single 9:16 safe zone calibrated to the
  most constrained one (Reels) — keep headline text and logos out of roughly the top 14%
  and bottom 35%, not a shallower bottom margin from older guidance.
- **Match tone to the platform, not just the format.** More polished on LinkedIn, more
  native/UGC-styled on TikTok, more aspirational on Pinterest — same angle, different
  voice.
- **Adjust the CTA wording to what the placement actually offers** (e.g. "Shop Now" vs.
  "Learn More" vs. "Sign Up") rather than forcing one CTA label everywhere.

## Source

Format-pattern guidance adapted from Creatify-AI/static-ad-concept-generator (MIT ©
Creatify AI) and cross-checked against current (2026) third-party platform-spec guides —
no single source agrees with every other on every edge case; most of this table is the
converging consensus, not an official export from any one platform. Two exceptions are
confirmed against the platform's own page: LinkedIn's 1200×628 / 1200×1200 single-image
sizes (linkedin.com/help/lms/answer/a423644 and business.linkedin.com/advertise/ads/
sponsored-content/single-image-ads-specs), and Meta's consolidated 14%/35% Stories/Reels
safe zone (Meta's March 2026 placement consolidation, confirmed via WebSearch — Meta's own
ads-guide pages were unreachable from this environment at the time of writing). Everything
else here still needs the platform's ads manager checked before a production run.
