# Capacity Model — Formula, Ramp Time and Attrition

## Step 4 — Revenue capacity formula, ramp time impact, attrition modeling

**Revenue capacity formula:**

```
Effective capacity = Number of reps × Attainment-adjusted productivity
Attainment-adjusted productivity = Quota per rep × Historical attainment %

Example:
3 AEs × €600K quota × 75% attainment = €1.35M effective capacity per quarter
If quarterly revenue target is €1.2M → capacity is sufficient (but tight)
If quarterly revenue target is €1.8M → capacity gap of €450K → need 1 additional AE
```

**Ramp time impact:**
- Ramp time to full productivity varies by segment and keeps trending longer — but SMB and mid-market don't converge as cleanly across current sources as enterprise does. Earlier aggregator benchmarks cited here put SMB at 4–6 months and mid-market at 6–9 months; a fresh 2026 pass across other aggregators (orm-tech.com, chambr.ai, thecroreport.com, salescadia.com, zyverno.app) instead clusters SMB closer to 3–4 months and mid-market at 5–7 months. Enterprise/complex-deal motions are the one figure that has held across every source checked so far: 9–12 months. Treat SMB as a 3–6 month bracket and mid-market as a 5–9 month bracket rather than a single number until the team's own ramp data settles it — none of this is an audited study, use the team's own historical ramp instead if it has one.
- Factor partial productivity during ramp: a rep hired in January at a 6-month ramp contributes near 0% in Q1, partial in Q2, and only reaches full productivity in Q3 — using a shorter ramp assumption than the team's actual segment understates the capacity gap.
- Work the hiring deadline backward from the team's own ramp length, not a generic 3–6 month assumption: if you need full productivity in Q3, a 6-month ramp means the hire has to land in Q1.

**Attrition modeling:**
- B2B sales team attrition runs role-dependent, not a single flat rate: roughly 35% annually team-wide, but SDR turnover (≈45%) runs well above AE (≈30%), sales manager (≈28%), and CSM (≈25%) — per a 2026 sales-ops benchmark (Optifai, ~939 companies surveyed); treat as directional, self-reported vendor data, not an audited study. Use the team's own historical rate by role if it has one.
- Every rep who leaves creates a productivity gap: departing rep's declining output + replacement rep's ramp time
- At a 30% AE attrition rate, roughly 1 of 3 AEs will leave this year — factor their replacement ramp into the capacity model, and weight the SDR seats in the model higher still given the steeper SDR turnover above
