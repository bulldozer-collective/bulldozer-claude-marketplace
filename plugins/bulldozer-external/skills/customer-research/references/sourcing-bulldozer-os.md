# Sourcing from Bulldozer OS — detail

Read this when actually pulling research material from the OS rather than from pasted
transcripts or a fresh web scrape: the exact tool, the field to filter on, and the gotcha
to know before trusting the result. The main skill text has the one-line summary table;
this is the detail behind each row.

Before asking the requester to paste transcripts or export a spreadsheet, check whether the
project already holds real research material — it usually does, and it's higher-signal than
a fresh web scrape.

- **Sales calls and client conversations (Claap).** When the project's workspace has a Claap
  link, `search_recording_transcripts` (Claap MCP) searches call transcripts and — this is
  the useful part — filters directly by `tag`: `PainPoints`, `Objections`,
  `CompetitorMentions`, `FeatureRequests`. Those four tags map almost one-to-one onto this
  skill's Extraction Framework. Results come back grouped by recording, each with its linked
  deal and company. Pull the full text of one recording with `get_recording_transcript`;
  `get_recording` returns just the AI summary first — cheaper, use it to decide whether the
  full transcript is worth fetching. This is Mode 1 material sourced live, not material
  someone has to hand you.
- **Support tickets (HubSpot).** If HubSpot is the connected CRM, its `TICKET` object is
  queryable read-only through `query_crm_data` (`FROM TICKET`) — pull real
  recurring-complaint data instead of asking for a manual export. Confirm the property names
  with `search_properties` first; don't guess them.
- **Win/loss signal (HubSpot).** The `DEAL` object (stage, close date, amount) is the same
  read-only path — cross-reference closed-lost deals against the Claap
  `Objections`/`CompetitorMentions` tags on the same account for a fuller picture of what
  tipped a decision. Bulldozer OS itself does not hold deal stage or win/loss outside of the
  connected CRM: don't invent a native equivalent.
- **On-site feedback or NPS forms.** If the client runs a feedback/NPS form on a connected
  Webflow site, find the form via `bdzListCmsForms` (match on `pageName` + `formElementId`,
  not the display name — several forms often share one) and pull real answers with
  `bdzListCmsFormSubmissions`, filtered on that `formElementId`. There is no dedicated NPS
  object in Bulldozer OS itself; this form path is the closest native equivalent, and only
  works if the client actually built such a form. Before trusting which field in the response
  actually holds the NPS score (or any other specific field), don't rely on the form's
  declared schema (`bdzGetCmsForm`) — it's been observed to omit fields its own submissions
  genuinely contain. Run `bdzPreviewCmsFormFieldMapping` first: it infers the real mapping
  from the form's 20 most recent actual submissions and lists every key it actually observed.
  `submissionsInspected: 0` means the form has never been filled in and the proposal fell
  back to schema labels — treat that read as markedly less reliable.
- **Reviews of your own company.** `bdzListReviews` is native for Trustpilot and Google
  Business Profile only — no other provider. It's the right tool for reading your own
  reviews, not for competitor review mining (see below).
- **LinkedIn engagement on a tracked profile or post.** If a target account or persona
  already has a scheduled LinkedIn refresh running (`bdzCreateLinkedInRefreshConfig`,
  `targetType: PEOPLE` for a profile or `POST` for one specific post, on a
  DAILY/WEEKLY/MONTHLY cadence), `bdzListLinkedInPosts` plus `bdzListLinkedInPostComments` /
  `bdzListLinkedInPostReactions` reads back the comment and reaction text already stored — a
  better default than freeform LinkedIn scanning when the account is already being refreshed
  for another reason. `bdzListLinkedInPosts` only reads what Bulldozer OS already has stored
  and never triggers a live search on its own; with no existing refresh config, pulling fresh
  posts means running `bdzCreateLinkedInPostListJob` and polling `bdzGetLinkedInPostListJob`
  first. Each comment/reaction carries `commenterHeadline` / `reactorHeadline` — tempting to
  drop straight into the "Customer profile signals" extraction field, but it's the
  commenter's self-written LinkedIn headline (a slogan), not a structured job title or
  company field: read it as a directional hint, never a confirmed firmographic match.

## G2, Capterra, Reddit, Hacker News, Discord, app store reviews

Bulldozer OS has no native connector for any of them. `bdzListReviews` / `bdzSearchReviews`
only cover Trustpilot and Google Business Profile — there is no G2 or Capterra provider in
the tool's schema, full stop. Reaching those sources means falling back to Mode 2:
`bdzWebExplorerSearch` to find the page or thread, `bdzWebExplorerExtractContents` to read
one page's content. Both are token-metered — don't call them by default for every ICP row in
the Mode 2 table; reserve them for a specific page or thread you've already decided is worth
reading, the same discipline used for competitor review mining elsewhere in the workshop.

Read what you find on G2/Capterra with the same suspicion you'd apply to any solicited
source. Review-generation campaigns (incentivized asks, timed to a renewal or a support win)
are standard vendor practice on both platforms — a page's reviews are skewed toward the
customers a campaign successfully reached, not an unprompted sample. That cuts both ways:
your own G2 page is inflated the same way a competitor's is. Treat a competitor's
G2/Capterra reviews as a directional read on how they position themselves, never as
confirmed unprompted customer language — an objection your own sales team actually logged
against that competitor (the Claap `CompetitorMentions` tag above) is worth more than a page
of their solicited reviews, and it's already sourced from Bulldozer OS rather than scraped.

One more reason not to read the two sites as independent checks on each other: G2 acquired
Capterra, GetApp, and Software Advice from Gartner in early 2026 (announced January 29, deal
closed February 5) — the same company now runs both platforms' review pipelines, trading as
G2 Digital Markets. The vendor-facing side has been consolidating: several independent
vendor guides (not G2 itself) describe my.G2, as of September 2026, listing all four sites
on one shared product profile with a single submission flow that publishes to Capterra,
GetApp, and Software Advice at once — with vendors reporting friction during the merge
(missing Capterra profiles, logins redirecting to G2, unclaimable listings). That's a
directional read, not a confirmed one: every official G2 domain tried (g2.com, sell.g2.com,
company.g2.com) stays unreachable from this environment, so nothing here has been read at
the source. What stays separate either way: the reviews themselves. Buyers — and AI
assistants researching a category — still see four distinct sites, and reviews still sit in
two pools; a vendor submitting once doesn't merge the review counts or scores across
properties. A competitor's review volume or rating tracking closely between G2 and Capterra
confirms reach into the same solicitation pipeline, not two separate populations of
customers weighing in independently.
