---
name: |-
  lead-magnet-assets
description: |-
  L'agent assets d'un lead magnet : LIT le contenu produit et en DÉDUIT le plan de visuels — illustrations,
  graphiques, schémas — puis les produit réellement (Bulldozer Studio pour les illustrations, skill
  `dataviz` pour les graphiques, SVG inline stylé aux tokens pour les schémas) et les rapatrie dans
  assets/. Les visuels sont commandés par le fond, jamais plaqués pour décorer : un paragraphe qui
  énumère des chiffres appelle un graphique, un process en 3+ étapes appelle un schéma, une ouverture de
  chapitre appelle une illustration.
  Skill atomique de la suite lead-magnet, invoquée par l'orchestrateur `lead-magnet` à l'étape ❹, entre
  la rédaction et la mise en forme.
when-to-use: |-
  Use this skill when the `lead-magnet` master has a finished draft plus its content manifest and needs
  the visual assets planned and produced before layout. Not for ad creatives (`abm-linkedin-creas`,
  `bulldozer:ad-creative`), not for landing page imagery (no dedicated skill for this exists in the OS
  yet — see ANALYSE.md), not for laying out the document (`lead-magnet-design`).
user-invocable: false
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill
  - mcp__plugin_bulldozer_bulldozer__bdzCreateStudioJob
  - mcp__plugin_bulldozer_bulldozer__bdzGetStudioJob
  - mcp__plugin_bulldozer_bulldozer__bdzGetStudioJobParams
  - mcp__plugin_bulldozer_bulldozer__bdzListStudioJobs
  - mcp__plugin_bulldozer_bulldozer__bdzListProjectFiles
  - mcp__plugin_bulldozer_bulldozer__bdzGetCustomerSubscription
  - mcp__plugin_bulldozer_bulldozer__bdzCreateMetric
effort: |-
  high
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

- Le **registre visuel est arbitré au cadrage**, et arrive dans `cadrage.md` (champ *Registre visuel*,
  voir Entrées) : couverture visuelle, couverture visuelle + ambiance, ou typographique assumé. Cette
  skill **exécute** l'arbitrage, elle ne le prend pas.
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
- `cadrage.md` — le brief produit par l'orchestrateur `lead-magnet` à l'étape de cadrage ; le champ qui
  compte ici est **Registre visuel (R8)**, qui décide si la couverture est obligatoire et si des
  bandeaux d'ambiance sont autorisés dans le corps. Sans ce champ, se comporter comme si le registre
  était le défaut : couverture visuelle, graphiques seuls dans le corps.
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

**Seuil du graphique : en dessous de trois valeurs comparables, ce n'est pas un graphique.** Une
donnée à deux points (avant/après, avec/sans) se dit en une phrase avec le chiffre en gras — un
graphique à deux barres n'ajoute rien qu'une puce ne dise aussi bien, et coûte une commande, un rendu,
une place en page. Réserver le graphique aux comparaisons qu'une phrase ne peut pas porter : une
tendance sur plusieurs points, une répartition à plusieurs parts.

**L'excès inverse existe aussi.** Une commande à chaque sous-titre consécutif est souvent un réflexe
de remplissage, pas une fonction : si deux intentions voisines se recoupent presque mot pour mot,
l'une des deux commandes est de trop — le plancher visuel (R8) protège contre le chapitre nu, pas
contre le chapitre qui illustre son propre sommaire.

Contrôle du plan avant production : chaque chapitre a au moins un visuel (ou une justification écrite de
son absence), et aucune commande n'existe sans intention.

## Étape 2 — Production

### Illustrations → `bulldozer:bulldozer-studio`

- `bdzCreateStudioJob` référence une image existante via son paramètre `inputs[]`
  (`referenceUrls` pour une URL publique déjà accessible, `fridgeIds` pour un fichier déjà déposé au
  fridge) — **jamais un placeholder `{{asset:…}}` dans le texte du prompt**, ce mécanisme n'existe pas
  dans l'outil réel. `inputs` est déclaré `string` dans le schéma de l'outil, pas tableau : sérialiser
  le tableau d'objets `{text, referenceUrls, fridgeIds}` en JSON texte avant l'appel, sinon l'appel
  échoue. Cette skill n'a pas d'outil de dépôt fridge dans son contrat : la réutilisation d'un
  asset déjà généré comme référence ne tient que tant que son lien de téléchargement reste valide — le
  contrat de l'outil documente un lien CDN, sans durée de validité annoncée (détail et
  repli : `references/studio-prompts.md`).
- **Toujours demander à l'opérateur s'il veut activer `useTov`** avant la première commande de la
  série — l'outil le demande lui-même explicitement (« Always ask the user if they want to use their
  tone of voice »), ce n'est pas un arbitrage à trancher seul. Une fois la réponse obtenue, l'appliquer
  à toute la série sans le retoucher : c'est ce qui donne la cohérence de ton entre les visuels.
  Détection d'un ton de voix non renseigné côté projet : `references/studio-prompts.md` (Paramètres).
- **Textless** : « no text, no letters, no numbers, no logos ». Les titres, chiffres et logos s'incrustent
  **en post** (HTML/CSS au moment du design). Les rendus IA déforment le texte et falsifient les logos.
- Polling `bdzGetStudioJob` jusqu'à `completed`, `failed` **ou** `canceled` — pas seulement
  `completed` : un job qui a échoué ne redeviendra jamais `completed` tout seul. Tant que
  `status = in_progress`, `startedAt` reste `null` si le job est seulement en file (`updatedAt`
  figé plusieurs minutes pendant l'attente : c'est normal, pas une panne — ne pas l'interpréter
  comme un job bloqué). Un job qui bloque vraiment pour de bon est basculé en `failed` par un
  balayage serveur sous 30 minutes, avec une erreur qui dit s'il n'a jamais démarré ou jamais
  fini. Dès `completed` : **téléchargement immédiat** dans `assets/` — l'outil documente un lien
  CDN de téléchargement, sans durée de validité annoncée : ne jamais compter sur sa persistance
  au-delà de la session en cours (voir `references/pannes-et-parades.md`).
- `429` à la création : la file de génération Studio est pleine, ce n'est pas une panne — réessayer
  après un court délai plutôt que d'escalader (voir `references/pannes-et-parades.md`).
- Un défaut **localisé** sur un rendu par ailleurs bon (texte parasite dans un coin, une main
  déformée) se corrige souvent moins cher par une retouche conversationnelle (`conversationId`,
  `gpt-image-2` uniquement — Gemini n'a pas de continuité) qu'en régénérant depuis zéro. Une seule
  tentative : une retouche ratée compte comme le premier des deux échecs consécutifs de
  `references/studio-prompts.md`, pas comme un essai gratuit.
- **Si l'état local est perdu avant d'avoir pu tout rapatrier** (reset de sandbox en cours de
  série — voir `references/pannes-et-parades.md`) : `bdzListStudioJobs` retrouve les jobs déjà
  soumis pour le projet, et `bdzGetStudioJobParams` le prompt et les références exactement
  envoyés pour chacun. C'est un repli côté OS, à préférer à une redemande de prompts à
  l'opérateur — mais pas une garantie : l'outil ne documente aucune durée de rétention de cet
  historique.

Recettes de prompts, négatifs, plafonds de référence et paramètres : `references/studio-prompts.md`.

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

### Alignement, calibrage, et le piège du `fill`

Trois défauts fréquents sur un SVG produit pour ce document — encre qui ne tombe pas bord à bord
sur la colonne de texte, hauteur augmentée pour rien (seule la largeur pilote l'échelle du texte),
et une couleur de texte SVG posée du mauvais côté de la cascade — **qui s'inverse selon le mode
d'intégration** (SVG inliné ou chargé via `<img>`). Règles et parades par mode :
`references/svg-alignement.md` — à lire avant de produire ou de corriger un graphique ou un schéma.
`check_alignements.py` vérifie l'alignement et le `fill`.

## Étape 3 — Cohérence de série

Toutes les illustrations partagent **une seule direction artistique** : même prompt de style de base
(médium, palette, lumière, niveau d'abstraction, cadrage), même `useTov`. Un document avec 5 styles
d'images différents est un échec — il donne l'impression d'un assemblage, pas d'un livrable.

Le prompt de style de base est écrit une fois, consigné dans `plan-assets.json`, et réutilisé tel quel
pour chaque illustration, seul le sujet changeant.

**`useTov` a un second usage, à l'opposé de la cohérence : l'exploration.** Tant que le style de base
n'est pas arrêté — plusieurs pistes concurrentes à comparer avant de choisir la direction de la
série — le désactiver délibérément : un ton de marque imposé trop tôt réduit l'éventail que le modèle
propose. Ne l'activer, et le garder actif pour toute la série sans le retoucher, qu'une fois la piste
retenue.

## Étape 4 — Sortie

`plan-assets.json` complété des fichiers produits (`fichier` est un nom de fichier dans `assets/`,
jamais un chemin ni une URL) :

```json
{
  "style_base": "…le prompt de style commun à toute la série…",
  "use_tov": true,
  "commandes": [
    { "id": "a3", "emplacement": "ch2-b3", "type": "graphique", "sujet": "…", "donnees": ["s3"],
      "intention": "…", "statut": "produit", "fichier": "a3-depassements.svg" },
    { "id": "a5", "emplacement": "ch3-opener", "type": "illustration", "sujet": "…",
      "intention": "…", "statut": "échec", "raison": "job Studio failed ×2",
      "proposition": "retry | remplacement par un schéma | suppression" }
  ]
}
```

**Un échec ne se tait jamais.** Il se signale avec une proposition : relancer, remplacer par un autre
type d'asset, ou supprimer la commande (et alors dire ce que la page perd). Un visuel absent sans
mention produit une page trouée au moment du design, découverte trop tard.

**Des échecs sur plusieurs commandes indépendantes ne se traitent pas au cas par cas.** Un plan qui
échoue commande après commande, sur des sujets sans rapport, signale une cause commune (plugin non
autorisé, file de génération pleine) — vérifier cette cause une fois plutôt que de proposer une parade
différente à chaque ligne du plan.

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
- ❌ Appliquer la même parade de `fill` à un schéma inliné et à un graphique en `<img>` : les deux
  s'inversent (`references/svg-alignement.md`).
- ❌ Un graphique sur des données inventées ou « d'illustration ».
- ❌ Des styles d'illustration hétérogènes dans un même document.
- ❌ **Réutiliser une image déjà placée** pour combler un second bas de page : un doublon se voit
  immédiatement, surtout en clôture. Générer une image inédite (1 à 2 jetons) ou laisser le trou.
- ❌ Un placeholder `{{asset:uuid}}` (ou toute autre syntaxe inventée) dans le texte d'un prompt Studio —
  la référence passe par `inputs[].referenceUrls`/`fridgeIds`, jamais par le texte du prompt.
- ❌ Mettre un logo, du texte ou des chiffres dans un prompt de génération.
- ❌ Laisser un lien de téléchargement Studio dans un livrable ou dans `plan-assets.json` en guise de
  fichier — la validité de ce lien dans le temps n'est pas garantie par l'outil.
- ❌ Un échec de génération passé sous silence.

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = METRIC_TYPE_SKILL_USED`,
`reference = lead-magnet-assets`). Non bloquant si l'appel échoue.

## Références

- `references/plan-assets.md` — schéma complet du plan, règles de décision, contrôle avant production
- `references/studio-prompts.md` — recettes de prompts textless, style de base, négatifs, rapatriement
- `references/pannes-et-parades.md` — pannes déjà payées sur Studio, l'egress du sandbox et le rendu SVG,
  avec leur parade ; à lire avant la production et avant d'écrire qu'un asset a échoué.
- `references/svg-alignement.md` — alignement « encre bord à bord », calibrage par la largeur, le
  piège du `fill` écrasé ; à lire avant de produire ou de corriger un graphique ou un schéma.