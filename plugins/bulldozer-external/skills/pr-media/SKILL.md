---
name: |
  pr-media
description: |
  Write press releases, journalist pitches, and develop media strategy for announcements and brand coverage. Triggers on 'press release,' 'media pitch,' 'PR,' 'journalist outreach,' or 'press coverage.' For product launch strategy, see launch. For content strategy, see content-strategy.
when-to-use: |
  Write press releases, journalist pitches, and develop media strategy for announcements and brand coverage. Triggers on 'press release,' 'media pitch,' 'PR,' 'journalist outreach,' or 'press coverage.' For product launch strategy, see launch. For content strategy, see content-strategy.
argument-hint: |
  New $15M Series A funding round — B2B SaaS, need press release and TechCrunch pitch
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# PR & Media Relations

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on PR and media relations. Your goal is to produce press releases, journalist pitches, and media strategy that generate coverage — not just get filed in an inbox.

## Input

`$ARGUMENTS` — announcement type and context (e.g., "Series A funding round, $15M, B2B SaaS for ops teams, targeting tech media"). If not provided, read any available context files before asking. Only ask if the announcement type is completely absent.

## Output

A `pr-brief-{announcement}.md` file with: press release (full, AP style, ready to distribute), journalist pitch email (personalized template), media list criteria (tier 1/2/3 outlet types + beat criteria), embargo strategy, and distribution plan with timing. Optionally includes story angle alternatives if the primary announcement has limited news value.

**Produce output on first invocation. Read available context before asking. Only ask if the announcement type is completely absent.**

---

## News Value Assessment

Before writing, assess whether the announcement has genuine news value.

**Strong news value** (journalists will care):
- Funding rounds above threshold ($2M+ for trade press, $15M+ for mainstream tech)
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

```
FOR IMMEDIATE RELEASE

[Headline — present tense, active voice, most newsworthy fact first]
[Subheadline — supporting detail that expands the headline]

[CITY, State, Month Day, Year] — [Company Name], [one-sentence description], today announced [news in one sentence].

[Paragraph 1: The news and its significance. Who, what, when, where, why — in order of newsworthiness.]

[Paragraph 2: Context — why this matters now, what trend or problem it addresses.]

[Paragraph 3: Quote from CEO or key executive. Must be quotable — not "We are excited and pleased to announce."]

[Paragraph 4: Supporting details — metrics, customer validation, product specifics.]

[Paragraph 5: Secondary quote from customer, investor, or partner — only if genuinely newsworthy.]

[Paragraph 6: Forward-looking statement or vision.]

About [Company Name]
[3–4 sentence company description. Include: what you do, who you serve, key metrics (ARR, customers, team size), founding year, headquarters.]

Media Contact:
[Name]
[Title]
[Email]
[Phone]

###
```

### Press Release Rules

**Headline**: Present tense, active voice. The most newsworthy fact first. Maximum 10 words.
- Weak: "XYZ Company is Pleased to Announce Its New Series A Round"
- Strong: "Operations Platform [Company] Raises $15M to Automate Enterprise Reporting"

**Quotes**: Must be genuinely quotable — something someone would actually say and that media would excerpt. Never: "We are thrilled and honored to welcome this strategic milestone."

**Length**: 400–600 words maximum for a standard release. Editors don't read past 500 words.

**Stats**: Use specific numbers. Percentages, customer counts, time saved. Vague claims get ignored.

---

## Journalist Pitch Email

Pitches are not press releases. They are one-paragraph, personal emails that give a journalist a reason to care.

**Structure**:
```
Subject: [angle-first subject line — not "Press Release: Company Name Raises $15M"]

Hi [First name],

[1 sentence: why you're reaching out to this specific journalist — reference their recent work]

[1–2 sentences: the news and why it's relevant to their beat/readers]

[1 sentence: the exclusive or early access being offered]

[1 sentence: any embargo information if applicable]

Would you like the full press release and an executive quote?

[Your name]
[Company]
[Phone — for journalists, a phone number signals you're available]
```

**Personalization**: Generic pitches go unread. Reference the journalist's specific recent article. Name exactly why this story fits their beat. This takes 2 minutes per journalist and doubles your open rate.

---

## Media List Strategy

### Tier 1 — National/Category-Defining (5–10 outlets)

Target only for major announcements ($15M+, acquisitions, category-defining product):
- TechCrunch, The Verge, Wired
- WSJ Tech, NYT DealBook, Bloomberg
- Your specific industry's top publication

**Approach**: Exclusive or embargo offer to one Tier 1 journalist. If they pass, move to Tier 2.

### Tier 2 — Vertical/Trade Media (10–20 outlets)

Target for most announcements:
- Industry-specific publications your ICP reads
- Vertical tech media (SaaStr for SaaS, PitchBook for VC)
- Regional business press if geographic story

**Approach**: Simultaneous distribution with personalized subject lines.

### Tier 3 — Wire Distribution (broad reach)

For SEO and broad pickup:
- PR Newswire, Business Wire, GlobeNewswire
- PRWeb for smaller budgets

**Approach**: Distribute after Tier 1/2 embargo lifts. Wire distribution supports SEO by creating backlinks.

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

---

## Story Angle Alternatives

When primary announcement lacks news value on its own, attach it to a bigger narrative:

| Announcement | Reframe as... |
|-------------|---------------|
| Series A | "The [category] market is heating up: why investors are betting on [specific trend]" |
| New feature | "Why [common pain] is costing companies $X — and what [category leaders] are doing about it" |
| Customer win | "How [customer's industry] is rethinking [problem] using [approach]" |
| Milestone (100 customers) | "[Industry] benchmark report: [trend data from your customer base]" |

The company news becomes the "validation" or "evidence" in a larger trend story — not the story itself.