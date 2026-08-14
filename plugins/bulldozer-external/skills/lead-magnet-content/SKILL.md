---
name: lead-magnet-content
description: |
  Écrit le FOND d'un lead magnet (livre blanc) à partir d'un brief de cadrage validé et du contexte
  Bulldozer OS : structure canonique en 6 sections, chapitres portés par une idée directrice, et surtout
  un contenu livré PRÉ-DÉCOUPÉ EN BLOCS TYPÉS (prose, kpi, quote, testimonial, checklist, steps, table,
  encart) + un manifeste de contenu JSON — l'entrée des skills assets et design.
  Skill atomique de la suite lead-magnet : invoquée par l'orchestrateur `lead-magnet` à l'étape ❸, et
  ré-invoquée pour appliquer les corrections de fond issues de `lead-magnet-review`.
  Ne choisit jamais la thématique : elle exécute un cadrage donné par l'humain.
when-to-use: |
  Use this skill when the `lead-magnet` master has a validated framing brief and needs the white paper
  body written, or when review feedback requires content corrections. Not for landing page copy
  (`atomic-copywriting`), not for ABM co-branded white papers (`abm-newsjacking`), not for choosing the
  topic — the topic always comes from the operator.
user-invocable: false
effort: high
allowed-tools:
  - Read
  - Write
  - Edit
  - Skill
  - WebSearch
  - WebFetch
  - mcp__bulldozer__bdzGetProjectToneOfVoice
  - mcp__bulldozer__bdzGetProjectAiContext
  - mcp__bulldozer__bdzListProjectIcpProfiles
  - mcp__bulldozer__bdzListReviews
  - mcp__bulldozer__bdzSearchReviews
  - mcp__bulldozer__bdzWebExplorerSearch
  - mcp__bulldozer__bdzWebExplorerExtractContents
  - mcp__bulldozer__bdzCreateMetric
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
- `contexte-api.md` — ton de voix, positionnement, value proposition, concurrents, avis clients.

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

- **Ton de voix du client** (`bdzGetProjectToneOfVoice`) et **langue du cadrage** — R7. C'est la voix du
  client, pas celle de Bulldozer.
- **Un seul lecteur** : l'ICP du cadrage. On écrit pour LUI — son niveau de connaissance, ses contraintes,
  son vocabulaire. Un document qui parle à trois profils à la fois ne parle à personne.
- **Niveau rédactionnel** : charger `anthropic-skills:anti-slop-writing` et s'y tenir. Zéro remplissage,
  zéro généralité creuse, chaque paragraphe apprend quelque chose. Un paragraphe qui pourrait figurer
  dans n'importe quel document du secteur est un paragraphe à supprimer.
- **Positionnement respecté** : le magnet démontre l'expertise du client sans être une plaquette
  commerciale. Ratio indicatif **90 % valeur / 10 % client** — le client apparaît quand il apporte une
  preuve ou une méthode, pas quand il faut « rappeler qu'on existe ».
- **Titres qui informent** : un titre de chapitre annonce l'idée, pas le thème (« Pourquoi 70 % des
  migrations échouent la première année » plutôt que « La migration »).

## Sourcing (R3)

Chaque donnée chiffrée est traçable : contexte API, recherche sourcée
(`bdzWebExplorerSearch` / `bdzWebExplorerExtractContents`, ou `WebSearch`/`WebFetch`), ou fournie par
l'opérateur. Une donnée introuvable devient **une question posée** ou une mention **« [à compléter] »**
visible — jamais un chiffre plausible.

Chaque source citée porte : affirmation reprise · émetteur · date · URL. Elles alimentent l'annexe
Sources et le champ `sources` du manifeste. Méthode et pièges : `references/sourcing.md`.

## Testimonials — réels ou absents

Un verbatim inventé est le mensonge le plus coûteux d'un livre blanc : il engage la parole d'un tiers
identifiable. Sources acceptables, dans l'ordre :

1. `bdzListReviews` / `bdzSearchReviews` — avis clients du projet ;
2. verbatims présents dans le contexte API ou les fichiers projet ;
3. verbatims fournis par l'opérateur au cadrage.

**Pas de testimonial réel = pas de bloc testimonial.** Ni paraphrase « inspirée d'un avis », ni verbatim
anonymisé reconstruit. Le design n'inventera pas ce bloc si le manifeste ne le contient pas.

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
- ❌ Choisir la thématique ou l'angle (R2) — ils viennent du cadrage.
- ❌ Écrire l'executive summary avant le corps.
- ❌ Un chapitre « bouche-trou » sans idée directrice, ajouté pour atteindre une pagination.
- ❌ Livrer un chapitre 100 % prose, sans aucun bloc de variation.
- ❌ Livrer `contenu.md` sans `manifeste-contenu.json` (ou l'inverse).
- ❌ Laisser un « [à compléter] » sans le remonter explicitement à l'orchestrateur.
- ❌ Basculer dans la plaquette commerciale (le ratio 90/10 se vérifie, chapitre par chapitre).

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = AI_METRIC_TYPE_SKILL_USED`,
`reference = lead-magnet-content`). Non bloquant si l'appel échoue.

## Références

- `references/structure-canonique.md` — les 6 sections en détail, avec gabarits et critères
- `references/blocs-types.md` — les 9 types de blocs, la syntaxe markdown, le schéma du manifeste
- `references/sourcing.md` — méthode de sourcing, format des sources, gestion des « [à compléter] »
