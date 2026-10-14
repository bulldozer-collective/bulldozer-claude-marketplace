# Operationalization Checklist

## Operationalization Checklist

Before running any signal-based motion:

- [ ] Signal sources are connected and alerting — native OS signals (`bdzCreateSignal`) where a matching type exists, third-party alerting (Crunchbase, LinkedIn Sales Navigator saved searches, BuiltWith) where it doesn't
- [ ] False-positive triage rules are documented and enforced — not everything that looks like a signal is a signal
- [ ] Each signal type has an assigned decay window and tier
- [ ] Tier 1 SLA is defined and achievable: who routes it and in how long?
- [ ] Each signal type has a unique message angle — not just personalization tokens on a generic template
- [ ] Sequence steps are loaded in the outreach tool before signals start firing — in Bulldozer OS, the Lemlist campaign and its steps exist and the lead list they draw from is created before the first signal fires
- [ ] The Lemlist campaign is actually started (`bdzStartLemlistCampaign`), not just created — check it isn't already running first (`bdzListLemlistCampaigns`/`bdzGetLemlistCampaign`, synced hourly, not live), since a second Start call on a running campaign fails every time
- [ ] CRM (or, in Bulldozer OS, the lead list's per-lead `note`) tracks signal type, tier, and fire date per account — so a second signal inside the decay window escalates the account instead of starting a fresh sequence from Tier 3
- [ ] A non-response exit path exists — a completed sequence with no reply routes the account back to Tier 3 nurture, it does not restart on the same signal
- [ ] Someone owns weekly review of the false-positive rate — if nearly all raw signals are being acted on, the filters are too loose and rep time is being spent on noise
- [ ] If a website visitor-identification tool feeds first-party intent, legal/compliance has reviewed both the tool and the opening line before it ships at volume — this is a live litigation area in the U.S., not a settled one
