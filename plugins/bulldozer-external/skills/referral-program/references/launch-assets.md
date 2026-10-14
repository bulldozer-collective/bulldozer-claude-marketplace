# Launch assets — referral email template and checklist detail

## Referral Email Template

Subject: You can now earn [reward] for sharing [Product]

```
Hey [Name],

We just launched our referral program.

Share [Product] with someone in your network who'd find it useful — 
they get [their reward], you get [your reward] after they sign up.

Your referral link: [unique link]

It's simple:
1. Share your link
2. They sign up
3. You both get [reward]

[Share My Link]

Thanks for being part of the [Product] community.

[Your name]
```

## What "fraud prevention rules" actually means

A cap per referrer catches volume abuse but not the two patterns that show up first: self-referral (a second account, a plus-addressed or disposable email, the same card or IP as the referrer) and reward farming (a burst of low-quality signups from one IP or device cluster, timed to the incentive). The single highest-leverage rule is where the reward fires: gate it on a verified paid conversion or a short minimum-usage window, never on signup alone — signup-gated cash rewards on a double-sided program are exactly where this concentrates. A cap is a backstop after that, not a substitute for it.

## What 30 days can and can't tell you

For a self-serve product, the first-30-days window is enough to read the funnel and the incentive's pull. For anything with a real sales cycle, it's only enough to read participation and friction — whether the incentive size and structure are actually working has to wait until referred deals have had time to close, which means at least one full sales-cycle length, not a calendar month. Use the account's own median (HubSpot's `days_to_close` if it's connected — see `references/measuring-in-bulldozer-os.md`) rather than borrowing a benchmark from another business. Changing the reward size before that window closes is reading noise as a result.
