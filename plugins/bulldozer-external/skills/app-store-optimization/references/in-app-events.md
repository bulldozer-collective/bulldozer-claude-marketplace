# In-App Events — full detail (visibility lever, Apple only)

Called from `SKILL.md` Phase 3. A listing feature, not a page-variant or metadata field — covered here because it changes what shows up in search and browse around a launch or update, which is squarely an ASO visibility question, not a product-roadmap one.

## What it is and where it shows

An In-App Event is a scheduled, time-boxed promotion (a season launch, a competition, a live event, a major update) that Apple can surface directly in App Store search results and the Today/Games/Apps tabs, with its own card, badge, and dedicated detail page — reach a listing-only audit otherwise has no lever for. It exists only on the Apple App Store; this skill has found no Google Play equivalent and none is asserted here.

## Plafonds — ne pas confondre les deux

Two caps that get confused with each other: a developer account can have up to **15 approved** events live in App Store Connect at once, but only **10 of those can be published** (visible on the Store) at the same time. An event runs a maximum of **31 days** and can be promoted — visible with a countdown — starting up to **14 days before** it begins.

## Badges — sept, pas six

Exactly **seven** badge types exist, each with a specific official definition — don't default to a vaguer or shorter list:
- **Live Event** — happening now, time-sensitive
- **Premiere** — first-time content or feature release
- **Challenge** — a task or goal for users to complete
- **Competition** — a contest with ranking or prizes
- **New Season** — a new season of ongoing content
- **Major Update** — explicitly excludes minor UI tweaks or bug fixes; reserve for changes substantial enough to justify the badge, or risk rejection
- **Special Event** — doesn't fit the other six

## Character limits — three fields, three different caps

Don't reuse the Phase 2 metadata caps here — these are separate fields with their own limits: event **name** up to **30 characters** (title case), **short description** (the card shown in search/browse) up to **50 characters** (sentence case), **long description** (the event's own detail page) up to **120 characters** (sentence case). Third-party ASO sources commonly give 80 characters for the short description instead of 50 — that figure is stale; 50 is the current official limit.

## When to flag this in an audit

Flag an In-App Event only when the audit finds a real trigger to hang it on — a content season, a competition, a major feature release, a live or time-limited event — not as a blanket recommendation. An app with nothing event-shaped happening has nothing to badge.

(Apple Developer, "In-App Events" — developer.apple.com/app-store/in-app-events — and App Store Connect Help, "In-app event badges" — both read directly, checked 2026-10.)
