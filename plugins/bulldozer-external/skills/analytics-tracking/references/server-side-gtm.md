# Server-side GTM (sGTM) — cost and when it's worth it

Standard web GTM (client-side) is the right starting point for most B2B SaaS marketing
sites. Server-side GTM — a separate container you run on your own cloud infrastructure,
typically Cloud Run — exists to reduce ad-blocker/browser data loss and control what leaves
the browser, but it's a system to build, host and maintain: roughly $40-45/month per
instance, with Google's Cloud Run setup guide recommending a minimum of 2 instances in
production to avoid data loss during an outage — a floor near $90/month, still a few
hundred to a few thousand dollars a year; less with a managed provider.

The "3 instances" figure that circulates in some write-ups is Google's older App Engine
guidance, not Cloud Run's — check which platform a client's sGTM actually runs on before
sizing the cost, since the two guides don't agree.

Reach for sGTM when volume or regulatory exposure justifies that cost — heavy ad spend that
depends on clean conversion data, e-commerce, GDPR-sensitive sectors — not by default for a
mid-size marketing site.

Be skeptical of any vendor claim that client-side tracking "loses 20-40% of data" to
ad-blockers: that range comes almost entirely from vendors selling the server-side fix, and
the one methodologically-described independent test found (a 10-day, 7M+ hit sample)
recovered under 5% of blocked requests on Chrome and under 1% on Safari — nowhere near the
headline numbers. If data loss is the actual concern, measure the gap on your own traffic
first (compare server logs or a first-party pixel against GA4 hit counts) before buying a
fix sized by someone else's marketing.

Le plancher de 2 instances Cloud Run vient de plusieurs guides spécialisés convergents, pas
d'une lecture directe de la documentation Google — à revérifier directement sur
`developers.google.com` si l'accès redevient possible, avant de le citer comme un chiffre
officiel Google.
