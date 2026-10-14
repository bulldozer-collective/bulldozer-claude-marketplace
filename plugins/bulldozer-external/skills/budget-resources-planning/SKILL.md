---
name: |-
  budget-resources-planning
description: |-
  Build the annual operating budget and resource allocation plan for a B2B SaaS company — revenue model, headcount plan by quarter, department allocation benchmarks, 3-scenario planning, runway calculation, and signal-based unlock triggers. Triggers on 'budget planning,' 'annual operating plan,' 'AOP,' 'headcount plan,' 'budget allocation,' 'how much to spend on GTM,' 'how many people can I hire,' or 'runway calculation.' For org design, see org-design-hiring-roadmap. For team assessment, see team-assessment.
when-to-use: |-
  Build the annual operating budget and resource allocation plan for a B2B SaaS company — revenue model, headcount plan by quarter, department allocation benchmarks, 3-scenario planning, runway calculation, and signal-based unlock triggers. Triggers on 'budget planning,' 'annual operating plan,' 'AOP,' 'headcount plan,' 'budget allocation,' 'how much to spend on GTM,' 'how many people can I hire,' or 'runway calculation.' For org design, see org-design-hiring-roadmap. For team assessment, see team-assessment.
argument-hint: |-
  Series A, €2.8M ARR. Raised €4M. Need to build a 12-month operating plan — how to allocate the €4M across hiring, marketing, and infrastructure. Board wants to see a hiring plan with runway to 18 months.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
effort: |-
  high
---

# Budget & Resources Planning

> This is a Bulldozer skill. A budget is fundamentally a hiring plan. Headcount is 60–70% of total burn at every stage. The question "how should we allocate the budget?" is really "how should we sequence the hiring?" Get the sequence wrong and you hire people who can't produce results because the foundation they need doesn't exist yet. Get it right and each hire multiplies the output of the people already on the team.

You are a Bulldozer operator building an annual operating budget and resource plan. Your job is to model revenue, calculate headcount capacity, allocate budget by department, build 3-scenario plans with signal-based unlock triggers, and produce a quarterly runway tracker.

## Input

`$ARGUMENTS` — current ARR, capital raised (or current cash), 12-month revenue target, current headcount and burn rate, primary GTM motion. If not provided, read available context files. Ask once if ARR and capital are completely absent.

## Output

A `budget-plan-{company}-{year}.md` file with: revenue model by quarter, department budget allocation (% of total with benchmarks), headcount plan by role and month, 3 scenarios (base / upside / downside) with trigger logic, monthly burn and runway table, and signal-based spending unlocks.

**Produce on first invocation. Build the revenue model before the headcount plan — revenue capacity determines what headcount is justified.**

**When this artifact is the wrong move.** A full annual operating plan — stage benchmarks, 3 scenarios, signal-based unlocks — assumes there is a revenue motion worth modeling. Two cases where building it anyway just hides the real decision inside a spreadsheet:

- **No repeatable New ARR motion yet.** Pre-seed or pre-PMF, where each new logo is still won by a different combination of channel and pitch, doesn't have a rate to extrapolate. What's needed there is a cash runway table (Step 5 alone) and a hiring freeze on anything but the roles proving the motion — not a department-benchmark budget that pretends the motion is already found.
- **The strategic objective isn't decided yet.** A budget allocates money against a bet (which segment, which motion, land-and-expand vs. net-new). If the board or founders haven't made that call, running this skill produces a plan that looks rigorous and answers the wrong question — the objective decision belongs in strategy work first, not inside a budget template.

---

## Step 1: Revenue Model

The revenue model structure for B2B SaaS (new ARR, expansion ARR and the related formulas, with the worked detail) is in `references/revenue-model.md`. Read it before building the revenue model.

---

## Step 2: Department Budget Allocation

The budget allocation benchmarks by stage (Series A and later, by department, with notes) are in `references/department-budget-benchmarks.md`. Read it before allocating budget across departments.

---

## Step 3: Headcount Plan

**Build the headcount plan month by month, by role.** A headcount plan that shows "Q3: +4 people" is not a plan. A headcount plan that shows "July: RevOps hire, August: AE #3, September: SDR #2" is executable.

**Check the existing roster before asking.** If working inside a Bulldozer project, `bdzListProjectTeams` then `bdzGetProjectTeam` / `bdzListProjectTeamMembers` show who's already on the teams this budget covers — current headcount, job titles, internal vs. external — instead of asking the user to redescribe a structure that may already be on record. Build the plan on top of what's there, not from a blank sheet.

**All four team tools in this step take a `targetProjectId`, not just the usual project context.** `bdzListProjectTeams`, `bdzGetProjectTeam`, `bdzListProjectTeamMembers` and `bdzCreateProjectTeamMember` (below) each require a `targetProjectId` — the project's UUID — as a mandatory parameter alongside the standard `customerId`/`projectId` pair. It's easy to assume the usual two-ID pair is enough because most other project-scoped tools only need those; omitting the third one here fails the call.

**Headcount plan format:**

| Month | Role | Function | Start date | Fully-loaded cost/month | Cumulative monthly burn | Runway impact |
|-------|------|----------|-----------|------------------------|------------------------|--------------|
| Jan | AE #2 | Sales | Jan 15 | €7,200 | €42,000 | +0.2 months to payback |
| Feb | SDR #1 | Sales | Feb 1 | €4,500 | €46,500 | — |
| Mar | RevOps | Operations | Mar 1 | €6,800 | €53,300 | — |

**Hiring cost add-on:** Add 15–20% of annual salary to the first-year cost of each hire (recruiting fees if using agency, or internal recruiter time cost). A VP Sales hired at €120K base adds €18–24K in recruiting cost.

**Ramp cost:** New hires are not productive on day 1. Factor 50% productivity for the first 3 months, 75% for months 4–6, 100% thereafter. This applies to revenue-generating roles; support roles reach full productivity faster.

**Stagger hiring:** Don't hire everyone in months 1–3. Stagger 1–2 hires per month at seed/Series A. This preserves cash optionality and gives new hires adequate onboarding attention.

**The real ceiling is often onboarding capacity, not budget.** A plan that puts three new quota-carrying reps under one manager in the same quarter isn't executable regardless of what the runway table says — the existing team's ramp degrades along with the new hires' because the manager can't run three onboarding tracks at once. Ask who is doing the ramping before approving the stagger, not just how much cash it costs. Bulldozer OS doesn't help here: the team roster (`bdzGetProjectTeam` / `bdzListProjectTeamMembers`) records job title, seniority and time allocation per member, but carries no reporting line or manager field — span of control isn't something the OS can check, it has to be asked of the client directly.

**Tag every line as growth or backfill.** A plan that shows "+4 headcount" without saying how many of those four are replacing someone who left overstates the capacity actually being added and hides the real cost of attrition from the board. Two hires funding growth and two backing out of open roles is a different plan than four incremental heads — write down which is which.

**Log approved hires as they're made.** Once a hire from this plan is signed, register them with `bdzCreateProjectTeamMember` (job title, experience level, time allocation) against the team from the roster check above. That's the same record `team-assessment` and `org-design-hiring-roadmap` read from — logging it here keeps the org picture current instead of drifting from what the budget actually paid for.

---

## Step 4: Scenario Planning

The three executable scenarios (base case and the two others, with their switching triggers) are in `references/scenarios-and-signal-unlocks.md` (section "Step 4: Scenario Planning"). Read it before writing the scenario plan.

---

## Step 5: Runway Calculation

**Runway = Cash / Monthly Burn Rate.** Target: 18 months minimum. 24 months preferred.

**Monthly burn = Total cash out − Cash in (revenue received, not booked)**

Note: For B2B SaaS with annual contracts, you receive cash at signing — model cash flow, not ARR. A €12K ACV deal signed in January produces €12K in January (if paid annually), not €1K/month.

**Monthly burn table format:**

| Month | Cash in | Cash out (payroll) | Cash out (other) | Net burn | Cumulative cash | Runway (months) |
|-------|---------|--------------------|-----------------|---------|-----------------|----------------|
| Jan | €85K | €42K | €18K | -€60K | €3,940K | 65.7 |
| Feb | €92K | €46K | €19K | -€65K | €3,875K | 59.6 |

**Runway warning thresholds:**
- 18+ months: Safe to execute base plan
- 12–18 months: Review hiring sequence; defer non-critical hires
- 9–12 months: Begin fundraising process immediately (Series A or B takes 4–6 months)
- <9 months: Implement downside scenario now; fundraising becomes urgent
- <6 months: Existential — board escalation required

**The 12-month trigger is a floor, not the only reason to start early.** These thresholds are burn-driven — they tell you when running out of cash forces the timeline. A second, independent trigger is market-driven: strong metrics, a hot narrative, or a signal that the funding window is closing (a downturn in the category, a comparable's down-round) are reasons to start a raise well above 12 months of runway to capture better terms while they're available, not reasons to wait until the burn clock says so. Don't let a healthy runway number be read as "no urgency" when the market signal says otherwise.

---

## Step 6: Signal-Based Spending Unlocks

The unlock gate format and the rules for releasing budget on performance signals are in `references/scenarios-and-signal-unlocks.md` (section "Step 6: Signal-Based Spending Unlocks"). Read it before writing the spending unlock gates.

---

## Budget Planning Calendar

| Month | Activity | Owner |
|-------|----------|-------|
| Sep–Oct | Build next-year revenue model; set ARR targets | CEO + CFO |
| Oct | Headcount planning by department — department heads submit requests | All VPs |
| Nov | Consolidate department requests; build 3 scenarios | CFO |
| Nov | Board presentation: scenarios + unlock triggers | CEO |
| Dec | Final budget approved; headcount plan frozen | Board |
| Jan | Q1 actuals start; monthly variance review begins | CFO |
| Apr | Q1 review: are we in base / upside / downside? | CEO + CFO |
| Jul | Mid-year re-forecast: adjust H2 plan based on H1 actuals | CEO + CFO |
| Oct | Start next year's cycle | CEO + CFO |

---

## Rules

- **Headcount is the budget.** If you can't name the specific roles you're planning to hire and when, you don't have a headcount plan — you have a wish list. Every budget line for people should have a role title and a planned start month.
- **Model cash flow, not ARR.** Annual contracts paid upfront change the shape of your cash curve dramatically. A €500K annual deal signed in March is €500K of cash in March and nothing for the eleven months after it. Build the burn table on cash received, not on bookings.
- **Budget fully-loaded or don't budget at all.** Base salary is never the cost of a hire: apply the 1.25–1.40x multiplier, add the first-year recruiting cost, and apply the ramp curve to revenue-generating roles. A plan built on base salaries understates people cost by a quarter to a third, and the gap compounds with every hire.
- **A trigger without a metric, a threshold and a duration is a mood.** "If growth slows" is not a scenario switch; "NRR below 90% for two consecutive months" is. Write the actions next to the trigger, before it fires — pre-defining them removes the debate from the month where debating costs the most.
- **Write the downside plan while the numbers are good.** A hiring freeze designed in a bad quarter gets designed under pressure, by people who are already defending their own headcount. Decide in advance which roles are P1, which vendor lines are discretionary, and who signs the freeze.
- **Start the raise at twelve months of runway, not at six.** A round takes 4–6 months to close. Beginning at nine months means signing with three months of cash left, which is negotiating from a position everyone in the room can see. Treat 12 months as the trigger to start the process, not the moment to start worrying.
- **Re-forecast on actuals, don't defend the plan.** The revenue model was a set of assumptions, and by mid-year several of them are measurable. Rebuild H2 on what H1 actually produced — a budget that survives twelve months untouched was never being read.
- **Budget is a constraint; onboarding capacity is often the real one.** A hire the runway table can afford is still unexecutable if there's no manager with room to ramp them. Check who does the ramping before staggering hires into the same quarter, not just what they cost.
- **A missed unlock gate is a fork, not a single door.** "Hold" and "cut" are different decisions — hold when a metric is flat or newly missed, cut when the data shows a channel or bet has been getting worse for more than one period. Defaulting every miss to "hold" lets a genuinely failing line keep its budget by default.