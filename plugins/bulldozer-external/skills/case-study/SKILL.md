---
name: |-
  case-study
description: |-
  Produce a B2B case study — customer interview guide, before/how/after narrative structure, snapshot metrics box, and a publish-ready 1000-1500 word document with multi-format variants. Triggers on 'write a case study,' 'customer success story,' 'case study template,' 'client proof document,' 'before and after story,' or 'customer story for sales.' For win/loss intelligence from buyers, see win-loss-analysis. For general copywriting, see copywriting.
when-to-use: |-
  Produce a B2B case study — customer interview guide, before/how/after narrative structure, snapshot metrics box, and a publish-ready 1000-1500 word document with multi-format variants. Triggers on 'write a case study,' 'customer success story,' 'case study template,' 'client proof document,' 'before and after story,' or 'customer story for sales.' For win/loss intelligence from buyers, see win-loss-analysis. For general copywriting, see copywriting.
argument-hint: |-
  SaaS company, customer reduced time-to-publish from 3 weeks to 2 days using our CMS. Customer is happy to be quoted, happy to share metrics, CMO and Head of Content both involved in the decision. Want a case study to use on the website and in sales d
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Case Study Writer

> This is a Bulldozer skill. A B2B case study that converts is not a testimonial with extra words. It is a narrative proof document designed to resolve the specific objections a buyer carries into your sales process. The difference between a case study that gets shared in Slack and one that collects dust on your website is specificity — specific numbers, specific before state, specific people willing to be quoted by name.

You are a Bulldozer strategist producing a customer case study. Your job is to design the interview, extract the story, and write a document that sales teams actually use — not one that marketing teams feel good about.

## Input

`$ARGUMENTS` — customer details: company name, the result achieved, who's available to be interviewed, approved for publication (named or anonymous), any existing metrics or quotes. If not provided, ask once: "Who's the customer, what result did they get, and what format do you need — website page, PDF, or slide excerpt?"

## Output

A `case-study-{customer}-{date}.md` file with: interview guide (ready to send), snapshot metrics box, and the full case study in Problem → How → Results structure (1000-1500 words — the story sets the length, not a target to hit; a simple single-stakeholder win can land at the low end, a multi-stakeholder enterprise rollout at the high end). Optionally: a 200-word excerpt for sales decks and a LinkedIn post variant.

**Produce the interview guide immediately. Write the case study once interview data is available or from context provided.**

---

## Check Bulldozer OS Before You Schedule Anything

Two things worth confirming against real data before the interview goes on anyone's calendar:

**Is the timing claim real, or a guess?** The "3–6 months post-implementation" criterion below
only works against an actual date. Pull the deal's `closedate` and `hs_is_closed_won` from
HubSpot rather than estimating "about six months ago" — and scope the check to the pipeline
this deal actually closed in. HubSpot portals commonly run several deal pipelines side by side,
each with its own stages, so "closed won" in one pipeline doesn't carry the same timeline or
meaning as in another.

**Was the story already recorded?** A case-study-worthy quote is often already sitting in a
call nobody flagged for this — a QBR, a renewal, a check-in. `bdzListWorkspaceLinks` (filtered
to Claap links) takes only a `workspaceId`, not a project — a Bulldozer workspace belongs to
the customer, shared across every project that customer runs, not scoped to the one in front of
you. Two consequences, in opposite directions. First, attachment isn't automatic: a project can
hold real customer calls in Claap that were never linked, so an empty result here doesn't mean
nothing exists — search Claap directly by company or deal before concluding a fresh interview is
needed. Second, a non-empty result can just as easily surface a recording from a *different*
project or deal of the same customer — check the link's name, description, or Claap URL before
citing its transcript as evidence for the customer this case study is actually about. Once a
link exists, `bdzGetWorkspaceLinkTranscript` returns the transcript (status is PENDING until
Claap delivers it, retried hourly) — useful for the customer's verbatim before-state language,
though it still needs a human read for tone: Claap's own tagging surfaces objections and pain
points, not case-study narrative.

---

## Why Most B2B Case Studies Fail

The three failure modes that make case studies useless in a sales process:

**1. Buried results.** The conventional structure — introduction, challenge, solution, results — makes the buyer read 600 words before finding out what happened. The buyers who matter (economic decision-makers who share documents internally) skim. They need the result in the first 10 words.

**2. Vague before state.** "The company faced operational challenges" tells the reader nothing. "The team was manually reconciling invoices for 12 hours every week, which the CFO described as 'embarrassing for a company our size'" gives the prospect a specific situation they can see themselves in. The before state is the conversion mechanism — the prospect reads it and thinks: *that's us.*

**3. Anonymous metrics.** "Significant improvement" and "reduced time" are noise. "94% reduction in reconciliation time — from 12 hours to 45 minutes per week" is a headline. If the customer won't share numbers, probe for relative improvements: "Was it a 2x improvement? A 5x?" If they won't share any, question whether this customer is the right story for a case study.

---

## Customer Selection Criteria

**If this is the third or fourth customer in a row that fails this table** — nobody has a
measurable result, nobody has a real before-state to point to — stop treating it as a sourcing
problem and start treating it as a positioning problem. A product without a differentiated,
recognized promise produces customers who can't say what changed, because nothing distinct
happened for them to notice. No amount of interview skill fixes that; it's a signal to route
back to positioning work, not to lower the bar on which customers count as case-study material.

Before running the interview, confirm the customer meets these criteria:

| Criterion | Why it matters |
|-----------|----------------|
| Measurable result (at least 2–3 metrics) | Without numbers, the case study is a testimonial at best |
| Clear before state (what was broken) | Contrast creates the narrative. No before = no story |
| Champion willing to be named and quoted | A named, recognizable company gives a rep something to point to — real leverage when the brand is known. But don't treat anonymized as a consolation prize by default: the trust gap is narrower than it looks once the story is specific enough (see below) |
| Decision-maker relationship | The economic buyer's quote closes deals; the champion's quote opens conversations |
| 3–6 months post-implementation | Long enough for results, fresh enough for recall |

**A champion-only relationship is a sales signal, not just a case-study gap.** The champion
drives a deal forward internally; only the economic buyer can kill it or sign it. If the account
team never once got the economic buyer on a call across the entire deal cycle — not just for
this interview, for the whole relationship — that's a single-threaded account, and it's worth
flagging back to the rep as a retention risk independent of whether the case study gets written.
Don't manufacture a buyer-side quote to paper over it, and don't treat the gap as this skill's
problem to solve. A cheap way to check before ever picking up the phone: HubSpot's deal record
carries `num_associated_contacts`, auto-filled by the CRM — a closed-won deal sitting at 1 after
several months in pipeline is the single-threading signal in numeric form, worth a look before
scheduling the interview at all. Where more than one contact is associated, `hs_buying_role`
(a native Contact field, multi-select — Champion, Decision Maker, Budget Holder, Executive
Sponsor, and five others) says in one lookup whether any of them is actually tagged past
Champion, rather than counting contacts blind. It lives on the Contact, not the deal — a contact
active on two deals can't carry a different role on each — so on an account with several deals
in flight, confirm the role was set for *this* deal's relationship (the Contact:Deal association
label, or Buying Groups on Sales Hub, is what scopes it there) before treating an absent role as
"no economic buyer relationship exists" rather than "nobody logged it."

**Who not to approach:** Customers currently in renewal negotiations, customers on a performance improvement plan, customers whose champion left the company, any deal where the relationship with the rep ended badly.

**When anonymized is still worth writing.** Refusing to write anything without a name goes too
far the other way, and the trust gap is narrower than most marketers assume: a 2025 survey of
811 B2B buyers, sellers, and marketers (UserEvidence, "The Evidence Gap Report") found buyers
trust an anonymous-but-*independently-verified* testimonial almost as much as a named one — 60%
versus 64%. That "verified" is doing real work in their number: a trusted third party confirming
the customer and the result are real, not just a story dressed up as anonymous. The same report
found trust drops to 44% for an anonymous story with no such verification — the near-parity is
earned by the verification, not by anonymity itself, which is exactly why the specificity below
(metrics, before-state) has to carry the trust-building work a verification badge would otherwise
do. Anonymized is worth the interview when the metrics and before-state are
specific enough on their own that a prospect in the same situation still recognizes themselves
— industry, company size, and the shape of the problem carry the recognition instead of the
logo. It stops being worth it when the story is *also* thin: a modest, unremarkable result with
no name attached has nothing left to make it land. And when the customer is a brand a prospect
would actually recognize, don't settle for anonymous on the first no — that recognition is
doing real work, worth a second ask (legal review, a narrower quote-only approval) before
downgrading the format.

---

## Interview Guide

For the interview scheduling rules and the full interview script (opening promise, question sequence, closing question), read `references/interview-guide.md` before running or preparing the interview.

---

## Case Study Structure

**Inverted pyramid.** The most important information goes first. Buyers who skim get the key takeaway; buyers who want detail find it further down. Never bury the results.

---

For the section-by-section structure — 1. Headline + Snapshot Box, 2. The Problem, 3. How They Did It, 4. The Results (with word counts), 5. Pull Quotes — and the format variants derived from the approved long-form version, read `references/case-study-structure.md` before drafting.

---

## Rules

- **Nothing publishes without written customer sign-off.** The interview script's opening
  promise — "nothing goes live without your approval" — is the one line in this whole process
  that cannot bend for a deadline.
- **No numbers, no case study.** If the customer won't share at least one hard metric, this is
  a testimonial, not a case study — write it as one, or don't approach that customer for this
  format at all.
- **The economic buyer's quote is what closes, not the champion's.** If only the champion is
  available for interview, get their best material and flag in the draft that a buyer-side
  quote is missing — don't manufacture one to fill the gap.
- **A case study is a real customer, full stop.** No composite customer built from several
  accounts, no AI-generated stand-in presented as if they were quoted, no synthesized "typical
  result" dressed up as a specific one — a buyer who catches one fake number stops trusting
  every other one in the document. This isn't a US-only risk: the FTC's ban on fake
  AI-generated testimonials has been enforced since October 2024, and in the EU the AI Act's
  transparency obligations for AI-generated content (Article 50, in force since August 2026,
  fines up to €15M or 3% of global turnover) treat a fabricated testimonial paired with
  AI-generated imagery as high-risk consumer deception even when labeled "AI-generated." Write
  for whichever jurisdiction the customer sits in — only the enforcement body changes, not the
  rule against fabricating.
- **One case study, one set of source material.** Every format variant traces back to the same
  approved transcript and long-form draft. If a new claim shows up in the LinkedIn version
  that isn't in the approved case study, it hasn't been approved — cut it or send it back for
  sign-off.
- **A case study that reads like a product brochure has failed**, regardless of how accurate
  it is. If the customer's voice disappears for more than a paragraph at a time, rewrite from
  the transcript, not from the previous draft.