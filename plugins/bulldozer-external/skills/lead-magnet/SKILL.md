---
name: lead-magnet
description: |
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
when-to-use: |
  Use this skill whenever the user wants a downloadable long-form marketing asset (white paper, guide,
  ebook, lead magnet) produced for a Bulldozer OS customer — content and design, ending in a PDF.
  Do NOT use for: ABM 1-to-1 co-branded white papers built from a target account's news (that is
  `abm-newsjacking`), landing pages (`lp-rapprochement`), slide decks (`bulldozer:slides-deck`), or a raw
  PDF export of an existing document (`bulldozer:pdf-report`).
user-invocable: true
effort: high
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill
  - WebSearch
  - WebFetch
  - mcp__bulldozer__bdzListUserProjectMemberships
  - mcp__bulldozer__bdzGetProject
  - mcp__bulldozer__bdzGetProjectAiContext
  - mcp__bulldozer__bdzGetProjectToneOfVoice
  - mcp__bulldozer__bdzGetProjectValueProposition
  - mcp__bulldozer__bdzGetProjectMarketPositioning
  - mcp__bulldozer__bdzGetProjectMarketPerception
  - mcp__bulldozer__bdzListProjectIcpProfiles
  - mcp__bulldozer__bdzGetProjectObjectives
  - mcp__bulldozer__bdzGetCompetitors
  - mcp__bulldozer__bdzListProjectFiles
  - mcp__bulldozer__bdzListReviews
  - mcp__bulldozer__bdzSearchReviews
  - mcp__bulldozer__bdzCreateMetric
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
| Un livre blanc **cobrandé** émetteur × compte cible, tiré de l'**actu** d'un compte nommé, en série (6 docs) | `abm-newsjacking` |
| Une **landing page** de rapprochement 1-to-1 | `lp-rapprochement` |
| Une **présentation** client (slides) | `bulldozer:slides-deck` |
| Un **export PDF** d'un document déjà écrit | `bulldozer:pdf-report` |
| Des **créas publicitaires** | `abm-linkedin-creas`, `bulldozer:ad-creative` |

Ici : **UN** lead magnet, thématique **donnée par l'opérateur**, contexte tiré du **Bulldozer OS**,
destiné à capter des leads pour ce client. **Monomarque par défaut** — et co-brandé avec un partenaire
si l'opérateur le demande et que l'accord est acté (voir `lead-magnet-design/references/co-branding.md`).
À ne pas confondre avec `abm-newsjacking`, qui produit des livres blancs cobrandés **en série**, tirés de
l'actualité d'un compte cible nommé.

## Vocabulaire

- **Client** : l'entreprise pour qui on produit, identifiée par un projet Bulldozer OS.
- **Opérateur** : la personne qui invoque la skill (freelance ou membre Bulldozer). C'est elle qui donne
  la thématique et qui valide.
- **Cadrage** : le brief validé à l'étape ❷ — thématique, angle, ICP cible, objectif business, langue,
  longueur. C'est le contrat d'entrée de toute la chaîne.
- **Manifeste de contenu** : le JSON produit par `lead-magnet-content` qui décrit sections, blocs typés,
  données et sources. C'est l'interface entre le fond, les assets et le design.

## Les 9 règles opposables (valables pour toute la suite)

Ces règles ne sont pas des intentions : chaque étape se vérifie contre elles, et un manquement bloque.

**R1 — L'API Bulldozer OS est obligatoire, jamais contournable.** Aucune génération ne démarre sans
`(customerId, projectId)` résolu via `bulldozer:bulldozer-project-chooser`. Pas de projet résolu = pas de
lead magnet. On ne « devine » pas le client depuis le nom d'un dossier ou une conversation précédente.

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
(`type = AI_METRIC_TYPE_SKILL_USED`, `reference = <nom de la skill>`). Non bloquant si l'appel échoue.

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

> Faute déjà commise : une production a livré 23 pages sur le coût de la santé des chiens et des chats
> sans un seul animal, en invoquant « aucun visuel sans fonction ». Les 5 graphiques étaient justes, le
> document était froid. R8 existe pour que l'arbitrage revienne à l'humain.

**R9 — La DA vient du site de production, pas d'une charte interne.** Brandbook, `CLAUDE.md`, skill
« charte maison » : ces documents sont écrits une fois et ne suivent pas les refontes. On extrait les
7 tokens du **site en ligne d'abord**, on compare ensuite avec la source interne, et **le site gagne**
en cas de divergence — qui se consigne et se remonte à l'opérateur. Cette règle vaut aussi, et surtout,
quand on croit connaître la marque : y compris pour **Bulldozer** sur un document co-brandé.

> Faute déjà commise : une charte interne annonçant « fond noir, 0 border-radius » a produit un document
> entier à l'opposé du site réel (fond clair, angles arrondis, sentence case). Verdict : « il n'y a que
> la police qui est bonne. » Protocole complet dans
> `lead-magnet-design/references/charte-extraction.md`.

## Le flow

```
Opérateur : « fais un lead magnet pour [client] sur [thématique] »
  ↓
❶ project-chooser → contexte API complet
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

1. Invoquer `bulldozer:bulldozer-project-chooser` → `(customerId, projectId)` persistés dans
   `bulldozer.json`. **Sans ce couple, s'arrêter ici** et le dire.
2. Tirer le contexte via l'API, dans cet ordre :
   `bdzGetProjectAiContext` · `bdzGetProjectToneOfVoice` · `bdzGetProjectValueProposition` ·
   `bdzGetProjectMarketPositioning` · `bdzGetProjectMarketPerception` · `bdzListProjectIcpProfiles` ·
   `bdzGetProjectObjectives` · `bdzGetCompetitors` · `bdzListProjectFiles` (logo, assets de marque).
3. **Chaque brique manquante est notée et remontée au cadrage** — jamais comblée par invention (R3).
   Ce que chaque appel apporte concrètement, et quoi faire quand il revient vide :
   `references/contexte-api.md`.

### ❷ Cadrage — validation humaine n°1 (R2, R6)

**Une seule salve de questions**, pas dix allers-retours. Ce qui se confirme : thématique et angle
(donnés par l'opérateur), ICP cible parmi les profils API, objectif business du magnet (le CTA final),
langue, longueur (défaut **12–20 pages**, ajustable), contraintes éventuelles, et les trous du contexte
API relevés en ❶.

Proposer 3 titres candidats **seulement si l'opérateur le demande ou n'a pas de titre** — sinon prendre
le sien, tel quel. La salve type et le format du brief de cadrage : `references/cadrage.md`.

> **Si la thématique manque : poser la question et attendre.** Ne pas enchaîner « en attendant », ne pas
> pré-rédiger un plan sur un sujet supposé. Un cadrage vide n'est pas un cas dégradé, c'est un arrêt.

### ❸ → ❺ Production

| Étape | Skill déléguée | Entrée | Sortie attendue |
| ----- | -------------- | ------ | --------------- |
| ❸ Contenu | `lead-magnet-content` | brief de cadrage + contexte API | markdown en blocs typés + `manifeste-contenu.json` |
| ❹ Assets | `lead-magnet-assets` | draft + manifeste | plan d'assets complété des fichiers/SVG produits |
| ❺ Design | `lead-magnet-design` | draft + assets + charte client | `lead-magnet.html` + `lead-magnet.pdf` |

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

Le PDF et le HTML sont les livrables ; **l'URL est ce qui rend le lead magnet diffusable**. Publier via
`bulldozer:bulldozer-hosting` en **site statique public** :

1. Ajouter au HTML un bouton **« Télécharger le PDF »** pointant vers le PDF en chemin relatif — ce
   bouton n'existe que dans la version publiée, pas dans le HTML source livré à part.
2. **Zipper `index.html` + le PDF ensemble** : les deux sont alors servis sous la même URL, et la page
   propose son propre téléchargement. C'est ce qui évite d'avoir deux liens sans rapport.
3. Déposer le zip via `bulldozer:bulldozer-fridge`, puis `bdzCreateHosting` avec
   `type = HOSTING_TYPE_STATIC_SITE` et un `subdomain` → `https://{customerSlug}.bulldozer-os.fr/{subdomain}/`.
4. **Vérifier les deux URL en HTTP** (page et PDF) avant de les annoncer : un `curl -o /dev/null -w "%{http_code} %{content_type}"` suffit.
5. Consigner `hostingId`, `subdomain` et URLs dans `bulldozer.json` — republier plus tard se fait avec
   `bdzReplaceHostingContent` sur le même id, **sans changer l'URL**.

> ⚠️ **Une page ainsi publiée est PUBLIQUE** : pas de mot de passe, pas d'expiration. Le dire
> explicitement à l'opérateur au moment de livrer l'URL, en rappelant ce qu'elle expose (emails des
> interlocuteurs, chiffres clients). La skill `bulldozer-hosting` ne documente que l'hébergement privé
> à URL signée d'une heure : le mode site statique public existe pourtant dans l'API et c'est celui-ci
> qu'il faut pour un lead magnet.

Puis logger la complétion (R5).

## Briques réutilisées (R4 — ne rien réécrire)

| Besoin | Brique | Note |
| ------ | ------ | ---- |
| Résolution projet | `bulldozer:bulldozer-project-chooser` | obligatoire, étape ❶ |
| Charte réelle du client (7 tokens) + logo fichier | `emetteur-brand-kit` + `logo-resolver` | protocole détaillé dans `lead-magnet-design/references/charte-extraction.md` |
| Illustrations | `bulldozer:bulldozer-studio` | `bdzCreateStudioJob`, textless, `useTov`. **Couverture visuelle par défaut (R8)** |
| Graphiques | `dataviz` | palette dérivée des tokens client |
| PDF | `bulldozer:pdf-report` (pattern WeasyPrint) | conversion + fallback |
| Niveau rédactionnel | `anthropic-skills:anti-slop-writing` | grille universelle |
| Publication en URL publique | `bulldozer:bulldozer-hosting` + `bulldozer:bulldozer-fridge` | étape ❼, si demandée au cadrage — zip `index.html` + PDF, `HOSTING_TYPE_STATIC_SITE` |
| Document co-brandé (2 marques) | `lead-magnet-design/references/co-branding.md` | accord partenaire confirmé par l'opérateur |
| Avis clients réels (testimonials) | `bdzListReviews` / `bdzSearchReviews` | R3 : jamais de verbatim inventé |

> ⚠️ `anthropic-skills:bulldozer-editorial` porte la voix éditoriale **de Bulldozer**. Pour un lead magnet
> client, c'est le ton de voix **du client** (`bdzGetProjectToneOfVoice`) qui prime — n'emprunter à
> `bulldozer-editorial` que ses exigences de structure et d'anti-remplissage, jamais sa voix.

## Interdits du master

- ❌ Sauter le project-chooser, ou « retrouver » le projet autrement (R1).
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
- ❌ Publier une URL sans dire à l'opérateur qu'elle est publique, et ce qu'elle expose.
- ❌ Enterrer une hypothèse non vérifiée (email déduit, chiffre supposé) dans une note de bas de
  page : elle se dit en tête du message de livraison.

## Jamais de dégradation silencieuse

Quand une brique est indisponible (Studio non autorisé, egress bloqué, WeasyPrint absent, contexte API
vide), la règle est constante : **le dire, proposer le repli, le consigner au rapport de complétude**.
Un livrable dégradé assumé vaut mieux qu'un livrable qui a l'air complet et ment. Les pannes déjà vécues
et leurs parades : `references/pannes-et-parades.md` — **à lire avant la production d'assets et avant la
conversion PDF**.

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = AI_METRIC_TYPE_SKILL_USED`, `reference = lead-magnet`).
À la livraison : un second appel avec `reference = lead-magnet:delivered`. Non bloquant si l'appel échoue.

## Références

- `references/workflow.md` — le flow détaillé, gate par gate, + le modèle de rapport de complétude
- `references/cadrage.md` — la salve de cadrage, les défauts, le format du brief de cadrage
- `references/contexte-api.md` — ce que chaque appel API apporte, et quoi faire quand il revient vide
- `references/pannes-et-parades.md` — pannes connues (Studio, hosting, egress, WeasyPrint, polices)
