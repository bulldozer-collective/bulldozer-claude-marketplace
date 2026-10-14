---
name: |-
  website-brief
description: |-
  Produce a complete website project brief — business context, conversion goals, sitemap, audience and messaging requirements, design references, technical constraints, content ownership, timeline, and approval process. Triggers on 'website brief,' 'website redesign brief,' 'brief for our agency,' 'brief for website build,' 'write our web brief,' 'we need to brief a developer,' or 'how do we kick off a website project.' For brand positioning, see brand-platform. For conversion rate analysis, see audit-website-cro.
when-to-use: |-
  Produce a complete website project brief — business context, conversion goals, sitemap, audience and messaging requirements, design references, technical constraints, content ownership, timeline, and approval process. Triggers on 'website brief,' 'website redesign brief,' 'brief for our agency,' 'brief for website build,' 'write our web brief,' 'we need to brief a developer,' or 'how do we kick off a website project.' For brand positioning, see brand-platform. For conversion rate analysis, see audit-website-cro.
argument-hint: |-
  Series A SaaS, redesigning the website to support a new positioning. Existing Webflow site, 6 pages, needs to be redesigned with a new homepage, product page, pricing page, and 2 case study pages. Agency kick-off in 2 weeks, budget €25K.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Website Brief

> This is a Bulldozer skill. Most website projects fail not because of design or development — they fail because the brief was vague, the goals weren't measurable, and the approval process wasn't defined before work started. A strong brief takes 2–3 hours to write and saves 20–30 hours of revision cycles. It is the single highest-leverage document in a website project.

You are a Bulldozer operator producing a website project brief. Your job is to extract the business context, define measurable goals, document the sitemap and content requirements, specify technical constraints, and set up the approval process — before a single wireframe is drawn.

## Input

`$ARGUMENTS` — company overview, reason for the project (new positioning, redesign, migration, new site from scratch), number and type of pages, target go-live date, budget range, key stakeholders and who has final approval. If not provided, read available context files. Ask once if the project reason and target date are completely absent.

## Output

A `website-brief-{company}-{date}.md` file containing all 10 required sections in sequence: project overview, objectives and success metrics, target audience, sitemap and page requirements, messaging and brand, design direction, content responsibilities, technical requirements, timeline and budget, and approval process. Formatted for handoff to an external agency or internal team.

**Produce on first invocation. Do not start with design references — start with goals and audience. Creative direction without a clear goal produces beautiful work that doesn't convert.**

---

## Section 1: Project Overview

**2–3 sentences answering:** What are we building or rebuilding, and why now?

```
[Company] is [stage and context]. This project is a [redesign / new build / migration] of the [primary domain / specific section], triggered by [reason: new positioning, new product, scale to SDR team, agency rebrand, CRO initiative, etc.].

The website must achieve [primary business outcome] within [timeframe], supporting [GTM motion: sales-led, product-led, marketing-led].
```

**What "why now" unlocks:** The reason for the project defines the constraint. A website built to support a new positioning is different from one built to enable self-serve trial conversion. The agency needs to know which one they're solving.

---

## Section 2: Objectives and Success Metrics

**Define measurable goals before the project starts.** "Increase brand awareness" is not a goal. "Increase trial starts from organic search by 30% within 90 days of launch" is a goal.

**Required format:**

| Goal | Metric | Current baseline | Target | Measurement method |
|------|--------|-----------------|--------|-------------------|
| [Primary objective] | [Specific metric] | [Current value] | [Target value] | [GA4 / HubSpot / tool] |
| [Secondary objective] | [Specific metric] | [Current value] | [Target value] | [GA4 / HubSpot / tool] |

**Common B2B website objectives and their metrics:**

| Objective | Metric |
|-----------|--------|
| Increase inbound lead volume | Demo requests / month |
| Improve lead quality | MQL-to-SQL conversion rate from organic/direct |
| Reduce CAC from paid | Cost per trial start or demo from paid |
| Increase SEO organic traffic | Organic sessions from target keyword clusters |
| Support SDR prospecting | Time on page + page views for outbound prospects |
| Improve trial conversion | Trial → paid conversion rate |

**Include exactly one primary metric.** The primary metric is the one that determines whether the project was a success when reviewed 90 days post-launch. Secondary metrics are diagnostic — useful for understanding what's driving the primary metric, not for evaluating project success.

**Pull the baseline — don't guess it.** "Current baseline" is a real number, not a placeholder to fill in from memory. If the client's Webflow site and HubSpot are already connected to Bulldozer OS, read them — in this order, each step has its own failure mode:

- `bdzListCmsSites` first, always. It's the only way to get the `siteId` every CMS call below requires — a blank `siteId` is the most common real failure logged against this skill's tool calls, and it reads as a generic 400, not as "no connection."
- `bdzGetCmsTrafficReport` and `bdzGetCmsTopPagesReport` give real session and pageview volume per page. Both require the Webflow Analyze add-on — a 409 here usually means the add-on isn't purchased, not that the credential is broken — and the two must be called one after the other, never in parallel.
- `bdzListCmsForms` + `bdzListCmsFormSubmissions` count actual form submissions, matched on page + form element, never on the form's displayed name (several forms on the same site routinely share a name like "Email Form"). Before citing a count as a capture metric, check `bdzPreviewCmsFormFieldMapping` on that form: `submissionsInspected: 0` means it has never been submitted — the baseline is 0, not unknown — and a null email mapping means it can't capture an email at all. A plausible form name is not proof the capture works.
- HubSpot's `get_campaign_attribution_reports` ties that traffic to revenue already attributed. Its first call in a session returns a status asking to be read via `tool_guidance` first instead of data — that's the tool's own gate, not a failure.

One more terminology note for the Measurement method column: outside Google Ads, GA4 renamed "conversions" to "key events" in March 2024 — write "key events," not "conversions," when the method is GA4.

**When the client wants two "primary" metrics, that's a decision they're avoiding, not a compromise to accept.** Ask which one wins the day a design or dev choice helps one at the cost of the other — a bigger pricing CTA that lifts trial starts but adds friction to the enterprise "talk to sales" path, for instance. Whichever answer comes back is the real primary metric; write only that one in the table, and move the other to secondary.

**Don't call the result before the site has enough volume to say anything.** How long that takes depends entirely on the baseline volume just pulled above — a site converting from a few hundred monthly sessions needs far longer to produce a non-noisy read than one converting from tens of thousands, and there is no fixed number of weeks that transfers between the two. Agree on the read-by date with the client at brief time, using their own baseline, not after the 90-day number disappoints someone.

---

## Section 3: Target Audience

**Who is the website for? Describe them as buyers, not demographics.**

**Required elements:**
1. **ICP definition:** Role, company type, company size, what they're responsible for
2. **Pain state:** What problem are they trying to solve when they land on the site?
3. **Skepticism level:** What do they doubt about solutions like ours?
4. **Decision criteria:** What do they need to see/believe before requesting a demo or starting a trial?
5. **Buying committee:** Who else is involved? (If the CMO is the champion but the CFO approves the budget, both need to find their answers on the site)

**Template:**
```
Primary visitor: [Title] at [Company Type], typically [size]. They are responsible for [function] and are evaluated on [KPI]. 

When they find our website, they are usually trying to [goal or problem]. Their biggest concern is [top objection]. Before they request a demo, they need to [trust criteria — e.g., see proof that this works for a company like theirs].

Secondary visitor: [Budget owner / technical evaluator / end user]. They care primarily about [their specific concern: ROI / security / ease of implementation].
```

---

## Section 4: Sitemap and Page Requirements

**List every page in scope.** Ambiguity about page count is the leading cause of scope creep and billing disputes.

**Format:**

| Page | Status | Priority | Primary CTA | Notes |
|------|--------|---------|-------------|-------|
| Homepage | Redesign | P1 | Demo request | New positioning, new hero |
| Product page | Redesign | P1 | Trial start | 3 sections: problem, solution, proof |
| Pricing page | New | P1 | Trial start | 3 tiers, FAQs, annual/monthly toggle |
| Case study: [Company A] | New | P2 | Demo request | Content written, needs design |
| Case study: [Company B] | New | P2 | Demo request | Content TBD — client approval needed |
| About | Keep / minor update | P3 | N/A | Only update team section |

**Priority guide:**
- P1: Must launch on go-live date. Project success depends on these pages.
- P2: Launch within 30 days of go-live.
- P3: Launch within 60 days, or explicitly deprioritized.

**Explicitly state what is OUT of scope.** Every page or feature not listed in this table is out of scope. If the client requests it later, it is a change order.

**If a pricing page is in scope, the pricing model is a product decision the client brings — the agency doesn't invent it to fill a template.** Tiers, what's included or excluded at each one, self-serve versus sales-assisted access: these determine the page's structure before a wireframe can be drawn. An undefined pricing model is a Section 9 dependency with the same severity as a missing positioning statement in Section 5 — a wireframe built around placeholder tiers gets rebuilt in full the day real pricing arrives, not adjusted at the margins.

---

## Section 5: Messaging and Brand

**Give the agency what they need to write to the right audience — or to evaluate your existing copy against the right standard.**

**Required inputs:**
1. **Positioning statement:** One sentence — what you do, for whom, and why it's different (from brand-platform if it exists)
2. **Key message pillars:** The 2–3 proof points the site must communicate on every page
3. **Tone of voice:** 3 adjectives describing how the brand sounds + 1 example of on-brand language and 1 example of off-brand language
4. **Existing brand assets:** Link to brand guidelines, logo files, approved color palette, typography spec
5. **What the site must NOT say:** Specific language to avoid (competitor claims you can't substantiate, category language you're moving away from, jargon your ICP doesn't use)

**If brand guidelines don't exist yet:** Flag this as a dependency. Do not start a website project without a positioning statement. The website is a positioning execution — positioning first, execution second.

---

## Section 6: Design Direction

For how to write the design direction (references over adjectives, what to specify, and how to give actionable feedback), read `references/design-and-technical.md` when writing Section 6.

---

## Section 7: Content Responsibilities

**The most commonly underestimated scope item.** Websites stall because content isn't ready. Define content ownership before the project starts.

**Content responsibility matrix:**

| Page | Copy owner | Status | Delivery date | Approver |
|------|-----------|--------|--------------|---------|
| Homepage | [Client / Agency] | [TBD / Draft exists / Final] | [Date] | [Name] |
| Product page | [Client / Agency] | | | |
| Case study A | [Client / Agency] | | | |

**Content dependencies to flag:**
- Customer quotes and case study approvals: who manages client relationship? What's the turnaround time for approval?
- Product screenshots: are they current or will product UI change during the project timeline?
- Team photos: for About page — who provides, by when?
- SEO keyword research: is this in scope or does the client provide target keywords?

**Rule:** If the agency writes the copy, include one round of client revisions in scope — not unlimited revisions. Specify the revision protocol in Section 10.

---

## Section 8: Technical Requirements

For the checklist of systems the website must connect to, comply with, or perform within, and how to flag undecided fields as dependencies, read `references/design-and-technical.md` when writing Section 8.

---

## Section 9: Timeline and Budget

For the milestone breakdown, budget structure and contingency rule, read `references/timeline-budget-approval.md` when writing Section 9.

---

## Section 10: Approval Process

For who approves what at which stage, and the rule on the final approver, read `references/timeline-budget-approval.md` when writing Section 10.

---

## Rules

- **Goals and audience before design references.** A brief that opens with visual inspiration produces a beautiful site solving the wrong problem — Section 2 and Section 3 exist to prevent that.
- **One primary metric, not a scorecard.** A brief with five equally-weighted goals gives the agency no way to make tradeoffs when a decision affects one goal at the expense of another.
- **Every page in Section 4 needs a status.** "We'll figure out the About page later" is how a 6-page project becomes a 9-page project with no additional budget.
- **Content readiness gates the go-live date, not the reverse.** Set the Section 9 timeline off of when content actually arrives (Section 7), not off of a launch date picked first and worked backward from optimistically.
- **No project starts without a named final approver.** A brief that lists "the marketing team" as the approver in Section 10 has not actually defined who approves anything.
- **Flag missing positioning as a blocker, not a nice-to-have.** If Section 5 has no positioning statement, the project is not ready to brief — it's ready for a positioning exercise first.
- **An unfunded reference, an unnamed piece of feedback, or a missing brand asset is a scope conversation, not something to solve mid-design.** Send it back in Section 6 before it costs a design round — the same way Section 5 already blocks on missing positioning.
- **A pricing page with no pricing model, or two goals both called "primary," is not ready to brief either.** Both are decisions the client is avoiding, not details the agency can infer — name them as dependencies in Section 4 and Section 2 before wireframes start.