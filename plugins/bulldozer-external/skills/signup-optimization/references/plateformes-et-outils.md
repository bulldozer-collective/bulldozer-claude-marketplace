# Signup optimization — platform specifics and tool detail

Read a section when the situation it names actually applies to the signup form being audited — this file isn't needed on every invocation of `signup-optimization`.

## Sign in with Apple — App Store Guideline 4.8

If the signup form is embedded in a native iOS app (not just reached through a browser), don't reach for "add Sign in with Apple" as a reflexive rule. App Store Review Guideline 4.8 doesn't name Apple's button — it requires that an app offering third-party/social login for the primary account (Google, Facebook, etc.) also offer an equivalent alternative that (1) limits data collection to name and email, (2) lets the user keep their email private at signup, and (3) doesn't use in-app activity for advertising without consent. In practice Sign in with Apple is almost always the only option that clears all three, but the rule has five exceptions: the app only uses its own account system; it's an alternative marketplace app with its own login; it's an education/enterprise app requiring an existing institutional account; it uses a government/industry ID system; or it's a client for one named third-party service the user must sign into directly. Check whether the app falls under one of those before assuming the requirement applies.

*Source: Apple Developer, App Store Review Guidelines §4.8 Login Services — developer.apple.com/app-store/review/guidelines — read 2026-09-16.*

## Minimum touch target size — WCAG 2.2 vs native-app conventions

This skill describes a web form, so the standard that actually governs touch target size is WCAG 2.2's SC 2.5.8 Target Size (Minimum, level AA): at least 24×24 CSS px, with defined exceptions (enough spacing around a smaller target, an equivalent control elsewhere on the page, an inline text link, unmodified user-agent default, or when the presentation is essential). Apple's 44pt HIG and Android's 48dp Material Design figures are native-app conventions, not the web accessibility floor — they sit closer to WCAG's stricter, optional SC 2.5.5 (Enhanced, level AAA, 44×44 CSS px). Don't cite 44px as "the WCAG minimum": that conflates the AA baseline with the AAA target. Treat 24×24 as the compliance floor and 44×44 as the better-practice target for primary buttons (submit, social auth) on a signup form.

Cite the standard itself as "WCAG 2.2 AA", not "WCAG 2.1 AA": 2.2 is the version in force since its 5 October 2023 Recommendation. 2.1 remains a valid subset (2.2 is backward-compatible and drops no 2.1 criterion) but is no longer the reference version to cite. WCAG 3.0 has no Recommendation status as of this writing — nothing replaces 2.2 yet.

*Source: W3C WCAG Working Group, Understanding SC 2.5.8 Target Size (Minimum) and tracking issue #3714 (github.com/w3c/wcag) — read 2026-09-03; WCAG 2.2-vs-2.1 status confirmed directly on the same repository — read 2026-10-07.*

## Passkeys — 2026 adoption figures

Passkeys (WebAuthn) have stopped being a niche bet. FIDO Alliance's "State of Passkeys 2026: Global Consumer and Workforce Report" (Sapio Research fieldwork, April 2026 — 11,000 consumers across 10 countries, margin of error ±0.9 points; 1,400 enterprise decision-makers at organizations with 500+ employees, margin of error ±2.6 points) found 75% of consumers have enabled a passkey on at least one account, and 68% of organizations have deployed or are actively deploying passkeys for employee sign-in.

The product tradeoff to design for, not skip: a passkey-only signup still needs a fallback (magic link or password) for the browser/device combinations that don't support it, and a clear recovery path if the device holding the passkey is lost.

*Source: FIDO Alliance, "The State of Passkeys 2026: Global Consumer and Workforce Report" — fidoalliance.org/the-state-of-passkeys-2026-global-consumer-and-workforce-report — confirmed directly at the primary source 2026-10-09 (an earlier pass, 2026-09-03, had only seen the same figures via a WebSearch summary, not the report itself).*

## `bdzEnrichContact` — what it actually covers

Don't assume Bulldozer OS's own enrichment tool (`bdzEnrichContact`) can auto-suggest a company name as someone types it into a signup form. It enriches a *contact record that already exists*, from that contact's LinkedIn URL — job history always, email/phone only if asked for explicitly (each overwrites whatever is already stored) — and it costs jetons per call (2 for the profile, +2 for each of email/phone requested). It's a post-signup CRM enrichment step, not a live autocomplete while someone is still filling the form. Inferring company from the work-email domain at signup time needs a domain-lookup service wired into the form itself, which Bulldozer OS does not provide out of the box.

*Source: `bdzEnrichContact` tool schema, read via ToolSearch — verified 2026-09-14, no change found on re-check 2026-09-25.*
