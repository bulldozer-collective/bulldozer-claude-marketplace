# GA4 report template — preset and anomaly detection caveats

The OS ships a `conversion_funnel` preset (`bdzApplyGoogleAnalyticsTemplatePreset`, one of five preset IDs listed by `bdzListGoogleAnalyticsTemplatePresets`) that creates a report template pre-filled with dimensions and metrics in one call instead of building it field by field — worth checking first, but verify the preset's actual dimensions and metrics cover the specific primary/secondary/guardrail metrics from the hypothesis before trusting it as-is; it's built for a general funnel read, not for any one test's exact event set.

Each run of a GA4 report template also triggers automatic anomaly detection (flags any metric that deviates more than 2σ from its history) — a useful extra flag if a tag breaks mid-test, but not a substitute for the SRM check: it watches one variant's numbers over time, not the split between variants.
