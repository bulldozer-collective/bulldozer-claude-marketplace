# Visual assets & technical quality — full detail (Phases 3 and 4)

Called from `SKILL.md` Phase 3 (screenshots, App Preview) and Phase 4 (Android vitals).

## Screenshots in search results

Apple shows up to three screenshots or app previews directly in search results, before anyone taps into the listing — the exact count depends on platform and image orientation, portrait giving more room than landscape (Apple Developer, "App Store search," developer.apple.com/app-store/search — checked 2026-08). Whatever the count on a given device, screenshot 1 is still the highest-certainty real estate in the whole listing: design it as if it's the only one anyone will see.

## App Preview content rules

App Preview must show only footage captured on-device of the app's own features, functionality, and UI, and run 15–30 seconds — under 15 seconds is as non-compliant as over 30, not just "shorter is safer." Beyond "no marketing footage," Apple's own spec names two further rejection reasons a generic "show real gameplay" check misses: (1) any shot of a person interacting with the device — an over-the-shoulder angle or visible fingers tapping the screen — is explicitly disallowed, not just staged marketing cutaways; (2) every frame must be content the publisher is legally authorized to show. A preview that's genuine in-app footage but filmed over someone's shoulder still fails review. (Apple Developer, "App Previews" and App Store Connect Help, "App preview specifications" — checked 2026-09.)

No equivalent check has been made for Google Play's own Promo Video / feature graphic content rules — this skill only cites the Apple rule, verified at the source; no research has been done on whether Google Play has an equivalent or different restriction on its own promo video content.

## Android vitals (Phase 4 technical gate)

Before blaming metadata or creative for a Google Play app, rule out a technical-quality cause first. Google Play throttles an app's own visibility when its Android vitals cross fixed thresholds, measured as a 28-day rolling average: user-perceived crash rate ≥ 1.09% or ANR (App Not Responding) rate ≥ 0.47%, both across all devices combined; per individual device model, the bar is ≥ 8% for either metric, and Play can flag a warning and suppress visibility on that specific device model even when the app-wide rate is fine. This is invisible to a listing-only audit — it doesn't show up in the metadata, screenshots, or even the review text — so ask whether Android vitals (Play Console) have been checked before concluding a ranking or conversion problem is an ASO issue at all. No equivalent public self-service metric exists for this on the Apple side within this audit's scope. (Android Developers, "Android vitals," developer.android.com/topic/performance/vitals — checked 2026-09.)
