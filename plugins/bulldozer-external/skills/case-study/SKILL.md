---
name: |
  case-study
description: |
  Produce a B2B case study — customer interview guide, before/how/after narrative structure, snapshot metrics box, and a publish-ready 1500-2000 word document with multi-format variants. Triggers on 'write a case study,' 'customer success story,' 'case study template,' 'client proof document,' 'before and after story,' or 'customer story for sales.' For win/loss intelligence from buyers, see win-loss-analysis. For general copywriting, see copywriting.
when-to-use: |
  Produce a B2B case study — customer interview guide, before/how/after narrative structure, snapshot metrics box, and a publish-ready 1500-2000 word document with multi-format variants. Triggers on 'write a case study,' 'customer success story,' 'case study template,' 'client proof document,' 'before and after story,' or 'customer story for sales.' For win/loss intelligence from buyers, see win-loss-analysis. For general copywriting, see copywriting.
argument-hint: |
  SaaS company, customer reduced time-to-publish from 3 weeks to 2 days using our CMS. Customer is happy to be quoted, happy to share metrics, CMO and Head of Content both involved in the decision. Want a case study to use on the website and in sales d
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Case Study Writer

> This is a Bulldozer skill. A B2B case study that converts is not a testimonial with extra words. It is a narrative proof document designed to resolve the specific objections a buyer carries into your sales process. The difference between a case study that gets shared in Slack and one that collects dust on your website is specificity — specific numbers, specific before state, specific people willing to be quoted by name.

You are a Bulldozer strategist producing a customer case study. Your job is to design the interview, extract the story, and write a document that sales teams actually use — not one that marketing teams feel good about.

## Input

`$ARGUMENTS` — customer details: company name, the result achieved, who's available to be interviewed, approved for publication (named or anonymous), any existing metrics or quotes. If not provided, ask once: "Who's the customer, what result did they get, and what format do you need — website page, PDF, or slide excerpt?"

## Output

A `case-study-{customer}-{date}.md` file with: interview guide (ready to send), snapshot metrics box, and the full case study in Problem → How → Results structure (1500-2000 words). Optionally: a 200-word excerpt for sales decks and a LinkedIn post variant.

**Produce the interview guide immediately. Write the case study once interview data is available or from context provided.**

---

## Why Most B2B Case Studies Fail

The three failure modes that make case studies useless in a sales process:

**1. Buried results.** The conventional structure — introduction, challenge, solution, results — makes the buyer read 600 words before finding out what happened. The buyers who matter (economic decision-makers who share documents internally) skim. They need the result in the first 10 words.

**2. Vague before state.** "The company faced operational challenges" tells the reader nothing. "The team was manually reconciling invoices for 12 hours every week, which the CFO described as 'embarrassing for a company our size'" gives the prospect a specific situation they can see themselves in. The before state is the conversion mechanism — the prospect reads it and thinks: *that's us.*

**3. Anonymous metrics.** "Significant improvement" and "reduced time" are noise. "94% reduction in reconciliation time — from 12 hours to 45 minutes per week" is a headline. If the customer won't share numbers, probe for relative improvements: "Was it a 2x improvement? A 5x?" If they won't share any, question whether this customer is the right story for a case study.

---

## Customer Selection Criteria

Before running the interview, confirm the customer meets these criteria:

| Criterion | Why it matters |
|-----------|----------------|
| Measurable result (at least 2–3 metrics) | Without numbers, the case study is a testimonial at best |
| Clear before state (what was broken) | Contrast creates the narrative. No before = no story |
| Champion willing to be named and quoted | Anonymized case studies convert at 40-60% of named ones |
| Decision-maker relationship | The economic buyer's quote closes deals; the champion's quote opens conversations |
| 3–6 months post-implementation | Long enough for results, fresh enough for recall |

**Who not to approach:** Customers currently in renewal negotiations, customers on a performance improvement plan, customers whose champion left the company, any deal where the relationship with the rep ended badly.

---

## Interview Guide

**Scheduling:** 45 minutes. Tell them the process upfront: you handle all the writing, they approve before anything publishes. The case study takes 45 minutes of their time total. Most refusals come from people expecting to write something themselves.

**Recording:** Always record with permission. Verbatim quotes from the transcript are the highest-trust elements of any case study. Paraphrased quotes convert worse because they read like marketing copy.

---

### Interview Script

**Opening (5 min):**
"Thanks for doing this. To set expectations: I'll handle all the writing, I'll send you a draft for review before anything goes live, and nothing publishes without your sign-off. The goal is to tell your story accurately so other companies in your situation can see what's possible. Let me start with some context."

**Company and role (5 min):**
- "Tell me a bit about [company] — what do you do, who do you serve, and roughly what size is the team?"
- "What's your role, and what were you responsible for when this project started?"

**The before state (10 min):**
- "Walk me through what the situation looked like before you started using [product]. What was the specific problem you were trying to solve?"
- "Can you put a number on it? How many hours, how many people, how much was it costing?"
- "What had you tried before? What didn't work and why?"
- "How was this problem affecting your team day-to-day? What did it feel like?"
- "What finally made you decide to look for a solution at that point, rather than earlier?"

**The decision (5 min):**
- "What other options did you evaluate? What else was on the shortlist?"
- "What specifically made you choose [product] over the alternatives?"
- "Was there a moment when the decision became clear? What happened?"

**Implementation (5 min):**
- "Walk me through how you got started. How long did it take to be up and running?"
- "Were there any surprises — positive or negative — during implementation?"
- "What support did you need? Who from your team was involved?"

**Results (10 min):**
- "What's changed since you started using [product]? What's the most significant result you can point to?"
- "Can you give me specific numbers?" *(Pause and wait. Do not fill the silence.)*
- "In what time frame did you see those results?"
- "What's the biggest 'I didn't expect that' moment you had?"
- "How has this changed your team's day-to-day? What are they spending that recovered time on now?"

**Closing (5 min):**
- "If you were talking to someone in your exact situation 12 months ago, considering whether to do what you did — what would you tell them?"
- "What would you tell them to watch out for?"
- "Is there anything I haven't asked that you think is important for us to capture?"

---

## Case Study Structure

**Inverted pyramid.** The most important information goes first. Buyers who skim get the key takeaway; buyers who want detail find it further down. Never bury the results.

---

### 1. Headline + Snapshot Box

The headline leads with the result: *"How [Customer] Cut Invoice Processing Time by 94%"* — not *"[Customer] Partners with [Company] to Transform Operations."*

The snapshot box appears immediately below the headline, before the narrative begins. It travels when the case study gets forwarded in Slack.

```
┌─────────────────────────────────────────────────┐
│  [Customer Company]                              │
│  Industry: [X] · Size: [Y employees]            │
├─────────────────────────────────────────────────┤
│  94%  reduction in processing time              │
│  $127K  saved in first 12 months                │
│  2 days  to full implementation                 │
└─────────────────────────────────────────────────┘
```

Three metrics maximum. The first is the headline metric (most impressive). The second is financial (gives CFOs a number). The third is ease-of-adoption (handles the "is this realistic for us?" objection).

---

### 2. The Problem (300-400 words)

Describe the before state in the customer's words, not yours. The goal: the ideal prospect reads this section and thinks *"that's exactly what we're dealing with."*

Structure:
- Company context (2 sentences — industry, size, what they do)
- The specific situation before: what was broken, how broken, in what numbers
- What they'd tried: previous attempts, why they failed
- The tipping point: what made them start looking for a solution at that particular moment
- At least one direct quote from the customer about how the problem felt

**Anti-pattern to avoid:** Describing the problem in vendor language. "They lacked visibility into their operational metrics" is vendor language. "Every Monday morning, the ops team spent 4 hours pulling numbers from three different spreadsheets just to answer a question the CEO asked the week before" is customer language.

---

### 3. How They Did It (300-400 words)

Not a product brochure. The customer is the protagonist — your product is the vehicle.

Structure:
- Why they chose this solution (what tipped the decision, what the evaluation process was)
- How they got started (implementation timeline, who was involved, what was harder or easier than expected)
- How they use it now (specific workflows, specific features used by name — not "they used the platform" but "they used the Rules Engine to automate X")
- Adoption experience (did the team embrace it? was there resistance? how was it handled?)

**Objection handling opportunity:** Implementation, change management, and user adoption are the three fears every buyer carries. Address all three here, directly and honestly. "Implementation took 2 weeks, not the 1 week we hoped for, because we had 5 years of legacy data to migrate" is more credible than "seamless implementation."

---

### 4. The Results (400-500 words)

Lead with the most impressive metric. Then layer.

Structure:
- Headline metric (with timeframe)
- Secondary metrics (financial, team, customer impact)
- Quote from the economic buyer (not just the champion)
- The compound effect: what is the team doing with the recovered time/money?
- What's next: how they plan to expand or build on what they've accomplished

**The "what's next" close:** Ending a case study with a forward-looking statement signals momentum — this isn't a one-time fix but a compounding investment. It also handles the "will this still work 12 months from now?" objection implicitly.

---

### 5. Pull Quotes

Extract 2–3 strong quotes from the transcript and format them as pull quotes 