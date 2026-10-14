# Signaux CRM natifs pour la revue de pipeline

Détail des champs HubSpot et des tags Claap cités dans `PROPOSITION.md` : ce qu'ils valent
réellement, leurs limites, et à quelle section du texte principal chacun se rattache. Appelé
depuis Output, Stakeholder Map, Red Flag Analysis et Deal Health Score.

## HubSpot — champ Deal `dealtype` (section Output)

Le champ standard `dealtype` existe nativement avec une énumération à seulement 2 valeurs :
New Business (`newbusiness`) et Existing Business (`existingbusiness`). Il ne distingue pas
renouvellement, expansion et cross-sell entre eux — tout ça tombe dans Existing Business. Pour
gater un taux de commission ou lire un score MEDDIC plus finement que new vs. existing, il faut
soit une propriété custom, soit les line items associés au deal.
*Source (mesure) : `mcp__HubSpot__get_properties(deals, [dealtype])` sur le portail HubSpot
connecté à la session Bulldozer — énumération à 2 valeurs confirmée [2026-09].*

## HubSpot — champ Deal `num_associated_contacts` (section Stakeholder Map)

Compteur de contacts associés au deal, renseigné automatiquement par HubSpot — gratuit et
immédiat comme premier indicateur de compte single-threaded, avant même de remplir une ligne
du tableau de parties prenantes.
*Source (mesure) : `mcp__HubSpot__search_properties(deals, keywords=[associated_contact,
num_associated_contacts, buying_role, contact_role, stakeholder])` sur le portail HubSpot
connecté à la session Bulldozer [2026-09].*

## HubSpot — champ Contact `hs_buying_role` (section Stakeholder Map)

Énumération multi-select à 9 valeurs : Blocker, Budget Holder, Champion, Decision Maker, End
User, Executive Sponsor, Influencer, Legal & Compliance, Other — un contact peut en porter
plusieurs à la fois. Le tirer pour chaque contact associé au deal est un pré-remplissage plus
fiable que d'inférer un rôle depuis un intitulé de poste. Sa vraie limite : le champ vit sur le
Contact, pas sur le Deal — un contact actif sur deux deals ne peut pas y porter un rôle
différent sur chacun. Quand cette distinction compte, le mécanisme deal-scope est le label
d'association Contact:Deal, ou l'outil Buying Groups (Sales Hub, quand le portail l'a) — pas
une seconde propriété contact. Le tableau Stakeholder Map reste ce qui transforme ce rôle en
stance et en influence pour *ce* deal précis ; `hs_buying_role` n'en est que le pré-remplissage
gratuit.
*Source (mesure) : `mcp__HubSpot__get_properties(contacts, [hs_buying_role])` sur le portail
HubSpot connecté à la session Bulldozer — énumération à 9 valeurs confirmée [2026-09].*

## HubSpot — Buying Groups (Sales Hub) (sections Stakeholder Map et archétype Committee Deal)

Quand le portail a Buying Groups (Sales Hub), l'outil rend la composition du comité d'achat en
org chart sur la fiche Company, avec l'engagement de chaque partie prenante — plus rapide à
lire qu'à reconstruire de mémoire, et ça montre un décideur qui devient silencieux avant que ça
se voie comme un deal bloqué.

## HubSpot — forecast du Deal (section Deal Health Score)

Deux mécanismes de forecast coexistent et se vérifient séparément :

- `hs_deal_stage_probability` : probabilité par stage, par pipeline, propre à chaque portail —
  un défaut d'installation que les portails actifs renomment et reconfigurent ; peut être
  périmée ou simplement fausse pour un deal donné.
- `hs_manual_forecast_category` (outil Forecast de Sales Hub) : catégorie posée à la main par
  le rep lui-même sur le deal — énumération à 5 valeurs (Not forecasted / Pipeline / Best case
  / Commit / Closed won) — accompagnée de `hs_forecast_probability` et `hs_forecast_amount`
  (pourcentage et montant custom, distincts de la probabilité de stage).

Un audit de forecast qui ne lit que la dérive de `hs_deal_stage_probability` ignore ce second
signal : le forecast peut être fidèle au modèle probabiliste par stage et faux au niveau
Commit/Best Case si les reps ne renseignent jamais ce champ catégoriel, ou l'inverse.
*Source (mesure) : `mcp__HubSpot__search_properties(deals, keywords=[split, forecast,
forecast_category, revenue_split, team_selling])` puis `get_properties(deals,
[hs_manual_forecast_category, hs_forecast_probability, hs_forecast_amount])` sur le portail
HubSpot connecté à la session Bulldozer [2026-09].*

## HubSpot — `hs_deal_score` (section Deal Health Score)

Champ natif deals, type `number`, sans options (pas une énumération), décrit par HubSpot
lui-même comme « the predictive deal score calculated by Hubspot AI to score the deal health »
— un signal IA distinct de `hs_deal_stage_probability` et de `hs_predictivecontactscore_v2`
(scoring prédictif au niveau contact). La métadonnée de propriété ne donne aucune échelle ni
bornes : impossible de savoir sans lire des enregistrements réels si le champ est peuplé sur
0–100, sur quelle fréquence de recalcul, ni si la fonctionnalité est gated par tier Sales Hub.
Ne remplace pas le calcul qualitatif MEDDIC — il n'expose pas ses facteurs et n'est pas
auditable comme les trois dimensions pondérées du Deal Health Score — mais sert de
cross-check à consulter avant l'entretien de revue, après avoir vérifié qu'il est bien peuplé
sur ce portail (un champ vide ressemble à un score bas sans en être un).
*Source (mesure) : `mcp__HubSpot__search_properties(deals, keywords=[predictive, likelihood,
propensity, deal_score, health_score])` puis `get_properties(deals, [hs_deal_score])` sur le
portail HubSpot connecté à la session Bulldozer [2026-09]. Disponibilité réelle sur un portail
client (peuplement, échelle, gating par tier) non vérifiée — à confirmer portail par portail.*

## Claap — tags de transcription (sections Output et Red Flag Analysis)

`search_recording_transcripts` filtre par `dealId` (les deals Claap portent l'URL HubSpot du
deal correspondant, donc le même identifiant utilisé ailleurs dans ce skill) et par tag.
L'énumération réelle des tags posés automatiquement quand un speaker externe a déclenché
l'une de ces quatre situations est : `Objections`, `PainPoints`, `CompetitorMentions`,
`FeatureRequests`.

- `Objections` → les objections réellement soulevées, pour ancrer l'Output.
- `PainPoints` → preuve plutôt que ressenti pour la ligne MEDDIC Identify Pain.
- `CompetitorMentions` → confirme ou infirme le Hard Red Flag « Competitor advantage not
  addressed » au lieu de le deviner.

*Source (mesure) : `mcp__Claap__list_workspaces` (un seul workspace, Bulldozer) puis
`mcp__Claap__search_recording_transcripts` avec filtre `tag`, et `mcp__Claap__search_deals`
(tri `lastInteraction desc`) confirmant l'URL HubSpot sur les deals Claap — portail connecté à
la session Bulldozer [2026-09-30]. Forme exacte de `mcp__Claap__get_deal` et de
`returnAiFields` non testée — à vérifier avant de documenter des champs IA côté deal Claap.*
