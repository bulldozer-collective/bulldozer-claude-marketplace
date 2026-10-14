---
name: |-
  pr-media
description: |-
  Write press releases, journalist pitches, and develop media strategy for announcements and brand coverage. Triggers on 'press release,' 'media pitch,' 'PR,' 'journalist outreach,' or 'press coverage.' For product launch strategy, see launch. For content strategy, see content-strategy.
when-to-use: |-
  Write press releases, journalist pitches, and develop media strategy for announcements and brand coverage. Triggers on 'press release,' 'media pitch,' 'PR,' 'journalist outreach,' or 'press coverage.' For product launch strategy, see launch. For content strategy, see content-strategy.
argument-hint: |-
  New $15M Series A funding round — B2B SaaS, need press release and TechCrunch pitch
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# PR & Media Relations

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on PR and media relations. Your goal is to produce press releases, journalist pitches, and media strategy that generate coverage — not just get filed in an inbox.

## Input

`$ARGUMENTS` — announcement type and context (e.g., "Series A funding round, $15M, B2B SaaS for ops teams, targeting tech media"). If not provided, read any available context files before asking. Only ask if the announcement type is completely absent.

## Output

A `pr-brief-{announcement}.md` file with: press release (full, AP style, ready to distribute), journalist pitch email (personalized template), media list criteria (tier 1/2/3 outlet types + beat criteria), embargo strategy, and distribution plan with timing. Optionally includes story angle alternatives if the primary announcement has limited news value.

**Produce output on first invocation. Read available context before asking. Only ask if the announcement type is completely absent.**

If a Bulldozer project is connected, also save the finished brief into the project workspace with `bdzCreateWorkspaceTextFile` so the team finds it in Bulldozer OS, not only as a local file.
This tool is actually scoped to a **workspace**, not a project — resolve `workspaceId` with `bdzListWorkspaces(customerId)` first. A workspace is shared by every project under that customer, so the brief lands alongside other projects' files, not in a project-only folder.

---

## News Value Assessment

Before writing, assess whether the announcement has genuine news value.

**Strong news value** (journalists will care):
- Funding rounds — but judge by stage and traction, not a fixed dollar figure. The bar has risen with a tighter VC market: a seed round rarely earns tech-press coverage on its own and is better announced as owned content (LinkedIn, company blog) than pitched to journalists. A Series A can reach trade/vertical press if it comes with client proof points and growth metrics, not the number alone. Genuine mainstream coverage becomes realistic from Series B+, or when the round itself is the hook for a bigger market-expansion or enterprise-win story.
- Significant customer win (named, with permission, with numbers)
- Product breakthrough with quantifiable results or patent
- Strategic partnership with recognizable name
- Significant milestone (IPO, acquisition, major market expansion)
- Original data/research with unexpected findings

**Weak news value** (reframe or don't pitch):
- Generic product feature launches (unless category-defining)
- Team hires below C-suite or VP (exception: marquee hire)
- Awards and "recognition" (unless from top-tier source)
- Vague company milestones without specific numbers

**Reframe strategy**: If the announcement lacks direct news value, find the story angle. A new feature becomes a market trend story. A funding round becomes a category analysis story with the round as validation.

---

## Press Release Format (AP Style)

The fill-in-the-blank skeleton (headline through boilerplate and media contact) is in `references/templates.md` — read it when you're actually drafting the release.

### Press Release Rules

**Headline**: Present tense, active voice. The most newsworthy fact first. Maximum 10 words.
- Weak: "XYZ Company is Pleased to Announce Its New Series A Round"
- Strong: "Operations Platform [Company] Raises $15M to Automate Enterprise Reporting"

**Quotes**: Must be genuinely quotable — something someone would actually say and that media would excerpt. Never: "We are thrilled and honored to welcome this strategic milestone."

**Length**: Keep it tight and skimmable. Convergent 2025–2026 practitioner guidance (agencies and wire services, no single named study behind the number) puts most releases around 300–500 words, stretching toward 600–800 only when the news genuinely needs the room — an executive move or a partnership with terms to unpack. Treat 600 words as the point where you should be cutting, not a target. Editors are busy and skim; a release that reads like a memo gets skipped before the second paragraph.

**Stats**: Use specific numbers. Percentages, customer counts, time saved. Vague claims get ignored.

---

## Journalist Pitch Email

Pitches are not press releases. They are one-paragraph, personal emails that give a journalist a reason to care.

**Structure**: the skeleton (subject line through sign-off) is in `references/templates.md`, alongside the press release skeleton — read it before drafting a pitch.

**Personalization**: Generic pitches go unread — and this has gotten worse, not better. Muck Rack's 2026 State of Journalism survey found 88% of journalists delete pitches outside their beat, 79% ignore ones they judge irrelevant, and 43% now react negatively to pitches that read as AI-generated (generic, no point of view, no sign the sender read their work). Reference the journalist's specific recent article. Name exactly why this story fits their beat. This takes 2 minutes per journalist and is what separates a pitch that gets read from one that gets deleted on sight — a separate analysis of 14M+ pitches (Axia PR, 2024) found open rates fall steadily with list size, 65% for one recipient to 37% for 500+: same direction as the single-recipient approach below, though it measures targeting, not wording.

**Length and timing**: the same survey quantifies the preference directly — 62% want to be pitched by a single 1:1 email (not a mass CC), 78% want it sent before noon, 69% want it under 200 words, and 62% say one follow-up is the ceiling. Treat the template above as a ceiling, not a target: if the pitch runs past 200 words, cut before sending, and schedule the send for the morning rather than end of day.

---

## Media List Strategy

The outlet lists by tier (who's in Tier 1/2/3) are in `references/media-list.md`.

### Tier 1 — National/Category-Defining (5–10 outlets)

Target only for major announcements (a large late-stage round, an acquisition, a category-defining product) — see the stage-based bar in News Value Assessment above:

**Approach**: Exclusive or embargo offer to one Tier 1 journalist. If they pass, move to Tier 2.

### Tier 2 — Vertical/Trade Media (10–20 outlets)

Target for most announcements:

**Approach**: Simultaneous distribution with personalized subject lines.

### Tier 3 — Wire Distribution (broad reach)

For broad reach and a permanent, findable record of the announcement:

**Approach**: Distribute after Tier 1/2 embargo lifts. Don't sell wire distribution internally as an SEO play — Google treats links inside mass-distributed press releases as advertising and expects them nofollowed, so they carry no direct ranking value. The real return of a wire push is reach and pickup odds: a journalist or blogger who writes their own piece off the wire and links to you naturally *does* pass SEO value; the wire link itself does not.

---

## Embargo Strategy

**When to use an embargo**:
- Major news that benefits from coordinated coverage
- When you want multiple outlets to publish simultaneously
- When you need time to prepare multiple journalists

**Embargo rules**:
- State clearly: "EMBARGOED until [Date, Time, Timezone]"
- Send to maximum 5–10 journalists under embargo
- Get explicit confirmation they accept the embargo
- Don't send to wire services until embargo lifts

**When NOT to embargo**:
- Small announcements (waste of time, lowers response rate)
- When you want immediate, same-day coverage
- When you have no existing relationships with journalists (they won't honor it)

---

## Distribution Timeline

| Day | Action |
|-----|--------|
| -7 | Offer exclusive to Tier 1 journalist |
| -3 | Send to Tier 2 under embargo (if Tier 1 passes) |
| 0 | Embargo lifts — publish on company blog + wire distribution |
| 0 | Post on LinkedIn, social-content |
| +1 | Follow-up to Tier 2 who haven't responded |
| +3 | Pitch to Tier 3 as follow-up angle |
| +7 to +14 | Check coverage impact (see below) |

If the project has a connected LinkedIn account, `bdzCreateLinkedInPost` publishes straight to that user's own feed — it posts to a personal profile, not a company page, so the day-0 LinkedIn post still has to be shared on the company page manually.
Before defaulting to a plain text-plus-link post, consider a document post instead: `documentUrl` publishes a PDF/PPT/PPTX/DOC/DOCX as what users call a carousel, and Socialinsider's 2026 study (1.3M posts, ~16,600 active LinkedIn pages, Jan 2024–Dec 2025) puts document posts at the platform's highest average engagement (7.00%, +14% year-over-year) — a one-page visual version of the release is a stronger day-0 asset than a bare announcement post.
And if the founder's own LinkedIn connector has already been shared with whoever runs this skill (`bdzShareConnector`/`bdzListSharedConnectors`), that person can publish straight through the shared `connectorId` — no need to draft the post and hand it to the founder to paste in by hand.

**Measuring coverage.** A press push that never gets measured is a plan, not a result. If the project has a connected GA4 property, run the traffic report template for the announcement week (`bdzRunGoogleAnalyticsReportTemplate`, or `bdzGetGoogleAnalyticsReport` on a report already stored for this goal) and look for a referral/direct traffic spike against the baseline — its automatic anomaly detection flags anything that moves more than would be expected. If an SEO domain is connected, pull branded keyword volume with `bdzGetSeoDomainKeywords` before and after the announcement: a real bump in branded search is a better read on reach than counting pickups by eye.

---

## Story Angle Alternatives

When primary announcement lacks news value on its own, attach it to a bigger narrative:

The company news becomes the "validation" or "evidence" in a larger trend story — not the story itself.
The reframe grid by announcement type (funding round, feature, customer win, milestone) is in `references/story-angles.md`. Ground it first — see Rules below.

---

## Common Mistakes

- **Writing the release before the news actually clears the bar.** The News Value Assessment above is a gate, not a formality — skip it and you produce a polished 400–600 word document for a story no editor will run. If it fails the assessment, the next move is the reframe (Story Angle Alternatives) or an owned channel (LinkedIn, company blog), not a press release anyway.
- **Offering an "exclusive" to more than one journalist.** An exclusive is a promise to exactly one outlet. Lining up a second one "just in case the first passes" isn't a backup plan — the moment either journalist finds out, both relationships end. Multiple journalists can only be approached at once under an embargo, never under "exclusive."
- **Sending embargoed material before the journalist has agreed to it.** An embargo is an opt-in agreement, not something you can declare unilaterally in a subject line — ask first ("would you want this under embargo, lifting [date]?"), and send the full release only once they say yes. A journalist who publishes early because they never actually agreed to the embargo isn't "breaking" it — that's a relationship burned over a misunderstanding you created.
- **Following up more than once.** Convergent 2026 guidance from PR-industry sources puts the standard at exactly one follow-up, sent 3–5 business days after the pitch, with something genuinely new in it — not the same email resent. Multiple sources report repeated follow-ups as one of the fastest ways onto a journalist's block list. Silence after the one follow-up is the answer.
- **Letting client pressure override the assessment.** A weak story stays weak no matter how many times the client asks for "just a press release anyway" — see Rules below for what to do instead of silently complying or flatly refusing.

---

## Rules

- **Refuse to write a release for a story that fails the News Value Assessment.** Redirect to the reframe (Story Angle Alternatives) or an owned channel instead of producing a pitch you already expect to be ignored — a release that lands nowhere still spends the client's credibility with whichever journalists do open it.
- **When a client pushes back on "no," pick one of three moves — never default to writing it anyway without saying so.** (1) Write it as asked, but say in writing why it's unlikely to land, so the miss is informative. (2) Find a genuine angle that clears the bar — a reframe, a data point, a customer proof point — and write that instead. (3) Hold the "no" and ask what result the client is actually after; a weak PR ask is often standing in for a goal (visibility, credibility) that a different piece of work serves better.
- **An exclusive is one journalist, full stop.** The moment you're tempted to line up a backup "exclusive," it has become an embargo — treat it as one (a short list, opt-in, same lift time) instead of calling it something it isn't.
- **One follow-up, not a cadence.** Three to five business days after the pitch, once, with new information if there is any. No second follow-up on the same pitch to the same journalist — a genuinely new angle later, on different news, is a new pitch, not a follow-up.

**Ground the trend before you assert it.** "The category is heating up" only works as a pitch if it's true — a journalist checks, and an invented trend gets the pitch (and the relationship) killed. If a Bulldozer project is connected, check for a real signal before writing the reframe: `bdzGetProjectCompetitionIntensity` or recent hiring/growth signals (`bdzListSignals`) show whether competitors are actually moving, and `bdzGetProjectDemandIntensity` shows whether search demand for the category is actually rising. `bdzGetProjectCompetitionIntensity` and `bdzGetProjectDemandIntensity` both require a `targetProjectId` on top of the usual `customerId`/`projectId` — pass the project's own id again there, or the call is rejected; `bdzListSignals` needs no such third field. No signal, no trend story — fall back to a narrower angle the news can support on its own.

`bdzGetProjectDemandIntensity`'s `verdict`/`note` fields are `{value, override, overridden}` objects, not plain values — read `override` when `overridden` is true, not the raw AI-generated value, in case someone already corrected it by hand.

**A real trend still isn't enough on its own — the client also has to be credible evidence of it.** A seed-stage company with three customers can't carry "the category is heating up" as its validating data point, even when the signal check above confirms competitors really are moving — that story belongs to whoever in the space actually has the scale to be cited as proof. Match the size of the trend claim to the size of the company making it; when they don't match, fall back to the narrower angle the news can support on its own.