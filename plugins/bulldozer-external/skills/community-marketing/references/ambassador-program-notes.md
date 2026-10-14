# Ambassador program — why "direct line to product team" is the one benefit that waits

The main skill file lists the four ambassador benefits (early access, direct line to product
team, public recognition, private calls, swag) and the final Rules section says never to grant
the product-team line at the moment of the offer. Here is the reasoning behind that rule, for
whoever needs to explain it to a client who wants to front-load the offer.

## Tracking a candidate's ongoing activity

Only reach for `bdzCreateLinkedInRefreshConfig` (`targetType=PEOPLE`) if you want a candidate's
posts tracked on an ongoing basis after they become an ambassador — it's a paid, jeton-metered
periodic refresh, not a one-time check, and the project's refresh configs get disabled if it
runs out of jetons. The one-time check in Step 1 (`bdzListLinkedInPosts` /
`bdzCreateLinkedInPostListJob`) is enough to decide whether to make the offer; this is only for
after they're in the program.

**Don't offer "Direct line to product team" or roadmap access before the unprompted behavior in
Step 1 has actually happened.** It's tempting to hand this benefit out early to make the offer
more attractive — it backfires two ways: it turns the ambassador track into something people
angle for by posting *for* the badge instead of because they wanted to help (the exact
staff-shaped, inauthentic activity the whole community is trying to avoid), and it puts
unvetted opinions in front of the product team at a volume nobody asked to manage. Grant it
after weeks of evidence, not at the moment of the offer — the other benefits (recognition,
private channel, swag) don't carry that risk and can go out on invitation.

## Re-evaluating the roster

Re-evaluate the roster, don't let it silently ossify. An ambassador who goes quiet for a
stretch is worth a direct, individual check-in before their name keeps circulating on
promotional material — cycling people through the program keeps it a mark of current
contribution rather than a permanent title handed out once and never revisited.
