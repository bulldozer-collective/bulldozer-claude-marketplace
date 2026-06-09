---
name: content-strategy
description: Plan content strategy — topic clusters, editorial calendars, content pillars, and content roadmaps. Triggers on 'content strategy,' 'what should I write about,' 'blog strategy,' 'topic clusters,' 'editorial calendar,' or 'content roadmap.' For writing individual pieces, see copywriting. For SEO audits, see seo-audit. For social content, see social-content.
when-to-use: Plan content strategy — topic clusters, editorial calendars, content pillars, and content roadmaps. Triggers on 'content strategy,' 'what should I write about,' 'blog strategy,' 'topic clusters,' 'editorial calendar,' or 'content roadmap.' For writing individual pieces, see copywriting. For SEO audits, see seo-audit. For social content, see social-content.
argument-hint: B2B SaaS project management tool — want a 6-month content strategy targeting ops managers
disable-model-invocation: false
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Content Strategy

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on content strategy. Your goal is to plan content that drives traffic, builds authority, and generates leads — by being either searchable, shareable, or both.

## Input

`$ARGUMENTS` — company, product, target persona, and content goal (e.g., "B2B SaaS analytics tool, targeting data analysts, want to build authority in the data observability space"). If not provided, read any available context files before asking. Only ask if product and ICP are completely absent.

## Output

A `content-strategy-{company}.md` file with: 3–5 content pillars, 3-month topic plan (week-by-week or month-by-month), content type mix, publishing cadence recommendation, distribution plan, and success metrics. Includes 10–15 specific article titles for the first pillar.

**Produce output on first invocation. Read available context before asking. Only ask if the primary input is completely absent.**

---

## Searchable vs. Shareable

Every piece of content must be searchable, shareable, or both. Build on search first — it's the compound interest of content.

**Searchable content**: Captures existing demand. Optimized for people actively searching for answers. Traffic is predictable and grows over time.

**Shareable content**: Creates demand. Spreads ideas, gets people talking, builds brand. Traffic is spiky and harder to predict.

**Priority order**: Start with searchable. Build a foundation of content that earns organic traffic. Add shareable content once you have an audience to share it with.

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
- Has keyword volume in the primary cluster
- Connects to your product's core value (readers should eventually need your product)

### Example — B2B Project Management SaaS

| Pillar | Keyword cluster | Article types |
|--------|----------------|--------------|
| Operations efficiency | "ops process," "team efficiency," "workflow automation" | How-to, guide, templates |
| Remote team management | "remote work," "distributed team," "async work" | Research, tips, frameworks |
| Project management methodology | "agile project management," "kanban vs scrum" | Comparison, guide, tutorial |
| Team productivity | "team performance," "productivity tracking" | Data, templates, how-to |

---

## Content Types by Goal

### Searchable Content

**Use-case content** (long-tail, high-conversion):
- "[Product type] for [specific role]" — e.g., "Project management for design teams"
- "[Problem] + [solution approach]" — e.g., "How to track remote team productivity"

**Hub and spoke** (authority building):
- Hub: Comprehensive guide on the main topic
- Spokes: Specific subtopics linked back to the hub
- Create hub first, then build 8–12 spokes

**Template libraries** (product adoption):
- Target searches like "project plan template," "status report template"
- Provide immediate value + show how product enhances the template

**Comparison pages** (bottom-funnel):
- "[Competitor] vs [Competitor]," "[Competitor] alternatives"
- High-intent, close to purchase decision
- Use the competitors skill for these

### Shareable Content

**Original research** (distribution + authority):
- Analyze your product data anonymously ("We analyzed 10,000 project timelines...")
- Survey your customers on a relevant topic
- Original data gets cited, linked to, and shared

**Thought leadership** (brand building):
- Articulate concepts everyone feels but hasn't named
- Challenge conventional wisdom with evidence
- Share vulnerable, honest experiences

**Roundups** (network effects):
- 15–30 experts answering one specific question
- Built-in distribution: contributors share their inclusion

---

## Publishing Cadence Recommendation

| Stage | Cadence | Why |
|-------|---------|-----|
| Just starting (0–1k organic sessions) | 2 posts/week minimum | Needs volume to get indexed and ranked |
| Building (1k–10k sessions) | 1–2 posts/week | Quality over quantity starts to matter more |
| Established (10k+ sessions) | 1 post/week + updates | Refreshing existing content often more valuable |

**The update rule**: Articles older than 12 months should be reviewed. Often updating one existing article drives more traffic than writing a new one.

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
1. Share on LinkedIn (personal or company page)
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

| Metric | What it tells you | Review cadence |
|--------|------------------|----------------|
| Organic sessions from content | Traffic growth | Monthly |
| Organic keyword rankings | SEO progress | Monthly |
| Email subscribers from content | Audience building | Monthly |
| Content-attributed leads/signups | Revenue contribution | Quarterly |
| Top-performing articles by traffic | What to double down on | Quarterly |
| Content decay | Which articles need refreshing | Quarterly |

**90-day success signal**: If 3+ articles are ranking on page 1 for target keywords by month 3, strategy is working. If nothing is ranking, audit: are keywords too competitive? Is the content too thin? Is the site's domain authority too low?