# Build Phases and Common Mistakes

## Build Phases

**Phase 1 (Week 1–2): Foundation**
- Configure Clay with HubSpot integration
- Set up email verification (NeverBounce/ZeroBounce) in waterfall
- Build qualification gate formula (ICP boolean)
- Define and document signal types + routing rules before building any workflow
- If a native Bulldozer OS signal covers the highest-volume signal (Funding round or Job posting match), create its lead list first (`bdzCreateLeadList`) — `leadListId` is required by `bdzCreateSignal` and cannot be changed once the signal exists

**Phase 2 (Week 3–4): First automation**
- Build one end-to-end workflow for the highest-volume signal (usually job posting or exec hire)
- Test on 50 contacts before enabling auto-enrollment
- Validate: did qualified contacts reach the right sequence? Did the CRM records populate correctly?
- Set up Slack notification for the owner rep whenever a Tier 1 signal creates a contact pending review

**Phase 3 (Week 5–8): Expand and harden**
- Add the remaining signal types from Step 1 one at a time — each new signal repeats the Phase 2 pattern: build, test on a small batch, validate, then enable
- Build the CRM hygiene loops from Step 5, starting with the stale contact loop — it catches the most volume for the least setup
- Turn on inbound lead automation from Step 6 if inbound volume justifies a dedicated workflow
- Wire up the monitoring layer: signal-to-meeting conversion by signal type, sequence reply and bounce rates by tier
- Revisit the qualification gate criteria before adding volume — a gate calibrated on 50 test contacts in Phase 2 usually needs tightening or loosening once real volume passes through it

**Do not start Phase 2 before Phase 1 is fully configured, and do not start Phase 3 before Phase 2 has run clean for at least one full cycle.** Each phase produces the evidence the next phase needs — skipping ahead means building on an unqualified gate or an unverified sync.

## Common Mistakes

- **Automating a broken manual process.** If the qualification gate criteria are fuzzy on a spreadsheet, they stay fuzzy in Clay — automation makes a bad filter run faster, not better. Fix the criteria before building the workflow.
- **Skipping the human checkpoint on Tier 1 signals.** The fastest-decaying, highest-precision signals are exactly the ones where a bad automated message does the most damage to a real opportunity. Keep the review step even when it's tempting to remove it for speed.
- **One sequence for every signal type.** Routing every signal into the same messaging treats a funding announcement the same as a job posting. The signal is the personalization — collapsing them back into one sequence defeats the point of automating signal detection in the first place.
- **Scaling before the gate is proven.** Turning on auto-enrollment for a workflow that hasn't been validated on a test batch pushes bad data into the CRM at volume, which is harder to clean up after the fact than before.
- **Treating CRM hygiene as a one-time project.** Contact and company data decays continuously. A hygiene loop that runs once during setup and is never scheduled again is back to manual cleanup within a quarter.
- **Building an external integration for a signal Bulldozer OS already detects natively.** Funding round and job posting signals have a native `bdzCreateSignal` type — wiring up Crunchbase or a LinkedIn Jobs alert for these duplicates a credit-metered capability that's already there and adds a webhook to maintain for no benefit.
- **Wiring the stale-contact hygiene loop straight to Clay without checking `bdzEnrichLeadList` first.** For contacts already sitting in a Bulldozer OS lead list, the native bulk re-enrichment call skips (free) anything refreshed in the last 7 days — a Clay webhook re-pays for that same refresh every quarter with no native cost guardrail.
- **Deleting a native signal to change one field.** Pausing (`status: SIGNAL_STATUS_INACTIVE`) or adjusting `dailyLeadLimit`/`name` through `bdzUpdateSignal` is free and keeps the signal's history and lead-list linkage intact; `bdzDeleteSignal` destroys the remote provider signal and forces a full rebuild for what should have been a one-field change.
- **Trusting the deactivation email as the only monitoring.** A native signal that runs out of jetons or hits a lead-list failure deactivates itself and emails its creator — if that person has moved on or the mailbox isn't watched, the pipeline goes quiet with nothing else to flag it. Check the signal's status on the same cadence as the CRM hygiene loop, not only when someone notices volume dropped.
- **Picking an inbound ICP-score routing threshold (Step 6) without calibrating it against closed-won accounts.** An uncalibrated cutoff routes leads on a guess dressed up as a formula — the same discipline the qualification gate already requires applies one step further downstream.
- **Scoping a website-visitor identification workflow on a vendor's remembered free-tier capability.** RB2B's free plan stopped including person-level data (name, email, LinkedIn URL) after a January 2026 repricing, and its person-level resolution has only ever covered US traffic — check the current plan and geography coverage with the client before promising the contact-level alert this skill's Step 3 describes.
- **Proposing `bdzEnrichContact`/`bdzEnrichLeadList` without checking the client's subscription first.** `bdzEnrichContact` requires the `SUBSCRIPTION_CAPABILITY_BASICS` capability — a client below that tier gets a failed call mid-build, not a graceful fallback. Confirm the plan before the native path is written into the architecture.
- **Passing a persona's `label` instead of its `value`.** `bdzListSignalPersonas` returns both (e.g. `label: "HR Director"`, `value: "SIGNAL_PERSONA_HR_DIRECTOR"`) — `targetPersonas`/`deliverPersonas` only accept the `value`; the readable label returns 400 as an unrecognized persona.
- **Re-running a failed signal build under the same name.** `bdzCreateSignal` returns 409 when a signal with that `name` already exists in the project — check `bdzListSignals` first instead of assuming the conflict signals a broken platform.
