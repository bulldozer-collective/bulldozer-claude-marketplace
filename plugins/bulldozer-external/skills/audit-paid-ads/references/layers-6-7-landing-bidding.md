# Layers 6 and 7: Landing Page Match and Bidding Checks

- **Message match**: does the ad headline match the landing page headline? If the ad says "14-day free trial" and the page says "Explore our platform," conversion leaks at click
- UTM → landing page relevance: ads by product line should land on product-specific pages, not the homepage
- Load speed on mobile: >3s load time = significant conversion loss before a single word is read. Check PageSpeed Insights for the exact landing URLs in the campaigns
- Mobile CTA visible without scrolling? Test on an actual device, not a browser simulator

- **Learning phase protection**: any campaign that received a significant change (budget >20%, bid strategy, audience edit) in the last 7 days is in learning. Do not change it again — stack of changes = permanent learning loop
- Smart Bidding readiness: Target CPA/ROAS requires ≥30–50 conversions/month per campaign to function. Below this, use Maximize Conversions with no target, then add target once data volume is there
- Google, budget-limited Target CPA/ROAS campaigns: a bidding system change (rolled out August 17–27, 2026) makes bids track the displayed target more faithfully across a budget change than before. If a past audit or the client credits a campaign with "beating its target right after a budget increase," check the date on that observation — the over-performance this described was real before the rollout and shouldn't be assumed to still happen
- Broad Match on Google is safe only when four conditions hold together: verified conversion tracking, Smart Bidding genuinely running the campaign (not Manual CPC alongside a Smart Bidding label), an actively maintained negative keyword list, and enough conversion volume for the bidding model to have signal. Missing any one of the four — "Smart Bidding is on" alone isn't enough — turns Broad Match into uncontrolled spend. Lead-gen accounts carry the sharpest risk: an unqualified lead pollutes the CRM, it isn't just wasted budget
- LinkedIn: Campaign Manager's three bid strategies are Maximum Delivery (fully automated), Cost Cap (automated but held to a target cost), and Manual Bidding. Maximum Delivery works for awareness. For lead gen, test Cost Cap first — Maximum Delivery on lead gen can overbid for low-quality leads
