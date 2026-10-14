---
name: |-
  lead-magnet-content
description: |-
  Écrit le FOND d'un lead magnet (livre blanc) à partir d'un brief de cadrage validé et du contexte
  Bulldozer OS : structure canonique en 6 sections, chapitres portés par une idée directrice, et surtout
  un contenu livré PRÉ-DÉCOUPÉ EN BLOCS TYPÉS (prose, kpi, quote, testimonial, checklist, steps, table,
  encart) + un manifeste de contenu JSON — l'entrée des skills assets et design.
  Skill atomique de la suite lead-magnet : invoquée par l'orchestrateur `lead-magnet` à l'étape ❸, et
  ré-invoquée pour appliquer les corrections de fond issues de `lead-magnet-review`.
  Ne choisit jamais la thématique : elle exécute un cadrage donné par l'humain.
when-to-use: |-
  Use this skill when the `lead-magnet` master has a validated framing brief and needs the white paper
  body written, or when review feedback requires content corrections. Not for landing page or website
  copy (`copywriting`), not for account-based marketing plays (`account-based-marketing`), not for
  choosing the topic — the topic always comes from the operator.
user-invocable: false
allowed-tools:
  - Read
  - Write
  - Edit
  - Skill
  - WebSearch
  - WebFetch
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectToneOfVoice
  - mcp__plugin_bulldozer_bulldozer__bdzListProjectIcpProfiles
  - mcp__plugin_bulldozer_bulldozer__bdzListReviews
  - mcp__plugin_bulldozer_bulldozer__bdzSearchReviews
  - mcp__plugin_bulldozer_bulldozer__bdzWebExplorerSearch
  - mcp__plugin_bulldozer_bulldozer__bdzWebExplorerExtractContents
  - mcp__plugin_bulldozer_bulldozer__bdzCreateMetric
effort: |-
  high
---

# Lead magnet — le fond

## Ce que fait cette skill

Elle écrit le livre blanc. Pas un texte linéaire : un contenu **déjà découpé en blocs typés**, pour que
le design puisse composer un document qui se lit, et non un mur de texte paginé. La qualité du rythme
visuel se joue ici, avant le design : un chapitre livré en 100 % prose condamne la mise en page.

Elle porte aussi la **structure canonique** — c'est elle qui garantit un niveau constant quel que soit
l'opérateur qui lance la chaîne.

## Entrées

- `cadrage.md` — le contrat : thématique, angle, titre, lecteur unique (ICP), objectif, CTA, langue,
  longueur. **S'il manque, ne pas démarrer** : le cadrage est validé par l'humain, pas déduit.

**Le test à faire avant d'écrire une ligne : le cadrage donne-t-il une idée, ou un sujet ?**
« Un livre blanc sur la migration cloud » est un sujet — tout le monde peut l'écrire, personne n'a
de raison de le lire. « La plupart des migrations dérapent parce que le coût du double run n'est
jamais budgété » est une idée : elle prend position, elle peut être fausse, donc elle vaut d'être
lue. Si l'angle du cadrage est un thème sans prise de position, ne pas produire un chapitrage
générique pour combler le vide : remonter une question précise à l'opérateur (« quelle est la
thèse ? ») avant d'écrire le corps. Un cadrage qu'on force à produire malgré ce trou donne un
document qui ressemble à n'importe quel autre livre blanc du secteur — l'échec que ce skill existe
pour éviter.
- `contexte-api.md` — ton de voix, positionnement, value proposition, concurrents, avis clients.
  En **mode hors-base** (client absent de l'OS), ce fichier porte les mêmes briques, reconstruites depuis
  le **site validé par l'opérateur**, chacune avec sa page d'origine. Rien ne change côté rédaction : le
  ton se respecte, les sources se citent, et ce que le site ne dit pas reste un trou à arbitrer — pas une
  liberté d'écriture.

## La structure canonique (obligatoire, dans cet ordre)

| # | Section | Règle |
| - | ------- | ----- |
| 1 | **Couverture** | Titre (celui de l'opérateur, ou validé au cadrage) + sous-titre = promesse de lecture + client + date |
| 2 | **Executive summary** | Lisible en 2 minutes par un décideur : le problème, les 3-5 enseignements clés, ce que le lecteur saura faire après. **Écrit EN DERNIER**, jamais en premier |
| 3 | **Sommaire** | Généré depuis la structure réelle, pas depuis le plan prévisionnel |
| 4 | **Chapitres** | **3 minimum**, plus si le sujet l'exige — jugement éditorial, pas gabarit à remplir. Chaque chapitre : une idée directrice, une progression, au moins un élément concret (donnée, exemple, framework actionnable) |
| 5 | **Annexes** | Selon pertinence : méthodologie, données détaillées, glossaire — et **sources (obligatoire dès qu'une donnée est citée, R3)** |
| 6 | **CTA final** | La mécanique lead magnet : une page qui ramène vers le client (offre, contact, prochaine étape), alignée sur l'objectif business du cadrage |

Pourquoi l'executive summary en dernier : écrit en premier, il devient une promesse que le corps ne tient
pas, et il fige le plan avant que le sujet ait été creusé. Écrit en dernier, il résume ce qui a
réellement été démontré.

Le détail de chaque section, avec ses gabarits : `references/structure-canonique.md`.

## Les blocs typés — le rythme se décide ici

Chaque chapitre livre, en plus de sa prose :

- ses **chiffres clés isolés** (`kpi`) — pour les cartes KPI du design ;
- ses **idées-forces** (`quote`) — pour les pull-quotes ;
- ses éléments listables (`checklist`, `steps`, `table`) ;
- ses encadrés de contexte ou de méthode (`encart`) ;
- et si disponible du `testimonial`.

> **Aucun chapitre ne se livre en 100 % prose.** Ce n'est pas une contrainte cosmétique : un chapitre sans
> chiffre isolé, sans idée-force et sans élément listable est presque toujours un chapitre qui n'a rien
> de concret à dire. Le manque de blocs est un symptôme de fond, pas un problème de forme.

Spécification complète des 9 types, du markdown de sortie et du manifeste JSON :
`references/blocs-types.md`.

## Règles d'écriture

- **Ton de voix du client** (`bdzGetProjectToneOfVoice` — exige les trois identifiants
  `customerId`, `projectId` **et** `targetProjectId`, un appel qui n'en passe que deux échoue en
  400) et **langue du cadrage** — R7. C'est la voix du client, pas celle de Bulldozer. Sur les
  projets clients réels, cet appel échoue environ 4 fois sur 10 — dans l'immense majorité des cas
  (6 fois sur 7 des échecs) en **404** : ce n'est pas une panne, ça veut dire qu'aucun ton de voix
  n'a été configuré pour ce projet. Dans ce cas, retomber sur un ton neutre professionnel et le
  noter dans le manifeste plutôt que d'improviser une tonalité ou de bloquer l'écriture. Un **402**
  (plus rare) signale un palier d'abonnement du client qui n'inclut pas ce champ : remonter
  l'incompatibilité à l'opérateur, jamais échouer en silence.
- **Un seul lecteur** : l'ICP du cadrage. On écrit pour LUI — son niveau de connaissance, ses contraintes,
  son vocabulaire. Un document qui parle à trois profils à la fois ne parle à personne. Pour un lecteur
  technique ou déjà avancé dans sa décision, une fonctionnalité concrète EST une preuve : ne pas la diluer
  en bénéfice seul (« un connecteur natif » qui devient « une intégration facile »). Garder les deux avec
  un pont — « un connecteur natif — ce qui veut dire aucun script de synchronisation à maintenir » — plutôt
  que choisir entre la preuve et l'implication.
- **Niveau rédactionnel** : zéro remplissage, zéro généralité creuse, chaque paragraphe apprend quelque
  chose. Un paragraphe qui pourrait figurer dans n'importe quel document du secteur est un paragraphe à
  supprimer. Éviter les marqueurs qui trahissent une écriture automatique — en anglais, les mots les plus
  reconnus par les outils de détection courants début 2026 (« tapestry », « multifaceted », « nuanced »,
  « pivotal », « realm », « underscore », « testament to », « at its core »), la tournure « it's not just
  X, it's Y » en substitut d'un argument, et — dans les deux langues — les listes de trois éléments qui ne
  portent qu'une seule idée. Cette liste de mots vieillit vite (elle a déjà tourné une fois en un an) : la
  retenir comme repère du moment, pas comme règle figée. Le tiret cadratin (« — ») ne fait PAS partie de
  ce repère : les modèles récents sont désormais entraînés à le supprimer, donc ni sa présence ni son
  absence ne prouvent quoi que ce soit à lui seul. La ponctuation d'enchaînement (virgules,
  points-virgules, parenthèses, par opposition au seul « and » pour lier les idées) n'en fait plus partie
  non plus, et ce dans les deux sens : un repère la lisait comme un évitement typique de l'écriture
  automatique, un test plus récent (mi-octobre 2026) repère au contraire l'abus d'incises entre
  parenthèses comme le tic le plus détecté — les deux se contredisent sans qu'aucun ne fasse autorité,
  donc ni la présence ni l'absence de ce type de ponctuation ne doit servir de repère. Le seul signal qui
  tient est la cadence de phrase : une longueur trop uniforme d'une phrase à l'autre, sans phrase courte
  pour casser le rythme. **Attention au sens inverse** : viser une variation de longueur à tout prix, ou
  multiplier les incises et les « and » pour « faire humain », produit un texte aussi artificiel que
  celui qu'on corrige. Le test reste « est-ce que la phrase dit encore quelque chose », jamais « la liste
  de tics est-elle à zéro ».
- **Positionnement respecté** : le magnet démontre l'expertise du client sans être une plaquette
  commerciale. Ratio indicatif **90 % valeur / 10 % client** — le client apparaît quand il apporte une
  preuve ou une méthode, pas quand il faut « rappeler qu'on existe ». Le seuil se déplace selon l'objectif
  du cadrage : un magnet de haut de funnel (comprendre un problème) reste strictement à 90/10, mais un
  magnet de bas de funnel explicitement cadré comme guide d'achat ou de comparaison peut nommer le produit
  du client plus souvent — le lecteur qui télécharge ce format-là attend un point de vue vendeur. Le test
  ne change pas pour autant : chaque mention doit encore porter un argument, jamais une simple répétition
  du nom.
- **Titres qui informent** : un titre de chapitre annonce l'idée, pas le thème (« Pourquoi 70 % des
  migrations échouent la première année » plutôt que « La migration »).

## Sourcing (R3)

Chaque donnée chiffrée est traçable : contexte API, recherche sourcée
(`bdzWebExplorerSearch` / `bdzWebExplorerExtractContents`, ou `WebSearch`/`WebFetch`), ou fournie par
l'opérateur. Une donnée introuvable devient **une question posée** ou une mention **« [à compléter] »**
visible — jamais un chiffre plausible.

`bdzWebExplorerSearch` et `bdzWebExplorerExtractContents` sont **jeton-métrés** (comme le Studio) : ne
pas les appeler en boucle par curiosité chapitre par chapitre. Les réserver aux chiffres qui manquent
réellement au contexte API et à l'opérateur — `WebSearch`/`WebFetch` d'abord pour repérer la bonne
source, `bdzWebExplorerExtractContents` seulement pour la lire pour de vrai une fois identifiée.

Chaque source citée porte : affirmation reprise · émetteur · date · URL. Elles alimentent l'annexe
Sources et le champ `sources` du manifeste. Méthode et pièges : `references/sourcing.md`.

## Testimonials — réels ou absents

Un verbatim inventé est le mensonge le plus coûteux d'un livre blanc : il engage la parole d'un tiers
identifiable. Sources acceptables, dans l'ordre :

1. `bdzListReviews` / `bdzSearchReviews` — avis clients du projet, mais pas de la même façon :
   - `bdzListReviews` appelé sans filtre mélange les avis de **toutes** les entreprises suivies
     sur le projet, concurrents inclus (des sociétés explicitement typées comme concurrentes
     peuvent apparaître dans la même réponse) — **toujours filtrer par `companyId` ou
     `locationId`** identifiant explicitement l'entreprise du client, jamais l'appeler nu sur un
     projet qui suit des concurrents. Retenir un verbatim sans vérifier qu'il porte la bonne
     entreprise revient au même risque qu'un testimonial inventé : une parole attribuée au
     mauvais client.
   - `bdzSearchReviews` est naturellement scopé (`companyId` et `domain` exigés) mais ne couvre
     que Trustpilot — 404 si le domaine n'a pas de profil Trustpilot. À préférer pour Trustpilot
     précisément parce qu'il ne peut pas mélanger les entreprises.
   - Les avis Google Business Profile ne remontent que via `bdzListReviews(locationId=…)`, après
     enregistrement (`bdzRegisterGbpLocation`) et synchronisation (`bdzSyncGbpLocation`) de la
     fiche — vérifier que cette étape a bien eu lieu avant de faire confiance à un avis obtenu
     par ce chemin ;
2. verbatims présents dans le contexte API ou les fichiers projet ;
3. verbatims fournis par l'opérateur au cadrage.

**Pas de testimonial réel = pas de bloc testimonial.** Ni paraphrase « inspirée d'un avis », ni verbatim
anonymisé reconstruit. Le design n'inventera pas ce bloc si le manifeste ne le contient pas. Ce n'est
plus seulement une question de confiance : depuis août 2024, la FTC (États-Unis) sanctionne un avis ou
témoignage fabriqué comme une violation à part entière, et traite chaque publication non conforme
séparément — un motif de plus pour ne jamais transformer un chiffre de satisfaction en verbatim, ni
étoffer un avis existant avec des mots que le client n'a pas dits. Côté européen, l'article 50 du
règlement sur l'IA (AI Act, en application depuis le 2 août 2026, amendes jusqu'à 15 M€ ou 3 % du
chiffre d'affaires mondial) exempte le texte ordinaire ayant reçu une revue humaine substantielle et
une responsabilité éditoriale assumée — ce que ce skill produit déjà (cadrage validé par l'humain,
relecture dédiée via `lead-magnet-review`) — mais désigne explicitement un témoignage fabriqué comme
à haut risque de tromperie, y compris quand il est étiqueté « généré par IA ». Le risque reste donc le
même des deux côtés de l'Atlantique et déjà couvert par cet interdit : jamais le texte de fond relu par
un opérateur, toujours le testimonial inventé.

## Sortie

Deux fichiers, toujours les deux :

1. **`contenu.md`** — le markdown structuré par blocs typés (syntaxe : `references/blocs-types.md`).
2. **`manifeste-contenu.json`** — sections, blocs et leurs types, longueurs, données citées et leurs
   sources, emplacements suggérés d'assets. C'est l'entrée de `lead-magnet-assets` et
   `lead-magnet-design` : un manifeste faux ou incomplet casse les deux étapes suivantes.

## Mode correction (après review)

Quand `lead-magnet-review` renvoie des corrections de fond, les appliquer **une par une**, en confirmant
chacune, et **régénérer le manifeste** — un manifeste désynchronisé du contenu produit un design qui
compose à partir de blocs qui n'existent plus. Ne pas en profiter pour réécrire ce qui n'était pas
signalé : la review borne le périmètre.

## Interdits

- ❌ Inventer un chiffre, une citation, un testimonial ou un exemple client.
- ❌ Retenir un avis (`bdzListReviews` / `bdzSearchReviews`) sans vérifier son `companyId` contre
  l'entreprise du client — un avis d'une autre entreprise suivie sur le même projet est aussi
  invalide qu'un testimonial inventé.
- ❌ Choisir la thématique ou l'angle (R2) — ils viennent du cadrage.
- ❌ Écrire un chapitrage complet sur un cadrage qui ne donne qu'un sujet sans idée directrice,
  sans avoir d'abord remonté la question à l'opérateur.
- ❌ Écrire l'executive summary avant le corps.
- ❌ Un chapitre « bouche-trou » sans idée directrice, ajouté pour atteindre une pagination.
- ❌ Livrer un chapitre 100 % prose, sans aucun bloc de variation.
- ❌ Livrer `contenu.md` sans `manifeste-contenu.json` (ou l'inverse).
- ❌ Laisser un « [à compléter] » sans le remonter explicitement à l'orchestrateur.
- ❌ Basculer dans la plaquette commerciale (le ratio 90/10 se vérifie, chapitre par chapitre).

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = METRIC_TYPE_SKILL_USED`,
`reference = lead-magnet-content`). Non bloquant si l'appel échoue.

## Références

- `references/structure-canonique.md` — les 6 sections en détail, avec gabarits et critères
- `references/blocs-types.md` — les 9 types de blocs, la syntaxe markdown, le schéma du manifeste
- `references/sourcing.md` — méthode de sourcing, format des sources, gestion des « [à compléter] »