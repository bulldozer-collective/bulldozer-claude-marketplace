# Deliverability and Domain Health — Full Detail

Called from the main skill's "Deliverability Is Not the Copywriter's Afterthought" and
"Retire a Damaged Domain" sections. Read this before setting up a new sending domain,
or before deciding whether a damaged one is worth nursing back.

## Warming Up a New Sending Domain

A perfect sequence sent from a cold or poorly-configured domain never gets read. Before
writing a single word for a new sending domain: it needs 3–4 weeks of gradual warm-up
(climbing from roughly 15–20 sends/day toward full cadence — the exact ceiling depends
on mailbox age and provider, sources disagree on the number, so ramp by watching bounce
and spam-complaint rates rather than hitting a fixed target). Check domain reputation in
Google Postmaster Tools before scaling volume; a "Needs work" Compliance Status or a weak
Deliverability Analysis verdict typically needs several weeks of clean sending to recover
— these are directional timeframes from deliverability vendors, not a guarantee.

Past the first two weeks of warm-up, watch the method too: an automated, mutualized
warm-up pool (inboxes that only ever email each other, same tool, same schedule) is
increasingly recognized and penalized by mailbox providers rather than rewarded. Don't
leave a domain at 100% warm-up-tool traffic beyond week two — blend in real sends.

## What Changed in Late 2025, and What Postmaster Tools Shows Today

Since November 2025, Gmail and Yahoo reject (not just spam-folder) non-compliant mail
outright for bulk senders: proper SPF/DKIM/DMARC authentication, a complaint rate under
0.3%, and a working one-click unsubscribe are baseline requirements once volume is high
enough to count as "bulk." A hand-run SDR sequence is usually far under that volume
threshold, but the same hygiene — authenticate the domain, keep complaint rate low, make
opting out trivial — is what keeps any cold sequence out of the spam folder regardless of
volume. Don't treat "we're not a bulk sender" as a reason to skip authentication.

Google Postmaster Tools is still the place to check, but not the way it used to work: its
old Domain/IP reputation dial (High/Medium/Low/Bad) is gone — retired with the v1→v2
rollout (v1 pulled September 30, 2025, reputation data stopped flowing around August
2026). What's there now is a Compliance Status (Compliant / Needs work / No data found)
plus a Deliverability Analysis verdict — a rules check against your setup, not a
reputation score — sitting alongside the same spam-complaint-rate metric as before. Read
the compliance verdict and the complaint rate; don't go looking for a color tier that no
longer exists.

## Compliance, Briefly

CAN-SPAM (US) permits unsolicited B2B email without prior consent, but requires an
accurate sender identity, a valid physical postal address, and a working opt-out honored
promptly — these usually live in the sending tool's account-level footer, not something
to hand-write into every draft. Cold email to EU contacts is generally run under GDPR's
"legitimate interest" basis for B2B outreach, but the rules vary by country and by how the
address was sourced. Treat this paragraph as a practitioner's summary, not legal advice —
check with counsel before scaling outreach into a new jurisdiction.

## Retire a Damaged Domain, Don't Try to Rescue It

Warm-up is a preventive move, not a repair. It builds a clean domain's reputation before
you send at volume — it does not fix a domain that's already burned. The threshold that
should make you retire a sending domain rather than keep nursing it: a spam-complaint rate
that reaches or stays at 0.3% — Gmail's own hard line for rejecting bulk senders outright,
and the point past which Gmail only restores sending eligibility after 7 consecutive days
back under 0.3% — or a simultaneous listing on more than one major blocklist (Spamhaus,
Barracuda, SpamCop). A single metric ticking up for a day is noise, not a signal. Below
that line, give the domain 2–6 weeks of genuinely clean sending before deciding either
way. These numbers come from a convergence of deliverability-vendor sources plus a Google
support page naming the 7-consecutive-day recovery mechanic — treat them as a strong
practitioner's line, not an official platform guarantee.

Once that threshold fires, don't sink another few weeks trying to recover the same domain
while a sequence is waiting to go out. Teams that send outbound in volume keep more than
one domain in rotation for exactly this reason — a damaged domain gets set aside and a
clean one takes over, rather than the whole sequence stalling on one domain's recovery.
(The exact rotation cadence and how many mailboxes per domain is a judgment call that
depends on sending volume — no single number here is well-corroborated enough to give as
a rule.)
