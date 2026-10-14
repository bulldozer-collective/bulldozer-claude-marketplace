# FLUX.2 Variants

"Flux" is a family, not one model — five named variants split by how you reach them and what
each is tuned for, not by a single quality axis.

| Variant | Access | Best for |
|---|---|---|
| **klein** | Self-hosted, open weights | Fast iteration or a large batch on your own infrastructure — tuned for speed and batch/edge use |
| **dev** | Self-hosted, open weights | Full quality on your own infrastructure, no latency budget — non-commercial by default |
| **pro** | API-only (BFL's own API, Replicate, fal.ai) | Best hosted photorealism for most briefs — closed-weight, the previous top tier BFL offered hosted |
| **flex** | API-only | Fine control on a single hosted generation — exposes step/guidance controls |
| **max** | API-only | The brief specifically needs the best BFL can produce hosted — the newest top tier, pushes quality, prompt fidelity and multi-turn edit consistency past `pro`, up to 10 reference images per call, with a "grounded generation" mode that pulls real-time web context into the prompt |

Self-hosting open weights means `klein` or `dev`. Going through a hosted account instead —
BFL's own API, Replicate, fal.ai, the far more common path for a marketing team — means
choosing among `pro`, `flex` and `max`. Name the variant, not "Flux" generically or whichever
the account happens to run.
