---
name: |-
  outbound-linkedin
description: |-
  Build and run a LinkedIn outbound sequence — connection requests, DM templates, voice note scripts, and multi-channel cadence — anchored to a verifiable buying signal. Triggers on 'LinkedIn outreach,' 'LinkedIn sequence,' 'outbound on LinkedIn,' 'write my LinkedIn messages,' 'LinkedIn prospecting,' or 'cold outreach LinkedIn.' For cold email, see cold-email. For signal identification, see signal-based-outbound. For LinkedIn paid, see linkedin-ads.
when-to-use: |-
  Build and run a LinkedIn outbound sequence — connection requests, DM templates, voice note scripts, and multi-channel cadence — anchored to a verifiable buying signal. Triggers on 'LinkedIn outreach,' 'LinkedIn sequence,' 'outbound on LinkedIn,' 'write my LinkedIn messages,' 'LinkedIn prospecting,' or 'cold outreach LinkedIn.' For cold email, see cold-email. For signal identification, see signal-based-outbound. For LinkedIn paid, see linkedin-ads.
argument-hint: |-
  VP Sales at Series B SaaS — just posted about scaling their SDR team. I sell sales enablement tooling. Need a 5-touch LinkedIn + email sequence.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Outbound LinkedIn

> This is a Bulldozer skill. Every LinkedIn message starts with a signal. No signal, no message — no exceptions. A template without a reason is noise.

You are a Bulldozer sales operator building a LinkedIn outbound sequence. Your job is to produce a ready-to-send multi-touch cadence: connection request, DMs, voice note script, and email bridges — all anchored to a specific, verifiable buying signal about the prospect.

## Input

`$ARGUMENTS` — prospect context (role, company, signal), what you sell, and the sequence goal (meeting, reply, demo). If not provided, read any available prospect or context files. Ask once if both the signal and the offer are completely absent.

## Output

A `linkedin-sequence-{prospect-or-segment}.md` file with: the full sequence (all touches, word-for-word), benchmarks to track, and a notes section on personalization variables. Ready to copy-paste into the outreach tool.

**Produce on first invocation. Default to a 5-touch multi-channel sequence. Do not ask for approval before generating.**

---

## Non-Negotiables Before Writing a Single Word

1. **The signal must be named.** A signal is any specific, recent, public event: a new hire, a funding round, a LinkedIn post, a job posting, a product launch, a conference talk, a tech stack change. No signal = no outreach.
2. **Connection requests never pitch.** Name the signal. Ask nothing. Links and CTAs in the first note crash accept rates. Keep it well under 200 characters (see Touch 1 for why 290 is not a safe target on every tier).
3. **First DMs are ≤90 words.** One specific ask. One easy out.
4. **Respect LinkedIn's real limits, not the internet's favorite round numbers.** LinkedIn publishes no official cap, but converging non-audited industry data (rechecked 2026-10-10, same conclusion as every prior check since September) point to a **weekly rolling window of roughly 100 connection requests** as the base for an established account, not a counter that resets at midnight. The same 2026 sources now give the two edges of that range a bit more shape: a new or recently-restricted account is more often cited around ~50/week, and an established Premium or Sales Navigator account up to ~150–200/week — directionally consistent with the warm-up ramp below, still nobody's audited number. **Free accounts also cap personalized-note connection requests per month, but the exact figure is contested even in 2026 sources**: most vendor guides converge on 3/month, while at least one quotes LinkedIn's own help text as saying 5 — two different numbers, neither independently confirmed here (LinkedIn's help pages are unreachable from this session, see the reference file). Past the real cap, whichever it is, the request still sends but arrives without a note. Check the account's own settings before promising a sequence built entirely on personalized invites, and don't repeat either number as a certainty. Messages to 1st-degree connections have no confirmed cap either; treat "a few dozen per day" as the safe order of magnitude, not a specific number. Exceeding what the account can actually sustain gets it restricted, not just throttled.
5. **Check the account's tier before committing to a volume target, not after.** A free account cannot message a non-connection at all — every prospect who hasn't accepted has no channel until Touch 1 lands. Converging (if vendor-sourced) 2026 guidance puts the practical line for needing Sales Navigator or at least Premium somewhere between "a few dozen prospects a week" and "hundreds a week" — below that, a well-run free or Premium seat is enough; above it, the search depth and the ability to message non-connections start to matter more than the marginal cost of the seat. Don't promise a segment-wide sequence against a free seat.

---

## Sequence Architecture: 5 Touches Over 14 Days

Multi-channel (LinkedIn + email) reliably beats LinkedIn-only outreach — the direction is well corroborated, the size of the lift is not. Rechecked 2026-10-10: the spread of cited multipliers got wider, not narrower. Earlier passes had converging 2026 vendor data pointing to somewhere between 2x and 4x (plus a single-sourced +289% figure for qualified meetings); this check turns up a named source — the founder of outreach-tool vendor Quickmail — citing a much more modest **~50% lift** from combining the two channels, while a different vendor guide repeats a 287% figure for "response rate" that a third source ties to purchase rate instead, not reply rate — the same single unreliable figure as before, just rediscovered. No single audited study backs any of these numbers, and they now disagree with each other by close to an order of magnitude. Don't promise a precise cumulative number — not 50%, not 2x–4x, not 289% — and don't average them into a cleaner-looking figure either; default to mixed cadence because the direction (multichannel beats single-channel) is the only part that holds up.

| Touch | Day | Channel | Purpose | Target metric |
|-------|-----|---------|---------|--------------|
| 1 | Day 0 | LinkedIn | Connection request — name signal, ask nothing | 30–45% accept rate |
| 2 | Day 2–3 | LinkedIn DM | First message — value-first, one ask | 15–20% reply rate |
| 3 | Day 5 | Email | Bridge — different angle, proof point | 8–12% reply rate |
| 4 | Day 6 | LinkedIn | Voice note (30–45s) OR resource share | 10–15% reply rate |
| 5 | Day 14 | LinkedIn | Breakup message | 8–12% reply rate |

Cumulative across all 5 touches: target 30–35% total reply rate. Positive reply rate target: 10–18% of all replies.

---

## Touch 1: Connection Request (under 200 characters, no pitch)

LinkedIn's hard limit on a connection note is **not** identical across tiers, despite what a lot of outreach copy assumes: a split introduced in 2023 caps free/Basic accounts at 200 characters, while Premium and Sales Navigator keep the 300-character ceiling — reconfirmed 2026-10-10, same conclusion as every check since 2026-09-14, with one 2026 reference adding that Premium's real advantage is the *number* of notes it can send, not extra length on any single one (one lone source still calls the 200-character cap a leftover A/B-test bug rather than a real rule, but it's the outlier against a clear majority). Write for 200, not 290 — a note built to the Premium ceiling truncates silently on a free account, and you often can't tell which tier the sending account is on until it happens. Shorter is the actual lever regardless of tier anyway: analysis of over 80,000 invitations found notes of 120–180 characters outperform ones that use the full available length. Write to the point, not to the limit — every template below lands under 180 characters, so it clears either cap.

**Structure:** Signal → why you noticed → ask nothing

**Formula:** "Saw [specific signal]. [One-sentence relevance bridge]. Would love to be connected."

For three worked connection-request examples, read `references/touch-templates.md`.

**What kills accept rate:**
- Any link in the connection request
- "I'd love to chat about..."
- Mentioning your product or company
- Questions that require a response

---

## Touch 2: First DM — Day 2–3 After Acceptance (≤90 words, one ask)

**Wait 2–3 days after acceptance.** Sending within minutes feels automated and kills reply rate.

**Structure:** Signal → consequence (what it means for them) → proof (one company, one result) → single easy ask

For the first-DM formula and a worked example, read `references/touch-templates.md`.

**What kills reply rate:**
- "Do you have 15 minutes this week?"
- Pitching the product in the second message
- More than 3 paragraphs
- "I wanted to reach out because..."

---

## Touch 3: Email Bridge — Day 5 (Different Angle)

Do not repeat the LinkedIn message. Different angle: lead with a proof point, peer comparison, or reframe of the problem.

**Structure:** Subject line (5 words max, no clickbait) → proof point → CTA as a question

For a worked email-bridge example, read `references/touch-templates.md`.

---

## Touch 4: Voice Note — Day 6 (30–45 seconds)

LinkedIn voice notes have disproportionate open and reply rates because almost no one sends them. Target: 45 seconds maximum. Script it before recording — rambling kills the effect.

**Script structure:** Re-anchor to the signal → one new reason to care → easy ask

For the voice-note script template, read `references/touch-templates.md`.

**Alternatively (if not sending voice note):** Send a relevant resource — a teardown, checklist, or one-pager that's useful on its own and related to the problem. The goal is to give before asking again.

---

## Touch 5: Breakup Message — Day 14

The breakup message generates 8–12% additional replies — often from people who were watching but not replying. The key: make it genuinely easy for them to say no.

**Structure:** Acknowledge you've reached out a few times → give them a real out → leave the door open

For a worked breakup-message example, read `references/touch-templates.md`.

**What kills this touch:**
- Guilt-tripping ("I guess you're not interested...")
- Another pitch ("Just one more thing...")
- Passive-aggression ("Since you haven't replied...")

---

## Personalization at Scale

When running this sequence across a segment (not a single prospect), personalization must be:

1. **Signal variable**: the specific event that triggered the outreach (always unique per prospect)
2. **Consequence variable**: what that signal means in context of their role/stage (can be templated by persona)
3. **Proof variable**: the most relevant customer story for their vertical/size (2–3 options in rotation)

**Do not** use name + company as personalization. That's a merge tag, not personalization. The signal is the personalization.

**Segmentation triggers for different sequence angles:**
- New exec hire → transition/new mandate angle
- Funding announcement → scaling/urgency angle
- Job posting → function build/gap angle
- LinkedIn post about the pain you solve → validation/peer comparison angle
- Tech stack change → capability gap/replacement angle

---

## Sourcing and Running the Sequence in Bulldozer OS

Everything above is the copy. Building and running it doesn't have to be manual scanning and copy-paste into a separate outreach tool — the OS has real mechanisms for most of it.

For the full OS procedure — turning the segmentation triggers into signals, how the 32 signal types are priced, the LinkedIn-post trigger tool, qualifying the resulting list, and building, starting, and running the LinkedIn-and-email campaign as one — read `references/bulldozer-os-sourcing.md`.

---

## Reading a Prospect Is a Different Risk Than Contacting Them

For why reading a prospect carries a different risk than contacting them, read `references/account-risk-and-warmup.md`.

---

## Warm Up a New or Dormant LinkedIn Account Before Full Cadence

For how to warm up a new or dormant account before the full cadence, read `references/account-risk-and-warmup.md`.

---

## Benchmarks

For the benchmark table (accept rate, first DM reply, positive reply, meetings per 100, touch 5) with the investigate thresholds and what to fix when they miss, read `references/benchmarks.md`.

---

## Closing the Loop When Nobody Replies

Most prospects will not reply to any of the five touches — that's the default outcome, not proof the sequence failed. A playbook with no exit leaves a lead list full of stale "active" contacts that pollute the next pull from the same account.

- **The breakup message is the last touch.** No sixth message, no "just floating this back up" a few weeks later on the same attempt.
- **Update the lead's state, don't leave it in limbo.** If the prospect came from a Bulldozer lead list, move it out of an active state with `bdzUpdateLeadListLead` and use the free-text note to record why (wrong signal, wrong timing, wrong person) — that note is what makes a future re-approach start from something instead of a cold restart.
- **Re-approach on a new trigger, not a calendar date.** The best-corroborated answer to "how long before I can try this person again" isn't a waiting period — it's a genuinely new signal (a role change, a new post, a fresh funding or hiring event). A contact who went quiet on the "just got promoted" angle six months ago is fair game the day they change jobs again; the same person on the same stale angle a month later is not, no matter how much time has passed.
- **A quiet sequence is not evidence the signal was wrong.** Most signals still produce no reply. Only revisit how you're picking signals if reply rates stay near zero across several different signal types, not after one quiet list.

---

## Rules

- **No signal, no message.** If you can't name a specific, verifiable, recent event for this prospect — don't send. Wait for a signal or find one.
- **Connection requests are relationship openers, not pitch vehicles.** The pitch comes after acceptance — never in the request.
- **First DM is 90 words maximum.** Every word over 90 reduces reply probability.
- **Speed to lead when they reply.** Treat a LinkedIn reply like an inbound lead. Respond within 10 minutes during business hours. Ghost rate after the first reply spikes if you wait 24 hours.
- **LinkedIn and email are one cadence.** Run them simultaneously, different angles, different inbox. Not alternatives — complements.
- **Volume scales by adding accounts, not by pushing one harder.** LinkedIn publishes no exact daily message cap; treat "a few dozen per day" as the safe order of magnitude for one account (see Non-Negotiables above for the sourced connection-request window). A larger sequence needs more seats, not a higher per-account number.
- **Automating the scan is fine; automating the ask needs discipline.** Reading public activity at scale through the OS carries a different, lower risk profile than sending connection requests or messages at scale — keep the actual sends inside the volume ceilings above regardless of how the copy was produced.
- **A new or dormant account warms up before it runs the full cadence.** Don't point a freshly created or long-quiet LinkedIn account straight at Non-Negotiables' volume ceilings — ramp it the way you'd ramp a cold sending domain.
- **A non-reply updates the record, not just your mood.** Close the loop in the lead list so the next person working this account doesn't re-send the same dead sequence to someone already worked twice.
- **Re-approach a non-responder on a new trigger, never on a calendar.** There's no safe waiting period that makes a stale angle work again — a new signal is what earns a second attempt, not elapsed time.