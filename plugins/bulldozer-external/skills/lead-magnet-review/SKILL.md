---
name: lead-magnet-review
description: |
  L'éditeur en chef d'un lead magnet : relit le livrable assemblé en deux volets — le FOND (chaque donnée
  tracée vers sa source, cohérence avec le contexte OS, qualité éditoriale anti-slop, mécanique lead
  magnet) et la FORME (standard moderne, rythme page par page sur le PDF converti, murs de texte, trous
  blancs, monotonie d'échelle). Rend un rapport structuré : verdict global (bon à livrer / corrections
  mineures / corrections majeures) + corrections de fond pour `lead-magnet-content` + commandes design
  localisées et actionnables pour `lead-magnet-design`, chacune priorisée bloquant/mineur.
  Skill atomique de la suite lead-magnet, invoquée par l'orchestrateur `lead-magnet` à l'étape ❻.
  Elle ne corrige jamais elle-même : elle commande, les skills de production exécutent.
when-to-use: |
  Use this skill when the `lead-magnet` master has an assembled deliverable (HTML + converted PDF) and
  needs an independent editorial and layout review before delivery. Not for HTML landing pages
  (`verification-web`), not for code review, not for applying the fixes — the review commands, the
  production skills execute.
user-invocable: false
effort: high
allowed-tools:
  - Read
  - Write
  - Bash
  - Skill
  - WebFetch
  - mcp__bulldozer__bdzGetProjectToneOfVoice
  - mcp__bulldozer__bdzListProjectIcpProfiles
  - mcp__bulldozer__bdzCreateMetric
---

# Lead magnet — la relecture croisée

## Ce que fait cette skill

Elle joue le rôle qu'un éditeur en chef joue dans une rédaction : elle **ne réécrit pas**, elle dit ce
qui ne va pas, où exactement, et ce qu'il faut faire. La séparation est ce qui rend la boucle efficace —
une review qui corrige elle-même perd la trace de ce qui a changé, et personne ne peut arbitrer.

Elle travaille sur le **livrable assemblé** : le HTML, le **PDF converti**, le contenu, le manifeste et
le contexte OS.

## Entrées

- `lead-magnet.pdf` — le document tel qu'il sera lu (c'est lui qui fait foi, pas le HTML)
- `lead-magnet.html` — pour localiser les corrections
- `contenu.md` + `manifeste-contenu.json` — pour tracer les données et les blocs
- `cadrage.md` + `contexte-api.md` — pour juger la cohérence avec ce qui était demandé

## Volet FOND

**Exactitude (R3).** Chaque donnée du document est tracée vers sa source (API, web sourcé, opérateur).
Un chiffre sans source est **bloquant** — pas « à vérifier », bloquant. Contrôler aussi que la source dit
bien ce que le document lui fait dire (périmètre, date, unité).

**Cohérence avec le contexte OS.** Ton de voix respecté, positionnement tenu, ICP servi : **le document
parle-t-il vraiment au lecteur du cadrage ?** Un livre blanc écrit pour « les entreprises » alors que le
cadrage visait un directeur des opérations d'ETI industrielle est un document raté, même bien écrit.

**Qualité éditoriale.** Grille `anthropic-skills:anti-slop-writing` : remplissage, généralités,
répétitions d'un chapitre à l'autre, paragraphes qui n'apprennent rien. Et la question qui tranche :
**la promesse du titre est-elle tenue ?**

**Mécanique lead magnet.** L'executive summary donne-t-il envie de lire la suite ? Le CTA final est-il
aligné sur l'objectif business du cadrage, unique, et relié à ce que le lecteur vient de lire ?

Grille détaillée et seuils : `references/grille-review.md`.

## Volet FORME

**Contrôle du standard moderne** (les 13 points de `lead-magnet-design`) : couverture, ouvertures de
chapitre, respiration, sauts de page, orphelins et veuves, cohérence des tokens.

**Contrôle du rythme, page par page, sur le PDF converti** — trois chasses :

| Défaut | Seuil | Devient |
| ------ | ----- | ------- |
| **Mur de texte** | > 4 paragraphes de prose consécutifs sans rupture | commande design |
| **Trou blanc** | page remplie à < ~2/3 (hors couverture, ouvertures de chapitre, page CTA) | commande design |
| **Monotonie d'échelle** | double page sans aucun contraste de taille (rapport max/min < 2) | commande design |

Le script `scripts/check_rythme.py` automatise le repérage :

```bash
python3 scripts/check_rythme.py lead-magnet.pdf --min-fill 0.66 --max-prose-run 4 --json
```

Il produit, par page, le taux de remplissage, les suites de prose, le contraste d'échelle, et une liste
de défauts déjà formatée en commandes design. **Il ne remplace pas l'œil** : la lecture visuelle du PDF
reste obligatoire (un titre orphelin, une image coupée, un logo avalé par son fond ne se mesurent pas).

**Contrôle des alignements et des pièges de moteur** — `scripts/check_alignements.py`, sur les
**sources** (HTML + SVG), avant même la conversion :

```bash
python3 scripts/check_alignements.py .          # dossier de mission
python3 scripts/check_alignements.py --json     # sortie exploitable en commandes design
```

Il attrape en quelques millisecondes ce qui ne se voit sinon qu'à l'œil sur un PDF rasterisé : figure
qui ne tombe pas sur la colonne, libellé de graphique rogné, couleur de texte SVG écrasée par une
classe, plage de police variable qui supprime tout le gras, U+202F invisible, couleur hors tokens,
propriété ignorée par WeasyPrint.

**Le contrôle visuel avec repères de colonne est obligatoire** sur chaque page portant une figure :
rasteriser la page et superposer deux filets verticaux aux bords de la colonne (à 150 dpi sur A4 :
106 px et 1134 px). Un décalage de 3 mm ne se voit pas autrement — et se voit une fois imprimé.

## Sortie — le rapport de review

Un fichier `review-N.md` contenant :

1. **Verdict global** : `bon à livrer` · `corrections mineures` · `corrections majeures`.
2. **Corrections de fond** (destinées à `lead-magnet-content`), chacune priorisée `bloquant` / `mineur`.
3. **Commandes design** (destinées à `lead-magnet-design`), chacune localisée et actionnable.

Format des commandes design — le contrat avec la skill design :

```json
{ "page": 8, "section": "ch2", "probleme": "hiérarchie H2/H3 illisible",
  "correction": "renforcer le contraste de corps entre H2 et H3", "priorite": "bloquant" }
```

Exemples de bonnes commandes :

- « p.8 : hiérarchie H2/H3 illisible → renforcer le contraste de corps » ;
- « chap. 2 : titre de tableau resté seul en bas de p.7 → remplacer la `<caption>` par un `.tbl-title` dans un `.tbl` » ;
- « p.12 : 6 paragraphes de prose consécutifs → promouvoir le chiffre du 3ᵉ paragraphe en carte KPI » ;
- « p.15 : page remplie à 41 % → remonter le premier bloc de la p.16 et agrandir la figure ».

Ce qu'une commande n'est jamais : « améliorer le design », « rendre la page plus dynamique », « revoir la
mise en page du chapitre 2 ». Une commande sans localisation ni correction attendue est ininterprétable —
elle produit un aller-retour de plus, exactement ce que la boucle bornée à 2 itérations veut éviter.

Modèle complet du rapport et catalogue de commandes : `references/format-commandes.md`.

## Règles de jugement

- **Verdict `bon à livrer`** : aucun bloquant, et les mineurs restants n'entament ni la crédibilité ni la
  lisibilité.
- **`corrections mineures`** : pas de bloquant, mais des points de forme à reprendre.
- **`corrections majeures`** : au moins un bloquant — donnée non sourcée, promesse du titre non tenue,
  CTA absent ou désaligné, document illisible sur plusieurs pages.
- **La borne de 2 vaut pour les passes autonomes.** Une remarque de l'opérateur après livraison
  rouvre une passe : c'est une nouvelle entrée, pas une itération. Voir `references/format-commandes.md`.
- **Ne jamais valider un document contenant une donnée non sourcée**, même si tout le reste est bon.
  C'est la seule règle sans exception de cette skill.
- Rester dans le périmètre : signaler ce qui ne va pas, pas refaire les choix éditoriaux validés au
  cadrage. Un désaccord sur l'angle se dit une fois, en remarque, pas en commande.

## Interdits

- ❌ Corriger directement le document (contenu ou HTML).
- ❌ Émettre une commande vague (« améliorer le design », « plus moderne »).
- ❌ Valider un document contenant une donnée non sourcée.
- ❌ Juger la forme sur le HTML au lieu du PDF converti.
- ❌ Valider les alignements à l'œil nu, sans repères de colonne superposés.
- ❌ Valider un rendu SVG depuis un navigateur : Chrome et WeasyPrint ne traitent pas la cascade SVG
  de la même façon, une couleur juste à l'écran peut être fausse dans le PDF.
- ❌ Rouvrir des choix tranchés au cadrage (thématique, angle, longueur).
- ❌ Rendre un rapport sans verdict global explicite.

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = AI_METRIC_TYPE_SKILL_USED`,
`reference = lead-magnet-review`). Non bloquant si l'appel échoue.

## Références

- `references/grille-review.md` — les deux volets en checklists, avec les seuils et ce qui est bloquant
- `references/format-commandes.md` — modèle de rapport, format des commandes, exemples bons/mauvais
- `scripts/check_rythme.py` — contrôle automatique du rythme sur le PDF (remplissage, murs de texte,
  contraste d'échelle) → commandes design pré-formatées
- `scripts/check_alignements.py` — contrôle statique des alignements et des pièges de moteur sur les
  sources (colonne, encre bord à bord, libellés rognés, `fill` écrasé, polices variables, U+202F,
  couleurs hors tokens). `--selftest` intégré
