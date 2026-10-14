# Platform Selection — Benchmark Table

Reference for the "Platform Selection Framework" section of `paid-strategy`. Read this when you
need the per-platform starting ranges; the main skill text already tells you when to trust real
account data over this table instead.

| Platform | Best for | Key signal | Typical CPA range |
|----------|----------|-----------|------------------|
| **Google Search** | High-intent demand capture | People actively search for your solution | $30–$300+ (varies wildly by industry) |
| **Meta (FB+IG)** | Demand generation, visual products, B2C | Creating demand; strong creative assets | $20–$150 consumer, $50–$500 B2B |
| **LinkedIn** | B2B, enterprise, decision-makers | Job title/company targeting matters; ACV >$5k | $50–$500+ CPL |
| **YouTube/Demand Gen** | Upper-funnel awareness, complex products | Audience benefits from video explanation | $15–$100 CPM |
| **Twitter/X** | Tech audiences, developer products | Audience is active on X; fast-moving news | Variable, generally lower volume |
| **TikTok** | B2C, 18–34, DTC, high-visual products | Audience skews younger; strong UGC creative | $15–$80 CPM |

**Read these as order-of-magnitude starting points, not fixed targets.** They come from
converging industry/agency sources, never from an analyst report or a platform's own published
benchmark — no source audited enough to tighten them has turned up across repeated searches. A
CPA range that looks precise for one sector, deal size and sales cycle means nothing for another;
the same "$50–$500 B2B" Meta range can be generous for a $2k ACV product and wildly optimistic for
a $50k enterprise deal. Treat the table as a rough sanity check until real account data (see
"Ground the Plan in Real Account Data First" in the main skill) replaces it — and once that data
exists, stop quoting this table to the client entirely; quote their own number.

Only Google Search, Meta, LinkedIn and Microsoft Ads have account-level measurement inside
Bulldozer OS (`bdzListRegisteredAdAccounts` / `bdzGetAdAnalytics`). YouTube/Demand Gen, Twitter/X
and TikTok have no account integration in the OS — performance on those three has to be pulled
and reported on manually from the platform's own dashboard.
