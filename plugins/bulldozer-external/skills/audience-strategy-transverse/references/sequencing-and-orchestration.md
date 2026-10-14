# Sequencing Gates in Bulldozer OS and Campaign Orchestration Model

## Step 3: Channel Sequencing Logic — gate mechanics

**How the ABM gate actually fires in Bulldozer OS.** "Activate account-level LinkedIn targeting" is not a manual export and reimport into the ad account: `bdzCreateAudience` creates an empty audience — `audienceType` `COMPANY_LIST` (account-level, **LinkedIn only**; Meta rejects `COMPANY_LIST` with a 400, and the type is immutable once set) or `CONTACT_LIST` (person-level, the default, works on both platforms) — then `bdzAddAudienceMembersFromLeads` fills it directly from leads already captured on the project, no export/reimport step. Because Meta has no company-list equivalent, "account-level" ABM only exists as such on LinkedIn; on Meta the same gate has to mean enrolling every known buying-committee contact as a `CONTACT_LIST` instead. Build the gate around two timing gaps rather than around their absence: the audience is born `BUILDING` and LinkedIn can take up to 48 hours for its first match (poll `bdzGetAudience` until `targetingId` is set) against Meta's few minutes, and LinkedIn won't actually serve a campaign to an audience under 300 matched members (`bdzCountAudience` returns `total=0` below that floor — read as "too narrow to serve," not "empty"). A deal created today may not have a servable LinkedIn audience until two days later; the weekly sync in Step 7 should expect that lag rather than read a same-week absence as the gate failing to fire.

**Skip the sequence for a hot inbound signal.** The four-stage sequence above is the default path for a prospect entering cold. A prospect who books a demo, replies to a cold email asking for pricing, or requests a call directly has already given a Decision-stage signal — routing them back through Stage 1 brand exposure before Stage 4 conversion delays a buyer who is ready now. Route on signal strength, not on how long the prospect has been in the system: a strong inbound signal goes straight to Stage 4, a weak one (a single blog visit, a form fill from a content download) starts at Stage 1 like any other cold prospect.

**Never build more trigger gates than someone will actually check.** Each gate in Step 3 needs the weekly check defined in Step 7 to mean anything — an orchestration sequence with six gates and no one checking them weekly is indistinguishable from six channels running independently, except it looks designed. Two or three gates with a named owner who checks them every week beat six gates that exist only in this document. If the team doesn't have a RevOps or growth-ops role to own the weekly check, don't build past the two gates that move the most volume — add more only once the first two are reliably firing and checked.

## Step 7: Campaign Orchestration Model — roles, weekly sync, campaign brief

**Roles:**
- **Sequencing owner** (RevOps or a growth lead): owns the trigger gates, checks weekly that each gate fired for the volume of prospects that crossed its condition, and escalates when it didn't.
- **Content production owner**: ships the asset.
- **Content distribution owner**: places it across the channels defined in the content-to-channel matrix (Step 5) within the 7-day window. Production and distribution are different people — a producer optimizing for output volume and a distributor optimizing for channel fit pull in different directions when combined into one role.
- **Channel owners** (paid, SEO/content, outbound, ABM): execute inside their channel, but do not set their own funnel-stage targets — those come from Step 2.

**Weekly cross-channel sync (30 minutes, not a status meeting):**
1. Which trigger gates fired this week, and for how many prospects (Step 3) — not "how did LinkedIn do," which is a channel question, not an orchestration question.
2. Any gate that should have fired and didn't — a deal was created in the CRM but account-level ads didn't activate, for instance. This is the orchestration failure mode to watch for, and it's invisible in any single channel's own dashboard. On the LinkedIn ABM gate specifically, give it up to 48 hours (Step 3) before calling it a failure — a same-day absence is expected, not a broken gate. A gate that fired weeks ago and has gone quiet since is a different failure: the platform can purge a matched audience's members on its own (it comes back `EXPIRED`), which looks identical from outside to a gate nobody is filling anymore — check the audience state, not just whether the gate exists, before assuming it's still live.
3. One asset shipped this week and where it's been distributed so far against the 7-day window (Step 5).

**Campaign brief (one per orchestrated campaign, shared across every channel team involved):**
```
Campaign: [name]
Funnel stage(s) targeted: [from Step 2]
Motion(s) funded: [from Step 4]
Trigger gates in play: [which ones from Step 3 this campaign depends on]
Primary asset(s): [from Step 5]
Channels executing: [list, with the owner for each]
Success metric: [the one unified metric from Step 6 this campaign is meant to move]
```

A campaign that can't fill in every line of this brief is not ready to launch across channels — it's a single-channel tactic wearing a cross-channel label.
