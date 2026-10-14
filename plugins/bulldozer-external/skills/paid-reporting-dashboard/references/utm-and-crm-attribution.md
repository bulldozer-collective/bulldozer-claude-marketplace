# UTM Taxonomy and CRM Attribution Configuration

**A consistent UTM standard is the foundation of all attribution.** Without it, GA4 and CRM source data becomes fragmented within 30 days of launch as different team members build campaigns with different naming patterns.

**Required UTM parameters (mandatory for every paid link):**

| Parameter | Definition | Example values |
|-----------|-----------|----------------|
| `utm_source` | Platform | `google`, `linkedin`, `meta`, `reddit` |
| `utm_medium` | Channel type | `cpc`, `paid-social`, `display`, `remarketing` |
| `utm_campaign` | Campaign name | `search-brand-q2`, `linkedin-icp-awareness-q2` |
| `utm_content` | Ad creative variant | `ad-headline-a`, `creative-cto-persona` |
| `utm_term` | Keyword (Search only) | `crm-software-smb` |

**Naming convention rules:**
- Lowercase only — GA4 is case-sensitive; `Google` and `google` are two sources
- Hyphens only, no spaces or underscores — spaces break URL encoding
- Include quarter in campaign name — enables QoQ comparison without date filters
- No abbreviations that aren't in the shared glossary

**GCLID (Google Click Identifier):** Enable auto-tagging in Google Ads so GCLID passes automatically with every click. GCLID enables server-side conversion matching even when UTM parameters are blocked by browser privacy settings. In HubSpot, turn this on per ad account: Settings → Marketing → Ads → select the account → toggle Auto tracking (this replaces the older "Ad Tracking" menu path some guides still describe). Two gotchas that cause silent gaps: HubSpot only captures the click ID when the visitor submits the form on the *same page* they landed on from the ad — a multi-page journey (landing page → pricing page → form) needs hidden fields or custom JavaScript to carry it forward — and the native Ads tool with conversion tracking requires Marketing Hub Professional or Enterprise, not Starter.

**A trap that resurfaces at every re-launch, not just at initial setup:** a website migration, a new page builder, or a domain change breaks GCLID pass-through and hidden-field UTM capture silently — nothing errors, the form still submits, the ad accounts still report spend. The team that only tests this once at setup finds out three months later, when someone asks why the Original Source match rate quietly dropped. Re-run the test-form-submission check below as a standing item on any site or CRM-integration change, not a one-time setup step.

**CRM UTM capture:** Every form submission should write the current session's UTM parameters to the contact record. In HubSpot, hidden form fields capture these automatically when the HubSpot tracking code is installed. Verify this is working: submit a test form with UTM-tagged URL and check the contact record for source fields.

**Every lead in the CRM needs an original source that never changes.** This is the field that enables closed-won analysis by channel.

**HubSpot configuration:**
- `Original Source` and `Original Source Drill-down 1/2`: Set by HubSpot automatically on contact creation — do not overwrite these fields
- Custom property `Ad Campaign` (text, read-only after creation): stores utm_campaign value at lead creation
- Custom property `Ad Source` (text, read-only after creation): stores utm_source + utm_medium
- Custom property `First Touch Date` (date): timestamp when contact was created with a paid source

**The read-only rule is critical.** If reps or automation can overwrite the original source, attribution degrades within weeks. Lock these fields at creation in CRM settings (HubSpot: Properties → field-level permissions → no edit after creation). Keep exactly one narrow, audited exception to the lock: merging two duplicate contact records, which can legitimately carry two different Original Source values and needs a documented data-ops decision on which one survives. That's data hygiene, not an override — a rep editing the field to argue for credit on a deal is the exact failure mode the lock exists to prevent, and treating the two cases the same either blocks legitimate cleanup or reopens the door to both.

**Data match target:** Run a monthly audit — what % of contacts in your CRM have the `Original Source` field populated? >80% is a reasonable starting bar, not a published standard — tune it to your own baseline once you've measured it a few months running. Anything meaningfully below your baseline signals tracking gaps (UTMs missing on some campaigns, form submissions not capturing source, API-created contacts without source data).
