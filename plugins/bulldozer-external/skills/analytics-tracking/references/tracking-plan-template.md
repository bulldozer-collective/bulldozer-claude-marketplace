# Ready-to-copy tracking plan template

Use this as the body of the `tracking-plan-{product}.md` deliverable (see Output in the
main skill).

```markdown
# [Site/Product] Tracking Plan

## Overview
- Analytics stack: GA4 + GTM
- Last updated: [Date]
- Owner: [Name]

## Events

| Event Name | Description | Properties | Trigger | Conversion? |
|------------|-------------|------------|---------|-------------|
| demo_requested | User submits demo request | form_location, source | Demo form submit | Yes |
| trial_signup_completed | User completes trial signup | method, plan | Success page | Yes |

## Custom Dimensions
| Name | Scope | Parameter |
|------|-------|-----------|
| user_type | User | user_type |
| plan | Session | plan_name |

## UTM Convention
Source: [list of approved sources]
Medium: [list of approved mediums]
Campaign: [naming pattern]
```

Once the plan is live, add a population-rate column to the Events table above: the % of
fires where each key property is non-empty. An event that's 100% present but only 60%
populated with `form_location` isn't validated, it's decoration.
