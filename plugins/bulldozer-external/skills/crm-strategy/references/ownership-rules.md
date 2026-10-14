# Team Ownership Rules

| Object | Default owner | Assigned by | Reassignment trigger |
|--------|---------------|-------------|----------------------|
| Contact (pre-MQL) | Unassigned — marketing-owned pool | No individual owner until the lifecycle stage requires one | Lifecycle stage reaches MQL |
| Contact (MQL → SAL) | SDR | Round-robin rotation across the active SDR pool | SDR marks Accepted (SAL) or Disqualified |
| Contact / Deal (SQL onward) | AE | Set at Opportunity creation; contact owner synced to the deal owner | Deal reassignment (territory change, rep departure) |
| Company | Account owner | Territory / ICP tier assignment rule, never a manual claim | Territory realignment or ICP Tier change |
| Deal (post Closed-Won) | CS / Account Manager | CS handoff workflow fires on Closed-Won + Handoff Completed | Renewal cycle change or churn-risk escalation |
| Ticket (if Service Hub in use) | Support queue, then individual rep | Queue-based routing | Escalation or manager reassignment |

**Assignment discipline rules:**
- Ownership is assigned by a rule — a rotation, a territory match, a tier — never by whichever rep claims the record first. In HubSpot this is built as a workflow (an enrollment trigger such as "Contact owner is unknown" feeding a "Rotate record to owner" action), which requires Sales Hub or Service Hub Professional or above and an activated paid seat for every rep in the pool. The action offers three built-in distribution modes — Round Robin (strict sequential order), Load Balanced (assigns to whoever in the pool currently holds the fewest open records), and Random — none of them a configurable weighted split; splitting the rotation unevenly between reps (e.g. 70/30) is still not natively supported and needs a workaround. Load Balanced is the closer native fit than Round Robin when reps already carry uneven books — including the ramp case below, since a rep new to the pool naturally holds fewer open records and Load Balanced routes fewer leads to them without any manual weighting.
- Every reassignment is logged — a "Previous Owner" field or a timeline note — so a manager can see who held a record and when it moved, not just who holds it now.
- A record with no owner beyond its stage-appropriate grace window (e.g. a Lead sitting unassigned for more than 24h) is an orphan. Run a weekly orphan report; it is the single fastest way to catch a broken assignment rule before it costs a quarter of pipeline.
- A rep leaving or changing territory triggers a bulk reassignment workflow, not a manual re-tagging of their book one record at a time.
- A rep new to the rotation — onboarding, or back from leave — doesn't take a full share from day one. Reduce their rotation weight during ramp, or they'll tank a run of leads they weren't ready to work and the whole team's per-rep conversion numbers get noisy for a quarter. Restore the full share on a fixed date, not "whenever they seem ready" — that always slips.
- A territory realignment doesn't yank ownership out of an active negotiation. Let the current owner close (or lose) any deal already past Proposal before reassigning it, even once the account officially belongs to someone else's patch — a deal that changes owner mid-close is a deal that usually goes quiet.
