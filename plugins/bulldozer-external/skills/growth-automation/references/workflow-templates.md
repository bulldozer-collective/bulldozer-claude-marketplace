# Workflow Templates and Calibration — Enrichment Fields, Auto-Enrollment Logic, Inbound Scoring

## Step 2: Enrichment Automation (Clay)

**Standard enrichment fields per contact:**
- First name, last name, title, seniority
- Work email (verified)
- Company name, domain, industry, employee count
- LinkedIn URL (contact + company)
- HQ location
- Technologies in use (BuiltWith integration in Clay)
- Recent news or signal context (used for personalization)

## Step 4: Sequence Enrollment — HubSpot auto-enrollment workflow

**HubSpot workflow logic for auto-enrollment:**

```
TRIGGER: Contact created in CRM with [Signal Type] field populated
AND: [Qualification Gate] = TRUE
AND: Contact is not already in an active sequence
AND: Contact is not an existing customer (company domain not in Closed-Won list)

ACTION:
  IF Signal Type = "New Executive Hire" → Enroll in "Executive Hire" sequence (Tier 1 or 2)
  IF Signal Type = "Funding Round" → Enroll in "Funding Announcement" sequence
  IF Signal Type = "Job Posting Match" → Enroll in "Job Posting" sequence
  IF Signal Type = "Website Visitor" → Assign to rep + Slack notification (human outreach)

DELAY: 2 hours after CRM creation (buffer for rep to review and opt out)
```

## Step 6: Inbound Lead Automation — threshold calibration

**Calibrate the threshold against real outcomes, not a round number.** Run the same scoring formula against last quarter's closed-won accounts before picking where the AE-queue cutoff sits — a threshold chosen because it "feels right" is the same unproven filter `Common Mistakes` already warns against for the qualification gate, just moved one step downstream. Revisit it on the same cadence as the qualification gate (Phase 3): a cutoff calibrated on a small closed-won sample will need retightening or loosening once real inbound volume passes through it.
