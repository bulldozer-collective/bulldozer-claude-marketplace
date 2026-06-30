---
name: |
  customer-research
description: |
  Run, analyze, and synthesize customer research — VOC, interview analysis, review mining, JTBD mapping. Triggers on 'voice of customer,' 'customer interviews,' 'review mining,' 'jobs to be done,' 'G2 reviews,' 'Reddit mining,' or 'find out why customers churn.' For copy informed by research, see copywriting. For page optimization from research, see conversion-optimization.
when-to-use: |
  Run, analyze, and synthesize customer research — VOC, interview analysis, review mining, JTBD mapping. Triggers on 'voice of customer,' 'customer interviews,' 'review mining,' 'jobs to be done,' 'G2 reviews,' 'Reddit mining,' or 'find out why customers churn.' For copy informed by research, see copywriting. For page optimization from research, see conversion-optimization.
argument-hint: |
  Analyze 10 customer interview transcripts — extract JTBD, pain points, and copy-ready quotes
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Customer Research

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on customer research. Your goal is to uncover what customers actually think, feel, say, and struggle with — so positioning, messaging, and product decisions are grounded in reality.

## Input

`$ARGUMENTS` — research material or topic (e.g., "analyze these 10 interview transcripts" or "mine G2 reviews for [competitor]"). If not provided, read any available context files. Only ask if research material or topic is completely absent.

## Output

Default: a `voc-synthesis-{topic}.md` file — themes ranked by frequency × intensity, verbatim quotes per theme, and implications for copy/positioning/product. Alternative formats (persona doc, JTBD map, competitive intel summary, intelligence gap analysis) if explicitly requested.

**Produce output on first invocation. Default to VOC synthesis. Only ask if there is no research material and no topic.**

---

## Two Research Modes

### Mode 1 — Analyze Existing Assets

You have raw material (transcripts, surveys, reviews, tickets). Extract signal from it.

**Asset types and what to extract:**

| Asset | Extract |
|-------|---------|
| Interview / call transcripts | Pains, triggers, desired outcomes, customer language, objections, alternatives considered |
| Survey results | Segment before drawing conclusions. Flag conflicts between open-ended and multiple-choice answers. |
| Support tickets | Recurring complaints, confusion points, feature requests. Separate bugs from missing features. |
| Win/loss notes | What tipped the decision? What almost made them choose a competitor? |
| NPS responses | Passives and detractors are higher signal than promoters. Pair scores with verbatims. |

### Mode 2 — Digital Watering Hole Research

Go find authentic, unmoderated customer language from online sources.

**Source selection by ICP:**

| ICP Type | Primary Sources |
|----------|----------------|
| B2B SaaS / technical | Reddit (role-specific subs), G2/Capterra, Hacker News, LinkedIn |
| SMB / founders | Reddit (r/entrepreneur, r/smallbusiness), Indie Hackers, Product Hunt |
| Developer / DevOps | r/devops, r/programming, Hacker News, Stack Overflow, Discord |
| B2C / consumer | App store reviews (1–3 star), Reddit hobby subs, YouTube comments |
| Enterprise | LinkedIn, industry analyst reports, G2 Enterprise filter, job postings |

**What to extract from every source:**

| Field | What to Capture |
|-------|----------------|
| Verbatim quote | Exact words — never paraphrase |
| Context | What prompted the comment? |
| Sentiment | Positive / negative / neutral / frustrated |
| Theme tag | Pain / trigger / outcome / alternative / language |
| Customer profile signals | Role, company size, industry hints |

---

## Extraction Framework

For each asset or source, extract across five dimensions:

1. **Jobs to Be Done** — what outcome are they trying to achieve?
   - Functional: the task itself
   - Emotional: how they want to feel
   - Social: how they want to be perceived

2. **Pain Points** — what's frustrating about their current situation?
   - Prioritize pains mentioned unprompted and with emotional language

3. **Trigger Events** — what changed that made them seek a solution?
   - Team growth, missed target, embarrassing incident, competitor doing something

4. **Desired Outcomes** — what does success look like in their words?
   - Capture exact quotes, not paraphrases

5. **Language and Vocabulary** — exact words customers use
   - "We were drowning in spreadsheets" is more valuable than "manual process inefficiency"

---

## Synthesis Process

1. **Cluster by theme** — group similar pains, outcomes, and triggers across sources
2. **Frequency × intensity score** — how often does a theme appear, and how strongly is it felt?
3. **Segment by profile** — do patterns differ by company size, role, or tenure?
4. **Select money quotes** — 5–10 verbatim quotes that best represent each theme
5. **Flag contradictions** — where customers say one thing but do another

### Output Template

```markdown
## VOC Synthesis — [Topic]

### Top Themes (ranked by frequency × intensity)

#### Theme 1: [Name]
**Summary**: [1–2 sentences]
**Frequency**: X of Y sources
**Intensity**: High / Medium / Low
**Representative quotes**:
- "[exact quote]" — [source, date]
- "[exact quote]" — [source, date]
**Implications**: What this means for messaging / product / positioning

#### Theme 2: ...
```

---

## Research Quality Guardrails

Label every insight with confidence before presenting it:

| Confidence | Criteria |
|------------|----------|
| High | Theme in 3+ independent sources; mentioned unprompted; consistent across segments |
| Medium | Theme in 2 sources, or only prompted, or limited to one segment |
| Low | Single source; could be an outlier; needs validation |

**Sample bias:** Online reviewers skew toward strong opinions. Support tickets skew toward problems. Reddit skews skeptical. Factor this in.

**Recency:** Weight sources from the last 12 months more heavily. Markets shift.

**Minimum viable sample:** Don't build personas or draw messaging conclusions from fewer than 5 independent data points per segment.

---

## Persona Structure (when requested)

Only build from research — never invent.

```markdown
## [Persona Name] — [Role]

**Profile**: [title range, company size, industry]
**Primary JTBD**: [one sentence — what outcome are they trying to achieve?]
**Trigger Events**: [what causes them to start looking?]
**Top Pains**: [in their words, 3 items]
**Desired Outcomes**: [what success looks like, how they measure it]
**Objections**: [what makes them hesitate]
**Alternatives Considered**: [competitor, DIY, do nothing, hire]
**Key Vocabulary**: ["exact phrases" sourced from research]
**How to Reach Them**: [channels, content types, communities]
```

**Anti-patterns**: Don't average across segments. Don't invent details — leave blanks rather than fill them in. Revisit quarterly.

---

## Deliverable Formats

Default: **VOC Synthesis Report** (themes, quotes, patterns, implications)

Request-specific alternatives:
- **VOC quote bank** — verbatim quotes by theme, ready for copy
- **Persona document** — 1–3 personas built from research
- **JTBD map** — functional, emotional, social-content jobs by segment
- **Competitive intel summary** — what customers say about competitors vs. you
- **Research gap analysis** — what you still don't know and how to find it