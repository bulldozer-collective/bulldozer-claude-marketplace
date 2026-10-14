## Grounding the categories in real calls

If Claap is connected to the project, pull the real objections first:
`search_recording_transcripts` filtered on `tag: [Objections]` (add
`CompetitorMentions` for the competitive ones) and `hasExternalSpeaker: true` returns
real transcript excerpts tied to a company and, through the deal, to its HubSpot record.
Don't stop at an empty result from `bdzListWorkspaceLinks` (type `CLAAP`) — it can come
back empty even when the project's Claap workspace holds real recordings, so search
Claap directly by company or deal before concluding no call data exists. When nothing is
connected, the categories table in the main skill is the fallback, not a placeholder to
skip past.

## A Technical objection is stronger grounded in a named ask than answered from the roadmap

Claap tags transcripts with four values, not just `Objections`/`CompetitorMentions`:
`search_recording_transcripts` filtered on `tag: [FeatureRequests]` surfaces the
integration or capability a prospect asked for by name on a real call. Cite that before
writing "Does it integrate with X?" from a guess at what buyers usually ask — a request
tied to an actual account beats a hypothetical one, and it tells you whether the honest
answer is "yes," "on the roadmap," or "no, and here's the workaround."

## "Status quo" reads differently depending on `dealtype`

On a New Business deal it's resistance to replacing an incumbent — the response
differentiates against the competitor. On an Existing Business deal (or whatever custom
value this portal uses for renewal/upsell — check with `get_properties` rather than
assuming the two HubSpot defaults, since a client portal can have replaced or extended
them) it's a retention risk, not a competitive one: the account is questioning whether
your own product is still worth the spend, and the response is proof of value already
delivered, not a differentiation pitch. Check the deal's `dealtype` before reaching for a
competitive response on an account that's already a customer.

## Response Format (Per Objection)

Use a real proof point when one exists — a closed-won deal that switched from the named
competitor, or the account's own review — the bracketed example below is the format to
fill, not a line to leave as invented filler. The RESPONSE line is what to say, not a
line to read: a rep who recites it word for word sounds like they're reading, and the
same objection lands differently call to call — write it as the reasoning a rep
restates, never a script.

```
OBJECTION: "We already use [Competitor]."

WHY THEY SAY IT: Fear of switching cost + sunk cost fallacy.
They're invested and don't want to admit it's not working.

RESPONSE: "That makes sense — a lot of our best customers came from [Competitor].
The question isn't whether to switch, it's whether what you're getting now
is worth the cost. What's the one thing you wish [Competitor] did better?"

PROOF POINT: "[Customer] switched from [Competitor] in 3 weeks and
cut their process time by 40%."

FOLLOW-UP QUESTION: "What would need to change for you to take a second look?"
```
