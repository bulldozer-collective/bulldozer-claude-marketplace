# Compliance & number reputation — cold calling detail

Full detail behind the Compliance & Number Reputation section of the main skill: dialer
choice under *Duguid* and the FTC's Telemarketing Sales Rule, the local-presence number
trap, and the consent requirement for an AI voice agent replacing a human SDR —
including the California AB 2905 disclosure obligation. The two constraints that apply
on every call (calling hours, caller ID reputation) are in the main skill, not repeated
here.

## Dialer choice is a compliance decision, not a throughput setting

Under the Supreme Court's *Duguid* ruling (an automatic telephone dialing system
requires a random-or-sequential number generator), both a power dialer (one line, an
agent already on before it connects) and a predictive/parallel dialer working from a
pre-loaded list generally fall outside the federal ATDS definition — *Duguid* narrowed
the definition for both, not just the power dialer. The real split between them sits
elsewhere: a power dialer structurally can't abandon a call (one line, one agent,
always ready), while a predictive/parallel dialer — several lines at once, routed to
whichever agent is free when someone answers — is exactly the pattern the FTC's
Telemarketing Sales Rule targets with its abandoned-call-rate cap: 3% of calls answered
by a live person, per campaign, over a rolling 30 days (an "abandoned" call under the
rule is one not connected to a live agent within two seconds of the person's greeting,
16 CFR 310.4(b)(4)(iii)). On top of that, more than a dozen US states run their own
autodialer statutes that define "automatic" more broadly than the post-*Duguid* federal
standard, so a dialer that's clear at the federal level can still be exposed state by
state. Default to a power dialer for cold outbound — it avoids the abandonment-rate
exposure by design; treat predictive/parallel dialing as something legal signs off on
state by state, not a throughput setting a manager flips on.

## Local-presence numbers: a reputation trap when rented

A local-presence number (matching the prospect's area code) lifts pickup, but that lift
is real and has been shrinking as buyers get used to unfamiliar local numbers — and a
rotating pool of third-party-leased local numbers is one of the fastest ways to get an
entire number block flagged "Spam Likely," since leased-pool numbers often carry weak
carrier attestation, which starts every call at a disadvantage. Buy or lease
local-presence numbers directly through the carrier that will originate the calls,
don't rotate them faster than that carrier's reputation system can track, and keep
volume per number in a normal range — the same discipline as domain rotation in cold
email.

## AI voice agents: a consent decision, not just a disclosure one

Replacing a human SDR with an AI voice agent is a consent decision, not just a
disclosure one. The FCC's February 2024 declaratory ruling — a federal action, not a
state-by-state trend — holds that a call placed with an AI-generated or cloned voice
counts as an "artificial voice" under the TCPA, the same bucket as a prerecorded
robocall. That pulls in the TCPA's full artificial-voice regime: prior express written
consent before the call goes out to a wireless number (absent an emergency or
exemption), plus identification/disclosure requirements and an opt-out mechanism —
obligations a live power-dialer call doesn't carry. In practice, an AI-voice
cold-calling program aimed at B2B mobile numbers needs consent captured before dial
one; it isn't a "launch and iterate" motion the way a human-SDR cadence is.

States can layer their own disclosure duty on top of this federal consent requirement.
California's is **AB 2905** (signed September 2024, effective January 1, 2025), which
works through the state's own autodialer statute rather than the TCPA: it expands
California's definition of an "automatic dialing-announcing device" to cover equipment
using a simulated or AI-generated voice and requires the call to disclose that the
voice is artificial at the outset. That's a different bill from SB 1001 (California's
older, general-purpose bot-disclosure law, sometimes cited for this by mistake) — treat
the exact disclosure wording and any penalty amount as unverified pending a read of the
statute text itself, but the existence and scope of the AB 2905 obligation isn't a
vendor-blog claim: it's confirmed independently by a privacy-policy tracker (epic.org)
and a California Assembly committee's own bill analysis.
