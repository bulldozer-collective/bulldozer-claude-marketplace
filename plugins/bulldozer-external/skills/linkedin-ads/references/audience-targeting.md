# Audience Targeting

## Primary Targeting Dimensions (Use These First)

| Dimension | Recommended use |
|-----------|----------------|
| **Job title** | Most precise. Target exact titles: "Director of Operations," not just "Operations" |
| **Job function** | Broader — use when multiple titles hold the same role |
| **Seniority** | Combine with function: "VP+ in Finance" |
| **Company size** | Critical for B2B — 51–200, 201–500, 501–1000 etc. |
| **Industry** | Combine with seniority to filter out small companies in the industry |

**Audience size target**: 50,000–300,000 for most campaigns. Below 50k = too narrow to learn. Above 500k = too broad for B2B precision.

**Warning**: LinkedIn's "Skills" targeting is still available in 2026 but stays notoriously inaccurate — users self-report skills they don't have, or LinkedIn infers them from job title/employer/education rather than the member confirming them. Stick to job title, function, seniority, and company attributes.

**Note**: LinkedIn deprecated several *inferred sensitive-attribute* targeting options in 2026 (e.g. inferred political affiliation or policy interests) — worth knowing if you inherit an older campaign that used them, but it doesn't affect the firmographic dimensions above.

## Matched Audiences (Retargeting + ABM)

| Audience type | How to build | Use for |
|--------------|-------------|---------|
| **Website visitors** | LinkedIn Insight Tag | Retarget all visitors with case studies |
| **Account list** | Upload CSV of target companies | ABM — show ads only to your named accounts |
| **Contact list** | Upload email list | Retarget known contacts, suppress converted customers |
| **Lead Gen Form openers** | Auto-created | Retarget engaged prospects |
| **Video viewers** | Auto-created | Move video viewers to conversion offer |

**ABM approach**: Upload your top 50–200 target account list as a Matched Audience. Layer job title/seniority targeting on top. This creates a laser-focused ABM campaign that only shows to decision-makers at your target accounts.

**Check the list math before committing budget.** LinkedIn only activates a Matched Audience once it resolves to at least 300 matched *members* — a floor on people, not on the company rows you uploaded. A 50-account list in a niche vertical, or one where few employees per company are active on LinkedIn, can land under that floor and simply never deliver, with nothing in the UI that clearly says why. LinkedIn's own guidance points toward 1,000+ accounts for comfortable delivery, not 50–200 — treat 50–200 as the floor to test at, and widen the account count or the seniority range up front if the vertical is thin, rather than discovering a silent non-delivery after launch.

## Predictive Audiences and Audience Expansion — Two Different Levers

LinkedIn retired classic Lookalike Audiences in 2024. What replaced them is **not one feature but two**, and they're mutually exclusive on the same campaign:

| Feature | Built from | Behavior |
|---|---|---|
| **Predictive Audiences** | Your first-party data (contact list, Lead Gen Form audience, or Online Conversions) + LinkedIn's AI | Builds a new audience of people who look like your *converters*. Needs a real first-party data source — no data, no predictive audience. |
| **Audience Expansion** | The professional-demographic attributes of the audience you already targeted | Broadens delivery to people who resemble your *targeting*, not your converters. **On by default** on every new campaign. |

Enabling Predictive Audiences automatically disables Audience Expansion on that campaign — you get one or the other, not both.

**Practical rule**: once you have enough converters (Matched Audience of website conversions, Lead Gen Form submissions, or CRM-uploaded closed-won contacts), a Predictive Audience is the sharper tool for scaling a working campaign. Until then, leave Audience Expansion **off** during initial ICP testing — since it's on by default, you have to switch it off explicitly if you want to know exactly who saw your ads.
