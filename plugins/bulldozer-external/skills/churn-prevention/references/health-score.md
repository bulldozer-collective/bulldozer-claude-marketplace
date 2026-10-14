# Instrumenting a churn health score

Detail for the Risk Signals section of `churn-prevention`: how to wire the signals to real
data sources, and the health-score formula with its action thresholds.

## Instrumenting the Signals

Don't build a health score on signals nobody is capturing. If the project already has GA4 wired up, the login-frequency and feature-usage rows above are GA4 conversion events (or custom events feeding into one) — pull them as a report instead of guessing at usage. If the CRM is HubSpot, writing the health score (or its inputs) back onto contact/company properties is a write, not a read, and the Bulldozer OS HubSpot connector tracks read and write access separately per object type — CONTACT and COMPANY write access commonly sits behind a reauthorization the connector doesn't have by default, even when read access is already available. Check that write access is actually granted before promising a property that routes a drop to the account owner; if it isn't, report the score instead (a scheduled export, a Slack alert) rather than describe a write the connection can't currently make. Reading the CRM to compute "top 20% by MRR" for the personal-outreach rule doesn't hit this wall — read access for CONTACT/COMPANY is commonly available even where write isn't. If neither GA4 nor the CRM is connected yet, say so before promising a live health score — a formula with no data feeding it is a spreadsheet exercise, not retention work.

## Health Score Formula

The weights below are a starting template to calibrate against the product's own churned-vs-retained cohorts, not a formula to ship as-is — a product where support tickets predict cancellation better than login frequency needs different weights, and that only shows up once enough churned accounts have gone through the formula to check which inputs actually correlated with the outcome.

```
Health Score = (
  Login frequency  × 0.30 +
  Feature usage    × 0.25 +
  Support sentiment × 0.15 +
  Billing health   × 0.15 +
  Engagement score × 0.15
)
```

| Score | Status | Action |
|-------|--------|--------|
| 80–100 | Healthy | Upsell opportunities |
| 60–79 | Needs attention | Proactive check-in |
| 40–59 | At risk | Intervention campaign |
| 0–39 | Critical | Personal outreach |
