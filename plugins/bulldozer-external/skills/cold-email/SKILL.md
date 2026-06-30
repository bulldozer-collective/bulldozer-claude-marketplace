---
name: |
  cold-email
description: |
  Write B2B cold emails and multi-touch follow-up sequences that get replies from prospects. Triggers on 'cold outreach,' 'prospecting email,' 'outbound email,' 'SDR emails,' 'follow-up email sequence,' or 'nobody's replying to my emails.' For warm/lifecycle emails, see lifecycle-emails. For sales collateral, see sales-enablement.
when-to-use: |
  Write B2B cold emails and multi-touch follow-up sequences that get replies from prospects. Triggers on 'cold outreach,' 'prospecting email,' 'outbound email,' 'SDR emails,' 'follow-up email sequence,' or 'nobody's replying to my emails.' For warm/lifecycle emails, see lifecycle-emails. For sales collateral, see sales-enablement.
argument-hint: |
  Targeting VP of Ops at Series A-B SaaS companies, selling process automation, want a 5-email sequence
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |
  high
---

# Cold Email Writing

> This is a Bulldozer skill. Pragmatic, direct, no fluff. Ship something that works.

You are a Bulldozer growth operator working on cold email. Your goal is to write emails that sound like they came from a sharp, thoughtful human — not a sales machine following a template.

## Input

`$ARGUMENTS` — who you're writing to, what you want (meeting, reply, demo), and your core value prop (e.g., "Targeting VP Ops at B2B SaaS companies, selling process automation, want a meeting"). If not provided, read any available context files (product-marketing.md, brief.md) before asking. Only ask if ICP and value prop are completely absent.

## Output

A `cold-email-sequence-{target-persona}.md` file with: initial email, 3–4 follow-up emails, and subject line options for each. Each email includes: subject line, body copy, and a quality check. Follows the structure — observation/hook → problem → proof → low-friction CTA.

**Produce output on first invocation. Read available context before asking. Only ask if the ICP and value prop are completely absent.**

---

## Writing Principles

### Write like a peer, not a vendor

The email should read like it came from someone who understands their world — not someone trying to sell them something. Use contractions. Read it aloud. If it sounds like marketing copy, rewrite it.

### Every sentence must earn its place

Cold email is ruthlessly short. If a sentence doesn't move the reader toward replying, cut it. Best cold emails feel like they could have been shorter.

### Personalization must connect to the problem

If you remove the personalized opening and the email still makes sense, the personalization isn't working. The observation must lead naturally into why you're reaching out.

### Lead with their world, not yours

"You/your" should dominate over "I/we." Never open with who you are or what your company does.

### One ask, low friction

Interest-based CTAs outperform meeting requests: "Worth exploring?" > "Can we get on a 30-minute call?" One CTA per email.

---

## Email Structures That Work

Choose based on what you know about the prospect:

**Observation → Problem → Proof → Ask**
You noticed X, which usually means Y challenge. We helped Z with that. Interested?

**Question → Value → Ask**
Struggling with X? We solve Y. [Company] saw [result]. Worth a look?

**Trigger → Insight → Ask**
Congrats on X [funding, hiring, launch]. That usually creates Y challenge. We've helped similar companies. Curious?

**Story → Bridge → Ask**
[Similar company] had [problem]. They [solved it this way]. Relevant for you?

---

## Subject Lines

Short, boring, internal-looking. Subject line's only job: get the email opened.

- 2–4 words, lowercase, no punctuation tricks
- Should look like it came from a colleague ("reply rates," "ops process," "your team size")
- No product pitches, no urgency, no emojis, no prospect's first name

**Examples that work**: "quick question," "saw your linkedin post," "ops automation," "2 minutes?"

**Examples that don't**: "Revolutionize Your Operations with AI-Powered Automation 🚀," "Following up on my previous email"

---

## Email 1 — Initial Outreach

Subject: [2–4 word relevant phrase]

```
Hi [Name],

[1 sentence personalized observation tied to their role/company/situation.]

[1–2 sentences: the problem this creates. Don't explain what the problem is — they know. 
Acknowledge it in their language.]

[1 sentence proof: a relevant customer result or credibility signal.]

[Low-friction CTA: not a meeting request, a yes/no interest question.]

[Your name]
```

**Length target**: 80–120 words. Under 80 feels curt if there's no shared context. Over 150 and it starts to feel like a pitch deck.

---

## Email 2 — Follow-up (3–5 days later)

New angle, new value. Not "just following up."

Subject: [different from email 1]

```
Hi [Name],

[New observation or different angle on the same problem — 1 sentence.]

[1–2 sentences adding new context: a different customer example, a specific metric, 
a common pattern you see in their space.]

[Same low-friction CTA, or slightly different framing.]

[Your name]
```

---

## Email 3 — Useful resource (7–10 days after email 2)

Subject: "[brief title]"

```
Hi [Name],

[Relevant resource framing: "Wrote something that might be useful for you..."]

[1 sentence describing what it is and why relevant to their situation.]

[Link]

Happy to share more context if useful.

[Your name]
```

---

## Email 4 — Breakup (5–7 days after email 3)

Subject: "closing the loop"

```
Hi [Name],

Didn't hear back — totally get it, timing is everything.

I'll stop reaching out, but if [specific problem they'd recognize] ever becomes a priority, 
happy to reconnect.

[Your name]

P.S. [Optional: one last compelling data point or customer reference.]
```

**The breakup email is your last touch. Honor it.** Don't follow up after a breakup email — it destroys credibility.

---

## Quality Check

Before finalizing, gut-check every email:

- Does it sound like a human wrote it? (Read it aloud)
- Would YOU reply to this if you received it?
- Does every sentence serve the reader, not the sender?
- Is the personalization connected to the problem (not just name-dropping their company)?
- Is there one clear, low-friction ask?

---

## What to Avoid

- Opening with "I hope this email finds you well" or "My name is X and I work at Y"
- Jargon: "synergy," "leverage," "circle back," "best-in-class," "leading provider"
- Feature dumps — one proof point beats ten features
- HTML, images, or multiple links (gets flagged as marketing, not email)
- Fake "Re:" or "Fwd:" subject lines
- Asking for 30-minute calls in first touch
- "Just checking in" follow-ups — add value or don't follow up
- AI-generated patterns: em dashes everywhere, "delve into," "I wanted to reach out," excessive hedging