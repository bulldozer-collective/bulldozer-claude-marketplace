---
name: lead-magnet-assets
description: |
  L'agent assets d'un lead magnet : LIT le contenu produit et en DÉDUIT le plan de visuels — illustrations,
  graphiques, schémas — puis les produit réellement (Bulldozer Studio pour les illustrations, skill
  `dataviz` pour les graphiques, SVG inline stylé aux tokens pour les schémas) et les rapatrie dans
  assets/. Les visuels sont commandés par le fond, jamais plaqués pour décorer : un paragraphe qui
  énumère des chiffres appelle un graphique, un process en 3+ étapes appelle un schéma, une ouverture de
  chapitre appelle une illustration.
  Skill atomique de la suite lead-magnet, invoquée par l'orchestrateur `lead-magnet` à l'étape ❹, entre
  la rédaction et la mise en forme.
when-to-use: |
  Use this skill when the `lead-magnet` master has a finished draft plus its content manifest and needs
  the visual assets planned and produced before layout. Not for ad creatives (`abm-linkedin-creas`,
  `bulldozer:ad-creative`), not for landing page imagery (`cible-creas`), not for laying out the document
  (`lead-magnet-design`).
user-invocable: false
effort: high
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill
  - mcp__bulldozer__bdzCreateStudioJob
  - mcp__bulldozer__bdzGetStudioJob
  - mcp__bulldozer__bdzGetStudioJobParams
  - mcp__bulldozer__bdzListStudioJobs
  - mcp__bulldozer__bdzListProjectFiles
  - mcp__bulldozer__bdzGetCustomerSubscription
  - mcp__bulldozer__bdzCreateMetric
---

# Lead magnet — les assets

## Ce que fait cette skill

Elle lit le document déjà écrit et décide **ce qui mérite un visuel, et lequel**. C'est l'inverse de la
démarche habituelle : on ne choisit pas des images pour « habiller » un texte, on identifie les endroits
où une image fait comprendre plus vite qu'un paragraphe.

Deux garde-fous permanents : **un chapitre sans aucun visuel est suspect** (souvent le signe qu'on n'a
rien identifié de concret dedans), et **un visuel sans fonction est interdit** (il vole de l'espace au
contenu et fait « slide de consultant »).

## Le plancher visuel (R8) — à lire avant d'appliquer le garde-fou ci-dessus

« Aucun visuel sans fonction » interdit **l'image décorative posée au milieu d'une démonstration**.
Ce n'est pas une autorisation à livrer un document sans aucune image.

- Le **registre visuel est arbitré au cadrage** (`lead-magnet/references/cadrage.md`) : couverture
  visuelle, couverture visuelle + ambiance, ou typographique assumé. Cette skill **exécute** l'arbitrage,
  elle ne le prend pas.
- Si le cadrage dit « couverture visuelle » : la commande de couverture est **obligatoire**, et son
  échec est un défaut d'étape, pas un choix éditorial.
- **Installer un registre est une fonction.** Sur un sujet grand public — santé, animal, famille,
  argent du quotidien — une photographie de couverture fait comprendre à qui le document s'adresse
  avant la première ligne. C'est mesurable au partage, pas au nombre de données par page.
- Une image d'ambiance dans le corps se justifie à une **respiration éditoriale** : fin de chapitre
  lourd, avant le CTA. Une par respiration, jamais deux, et jamais au milieu d'un raisonnement chiffré.
- **Un bas de page sous-rempli est une commande d'image légitime** (point 12 du standard). Quand la
  review signale une page sous le seuil et que les leviers de recomposition sont épuisés, un bandeau
  de respiration y répond mieux qu'un étirement de marges — qui est interdit. Deux conditions : une
  légende qui relie l'image au propos de la page, et un placement à une rupture de mouvement.
  Mesuré sur une production : deux bandeaux posés dans deux bas de page ont fait passer un document
  de 6 à 2 pages sous le seuil, sans toucher au texte.

> Faute déjà commise : 23 pages sur le coût de la santé des chiens et des chats, zéro animal, au motif
> qu'aucune image ne « portait de donnée ». Les graphiques étaient bons, le document ne ressemblait pas
> à son sujet.

## Entrées

- `contenu.md` — le draft en blocs typés
- `manifeste-contenu.json` — sections, blocs, données, sources, `assets_suggeres[]`
- `brandbook-[client].md` s'il existe déjà (tokens + logo), sinon les tokens seront ceux fournis par
  `lead-magnet-design`

## Étape 1 — Le plan d'assets

Parcourir le draft **et** le manifeste, puis produire une liste de commandes. Chaque commande :

```json
{
  "id": "a3",
  "emplacement": "ch2-b3",
  "type": "graphique",
  "sujet": "Répartition des dépassements de budget par phase de projet",
  "donnees": ["s3", "s7"],
  "intention": "montrer que le pic est post-bascule, pas à la migration",
  "statut": "à produire"
}
```

### Règle de choix

| Ce que dit le contenu | Type d'asset |
| --------------------- | ------------ |
| Un paragraphe qui énumère des chiffres, un bloc `table` de données, plusieurs `kpi` comparables | **graphique** |
| Un process en 3+ étapes, un framework, une architecture, un bloc `steps` | **schéma** |
| Une ouverture de chapitre, un concept abstrait, une ambiance à installer | **illustration** |

Le champ **`intention`** est ce qui distingue un plan d'assets d'une liste d'images : il dit ce que le
lecteur doit comprendre en regardant. Une commande dont on ne sait pas écrire l'intention est une
commande à supprimer.

Contrôle du plan avant production : chaque chapitre a au moins un visuel (ou une justification écrite de
son absence), et aucune commande n'existe sans intention.

## Étape 2 — Production

### Illustrations → `bulldozer:bulldozer-studio`

- `bdzCreateStudioJob`, assets importés référencés par `{{asset:uuid}}` — **jamais une image référencée
  par URL dans un prompt** (import obligatoire).
- **`useTov` demandé/confirmé une fois**, puis appliqué à toute la série : c'est ce qui donne la
  cohérence de ton entre les visuels.
- **Textless** : « no text, no letters, no numbers, no logos ». Les titres, chiffres et logos s'incrustent
  **en post** (HTML/CSS au moment du design). Les rendus IA déforment le texte et falsifient les logos.
- Polling `bdzGetStudioJob` jusqu'à `completed`, puis **téléchargement immédiat** dans `assets/` — les
  URLs S3 sont présignées ~1 h (voir `lead-magnet/references/pannes-et-parades.md`).

Recettes de prompts, négatifs et paramètres : `references/studio-prompts.md`.

### Graphiques → skill `dataviz`

- Palette **dérivée des 7 tokens client**, jamais les couleurs par défaut d'une librairie.
- **Uniquement des données réelles du manifeste (R3)** : chaque série pointe vers un `id` de source.
  **Pas de donnée = pas de graphique** — ni valeurs d'illustration, ni courbe « pour l'idée ».
- Sortie en SVG de préférence (net à l'impression, léger), avec la source affichée sous le graphique.

### Schémas → SVG inline stylé aux tokens

- Écrits à la main, aux tokens (`--accent`, `--texte`, `--radius`), typographie du document.
- Pas de génération IA pour un schéma : la précision d'un process ne se délègue pas à un modèle
  d'image, et le résultat n'est pas éditable.
- Texte du schéma en `<text>` réel (sélectionnable, net, corrigeable), jamais rastérisé.

### La règle d'alignement des SVG — « encre bord à bord »

Un graphique qui ne tombe pas sur la colonne de texte se voit immédiatement, et c'est le défaut de
mise en page le plus fréquent d'un document paginé.

```
viewBox="0 0 W H"  ·  l'élément visible le plus à GAUCHE commence à x ≈ 0
                   ·  l'élément visible le plus à DROITE finit à x ≈ W
```

En pratique :

- **Libellés d'axe** : calés à droite (`text-anchor="end"`) sur la largeur de leur colonne, de sorte
  que leur encre démarre à x ≈ 0. Jamais un `x` de départ arbitraire.
- **Barres, socles, bandeaux** : `x="0"`, et largeur qui va jusqu'à `W` pour l'élément le plus large.
- **Étiquettes de fin de série** : `text-anchor="end"` à `x="W"`.
- **Dimensionner les colonnes de libellés sur le libellé le plus long**, pas sur le plus court : un
  libellé qui dépasse la viewBox est **rogné à la conversion**, sans avertissement.
- La figure est ensuite posée **dans la colonne de texte**. Elle ne sort en pleine largeur que si le
  SVG compense exactement la marge négative — sinon plus rien n'est aligné.
- Corollaire : **aucun SVG ne porte de titre, de sous-titre ni de note de source.** Ils vivent dans le
  HTML (`.fig-title` + `<figcaption>`), à l'échelle typographique du document. Un titre dans le SVG
  échappe à la charte et double presque toujours la légende.

### Calibrage : la hauteur d'un SVG n'agrandit pas son texte

Erreur intuitive qui coûte une itération. Un SVG posé dans la colonne occupe **100 % de la largeur**
disponible : son facteur d'échelle est donc piloté par la largeur, pas par la hauteur. Augmenter `H`
n'aère que le tracé — **aucun libellé ne grossit**.

Pour agrandir le texte d'un graphique, il faut augmenter les `font-size` **dans** le SVG, ou réduire
`W`. Mesuré : a1 de 252 à 296, a2 de 222 à 258, a5 de 146 à 172 n'a rien gagné en lisibilité et a
coûté un trou blanc de plus.

### Le piège du `fill` écrasé

Dans un SVG, une règle CSS d'un bloc `<style>` (`.t { fill: … }`) **l'emporte sur l'attribut de
présentation** `fill="…"` d'un `<text>`. C'est la cascade normale, mais l'effet surprend : toutes les
couleurs de texte posées par attribut sont silencieusement remplacées par celle de la classe.

Certains moteurs de rendu de navigateur masquent le défaut ; WeasyPrint applique la cascade. Le
contrôle visuel dans un navigateur ne suffit donc pas.

→ **Poser les couleurs de texte en `style="fill:…"` inline**, qui gagne contre la classe dans tous les
moteurs. `check_alignements.py` le vérifie.

## Étape 3 — Cohérence de série

Toutes les illustrations partagent **une seule direction artistique** : même prompt de style de base
(médium, palette, lumière, niveau d'abstraction, cadrage), même `useTov`. Un document avec 5 styles
d'images différents est un échec — il donne l'impression d'un assemblage, pas d'un livrable.

Le prompt de style de base est écrit une fois, consigné dans `plan-assets.json`, et réutilisé tel quel
pour chaque illustration, seul le sujet changeant.

## Étape 4 — Sortie

`plan-assets.json` complété des fichiers produits :

```json
{
  "style_base": "…le prompt de style commun à toute la série…",
  "use_tov": true,
  "commandes": [
    { "id": "a3", "emplacement": "ch2-b3", "type": "graphique", "sujet": "…", "donnees": ["s3"],
      "intention": "…", "statut": "produit", "fichier": "assets/a3-depassements.svg" },
    { "id": "a5", "emplacement": "ch3-opener", "type": "illustration", "sujet": "…",
      "intention": "…", "statut": "échec", "raison": "job Studio failed ×2",
      "proposition": "retry | remplacement par un schéma | suppression" }
  ]
}
```

**Un échec ne se tait jamais.** Il se signale avec une proposition : relancer, remplacer par un autre
type d'asset, ou supprimer la commande (et alors dire ce que la page perd). Un visuel absent sans
mention produit une page trouée au moment du design, découverte trop tard.

## Repli quand Studio n'est pas disponible

Plugin non autorisé, projet sans accès Studio, egress bloqué : le dire, puis proposer —
(a) autoriser le plugin, (b) l'opérateur fournit ses propres visuels, (c) basculer la commande en
**schéma SVG ou data-viz** on-brand, réalisables sans Studio. Jamais de stock cliché ni d'image générique
posée en silence.

Si les fichiers sont générés mais non rapatriables (egress), produire une **galerie de récupération**
HTML avec des liens `<a download>`, et câbler `assets/` en fallback.

## Interdits

- ❌ Un visuel décoratif, sans fonction ni intention.
- ❌ **Décider seul de ne produire aucune image** (R8) : le registre vient du cadrage.
- ❌ Un SVG dont l'encre ne va pas de x=0 à x=W, ou dont un libellé dépasse la viewBox.
- ❌ Un titre ou une note de source écrits dans le SVG au lieu du `<figcaption>`.
- ❌ Une couleur de texte SVG posée par attribut `fill=` alors qu'une classe définit un `fill`.
- ❌ Un graphique sur des données inventées ou « d'illustration ».
- ❌ Des styles d'illustration hétérogènes dans un même document.
- ❌ **Réutiliser une image déjà placée** pour combler un second bas de page : un doublon se voit
  immédiatement, surtout en clôture. Générer une image inédite (1 à 2 jetons) ou laisser le trou.
- ❌ Référencer une image par URL dans un prompt Studio (import obligatoire).
- ❌ Mettre un logo, du texte ou des chiffres dans un prompt de génération.
- ❌ Laisser une URL S3 présignée dans un livrable ou dans `plan-assets.json` en guise de fichier.
- ❌ Un échec de génération passé sous silence.

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = AI_METRIC_TYPE_SKILL_USED`,
`reference = lead-magnet-assets`). Non bloquant si l'appel échoue.

## Références

- `references/plan-assets.md` — schéma complet du plan, règles de décision, contrôle avant production
- `references/studio-prompts.md` — recettes de prompts textless, style de base, négatifs, rapatriement
