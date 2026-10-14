# Quality Checklist

Before sending the brief, confirm:

- [ ] Every signal in the Executive Summary clears the 3-role threshold, or is explicitly framed as a single-hire "watch signal" — none are promoted on one posting alone.
- [ ] Every threshold-based interpretation states the competitor's headcount, so a small company's 3 hires isn't read the same as a large one's.
- [ ] Every GTM or product interpretation has been cross-referenced against at least one of: funding news, product changelog, conference presence (Step 4) — and the brief says which.
- [ ] Reposted listings are counted separately from fresh postings, not folded into the same signal.
- [ ] Every tracked competitor has an active `COMPANY`/`MONTHLY` LinkedIn refresh config (`bdzListLinkedInRefreshConfigs`) — without one, `employeeCount` never updates and the velocity read is meaningless, not just stale.
- [ ] Last month's `employeeCount` values are logged in the workspace file's `note` field, not its content — a value written only to the file's body cannot be read back by a tool call next month.
- [ ] Headcount velocity for each competitor comes from this month's logged `employeeCount` (`bdzListLinkedInCompanies`, the same field every month) against last month's logged value — never from a Company/Department Growth signal, which can't be scoped to a named competitor at all (see Step 1), and never swapped mid-series for `bdzListLinkedInEmployees`'s `totalElement`, which reads differently (see Step 3).
- [ ] Each "Strategic Response Recommendation" tells a named function (Sales, Product, Marketing) what to do differently this week — not just what happened.
- [ ] Every tracked competitor this month is one that actually shows up in closed-lost reasons or live pipeline — not carried forward by default from a market map (see "Before You Add a Competitor to This Brief").
- [ ] The "For Sales" recommendation states its confidence level (confirmed pattern vs. watch signal) and doesn't hand a rep language that reveals the hiring intelligence was monitored, not just known.
- [ ] The brief is saved as `hiring-signals-{month}-{year}.md`, and the next brief date is set before this one ships.
