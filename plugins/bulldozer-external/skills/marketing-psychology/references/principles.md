# Principles Reference

Full detail for every principle named in `SKILL.md`'s Challenge → Principle Lookup table:
the mechanism, the implementation, and — where one exists — the sourcing or caveat that
keeps it from being shipped as a settled fact. Read the entries that match the principles
you picked; this file is backing detail, not a second entry point into the skill.

## Contents

- [Understanding Buyers](#understanding-buyers)
- [Influence & Persuasion](#influence--persuasion)
- [Design & Behavioral Models](#design--behavioral-models)
- [Pricing-Specific](#pricing-specific)

## Understanding Buyers

**Mere Exposure Effect** — People prefer things they've seen before.
*Use*: Consistent brand presence across channels builds preference before a buying moment.

**Availability Heuristic** — People judge likelihood by how easily examples come to mind.
*Use*: Case studies and testimonials make success feel more achievable.

**Endowment Effect** — People value things more once they own them.
*Use*: Free trials and freemium let customers "own" the product — they're reluctant to give it up.

**IKEA Effect** — People value things more when they've contributed to building them.
*Use*: Let customers customize, configure, or build something. Investment increases perceived value.

**Zero-Price Effect** — "Free" is psychologically different, not just a low price.
*Use*: Free tiers and free trials have disproportionate appeal. The jump from $1 to $0 is bigger than $2 to $1.

**Present Bias / Hyperbolic Discounting** — People strongly prefer immediate rewards.
*Use*: Emphasize immediate benefits ("Start saving time today") over future benefits ("ROI in 6 months").

**Status-Quo Bias** — People prefer the current state. Change feels risky.
*Use*: Reduce friction to switch. "Import your data in one click." Make the transition feel safe.

**Paradox of Choice** — Too many options overwhelm and paralyze.
*Use*: Three pricing tiers beat seven. Recommend a single "best for most" option.

**Goal-Gradient Effect** — People accelerate effort as they approach a goal.
*Use*: Progress bars, completion %, and "almost there" messaging. Onboarding checklists.

**Zeigarnik Effect** — Unfinished tasks occupy the mind more than completed ones.
*Use*: "You're 80% done" creates pull to finish. Abandoned cart and incomplete profile flows.

**Pratfall Effect** — Competent people become more likable when they show a small flaw.
*Use*: "We're not the cheapest, but we're the most reliable" increases trust and differentiation.

**Mental Accounting** — People treat money differently based on its source or intended use.
*Use*: "$3/day" feels different than "$90/month." Frame costs in favorable mental accounts.

## Influence & Persuasion

**Reciprocity** — People feel obligated to return favors.
*Use*: Free content, free tools, and generous free tiers create obligation. Give value before asking.

**Commitment & Consistency** — Once people commit, they want to stay consistent.
*Use*: Get small commitments first (email, free trial). Each step makes the next more likely.

**Authority Bias** — People defer to experts and authority figures.
*Use*: Expert endorsements, certifications, "featured in" logos, thought leadership.

**Social Proof** — People follow what others are doing.
*Use*: Customer counts, testimonials, logos, reviews, "trending" indicators.

**Scarcity / Urgency** — Limited availability increases perceived value.
*Use*: Limited-time offers, exclusive access, low-stock signals. Only use when genuine — fake countdowns and invented low-stock signals are the textbook example regulators now target as a "dark pattern." The FTC settled with Amazon for $2.5B in September 2025 ($1B civil penalty, $1.5B in consumer refunds) over deceptive Prime enrollment/cancellation design — and the case rested on ROSCA (the Restore Online Shoppers' Confidence Act, a 2010 statute with its own disclosure, consent, and easy-cancellation requirements for negative-option offers) *and* FTC Act Section 5, not on the FTC's own 2024 Click-to-Cancel trade-regulation rule, which the Eighth Circuit had already vacated on procedural grounds in mid-2025. Keep that distinction straight: ROSCA itself was never vacated and stays fully enforceable for subscription and cancellation flows regardless of what happens to the FTC's rulemaking. Separately, the FTC reopened rulemaking toward a replacement trade rule with a new ANPRM published in the Federal Register on March 13, 2026 (comment period closed April 13, 2026); reconfirmed as of October 2026 that no replacement rule has been finalized — still at the notice-and-comment stage. So weigh a cancellation or subscription-enrollment design against ROSCA's negative-option requirements and Section 5 — both live today — not against the still-pending replacement rule. California's CCPA regulations, in effect since January 1, 2026, name false urgency explicitly as a prohibited dark pattern in consent flows — the regulator's own example is a countdown clock claiming a discount expires soon when nothing about it is actually time-limited. Treat this as a legal-risk check, not just an ethics one, before shipping a scarcity mechanic that isn't real.
Two things a legality check alone misses. First, enforcement so far has landed hardest on cancellation flows, not on scarcity copy itself — a countdown timer that's technically real can still sit on a page whose cancel/downgrade path is the actual exposure; check both, not just the one the brief mentions. Second, "genuine" is necessary but not sufficient: run it past `bdzGetProjectToneOfVoice` too. A real deadline pushed with a red countdown banner can still fight a brand that's positioned on calm or premium trust — when the tone-of-voice record and the urgency mechanic pull in opposite directions, that's a reason to soften the execution (a plain end date beats a ticking clock) even if the constraint itself is real.

**Loss Aversion** — Losses feel more painful than equivalent gains feel good; the classic estimate is about 2×.
*Use*: "Don't miss out" beats "You could gain." Frame in terms of what they'll lose by not acting. Treat "2×" as a contested textbook rounding, not a number to cite in a business case. The largest synthesis to date (Brown, Imai, Vieider & Camerer, 2024, 607 estimates across 150 studies) puts the average at λ≈1.955 in risky-gamble paradigms. A 2025 re-meta-analysis of that same dataset (Yechiam & Zeif, *Journal of Economic Psychology*) found the asymmetry only shows up when losses are smaller than gains or payoffs are presented in a fixed order — restricted to the cleanest test, symmetric and unordered designs, the coefficient drops to λ≈1.07 and stops being reliably different from 1 at all. Gal & Rucker's earlier, more general critique (2018, *Journal of Consumer Psychology*) made the same directional point on other grounds — don't cite it as the source of a specific ratio, it argues the effect is context-dependent, not that it settles at 1.3. The direction still holds — write to what's lost, not what's gained — just don't attach a specific multiplier to it.

**Anchoring** — The first number seen heavily influences subsequent judgments.
*Use*: Show the higher price first (competitor price, enterprise tier) to anchor expectations. A 2025 replication study (Li et al., *Economic Inquiry*) re-ran a result originally reported as a 31% shift in bids and found 3.4% once the design was properly powered — real, but far weaker than the classic lab number suggests. Treat anchoring as a direction to test, not a guaranteed lift.

**Decoy Effect** — Adding an inferior third option makes one of the originals look better.
*Use*: A "decoy" pricing tier that's clearly worse value makes your preferred tier the obvious choice. Named replication work questions how reliably this specific mechanism (asymmetric dominance) shows up outside the lab, on real pricing pages: Yang & Lynn, "More Evidence Challenging the Robustness and Usefulness of the Attraction Effect" (*Journal of Marketing Research* 51(4), 2014, pp. 508–513) ran 91 replication attempts across 23 product categories and 73 three-option choice sets, and found only 11 reliably reproduced the effect — it fell to chance level once options were described in ordinary qualitative language, the way a real pricing page reads, rather than the abstract numeric attributes typical of lab studies. Anchoring, social proof, and a strong default option have better field support. Don't design a pricing page around the decoy alone; pair it with a real anchor and validate with an A/B test (see `ab-testing`) before trusting the tier shift to it. Read that test the same way any other pricing test is read: 95% significance, 80% power, and a minimum two-week window to cover a full weekly cycle — a decoy tier that looks like it's working after three days is exactly the false-positive pattern this mechanism is prone to.

**Framing Effect** — How something is presented changes how it's perceived.
*Use*: "90% success rate" vs. "10% failure rate" — identical, but feel different. Frame positively. Careful with a technical or late-funnel buyer: don't reflexively dissolve a feature into a soft benefit statement to "frame it better." For this buyer the feature is often the proof they came for — bridge to the benefit instead of replacing it ("passes SOC 2 audits automatically — which means your security review takes days, not weeks").

**Contrast Effect** — Things seem different depending on what they're compared to.
*Use*: Show the "before" state clearly. Contrast with your "after" makes improvements vivid.

## Design & Behavioral Models

**Hick's Law** — Decision time increases with number and complexity of choices.
*Use*: One clear CTA beats three. Fewer form fields beat more.

**Fogg Behavior Model (B=MAP)** — Behavior happens when Motivation, Ability, and a Prompt converge at the same moment. All three must be present together, not just each above some bar.
*Use*: High motivation but hard to do = won't happen. Easy to do but no prompt = won't happen. Diagnose which is missing.

**Activation Energy** — The initial energy required to start something prevents action.
*Use*: Pre-fill forms, offer templates, show quick wins. Make the first step trivially easy.

**Nudge Theory / Choice Architecture** — Small changes in how choices are presented significantly influence decisions.
*Use*: Default selections, strategic ordering, and friction reduction guide behavior without restricting choice.

## Pricing-Specific

**Charm Pricing / Left-Digit Effect** — Prices ending in 9 seem significantly lower. $99 feels much cheaper than $100.
*Use*: .99 or .95 endings for value-focused products.

**Round-Price Fluency Effect** — Round numbers feel premium and easier to process.
*Use*: $100 signals quality; $99 signals value. Match to positioning.

**Rule of 100** — For prices under $100, percentage discounts feel larger. Over $100, absolute discounts feel larger.
*Use*: $80 product: "20% off" beats "$16 off." $500 product: "$100 off" beats "20% off."

**Good-Better-Best** — Three tiers where the middle is the target. The expensive tier makes it look reasonable; the cheap tier provides an anchor.
*Use*: Design pricing pages around the tier you want most customers to choose.
