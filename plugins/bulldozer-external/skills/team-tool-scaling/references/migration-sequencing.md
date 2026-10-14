# Migration Sequencing — Detail

**Before any consolidation migration:**
- Confirm the surviving tool covers the workflow the retired tool served, not just the features the heaviest users rely on — check with the team that uses an edge-case feature before cutting it out from under them.
- Run a parallel period: both tools stay live, but new activity is created in the survivor only. Historical data is exported into the survivor, never re-entered by hand.
- Lock admin access to the retired tool once the parallel period ends. From that point, logins happen only for a final data export — never for ongoing work.
- Keep read-only access to the retired tool for a defined window after cutover, for compliance and dispute resolution (a closed deal or a call recording someone needs to reference later). Cancel the license only once that window closes.

**Migration timeline template:**

| Phase | Window | What happens |
|-------|--------|--------------|
| Decision | Weeks 1–2 | Contract terms confirmed (notice period, data export rights), target tool configured, training scheduled |
| Parallel run | Weeks 3–6 | New activity created in the survivor tool only; historical data exported; adoption tracked against the Step 2 scoring |
| Cutover | Weeks 7–8 | Retired tool locked to admin-only access; final export run; integrations repointed to the survivor |
| Read-only window | Weeks 9+ | Retired tool kept read-only for lookups; license cancelled once the window closes |

**Never migrate two tools in the same workflow category at the same time.** If the sequencing tool and the CRM are both being replaced this quarter, sequence them. A rep who loses their sequencing tool and their CRM in the same sprint has no reliable workflow left, and the resulting support tickets won't tell you which change caused which problem.
