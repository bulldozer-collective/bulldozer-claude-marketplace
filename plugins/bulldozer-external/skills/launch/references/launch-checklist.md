# Launch checklist complète

Annexe du skill `launch`. Référencée depuis la section « Launch Checklist » du texte
principal — la checklist à dérouler telle quelle pendant le lancement, en trois temps
(avant, jour J, après).

## Pre-Launch (2+ Weeks Before)
- [ ] Landing page with clear value proposition, naming the status quo it replaces
- [ ] Waitlist list created (`bdzCreateLeadList`) and wired to the signup form
- [ ] Announcement email drafted and tested
- [ ] Blog post written and ready
- [ ] Social posts scheduled
- [ ] Product Hunt listing prepared (if using), maker account warmed up
- [ ] Launch assets ready (screenshots, GIFs, demo video)
- [ ] Onboarding flow ready for new users, built around the named activation event
- [ ] Analytics/tracking in place — GA4 key event configured for the activation event, existing report template checked before creating a new one, `conversions` (not `keyEvents`) used as the metric name if building a Bulldozer OS report template

## Launch Day
- [ ] Announcement email sent to list
- [ ] Blog post published
- [ ] Social posts live (`bdzCreateLinkedInPost` for LinkedIn — pass the actual drafted post copy as `message`; it's a required field and an empty or missing one is rejected outright)
- [ ] Product Hunt listing submitted (if using)
- [ ] In-app announcement active for existing users
- [ ] Website banner/notification live
- [ ] Team monitoring and responding
- [ ] Tracking launch metrics in real-time — read them against a full day/week, not the first few hours; early numbers overweight whoever was already paying attention

## Post-Launch (Week 1–4)
- [ ] Onboarding email sequence active for new signups
- [ ] Follow-up with engaged prospects
- [ ] Update website with new feature/product
- [ ] Comparison pages published
- [ ] Interactive demo or product tour available
- [ ] Feedback collected and traced to what didn't happen at the activation event, not just a running list of feature requests — a request is what someone asked for, not necessarily why they didn't activate
- [ ] A single high-stakes signal (a named security or compliance blocker, an early adopter who churned citing one specific gap) escalated immediately rather than filed to wait for a pattern — waiting for repetition is right for a segment-wide theme, wrong for one account-level red flag
- [ ] Plan next launch moment
