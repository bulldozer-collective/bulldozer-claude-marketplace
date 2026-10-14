---
name: |-
  lead-magnet
description: |-
  Produit un LEAD MAGNET (livre blanc) client-ready de bout en bout pour un client Bulldozer OS — le fond
  ET la forme — livré en PDF + HTML source, aux couleurs réelles du client, sans aucune donnée inventée.
  Orchestre la chaîne complète : contexte projet via l'API OS → cadrage validé par l'humain → rédaction
  (lead-magnet-content) → visuels (lead-magnet-assets) → mise en forme (lead-magnet-design) → relecture
  croisée (lead-magnet-review) → livraison.
  Déclencher dès que l'utilisateur dit : "fais un lead magnet pour [client]", "un livre blanc sur [sujet]",
  "produis un guide/ebook à télécharger", "il nous faut un contenu à mettre derrière un formulaire",
  "un aimant à leads pour [client]", "un PDF de fond pour la campagne de [client]" — même s'il ne dit ni
  "lead magnet" ni "livre blanc" mais décrit un document long, téléchargeable, qui capte des contacts.
  Déclencher AUSSI quand il demande seulement "un livre blanc" sans préciser la chaîne : c'est cette skill
  qui orchestre, pas une rédaction improvisée.
  Fonctionne MÊME SI le client n'est pas dans le Bulldozer OS : la skill demande alors de quel client il
  s'agit, fait valider l'URL de son site officiel, et reconstruit le contexte depuis ce site (mode
  hors-base) — la production continue à l'identique.
when-to-use: |-
  Use this skill whenever the user wants a downloadable long-form marketing asset (white paper, guide,
  ebook, lead magnet) produced for a Bulldozer OS customer — content and design, ending in a PDF.
  Do NOT use for: ABM 1-to-1 co-branded white papers built from a target account's news (no dedicated
  skill exists yet — closest today is `account-based-marketing`, which does not cover the co-branded/
  newsjacking series mechanic), landing pages (no dedicated skill in scope today), slide decks
  (`slides-deck`), or a raw PDF export of an existing document (`pdf-report`).
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill
  - WebSearch
  - WebFetch
  - mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships
  - mcp__plugin_bulldozer_bulldozer__bdzGetProject
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectToneOfVoice
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectValueProposition
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectMarketPositioning
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectMarketPerception
  - mcp__plugin_bulldozer_bulldozer__bdzListProjectIcpProfiles
  - mcp__plugin_bulldozer_bulldozer__bdzGetProjectObjectives
  - mcp__plugin_bulldozer_bulldozer__bdzGetCompetitors
  - mcp__plugin_bulldozer_bulldozer__bdzListProjectFiles
  - mcp__plugin_bulldozer_bulldozer__bdzListReviews
  - mcp__plugin_bulldozer_bulldozer__bdzSearchReviews
  - mcp__plugin_bulldozer_bulldozer__bdzCreateMetric
effort: |-
  high
---

# Lead Magnet — orchestrateur

## L'objectif, en une phrase

> **Sortir un livre blanc qu'on peut envoyer au client sans le retoucher** — fond solide, design aux
> couleurs réelles du client, zéro chiffre inventé, en PDF + HTML source.

Cette skill n'écrit pas le document elle-même. Elle **enchaîne quatre skills atomiques** et tient les
deux seuls points où l'humain tranche : le **cadrage** et la **livraison**.

## Ce que cette skill n'est PAS

Le voisinage est peuplé — se tromper de skill coûte une production entière :

| Si la demande est… | Ce n'est pas ici, c'est… |
| ------------------ | ------------------------ |
| Un livre blanc **cobrandé** émetteur × compte cible, tiré de l'**actu** d'un compte nommé, en série (6 docs) | pas de skill dédié aujourd'hui — le plus proche est `account-based-marketing`, qui ne couvre pas la mécanique newsjacking/série |
| Une **landing page** de rapprochement 1-to-1 | pas de skill dédié dans le périmètre actuel |
| Une **présentation** client (slides) | `slides-deck` |
| Un **export PDF** d'un document déjà écrit | `pdf-report` |
| Des **créas publicitaires** | `ad-creative` |

Ici : **UN** lead magnet, thématique **donnée par l'opérateur**, contexte tiré du **Bulldozer OS**,
destiné à capter des leads pour ce client. **Monomarque par défaut** — et co-brandé avec un partenaire
si l'opérateur le demande et que l'accord est acté (voir `references/co-branding.md`).

## Vocabulaire

Les termes clés (client, opérateur, cadrage, manifeste de contenu) sont définis dans `references/fautes-et-vocabulaire.md`.

## Les 9 règles opposables (valables pour toute la suite)

Ces règles ne sont pas des intentions : chaque étape se vérifie contre elles, et un manquement bloque.

**R1 — Le contexte client vient du Bulldozer OS en priorité, d'un cadrage humain à défaut.**
On cherche **toujours** le projet dans l'OS d'abord (`bulldozer-project-chooser`, puis
recherche par nom). Deux issues, deux modes :

- **Mode OS** (nominal) — le projet existe : `(customerId, projectId)` résolus, contexte tiré de l'API.
  Quand le projet existe, ce mode n'est pas optionnel : on ne se rabat pas sur le site par confort.
- **Mode hors-base** (repli légitime) — le client n'est pas dans l'OS : on demande **de quel client il
  s'agit**, on fait **valider l'URL de son site officiel par l'opérateur**, et on reconstruit le contexte
  depuis ce site. La chaîne continue ensuite à l'identique, avec les mêmes skills.

Ce qu'on ne fait jamais, dans les deux modes : deviner le client depuis un nom de dossier ou une
conversation précédente, et retenir un site sans confirmation humaine. Un lead magnet produit à la
charte d'une homonyme est irrattrapable — l'URL se fait valider, elle ne se déduit pas.

**R2 — La thématique vient de l'HUMAIN, jamais de la skill.** L'opérateur donne le sujet, l'angle et la
cible. La skill exécute un cadrage donné, elle ne l'invente pas. Elle **peut** proposer des titres, des
angles ou des structures **quand l'opérateur le demande ou hésite explicitement** — c'est une aide à la
décision, jamais une auto-attribution du sujet. Thématique absente à l'invocation → poser LA question et
attendre. Déduire un sujet du contexte API et démarrer dessus est la faute la plus grave de cette suite :
elle produit 20 pages parfaitement exécutées sur le mauvais sujet.

**R3 — Aucune donnée inventée.** Chaque chiffre, citation, exemple client vient du contexte API, d'une
recherche sourcée, ou de l'opérateur. Une donnée introuvable devient une question posée ou une section
signalée « à compléter » — jamais un chiffre plausible. Les sources sont citées en annexe.

**R4 — Réutiliser les briques OS existantes, ne rien réécrire.** Voir la table « Briques réutilisées »
plus bas. Toute réimplémentation d'une brique existante est un défaut de production.

**R5 — Logging.** Chaque skill de la suite loggue son invocation via `bdzCreateMetric`
(`type = METRIC_TYPE_SKILL_USED`, `reference = <nom de la skill>`). Non bloquant si l'appel échoue.

**R6 — Deux points de passage humains, exactement : cadrage et livraison.** Entre les deux, la chaîne
tourne en autonome (boucle review bornée). Pas de micro-validations intermédiaires qui cassent le flow,
pas de livraison sans passage humain final.

**R7 — Ton de voix et langue du client.** Tout le contenu respecte `bdzGetProjectToneOfVoice` et la langue
du client. Langue ambiguë → la demander au cadrage.

**R8 — Le document porte des visuels, et au minimum une couverture visuelle.** Un lead magnet est un
objet qu'on télécharge et qu'on montre : un document 100 % texte-et-graphiques ne se partage pas.

- **Plancher non négociable** : la couverture porte une image (photographie ou illustration) ou, à
  défaut assumé, un traitement typographique fort **arbitré par l'opérateur au cadrage** — pas décidé
  en silence par la chaîne.
- **La règle « aucun visuel sans fonction » s'applique aux figures, pas au registre.** Elle sert à
  interdire l'image décorative au milieu d'une démonstration chiffrée. Elle n'autorise pas à conclure
  qu'un document n'a besoin d'aucune image : sur un sujet grand public — santé, animal, famille,
  argent du quotidien — l'absence totale de présence humaine ou animale est un **défaut de registre**,
  pas une rigueur.
- **Le registre visuel se décide au cadrage** (question dédiée, voir `references/cadrage.md`), jamais
  après coup. Un document B2C sans image et un document d'analyse B2B sans image ne sont pas la même
  décision.
- Un document livré sans aucune image doit porter cette absence **en clair au rapport de complétude**,
  avec la commande prête à relancer.

> Faute déjà commise sur R8 (23 pages sans un seul animal) : récit complet dans `references/fautes-et-vocabulaire.md`.

**R9 — La DA vient du site de production, pas d'une charte interne.** Brandbook, `CLAUDE.md`, skill
« charte maison » : ces documents sont écrits une fois et ne suivent pas les refontes. On extrait les
7 tokens du **site en ligne d'abord**, on compare ensuite avec la source interne, et **le site gagne**
en cas de divergence — qui se consigne et se remonte à l'opérateur. Cette règle vaut aussi, et surtout,
quand on croit connaître la marque : y compris pour **Bulldozer** sur un document co-brandé. Cette
extraction a lieu **à ❶**, avant la moindre commande de visuel — un visuel produit sans la charte
réelle du client ne se corrige pas en le repeignant après coup, il se refait.

> Faute déjà commise sur R9 (charte interne contredisant le site réel) : récit complet dans `references/fautes-et-vocabulaire.md`. Protocole complet dans `references/charte-extraction.md`.

## Le flow

```
Opérateur : « fais un lead magnet pour [client] sur [thématique] »
  ↓
❶ project-chooser → contexte API complet
   └─ client absent de l'OS → mode hors-base : quel client ? → site validé par l'humain → contexte
❷ CADRAGE — VALIDATION HUMAINE n°1 (thématique/angle donnés par l'opérateur)
❸ lead-magnet-content   → draft en blocs typés + manifeste de contenu
❹ lead-magnet-assets    → plan d'assets + visuels réellement produits
❺ lead-magnet-design    → HTML aux couleurs client → PDF
❻ lead-magnet-review    → rapport → corrections (boucle ❸-❺, 2 itérations MAX)
❼ LIVRAISON — VALIDATION HUMAINE n°2 (PDF + HTML source)
```

Le détail exécutable de chaque étape, avec ses gates, est dans `references/workflow.md` — **le lire avant
de démarrer la chaîne**.

### ❶ Contexte client (R1)

Le détail des gestes (chercher le projet dans l'OS, mode OS avec l'ordre des appels API et le `targetProjectId`, mode hors-base en trois gestes, **extraction de la charte** (7 tokens + logo → `brandbook-[client].md`, voir R9), briques manquantes remontées au cadrage) est dans `references/etape-1-contexte-client.md` — **le lire avant de tirer le contexte**. Ce que chaque appel apporte et quoi faire quand il revient vide : `references/contexte-api.md`.

### ❷ Cadrage — validation humaine n°1 (R2, R6)

**Une seule salve de questions**, pas dix allers-retours. Ce qui se confirme : thématique et angle
(donnés par l'opérateur), ICP cible parmi les profils API, objectif business du magnet (le CTA final),
langue, longueur (défaut **8–16 pages**, ajustable — un document court qui répond à un problème précis
bat un document long sur un sujet flou, voir `references/cadrage.md`), contraintes éventuelles, et les
trous du contexte API relevés en ❶.

Proposer 3 titres candidats **seulement si l'opérateur le demande ou n'a pas de titre** — sinon prendre
le sien, tel quel. La salve type et le format du brief de cadrage : `references/cadrage.md`.

> **Si la thématique manque : poser la question et attendre.** Ne pas enchaîner « en attendant », ne pas
> pré-rédiger un plan sur un sujet supposé. Un cadrage vide n'est pas un cas dégradé, c'est un arrêt.

### ❸ → ❺ Production

| Étape | Skill déléguée | Entrée | Sortie attendue |
| ----- | -------------- | ------ | --------------- |
| ❸ Contenu | `lead-magnet-content` | brief de cadrage + contexte API | markdown en blocs typés + `manifeste-contenu.json` |
| ❹ Assets | `lead-magnet-assets` | draft + manifeste + `brandbook-[client].md` (déjà extrait à ❶) | plan d'assets complété des fichiers/SVG produits, à la palette réelle du client |
| ❺ Design | `lead-magnet-design` | draft + assets + `brandbook-[client].md` (appliqué, pas réextrait) | `lead-magnet.html` + `lead-magnet.pdf` |

Chaque étape rend la main avec ses livrables **réellement présents sur le disque**. Un livrable annoncé
mais absent est un échec d'étape, pas un détail : vérifier les fichiers avant d'enchaîner.

### ❻ Review — boucle bornée à 2 itérations

Déléguer à `lead-magnet-review`. Le rapport revient en deux listes : corrections de fond (→ `content`) et
commandes design (→ `design`). Appliquer, régénérer le PDF, refaire une passe de review.

> **Maximum 2 itérations, puis on sort** — même si le rapport n'est pas vierge. Ce qui reste ouvert part
> au rapport de livraison, à l'arbitrage de l'humain. Une boucle infinie de raffinage coûte plus cher
> qu'un point signalé à l'opérateur. Compter les itérations explicitement (`review #1`, `review #2`).

Sortie anticipée si le verdict est **« bon à livrer »** dès la première passe.

### ❼ Livraison — validation humaine n°2 (R6)

Livrer **les deux fichiers** : le PDF final ET le HTML source (le HTML est ce qui permet de corriger plus
tard sans tout refaire). Avec :

- un résumé d'une ligne de ce qu'est le document ;
- le **rapport de complétude** (modèle dans `references/workflow.md`) : ✅ produit · ⚠️ dégradé ·
  ❌ manquant · 🔓 en attente d'arbitrage ;
- **les hypothèses restées non vérifiées**, en tête de message et non en note de bas de page :
  une adresse email déduite, un chiffre à confirmer, une orthographe de nom incertaine. Ce sont les
  seuls défauts qui, passés en production, sont irrattrapables.

### Publication en URL (si demandée au cadrage, question 11)

Pour la procédure complète de publication (bouton de téléchargement, zip, `bulldozer-fridge`, `bdzCreateHosting`, vérification HTTP, consignation), les limites (**publier n'est pas capter** : un site statique ne capte aucun lead, voir `bdzAttachLeadListToCmsForm`) et l'avertissement que la page est PUBLIQUE, lire `references/publication-url.md` **avant toute publication**, et dire à l'opérateur que l'URL est publique et qu'elle ne capte rien par elle-même.

Puis logger la complétion (R5).

## Briques réutilisées (R4 — ne rien réécrire)

Pour la table complète des briques réutilisables (résolution projet, charte réelle, illustrations, graphiques, PDF, niveau rédactionnel, publication, co-branding, avis clients), lire `references/briques-reutilisees.md`.

> ⚠️ **Le ton de voix qui prime est celui du client** (`bdzGetProjectToneOfVoice`, R7), jamais une
> habitude éditoriale interne à Bulldozer — y compris sur un document de fond long.

## Interdits du master

- ❌ Sauter la recherche dans l'OS, ou passer en mode hors-base alors que le projet existe (R1).
- ❌ Retenir un site client sans validation explicite de l'opérateur, ou en déduire un d'un nom (R1).
- ❌ Démarrer sans thématique humaine, ou en déduire une du contexte API (R2).
- ❌ Dépasser 2 boucles de review **de sa propre initiative**. Une remarque de l'opérateur après
  livraison rouvre légitimement une passe (il est le point de passage humain) : écrire alors un
  `review-N.md` qui cite la remarque d'origine.
- ❌ Livrer sans les deux fichiers (PDF **et** HTML source).
- ❌ Présenter un livrable non relu comme final.
- ❌ Combler un trou de contexte par une valeur plausible plutôt que par une question (R3).
- ❌ Décider seul du registre visuel, ou livrer sans image sans que l'opérateur l'ait arbitré (R8).
- ❌ Multiplier les validations intermédiaires : deux points humains, pas trois (R6).
- ❌ Annoncer un fichier sans avoir vérifié qu'il existe et qu'il s'ouvre.
- ❌ Prendre une charte interne pour la DA du client sans l'avoir confrontée au site (R9).
- ❌ Passer en ❹ (assets) sans `brandbook-[client].md` déjà écrit — commander un visuel avant la charte
  produit une direction artistique à refaire, pas à corriger (R9).
- ❌ Publier une URL sans dire à l'opérateur qu'elle est publique, et ce qu'elle expose.
- ❌ Laisser croire qu'une URL de diffusion capte des leads : le hosting statique ne le fait jamais seul
  (voir ❼) — le dire avant de publier, pas après coup.
- ❌ Enterrer une hypothèse non vérifiée (email déduit, chiffre supposé) dans une note de bas de
  page : elle se dit en tête du message de livraison.

## Jamais de dégradation silencieuse

Quand une brique est indisponible (Studio non autorisé, egress bloqué, WeasyPrint absent, contexte API
vide), la règle est constante : **le dire, proposer le repli, le consigner au rapport de complétude**.
Un livrable dégradé assumé vaut mieux qu'un livrable qui a l'air complet et ment. Les pannes déjà vécues
et leurs parades : `references/pannes-et-parades.md` — **à lire avant la production d'assets et avant la
conversion PDF**.

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = METRIC_TYPE_SKILL_USED`, `reference = lead-magnet`).
À la livraison : un second appel avec `reference = lead-magnet:delivered`. Non bloquant si l'appel échoue.

## Références

- `references/workflow.md` — le flow détaillé, gate par gate, + le modèle de rapport de complétude
- `references/cadrage.md` — la salve de cadrage, les défauts, le format du brief de cadrage
- `references/contexte-api.md` — ce que chaque appel API apporte, et quoi faire quand il revient vide
- `references/pannes-et-parades.md` — pannes connues (Studio, hosting, egress, WeasyPrint, polices)
- `references/charte-extraction.md` — le protocole des 7 tokens + logo, R9 (le site de production
  gagne toujours sur une charte interne)
- `references/co-branding.md` — le partage de territoire entre deux marques sur un même document,
  quand un partenaire est co-signataire.