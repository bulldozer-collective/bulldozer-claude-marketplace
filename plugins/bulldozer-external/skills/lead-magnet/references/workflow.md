# Workflow détaillé — gate par gate

> À lire avant de démarrer la chaîne. Chaque étape se ferme sur une **gate** : une liste de cases
> vérifiables sur des fichiers réels. Une case vide = STOP, on complète ou on demande. Jamais
> « probablement fait ».

## Arborescence de travail

Tout vit dans un dossier de mission, pour que rien ne dépende de la mémoire de la session :

```
lead-magnet-[client]-[slug-theme]/
├── cadrage.md                  ❷ le brief validé (contrat d'entrée)
├── contexte-api.md             ❶ ce que l'OS a renvoyé + les trous relevés
├── contenu.md                  ❸ le draft en blocs typés
├── manifeste-contenu.json      ❸ l'interface fond → assets → design
├── plan-assets.json            ❹ commandes de visuels + fichiers produits
├── assets/                     ❹ images, SVG, graphiques, logo client
├── brandbook-[client].md       ❺ les 7 tokens + le logo, avec leurs sources
├── lead-magnet.html            ❺ la source (livrable)
├── lead-magnet.pdf             ❺ le PDF (livrable)
├── review-1.md / review-2.md   ❻ les rapports de review
└── completude.md               ❼ le rapport final
```

Le sandbox peut être réinitialisé : **tout doit être regénérable** depuis ces fichiers (prompts d'images
inclus). Rien d'important ne vit uniquement dans la conversation.

## ❶ Contexte client

1. `bulldozer:bulldozer-project-chooser` → `(customerId, projectId)`.
2. Les 9 appels de contexte (détail : `contexte-api.md`), consignés dans `contexte-api.md` du dossier.
3. Noter les **trous** : brique vide, réponse d'erreur, données visiblement périmées.

**GATE 1 (bloquante)**
```
[ ] customerId + projectId résolus (jamais devinés)
[ ] tone of voice récupéré (ou trou noté pour le cadrage)
[ ] ICP profiles listés (ou trou noté)
[ ] value proposition + positionnement récupérés (ou trous notés)
[ ] fichiers projet listés — logo client repéré ou absence notée
[ ] liste écrite des briques manquantes à poser au cadrage
```
Pas de projet → **arrêt** : « je ne peux pas produire de lead magnet sans projet OS résolu ».

## ❷ Cadrage (validation humaine n°1)

Une salve unique (voir `cadrage.md`), puis on écrit `cadrage.md` dans le dossier et **on attend le OK**.

**GATE 2 (bloquante)**
```
[ ] thématique + angle = donnés par l'opérateur (pas déduits)
[ ] titre : celui de l'opérateur, OU 3 propositions faites À SA DEMANDE et une retenue
[ ] ICP cible choisi parmi les profils API (ou décrit par l'opérateur si l'OS est vide)
[ ] objectif business + CTA final explicites
[ ] langue confirmée
[ ] longueur cible (défaut 12–20 pages)
[ ] REGISTRE VISUEL arbitré par l'opérateur (R8) — jamais déduit
[ ] trous de contexte arbitrés : comblés par l'opérateur, ou actés « à compléter »
[ ] OK explicite de l'opérateur sur le cadrage
```
Thématique absente → **arrêt** : une question, et on attend. C'est le cas d'arrêt n°2 de la suite.

## ❸ Contenu

Déléguer à `lead-magnet-content` avec `cadrage.md` + `contexte-api.md`.

**GATE 3 (bloquante)**
```
[ ] contenu.md présent, structure canonique complète (couverture, exec summary, sommaire,
    chapitres, annexes, CTA)
[ ] ≥ 3 chapitres, chacun avec une idée directrice et ≥ 1 élément concret
[ ] aucun chapitre 100 % prose : chacun porte au moins un bloc de variation
[ ] manifeste-contenu.json valide (sections, blocs typés, données + sources, emplacements d'assets)
[ ] chaque donnée chiffrée a une source traçable, ou est marquée [à compléter]
[ ] testimonials : réels et sourcés, ou absents (jamais inventés)
[ ] exec summary écrit APRÈS le corps
```

## ❹ Assets

Déléguer à `lead-magnet-assets` avec `contenu.md` + `manifeste-contenu.json`.

**GATE 4 (bloquante)**
```
[ ] plan-assets.json : chaque commande a {emplacement, type, sujet, données sources, intention}
[ ] chaque chapitre a au moins un visuel, ou l'absence est justifiée par écrit
[ ] aucun visuel sans fonction
[ ] graphiques : uniquement sur données réelles du manifeste
[ ] fichiers réellement présents dans assets/ (ou galerie de récupération + repli signalé)
[ ] cohérence de série : une seule direction artistique pour les illustrations
[ ] échecs de génération signalés avec proposition (retry / remplacement / suppression)
[ ] REGISTRE VISUEL du cadrage respecté (R8) : si « couverture visuelle », l'image existe
[ ] chaque SVG produit est dessiné « encre bord à bord » (x=0 à x=W, voir lead-magnet-assets)
[ ] aucun SVG ne porte son titre ni sa note de source — ils vivent dans le HTML
```

## ❺ Design

Déléguer à `lead-magnet-design` avec `contenu.md` + `manifeste-contenu.json` + `plan-assets.json` +
le contexte client (pour l'extraction de charte).

**GATE 5 (bloquante)**
```
[ ] brandbook-[client].md : 7 tokens extraits du CSS de production, avec leur source
[ ] logo = fichier réel du client (niveau consigné), jamais une recréation approximative
[ ] lead-magnet.html : autoporté (CSS inline, règles @page)
[ ] lead-magnet.pdf généré et OUVERT/inspecté page par page
[ ] aucun titre orphelin en bas de page, aucune image coupée
[ ] sommaire paginé juste (les numéros correspondent aux pages réelles)
[ ] nombre de pages conforme au cadrage (± 2 pages)
[ ] check_alignements.py passe sans bloquant (colonne, encre bord à bord, libellés non rognés,
    polices statiques, couleurs dans les tokens)
```

> `check_alignements.py` se lance **avant** la première conversion : il travaille sur les sources et
> attrape en quelques millisecondes des défauts qui coûtent sinon une conversion, une rasterisation et
> une inspection à l'œil.
>
> ```bash
> python3 ../lead-magnet-review/scripts/check_alignements.py .
> ```

## ❻ Review — boucle bornée

```
review #1 → corrections → régénération PDF → review #2 → corrections → SORTIE
```

Règles de boucle :
- **2 itérations maximum.** Au-delà, on sort avec ce qui reste ouvert, consigné au rapport.
- Un point rouvert deux fois sans être résolu ne se retente pas une troisième fois : il devient une
  ligne « 🔓 en attente d'arbitrage » pour l'opérateur.
- Sortie anticipée si verdict « bon à livrer ».
- Les corrections de fond partent à `lead-magnet-content`, les commandes design à `lead-magnet-design`.
  Le master ne corrige pas lui-même : il route. C'est ce qui garde chaque skill responsable de son
  domaine, et évite les corrections « à côté » faites par un généraliste.

**GATE 6 (bloquante)**
```
[ ] review-N.md présent avec verdict global
[ ] 0 correction bloquante restante, OU liste explicite des bloquants non résolus
[ ] PDF régénéré APRÈS la dernière correction (jamais livrer le PDF d'avant-correction)
[ ] compteur d'itérations ≤ 2 pour les passes AUTONOMES (une remarque de l'opérateur
    après livraison rouvre une passe et repart d'un compteur propre)
```

## ❼ Livraison (validation humaine n°2)

Livrer les deux fichiers + le rapport ci-dessous. Ne rien publier, ne rien envoyer au client final sans
demande explicite de l'opérateur.

### Modèle de rapport de complétude

```markdown
## Lead magnet — [Client] · [Titre]

✅ **Produit** : PDF [N] pages · HTML source · [N] visuels · [N] sources citées
⚠️ **Dégradé** : [ce qui a été fait autrement, et pourquoi — ex. « illustrations en SVG :
    Studio non autorisé sur ce projet »]
❌ **Manquant** : [ce que l'opérateur ou le client doit fournir — chiffre, verbatim, logo HD]
🔓 **En attente d'arbitrage** : [points de review restés ouverts après 2 boucles]
➡️ **Prochaines étapes** : [1 ligne chacune — ex. « faire relire le chapitre 3 par le client »]
```

Un rapport qui n'a que des ✅ alors qu'une brique a manqué est un rapport qui ment : les ⚠️ et ❌ sont la
partie utile.
