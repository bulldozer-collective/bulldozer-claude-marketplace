# Validation Rule Specifications and Field Standardization

## Step 5 — Required validation rules and warn-to-block decision

**Required validation rules (configure in CRM settings):**

| Rule | Where it applies | What it enforces |
|------|-----------------|-----------------|
| Email format | All contact creation | Must match email format (@ symbol, domain) |
| Company name required | Contact creation | Cannot save a contact without a company name |
| Industry picklist only | Contact + company | Industry must be from approved list — no free text |
| Phone number format | Contact creation | Strip non-numeric chars, enforce country code format |
| Closed Lost Reason required | Deal stage advancement | Cannot move to Closed Lost without selecting a reason |
| ACV required at Proposal stage | Deal stage advancement | Deal cannot advance to Proposal without an ACV estimate |

**HubSpot:** Settings → CRM → Properties → field validation → enable required fields per form + deal stage validation under Pipeline settings

**Salesforce:** Validation Rules in Object Manager → define formula + error message for each rule

**The right strictness level:** Start with warn-not-block for the first 30 days. Observe what breaks and what generates support tickets. Then switch to block for the fields where incomplete data causes the most downstream damage.

**Refuse to block on a field a rep genuinely can't know yet.** "ACV required at Proposal stage" only holds if an ACV estimate is realistically knowable by that stage — force it earlier in the pipeline than the sales process actually produces the number, and reps don't fill it in more accurately, they either invent a placeholder to get past the gate or start keeping the deal in a spreadsheet until it clears that stage. A shadow system outside the CRM is a worse outcome than the missing field it was meant to fix.

**What decides the flip from warn to block, concretely:** if the volume of warn-triggered tickets and workflow flags stays flat and low through the 30 days, that's the signal it's safe to switch to block — the rule isn't catching much friction because the field was already mostly gettable at that point in the process. If it spikes instead, that's not a sign reps need more training on the rule; it's a sign the rule is asking for the field at the wrong stage, and the fix is to move the requirement later in the pipeline, not to force it through anyway.

## Step 6 — Fields most likely to have drifted, and the standardization protocol

**Fields most likely to have drifted, and why:**

| Field | Common drift | Fix |
|-------|-------------|-----|
| Industry | Free-text entry, multiple spellings for the same sector, inconsistent granularity ("Tech" vs. "SaaS" vs. "B2B Software") | Convert to a closed picklist, cap the list at roughly 10–15 values — a longer list is a sign the field is trying to do two jobs (industry + sub-vertical) and should split |
| Company size / employee count | Mix of exact numbers, ranges, and "Enterprise"/"SMB" labels entered by different reps | Standardize to fixed bands (e.g., 1–10, 11–50, 51–200, 201–500, 501+) sourced from enrichment, not typed by hand |
| Lead source | Every rep and every campaign import invents its own label ("LI," "Linkedin Ad," "linkedin_paid") | Closed picklist matched to actual channels, enforced at the point of creation (form, import mapping, integration) |
| Country / region | Full names, ISO codes, and abbreviations mixed in the same field | Pick one standard (ISO country code is easiest to enrich and to match against ad platform targeting) and migrate everything to it |
| Job title seniority | Free-text titles used directly in segmentation instead of a derived seniority bucket | Derive a seniority field (IC / Manager / Director / VP / C-level) from the title via enrichment, don't hand-tag it |

**Standardization protocol:**
1. Pull the distinct values currently in the field and their counts — this is the map of what needs consolidating.
2. Group variants that mean the same thing and decide the canonical value for each group.
3. Bulk-update existing records to the canonical values (import mapping, workflow-based find-and-replace, or a one-time script depending on volume).
4. Convert the field from free text to a closed picklist so new drift can't re-enter the same way.

**HubSpot:** convert the property type to a dropdown (single-select) with the approved values — this alone blocks new free-text entries. Bulk-remap existing values via a list import with a source-to-target mapping file, or a workflow that copies a mapped value into the standardized property.

**Salesforce:** convert to a restricted picklist (not an unrestricted one) — a restricted picklist only accepts values from the defined list, which is the guardrail that actually holds; an unrestricted picklist still lets integrations and the API write arbitrary text into the field. Use Data Loader with a mapping file for the bulk remap.

**This is not a one-time cleanup.** Every new integration, import, or manual entry point is a place drift can re-enter. Standardization holds only as long as the field stays closed to free text — see Step 5 for the validation rule that enforces it going forward.

**Refuse to standardize a field just because you're already in the CRM's settings screen.** "While we're in there, let's also clean up X" is how a scoped hygiene project turns into an open-ended one that never closes. Standardize the fields that showed up as drifted *and* that feed something live today (Step 7's scoring/routing/personalization tiers) — a legacy field with inconsistent values but no report or workflow reading it is Step 7's "out of scope" case, not a freebie to fix while the picklist editor happens to be open.
