# Metadata rules — full detail (Phase 2)

Called from `SKILL.md` Phase 2. Full citations and reasoning behind the short rules stated inline.

## Keywords field: bytes vs. characters

Apple's own documentation is inconsistent on this exact point, so treat it as an open contradiction rather than a settled rule: "Platform version information" (App Store Connect Help — the reference page that documents this exact field) says the limit is 100 **bytes** ("You can provide up to 100 bytes of content"), while "Creating Your Product Page" says 100 **characters** total, with terms separated by commas and no spaces — both pages were live and read directly the same day (developer.apple.com/help/app-store-connect/reference/platform-version-information; developer.apple.com/app-store/product-page). Neither page references the other's wording. Reconfirmed by direct re-reading of both pages on 2026-10-08: nothing has changed since the contradiction was first logged on 2026-09-25 — "Platform version information" still says 100 bytes for Keywords (and also documents Notes/App Review at 4000 bytes, while What's New/Description/Promotional Text stay in characters on that same page), "Creating Your Product Page" still says 100 characters.

Until Apple reconciles it, count bytes: assuming bytes when the real limit turns out to be characters costs nothing, while assuming characters when the real limit is bytes can silently overflow a field packed with accented or non-Latin terms — every accented character in French keywords (é, à, ç, î…) typically costs 2 bytes in UTF-8, so a francophone keyword field can hit a byte ceiling well before 100 characters counted naively.

## App Store Tags (search tags generated from metadata)

Apple now generates search-result tags from an app's full metadata (title, subtitle, keywords, description, screenshots) using an LLM, then has them human-reviewed before they go live. They drive browse and discovery placements, not the search-ranking algorithm directly — but a vague or generic listing now costs discoverability twice: once in search, once in how correctly the app gets categorized. Treat description and screenshot copy as inputs to this system too, not just as conversion copy nobody indexes. (Apple Developer, "App Store search," developer.apple.com/app-store/search — checked 2026-08.)

## Behavioral relevance is a stated part of ranking, not just ASO folklore

Apple's own ML research team describes App Store search ranking as combining textual relevance (keyword match) with behavioral relevance — taps, downloads, and post-install engagement (Apple Machine Learning Research, "Scaling Search Relevance: Augmenting App Store Ranking with LLM-Generated Judgments," SIGIR 2026 — checked 2026-09, read only via secondary excerpt: machinelearning.apple.com was blocked by the network proxy on direct read; the citation relies on convergent independent secondary sources describing the same paper with the same reference — arXiv, ACM SIGIR, 9to5mac). Practical consequence: a listing that converts better on the same keyword set can out-rank one that matches the keyword more precisely but converts worse. That's the real argument for treating Phase 3 (screenshots) and Phase 6 (page variants) as ranking work, not just conversion polish — a stronger-converting default page or CPP variant is a lever a metadata rewrite alone can't pull.

## Volume without install intent

Volume without install intent is the same trap here as in web SEO: a broad, high-search-volume term that has nothing to do with what the app does converts nobody, drags down behavioral relevance if it draws the wrong tap, and — if it's a competitor name or an unrelated trademarked term stuffed in to game discovery — risks a rejection under App Review Guideline 2.3.7 (Accurate Metadata), which explicitly bars packing metadata with trademarked terms, popular app names, or irrelevant phrases "just to game the system" (Apple App Review Guidelines, developer.apple.com/app-store/review/guidelines — checked 2026-09). Prioritize terms someone searches a screen-tap from installing, not the biggest number in a keyword-volume tool.
