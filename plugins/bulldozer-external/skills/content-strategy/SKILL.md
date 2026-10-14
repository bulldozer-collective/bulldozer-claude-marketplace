---
name: |-
  content-strategy
description: |-
  Plan content strategy — topic clusters, editorial calendars, content pillars, and content roadmaps. Triggers on 'content strategy,' 'what should I write about,' 'blog strategy,' 'topic clusters,' 'editorial calendar,' or 'content roadmap.' For writing individual pieces, see copywriting. For SEO audits, see seo-audit. For social content, see social-content.
when-to-use: |-
  Plan content strategy — topic clusters, editorial calendars, content pillars, and content roadmaps. Triggers on 'content strategy,' 'what should I write about,' 'blog strategy,' 'topic clusters,' 'editorial calendar,' or 'content roadmap.' For writing individual pieces, see copywriting. For SEO audits, see seo-audit. For social content, see social-content.
argument-hint: |-
  B2B SaaS project management tool — want a 6-month content strategy targeting ops managers
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Content Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on content strategy. Your goal is to plan content that drives traffic, builds authority, and generates leads — by being either searchable, shareable, or both.

## Input

`$ARGUMENTS` — company, product, target persona, and content goal (e.g., "B2B SaaS analytics tool, targeting data analysts, want to build authority in the data observability space"). If not provided, read any available context files before asking. Only ask if product and ICP are completely absent.

**If this is a connected Bulldozer project, ground the plan before drafting pillars — don't propose blind:**
- `bdzListCmsPages` (and `bdzListCmsCollections` for the site's content types) — what's already published, so pillars don't duplicate ground the site already covers. Needs a `siteId` from `bdzListCmsSites` first — see `references/metriques-notes.md`.
- `bdzGetProjectToneOfVoice` — the brand voice already recorded, so pillar language and example titles don't clash with it. Needs three IDs; a 404 means nothing is configured yet, not an error — see `references/metriques-notes.md`.
- `bdzGetCmsTrafficReport` — the current traffic baseline, so the 90-day success signal is measured against a real starting point, not assumed from zero. A 409 here has two possible causes — see `references/metriques-notes.md`.

If none return anything (no project connected, or nothing published yet), say so and proceed on the brief alone — don't block on missing OS data.

## Output

A `content-strategy-{company}.md` file with: 3–5 content pillars, 3-month topic plan (week-by-week or month-by-month), content type mix, publishing cadence, distribution plan, and success metrics. Includes 10–15 specific article titles for the first pillar. If a Bulldozer project is connected, also save the plan with `bdzCreateWorkspaceTextFile` so the team finds it in Bulldozer OS, not only as a local file — resolve `workspaceId` first with `bdzListWorkspaces(customerId)` rather than assuming "the" project workspace. A workspace is scoped to the customer (one per user), not the project, so the file will sit alongside other projects' drops under that same customer — say so rather than implying the drop is project-isolated.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Searchable vs. Shareable

Every piece of content must be searchable, shareable, or both. Build on search first — it's the compound interest of content.

**Searchable content**: Captures existing demand. Optimized for people actively searching for answers. Traffic is predictable and grows over time.

**Shareable content**: Creates demand. Spreads ideas, gets people talking, builds brand. Traffic is spiky and harder to predict.

**Priority order**: searchable first, to build an organic-traffic foundation; shareable once there's an audience to share with.

---

## Content Pillars

Content pillars are the 3–5 core topics your brand will own. Each pillar spawns a cluster of related content.

### How to Identify Pillars

1. **Product-led**: What problems does your product solve?
2. **Audience-led**: What does your ICP need to learn to do their job better?
3. **Search-led**: What topics have meaningful volume in your space?
4. **Competitor-led**: What are competitors ranking for that you could compete on?

### Pillar Validation Criteria

A strong content pillar:
- Has at least 20+ potential article ideas
- Aligns with your ICP's active questions (not just your company's interests)
- Has keyword volume in the primary cluster — if an SEO domain is connected in Bulldozer, check real volume, difficulty and position with `bdzGetSeoDomainKeywords` instead of guessing. The data is a dated monthly snapshot, not a live crawl — see `references/metriques-notes.md` before calling a position "current."
- Connects to your product's core value (readers should eventually need your product)

For a worked example of a pillar table (keyword cluster + article types, SaaS B2B of project management), see `references/content-pillars-exemple.md`.

### The Idea Test — Don't Skip This

A pillar name is a topic. "Operations efficiency" is a topic. "Most ops teams optimize the wrong step because they measure activity, not the bottleneck" is an idea. A pillar earns its place in the plan once someone can state the actual position behind it in one sentence — not just the keyword cluster. A pillar with volume and no point of view produces content that reads like the average of everything already ranking for it: correct, generic, forgettable, and indistinguishable from what a competitor (or an AI writing tool) would produce on the same brief. Before locking a pillar, find the source of the idea — customer interviews, product usage data, the founder's own experience, a real disagreement with the conventional take. If there's no source, the pillar isn't ready; don't schedule articles against it yet.

**When to kill a pillar**: after a full quarter of sustained publishing at the cadence recommended below, if a pillar shows no ranking movement, no shares, and no inbound mentions, retire it rather than deepening the cluster — doubling down on a pillar that isn't moving is how a content plan quietly turns into an archive. CMI's B2B Content Marketing Benchmarks, Budgets, and Trends report (Outlook for 2025) puts a number on this exact failure mode: among the 58% of B2B marketers who rate their own strategy as only moderately effective, 42% point to a lack of clear goals — ahead of poor journey alignment (39%) and a lack of data-driven decisions (35%). Strategies fail less from too little volume than from pillars with no clear goal behind them.

---

## Content Types by Goal

### Searchable Content

- **Use-case content** (long-tail, high-conversion): pairs a product type or problem with a specific role or solution approach — e.g., "Project management for design teams."
- **Hub and spoke** (authority building): one comprehensive hub, then 8–12 spokes on specific subtopics linked back to it.
- **Template libraries** (product adoption): targets searches like "project plan template," pairs immediate value with a look at how the product enhances the template.
- **Comparison pages** (bottom-funnel): "[Competitor] vs [Competitor]," "[Competitor] alternatives" — high-intent, close to purchase decision. Use the `competitor-alternatives` skill for these.

Patterns and examples in full: `references/content-types-detail.md`.

### Shareable Content

- **Original research** (distribution + authority): analyze product data anonymously, or survey customers — original data gets cited, linked to, and shared. **Refuse this format if there's no real data behind it.** A customer base too small to survey meaningfully, or no proprietary usage data to analyze, means "we surveyed our customers" will read as thin (an n of 40 stated or implied) rather than authoritative — and it drags down trust in everything else in the piece. Wait until there's an actual dataset, or skip the format.
- **Thought leadership** (brand building): articulate concepts everyone feels but hasn't named, challenge conventional wisdom with evidence, share vulnerable and honest experiences.
- **Roundups** (network effects): 15–30 experts answering one specific question — built-in distribution, since contributors share their inclusion. **Refuse this format if you can't personally reach 15–30 real practitioners who'll actually answer.** A roundup assembled from cold, generic outreach reads exactly like the AI-flavored filler this format exists to beat, and it won't earn the built-in shares that are the whole reason to do it.

Patterns and examples in full: `references/content-types-detail.md`.

---

## Publishing Cadence Recommendation

| Stage | Cadence | Why |
|-------|---------|-----|
| Just starting (0–1k organic sessions) | 2 posts/week minimum | Needs volume to get indexed and ranked |
| Building (1k–10k sessions) | 1–2 posts/week | Quality over quantity starts to matter more |
| Established (10k+ sessions) | 1 post/week + updates | Refreshing existing content often more valuable |

**The update rule**: Articles older than 12 months should be reviewed. Often updating one existing article drives more traffic than writing a new one.

**Consistency beats volume.** Independent 2026 content-marketing guides converge on the same point: a steady 1–2 posts/week on one cluster for 6–12 months builds more topical authority than a burst of 15–20 posts followed by silence. Treat the cadence table above as a floor to sustain, not a target to hit once and drop.

**When the client can't sustain the cadence, cut the cadence — not the substance.** A half-cadence plan where every article carries an actual point of view beats a full-cadence plan padded with interchangeable "10 tips for X" posts — the kind of filler a reader, and increasingly a search engine, recognizes on sight. If team capacity forces a choice, say so and lower the number in the plan; don't quietly thin the ideas to hit a cadence that looked good in the proposal.

---

## Editorial Calendar Structure

```
## Month 1 — [Pillar Name] Launch

Week 1: Hub article — "The Complete Guide to [Pillar Topic]"
Week 2: Spoke 1 — "How to [Specific Subtopic]"
Week 3: Spoke 2 — "[X] vs [Y]: Which Approach Works Better?"
Week 4: Template — "[Topic] Template for [Persona]"

## Month 2 — [Pillar Name] continued + [Pillar 2] starts
...
```

---

## Distribution Plan

**Day of publish**:
1. Share on LinkedIn — but don't just drop the article link. A link in the post body costs real reach, and the first-comment workaround doesn't dodge it either; studies disagree on how much but agree on the direction (numbers in `references/distribution-recherche.md`). Lead with the idea, link secondary.
   - **Default to a document post, not a link.** `bdzCreateLinkedInPost` takes a `documentUrl` (PDF, PPT, PPTX, DOC or DOCX, up to 100MB and 300 pages) to publish what LinkedIn calls a document post — the carousel format, measured as the platform's highest-engagement post type (study detail in `references/distribution-recherche.md`). Repurpose the hub article or original-research piece into a short slide carousel and upload it this way before defaulting to a link post. `message` is required on every call, documentUrl included — don't call it with the file and no caption (see `references/metriques-notes.md`).
   - **Article format, for a piece needing several outbound links** (a research roundup, a resource list): the reach penalty reportedly spares LinkedIn's long-form Article format — but `bdzCreateLinkedInPost` has no Article mode, so publishing one still means going into LinkedIn directly.
   - `bdzCreateLinkedInPost` publishes to the connected user's own feed, a personal profile — a company-page share still has to happen manually in LinkedIn.
2. Share in relevant Slack/Discord communities (add value, don't just drop links)
3. Email to subscribers if content is newsletter-worthy

**Week 1**:
4. Twitter/X thread summarizing the key points
5. Share with relevant influencers who might find it useful (don't ask for a share — just share the article)

**Ongoing**:
6. Internal link from new articles to existing ones
7. Update Hub article to link to new Spokes
8. Repurpose into social posts over the next 4 weeks

---

## Success Metrics

| Metric | What it tells you | Review cadence | Where to pull it |
|--------|------------------|----------------|-------------------|
| Organic sessions from content | Traffic growth | Monthly | `bdzGetCmsTrafficReport` if the site is a connected Webflow site with the Analyze add-on; otherwise the client's own analytics. A 409 here has two possible causes — see `references/metriques-notes.md` before telling the client to buy the add-on |
| Organic keyword rankings | SEO progress | Monthly | `bdzGetSeoDomainKeywords` if an SEO domain is connected in Bulldozer |
| Email subscribers from content | Audience building | Monthly | Client's email platform — not a connected Bulldozer OS capability today |
| Content-attributed leads/signups | Revenue contribution | Quarterly | Client's CRM or `bdzGetGoogleAnalyticsReport` on a stored GA4 report, if one exists for this goal |
| Top-performing articles by traffic | What to double down on | Quarterly | `bdzGetCmsTopPagesReport` (pages ranked by sessions/users/pageviews, tied back to the CMS collection item behind each via `collectionId`/`itemSlug`) — a more direct fit than `bdzGetCmsTrafficReport`, which only returns a site-wide daily total, not a per-article ranking |
| Content decay | Which articles need refreshing | Quarterly | `bdzGetSeoDomainKeywords` sorted by position, trended over successive pulls |

Two technical traps when actually pulling this table — never call `bdzGetCmsTrafficReport` and `bdzGetCmsTopPagesReport` in the same pass (both are Analyze reports, neither supports running in parallel), and never report a keyword-position or traffic change without checking how stale the snapshot actually is. Full detail in `references/metriques-notes.md`.

**90-day success signal**: 3+ articles ranking page 1 for target keywords by month 3 means the strategy is working. Nothing ranking means audit: keywords too competitive, content too thin, or domain authority too low?

---

## Common Mistakes

**Pillars without an idea.** Three to five topics with keyword volume are not a content strategy — they're a keyword list. If nobody on the team can state the actual position behind a pillar in one sentence, don't schedule articles against it yet.

**A calendar that describes a cadence instead of what there is to say.** Filling "Week 3: Spoke 2" with a generic template title before the article's actual argument exists produces the interchangeable, AI-flavored copy this skill is meant to prevent. Draft the point of view first, the calendar slot second.

**Chasing the cadence table at the cost of substance.** The cadence table is a floor for a pillar that's working, not a quota to hit once ideas run thin — a thinner cadence of real ideas beats a full one padded with filler.

**Proposing original research or a roundup with no real source behind it.** A "we surveyed our customers" claim built on a handful of responses, or a roundup assembled from cold outreach, reads as thin rather than authoritative — it undercuts the credibility of the whole plan. Skip the format rather than fake the substance.

**Treating distribution as a same-day checkbox.** A link dropped into a LinkedIn post (or its first comment) is close to invisible today. Distribution needs the same point-of-view thinking as the article itself.

**Never re-checking a pillar that isn't moving.** A quarter with nothing to show — no rankings, no shares, no mentions — is a signal to retire the pillar, not to publish twice as much into it.