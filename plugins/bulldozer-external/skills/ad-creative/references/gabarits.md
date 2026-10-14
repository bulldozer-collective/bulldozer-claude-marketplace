# Gabarits — ad-creative

Les formats de sortie et les checklists de ce skill, à reprendre tels quels. Le texte
principal dit quand chacun s'applique ; ici, la forme et le détail complet.

## Table des matières

- Sortie RSA (Google Ads)
- Structure et exemple Meta (primary text)
- Journal d'itération
- Méthode d'itération en trois étapes
- Quality Standards — liste complète
- Common Mistakes — recap complet

## Sortie RSA (Google Ads)

```
## RSA — [Product Name]

### Headlines (30 char max)
1. "Cut Reporting Time by 75%" (25) ✓
2. "Automate Weekly Reports" (23) ✓
3. "[Product]: Built for Ops Teams" (30) ✓
4. "No More Manual Report Building" (30) ✓
5. "Start Free Trial Today" (22) ✓
[...10 more]

### Descriptions (90 char max)
1. "Join 12,000+ teams who automated their ops. No credit card required. Get started free." (87) ✓
2. "Connect your data once. Automated reports every week. Setup in under 10 minutes." (80) ✓
3. "Stop spending 5 hours/week on reports. [Product] saves ops teams 10+ hours weekly." (82) ✓
4. "Trusted by [Company], [Company], and 12,000+ ops teams. Start your free trial today." (85) ✓
```

## Structure et exemple Meta (primary text)

**Structure** :
```
[Hook line — stop the scroll]
[1–2 sentences bridge to product]
[Social proof or specific stat]
[CTA]
```

**Exemple** :
```
Your ops team is spending 40% of their week on manual reporting.

[Product] automates weekly reports across your tools — Notion, HubSpot, 
Salesforce, Sheets — and delivers them to your inbox every Monday.

Used by ops teams at [Company], [Company], and 12,000+ fast-growing teams.

Try it free → [URL]
```

## Journal d'itération

```
## Iteration Log
- Round: [number]
- Date: [date]
- Top performer: "[headline]" — CTR: [%], CVR: [%]
- Winning patterns: [summary]
- Retiring: [what's being paused and why]
- New angles being tested: [list]
```

## Méthode d'itération en trois étapes

### Step 1: Identify Winning Patterns

From top performers (by CTR, conversion rate, or ROAS):
- Winning themes (what topics/pain points appear?)
- Winning structures (questions? commands? numbers?)
- Winning word patterns (specific words recurring in top ads?)

### Step 2: Identify Losing Patterns

From worst performers:
- Angles that fell flat
- Structures that didn't work
- Words or phrases to avoid

### Step 3: Generate New Variations

- Double down on winning themes with fresh phrasing
- Extend winning angles into new variations
- Test 1–2 new angles not yet explored
- Avoid patterns from underperformers

## Quality Standards — liste complète

**Strong headlines**:
- Specific ("Cut reporting time 75%") over vague ("Save time")
- Benefits ("Ship code faster") over features ("CI/CD pipeline")
- Active voice over passive
- Numbers when possible ("3x faster," "in 5 minutes," "10,000+ teams")

**Avoid**:
- Claims without specificity ("Best," "Leading," "Top")
- All caps or excessive punctuation
- Headlines that only make sense together (RSAs mix them randomly)
- Clickbait the landing page can't deliver on

## Common Mistakes — recap complet

- **Judging on impressions instead of outcomes** — gut feelings lose to metrics, but so does a
  raw impression count. Judge on conversions (or, absent enough of those, CTR against an account
  baseline), and don't call a winner under a few dozen conversions per variant — below that,
  what looks like a pattern is noise. When the data comes from `bdzGetAdAnalytics`, that
  conversion count is right there in the response; use it as the gate before reading CTR or CPC.
- **All variations sound the same** — vary angles, not just word choice.
- **No CTA headlines in RSA** — include at least 2–3 action-oriented headlines.
- **Over-pinning in RSA** — limits Google's ability to optimize; 2–3 pinned headlines maximum, never one pinned everywhere.
- **Retiring creative too early** — allow meaningful volume before calling a winner or loser, and on a B2B account, enough elapsed time for the sales cycle to actually close (see *Iterating from Performance Data* in the main file).
- **Reading a 6-month average as this week's performance** — `bdzGetAdAnalytics` defaults to a 180-day lookback; pass `from` explicitly or the "current" cost-per-conversion is really a 6-month blend that can hide a recent spike.
- **Shipping a new round of variants into an ad set that hasn't cleared its learning phase** — a fixed iteration cadence ("new batch every Monday") is a scheduling convenience, not a reason to reset delivery that's still stabilizing.
