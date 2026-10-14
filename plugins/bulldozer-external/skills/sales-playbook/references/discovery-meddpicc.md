# Discovery Framework (MEDDPICC)

## Step 3: Discovery Framework (MEDDPICC)

MEDDPICC is a qualification and deal-mapping framework, not a checklist. The goal is not to fill in every field — it's to know which fields are blank and why.

| Element | Questions | What you're mapping |
|---------|-----------|---------------------|
| **Metrics** | "What does success look like in numbers? What KPIs are you measured on?" | The quantified business outcome — this becomes the ROI story |
| **Economic Buyer** | "Who ultimately signs off on this? Who else needs to approve?" | Budget authority — not your champion |
| **Decision Criteria** | "What's most important in your evaluation? What would make you say no?" | Must-haves, nice-to-haves, deal-breakers |
| **Decision Process** | "Walk me through how you've made similar purchases. What's your timeline?" | Steps, stakeholders, legal/procurement involvement, timeline — *who* needs to say yes |
| **Paper Process** | "Once there's a verbal yes, what happens next — security review, legal redlines, procurement portal, who actually signs?" | What happens *after* the yes: the logistics between a verbal commitment and a signed contract. Distinct from Decision Process above it, which maps how the decision gets made, not what it takes to paper it — on an enterprise deal this can run weeks on its own (see Step 6 for routing to legal/procurement and tracking e-signature once this is mapped) |
| **Identify Pain** | "What happens if you don't solve this? How much is this costing you?" | Urgency and cost of inaction |
| **Champion** | "Who internally is most invested in solving this?" | The person driving the deal from inside the account |
| **Competition** | "What else are you evaluating? What do you like about those options?" | Who you're competing against and on what criteria |

**Discovery call structure (45 minutes):**

| Time | Section | Goal |
|------|---------|------|
| 0–5 min | Rapport + agenda setting | Confirm why they agreed to meet, set expectations |
| 5–15 min | Current state + pain | Understand their world before your solution existed |
| 15–25 min | Impact + metrics | Quantify the cost of the problem |
| 25–35 min | Decision process + competition | Map the buying process and competitive landscape |
| 35–40 min | Solution bridge | Connect their specific pain to your capabilities (briefly — don't demo here) |
| 40–45 min | Next steps | Secure a specific next action with a date before leaving the call |

**The rule:** Never leave a discovery call without confirming the next step verbally and logging it in CRM within one hour.

**A cheap proxy before you even open the call notes:** HubSpot's `num_associated_contacts` on the deal (auto-populated, not a field a rep fills in) is a quick single-threading check — a low count on a deal that's been open for a while means the Champion/Economic Buyer split in the table above hasn't actually been tested. It's a first filter, not proof either way: check `hs_buying_role` next, HubSpot's native buying-role field on the Contact (a 9-value enum — Blocker, Budget Holder, Champion, Decision Maker, End User, Executive Sponsor, Influencer, Legal & Compliance, Other; a contact can carry more than one). It's finer than a headcount, but it lives on the Contact, not the deal — the same person active on two deals can't hold a different role on each — so for a read that's genuinely scoped to this deal, use the Contact:Deal association label (e.g. tag this specific pairing "Champion") or the Buying Groups tool (Sales Hub), not the raw contact-level value. Escalate a deal as single-threaded — a risk to name out loud, not a private worry — the moment two consecutive calls have passed without a verified contact with the economic buyer, not only once the deal has already stalled.
