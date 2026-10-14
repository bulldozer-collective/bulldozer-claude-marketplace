# Program Design — Detail

## Scaling past quarterly sampling

**Scaling past quarterly sampling.** The program above assumes a human interviewer and a quarterly sample. Teams that want coverage on every closed deal instead of a sample increasingly use a dedicated win-loss or conversation-intelligence platform (AI-moderated interview calls, or signal mined from recorded sales calls) to run at that volume — this is a tool choice made outside Bulldozer OS, not a step this skill executes; start with the manual quarterly sample above and only evaluate a platform once the program has proven its findings drive action.

## Pre-screening the interview list

**Pre-screen the list with a CRM signal before you start recruiting.** In HubSpot, `num_associated_contacts` on the deal is auto-populated — no manual tagging required — and it's a cheap proxy for how many people you ever actually reached on that account. A closed-lost deal sitting at `num_associated_contacts=1` after months in pipeline is very likely single-threaded: you were talking to one person who couldn't carry the decision internally. Flag those deals before you build the outreach list — the interview will usually just confirm what the CRM already told you, and the finding routes straight to "single-threaded" in Pattern Extraction, not to a generic "process issue."

**Don't guess the champion or decision-maker from job title alone — check `hs_buying_role` first.** HubSpot's native contact property `hs_buying_role` is a 9-value enum (Blocker, Budget Holder, Champion, Decision Maker, End User, Executive Sponsor, Influencer, Legal & Compliance, Other) that a rep can tag directly on a contact — when it's populated, it names the person to recruit without inferring it from a title on LinkedIn. It's multi-select, not a single pick: HubSpot's own field description reads "Contacts can have multiple roles, and can share roles with others" — a contact can be tagged Champion and Decision Maker at once, or Champion and Budget Holder. Don't read two roles on one contact as a tagging mistake, and don't assume "for wins, interview the champion — not just the economic buyer" (Who to interview, above) always means two different people to recruit — check whether this portal's tags already say the champion and the economic buyer are the same person before building a two-contact outreach list. It has a real limit: the field lives on the Contact record, not scoped per deal, so a contact who touched two deals can't carry a different role on each — if that distinction matters for a specific deal, check the Contact-to-Deal association label instead of the contact property. Treat it as a shortcut when it's filled in, not a source of truth when it's blank — most reps don't tag it consistently, so absence doesn't mean the role is unknown, only unrecorded.

## Recruiting

Expect roughly 10–30% of outreach to convert to a completed interview, well below 100% even with a warm ask — build a target list of 4–6x the interviews you need, not 1.5x. A rep-to-buyer introduction converts far better than a cold email from an unknown interviewer, but the exact multiplier isn't consistent enough across sources to quote as a fact — plan the outreach volume, don't bank on a precise rate.

**Recruiting script (from rep to buyer):**
> "Hi [Name] — I wanted to reach out personally. I know we didn't win your business, and I genuinely want to understand what we could have done better. Our Head of Product Marketing does independent buyer conversations — no sales, no follow-up — just 30 minutes to understand your perspective. Would you be open to that? It helps us improve, and many people find it useful to have a structured debrief on a major purchase decision."

**Why this works:** Framing it as independent (not the rep calling), non-sales, and mutual benefit increases response rates. The rep flagging it as personal adds warmth.

**Use it as a starting point, never as a script to read.** A message that sounds rehearsed on the phone kills the ask before it lands. Keep the structure — independent interviewer, non-sales framing, mutual benefit — but have the rep put it in their own words for that specific relationship, not recite it.
