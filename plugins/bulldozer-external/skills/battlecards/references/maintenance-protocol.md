# Maintenance Protocol — Detail

**Quarterly review (30-minute standard):**
1. Pull all deals last quarter where this competitor appeared — a real filter only if the portal's competitor-naming property is a closed picklist, not just present (see *Sourcing and Refresh in Bulldozer OS*): free text there means a text search, not a clean filter, and no property at all means a manual read of closed-lost deals and their notes
2. Review any new win/loss interviews that mention them — new themes feed the win/lose sections directly
3. Re-read "when we lose" against those deals. A loss reason that isn't already listed there is the most important edit of the review.
4. Re-check their pricing page and the positioning line on their homepage — both change without announcement
5. Re-pull their reviews and re-read the middle-rating band for complaints that weren't there last quarter
6. Ask two reps who ran the card in a live deal: which objection did you hear that isn't scripted here?

Close the review by updating the date and owner line at the top of the card, then post what changed in one message to the sales channel — `mcp__plugin_bulldozer_bulldozer__bdzSendSlackMessage` (a channel and the text) posts it directly when the reviewer has their own Slack connector set up; send it by hand otherwise. A card that changes silently doesn't get re-read.

**One owner per card.** The owner is named at the top and is the only person who edits it. Shared ownership shows up first in the "when we lose" section, which drifts back toward vagueness every time it changes hands.

**Retiring a card.** A card earns its place by appearing in deals. If a competitor showed up in no deal for two consecutive quarters, fold it into the competitive landscape overview and take it out of the set reps carry. Five accurate cards beat eight cards on a shelf.
