# Org Charts, Span of Control and Override Conditions

## Step 4: Org Chart Design

**Org chart at each stage should reflect the GTM motion, not a conventional org chart template.**

**Series A org (€1–3M ARR, 5–8 GTM headcount):**
```
CEO / Founder
├── Head of Sales (player-coach, also carries quota)
│   ├── AE #1
│   ├── AE #2
│   └── SDR #1 (optional)
├── Marketing Generalist
└── RevOps (part-time or fractional)
```

**Series B org (€3–10M ARR, 15–40 GTM headcount):**
```
CEO
├── VP Sales
│   ├── SDR Manager
│   │   ├── SDR #1–4
│   ├── AE #1–3 (Mid-Market)
│   ├── AE #4–6 (Enterprise, if segment exists)
│   └── Sales Enablement (at 8+ reps)
├── VP Marketing
│   ├── Demand Gen
│   └── Product Marketing
├── VP CS
│   ├── CSM #1–4
│   └── CS Ops (at 4+ CSMs)
└── RevOps (reports to CEO or CRO)
```

**Span of control standards:**
- 1 manager : 5–8 individual contributors (max 10 for high-velocity teams)
- SDR Managers: 6–8 SDRs before needing a second manager
- AE Managers: 5–7 AEs (enterprise), 7–10 AEs (SMB/high velocity)
- CSM Managers: 4–8 CSMs, tighter (closer to 2–3) below roughly €5M in managed ARR when the motion is still high-touch, loosening toward 8 as accounts standardize with scale — treat 6–8 as the mid-scale midpoint, not the floor for an early CS team

**Bulldozer OS has no field for any of this.** `bdzListProjectTeamMembers` returns job title, experience level, time allocation, and LinkedIn profile URL per person — never who they report to or how many people a manager already carries, and no parent-team field either. A span-of-control check or an onboarding-capacity read ("how many new reps can this manager ramp at once") has to be asked of the client directly; it cannot be pulled from the roster.

## Step 5: Override Conditions

**When the default sequence doesn't apply:**

| Condition | Override |
|-----------|---------|
| Enterprise ACV >€100K | AE first always — enterprise deals require a dedicated senior AE, SDRs can't carry this motion alone |
| AI SDR / prospecting agents in active use (e.g. Artisan, AiSDR, Amplemarket, Clay-based enrichment workflows) | Cut planned SDR headcount, invest in 1 GTM engineer to run the tooling instead of 2–3 SDRs — but size the cut against what the tooling is actually replacing this quarter, not a fixed ratio: a 2025 survey of 560+ B2B SaaS companies (Emergence Capital, "Beyond Benchmarks") found 36% had cut SDR/BDR headcount that year, 44% held steady, 19% were still growing it — a split market, not a rule. The 2026 edition of the same survey moved from self-reported answers to actual cap-table and payroll data (partnering with Carta, Ashby, and Pave) and its headline finding cuts the other way: non-AI companies still out-produce AI-adopting ones on revenue-per-employee across every segment measured — the efficiency case for the cut is not yet proven at the portfolio level. Demand the client's own before/after number (meetings booked, reply rate, cost per meeting) before sizing the cut, not the vendor's promised output. Vet the vendor too: this category has already produced one high-profile blowup (fabricated logos, inflated churn — new CEO installed since, trust still rebuilding as of 2026) — check references before staffing a plan around a specific tool's claims. |
| Product-led growth (PLG) motion | Hire growth engineer / PLG ops before sales AE; users self-serve until a commercial motion is proven |
| Bootstrapped / burn-constrained | Fractional or contract AE before full-time; validate motion before committing base salary |
| International expansion | Hire local AE + local SDR before VP — the local market knowledge matters more than the management layer |
