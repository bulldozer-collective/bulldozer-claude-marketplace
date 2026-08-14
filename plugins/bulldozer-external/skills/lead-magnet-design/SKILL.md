---
name: lead-magnet-design
description: |
  Met en forme un livre blanc / lead magnet aux VRAIES couleurs du client, en document MODERNE — pas un
  rapport Word, pas un PDF de consultant des années 2010. Extrait les 7 tokens de charte depuis le CSS de
  production du client, utilise son logo réel, compose à partir des blocs typés du contenu (cartes KPI,
  pull-quotes, testimonials, checklists, data-viz), produit un HTML autoporté puis le convertit en PDF
  (WeasyPrint) et le contrôle page par page : zéro mur de texte, zéro gros trou blanc.
  Réutilisable seule sur d'autres livrables paginés (rapport, guide, dossier) : déclencher sur
  "mets ce document aux couleurs de [client]", "designe ce livre blanc / ce rapport en PDF",
  "ce PDF fait rapport Word, refais la mise en page", "applique la charte de [client] à ce document",
  ou pour appliquer une liste de corrections de mise en page sur un document déjà produit.
when-to-use: |
  Use this skill to lay out a long-form paginated deliverable (white paper, guide, report) in a client's
  real brand tokens and convert it to PDF, or to apply structured design commands to an existing one.
  Not for landing pages (`lp-assemblage`), not for slides (`bulldozer:slides-deck`), not for a plain PDF
  export of an already-designed document (`bulldozer:pdf-report`).
user-invocable: true
effort: high
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Skill
  - WebFetch
  - mcp__bulldozer__bdzListProjectFiles
  - mcp__bulldozer__bdzGetProjectFile
  - mcp__bulldozer__bdzCreateMetric
---

# Lead magnet — la forme

## Ce que fait cette skill

Elle transforme un contenu en **document qu'on a envie de lire**. Deux exigences non négociables : il
ressemble au client (charte réelle, pas approchée), et il se lit comme un contenu premium de marque
SaaS/scale-up actuelle — pas comme un export de traitement de texte.

Elle ne réécrit jamais le fond. Elle **compose** à partir des blocs typés livrés par
`lead-magnet-content` : c'est le contenu qui décide quoi dire, le design qui décide comment ça respire.

## Entrées

- `contenu.md` + `manifeste-contenu.json` (blocs typés, sources, emplacements d'assets)
- `plan-assets.json` + `assets/` (illustrations, graphiques, schémas déjà produits)
- le contexte client (site de production, fichiers projet) pour l'extraction de charte
- ou, en **mode commandes design**, une liste de corrections structurées (voir plus bas)

## Charte client — protocole imposé

**Les 7 tokens** — fond · accent · texte · typo display · typo texte · radius · **casse** — sont
**extraits du CSS de production du site client**, jamais choisis au jugé. Protocole complet, avec
l'ordre de fiabilité des sources et le format du brandbook : `references/charte-extraction.md`. Il
s'appuie sur les briques existantes `emetteur-brand-kit` (charte + preuves) et `logo-resolver` (logo en
fichier réel).

> ⛔ **Le site de production prime sur toute charte interne** — brandbook, `CLAUDE.md`, skill « charte
> maison », PDF de charte. Ces documents sont écrits une fois et ne suivent pas les refontes. Extraire
> du site **d'abord**, comparer ensuite, et remonter toute divergence à l'opérateur. Une charte interne
> périmée a déjà coûté une production entière (le cas est documenté dans `charte-extraction.md`).

**Le logo est TOUJOURS le fichier réel du client.** Priorité : fichiers projet OS
(`bdzListProjectFiles` / workspace) → extraction depuis le site de production → échelle `logo-resolver`.
Jamais une recréation approximative, jamais un logo généré par IA, jamais un simple texte si un fichier
est obtenable. Le niveau atteint (officiel / rehost / banque / svg_recree) est consigné.

> Une couleur « de mémoire » et un logo recréé sont la première chose que le client repère. Ce sont aussi
> les deux défauts les plus faciles à éviter : ils ne coûtent qu'une extraction faite sérieusement.

## Le standard « lead magnet moderne » — 13 points opposables

Chaque point est vérifiable sur le PDF converti. Les critères chiffrés et la façon de les contrôler sont
dans `references/standard-moderne.md` — **à lire avant de composer**.

1. **Couverture pleine page** — typo display en très grand corps, aplat ou dégradé dérivé de l'accent,
   logo client, zéro clipart.
2. **Grille éditoriale aérée** — marges généreuses, colonne de lecture 65-75 caractères, interlignage
   confortable. La densité est un défaut.
3. **Hiérarchie typographique franche** — ouvertures de chapitre en pleine ou demi-page (numéro de
   chapitre en très grand corps + titre), jamais un simple H2 dans le flux.
4. **Chiffres clés en gros** — les données importantes sortent du texte en cartes/encarts KPI à l'accent,
   pas noyées dans un paragraphe.
5. **Encadrés et pull-quotes** — citations et idées clés en exergue, à filet d'accent.
6. **Data-viz propre** — via la skill `dataviz`, palette dérivée des tokens client, jamais les couleurs
   par défaut d'une librairie.
7. **Header / footer discrets** — pagination, titre courant, logo : présents mais effacés.
8. **Une seule famille d'accent** — tout se dérive des 7 tokens. Un document clair ou sombre, arrondi ou
   anguleux, reste LE MÊME design : mêmes composants, même finition, seule la charte change.
9. **Rythme éditorial — jamais de mur de texte.** Jamais plus de **3-4 paragraphes de prose consécutifs**
   sans rupture visuelle (carte KPI, pull-quote, testimonial, encadré, checklist, schéma, variation de
   corps). Chaque double page mélange **au moins 2 types de blocs**. Une page qui ressemble à une page de
   roman est un défaut.
10. **Jouer avec l'échelle** — variations de taille assumées : un chiffre en corps 60, une citation en 28,
    la prose en 10-11. Le contraste de tailles EST le dynamisme ; un document où tout est au même corps
    est plat, donc raté.
11. **Testimonials mis en scène** — bloc dédié (initiales ou logo, nom, fonction, entreprise, verbatim en
    exergue), uniquement à partir de verbatims réels fournis par le contenu (R3).
12. **Discipline de pagination — zéro gros trou blanc.** Après conversion, **aucune page remplie à moins
    de ~2/3** (exceptions : couverture, ouvertures de chapitre, dernière page CTA). Un trou se résorbe en
    **recomposant** — remonter un bloc, promouvoir une idée en pull-quote, redimensionner un visuel,
    ajuster un saut de page — jamais en étirant les marges ni en gonflant le texte.
13. **Tout aligne sur la colonne de texte.** Prose, titres, tableaux, encadrés, légendes et **contenu
    des figures** partagent le même bord gauche et le même bord droit. Les figures s'alignent par leur
    **encre**, pas par leur cadre : un SVG pleine largeur avec sa propre marge interne ne s'aligne sur
    rien. Se contrôle avec `check_alignements.py` puis à l'œil, **repères de colonne superposés** sur le
    PDF rasterisé — un décalage de 3 mm ne se voit pas autrement.

## Archétypes de mise en page

Trois archétypes, choisis **d'après le manifeste de contenu** — la forme s'adapte au fond :

| Archétype | Quand le manifeste le dicte | Signature |
| --------- | --------------------------- | --------- |
| **Éditorial** | beaucoup de prose, peu de chiffres, des citations | grande typo, larges respirations, pull-quotes structurants |
| **Data-driven** | beaucoup de `kpi` / `table` / graphiques | cartes KPI en grille, data-viz pleine largeur, chiffres en héros |
| **Premium minimal** | contenu dense mais sobre, cible dirigeants | contraste fort, très peu d'éléments, échelle typographique poussée |

Détail, règles de choix et composants de chacun : `references/archetypes.md`.
Base tokenisée prête à l'emploi : `assets/template-lead-magnet.html`.

## Varier les formes — l'archétype ne suffit pas

L'archétype fixe **ce qui domine**. Il ne dit pas comment éviter que les quatre chapitres se
ressemblent : appliquée telle quelle, la suite ouvre chaque chapitre par le même bandeau et le rythme
par la même grille de cartes. Un client qui reçoit deux livrables de la suite le voit.

**Objectif opposable : au moins 5 formes distinctes** par document, et une alternance visible entre
ce qui traverse la page et ce qui reste en retrait. Le défaut le plus courant n'est pas le manque de
blocs — c'est que **tout est en pleine largeur** : un bandeau qui porte un seul chiffre laisse une
zone morte à droite, et s'il tombe en haut de page il traîne au-dessus de lui la bande blanche de
20 mm de `@page`.

La palette complémentaire — duo KPI inégal, bande do/don't, page de données pleine page, annexe en
deux colonnes, trois variantes d'ouverture de chapitre — est dans `references/blocs-composes.md`,
**avec le coût en pages de chacune**. On y pioche selon le manifeste ; on ne les déroule pas toutes.

> Chiffre à connaître avant de choisir : passer les 4 ouvertures de chapitre en pleine page coûte
> **+5 pages et 6 pages remplies à 20-55 %**. Dépenser la page entière sur du CONTENU — la donnée
> centrale — plutôt que sur un intercalaire donne le même effet premium sans les trous.

## Production technique

1. **HTML unique auto-porté** — CSS inline dans le document, images en chemins locaux relatifs, règles
   `@page` pour l'impression (format, marges, header/footer, pagination).
2. **Conversion PDF via WeasyPrint** — pattern `bulldozer:pdf-report` : installation, conversion,
   fallback impression navigateur si WeasyPrint est indisponible.
3. **Contrôle statique AVANT la première conversion** — `check_alignements.py` sur les sources :
   alignements, encre bord à bord, libellés rognés, polices déclarées par graisse, couleurs hors tokens,
   propriétés ignorées par WeasyPrint. Quelques millisecondes, et ça évite une conversion pour rien.
4. **Contrôle du rendu APRÈS conversion, page par page** — sauts de page propres (jamais un titre
   orphelin en bas de page), images non coupées, sommaire paginé juste, aucune page < 2/3 remplie,
   **repères de colonne superposés** sur les pages qui portent une figure.

Commandes, réglages `@page`, gestion des sauts de page, polices et contrôle : `references/pdf-production.md`.

> Le HTML n'est pas le livrable qu'on juge. Un document parfait à l'écran peut être cassé une fois
> paginé : c'est la conversion qui décide des sauts de page, des orphelines et des trous. **Un PDF non
> inspecté page par page n'est pas un PDF validé.**

## Mode « commandes design »

La skill sait recevoir une liste de modifications structurées — venant de `lead-magnet-review` ou
directement d'un humain — et les appliquer **une par une, en confirmant chacune**. C'est une interface
de la skill, pas un mode dégradé.

Format attendu :

```json
{ "page": 8, "section": "ch2", "probleme": "hiérarchie H2/H3 illisible",
  "correction": "renforcer le contraste de corps entre H2 et H3", "priorite": "bloquant" }
```

Traitement : appliquer → régénérer le PDF → **vérifier la page concernée** → dire ce qui a été fait et ce
qui reste. Une commande qu'on ne peut pas appliquer sans casser autre chose se signale au lieu d'être
appliquée à moitié.

## Interdits

- ❌ Charte au jugé (couleur « de mémoire », police de substitution non vérifiée).
- ❌ Logo recréé, approximé, ou généré par IA.
- ❌ Template unique appliqué mécaniquement sans regarder le manifeste.
- ❌ Rendu « rapport ChatGPT » : pavés uniformes, aucune respiration, aucun élément saillant.
- ❌ Livrer sans avoir vérifié le PDF converti **page par page**.
- ❌ Résorber un trou blanc en gonflant le texte, en agrandissant l'interlignage ou en étirant les marges.
- ❌ Inventer un bloc que le contenu n'a pas fourni (surtout un testimonial).
- ❌ Utiliser les couleurs par défaut d'une librairie de graphiques.

## Journalisation (R5)

À l'invocation : `bdzCreateMetric` (`type = AI_METRIC_TYPE_SKILL_USED`,
`reference = lead-magnet-design`). Non bloquant si l'appel échoue.

## Références

- `references/charte-extraction.md` — protocole des 7 tokens + logo réel, avec format du brandbook.
  **Contient la règle « le site prime sur la charte interne »** — à lire avant toute extraction.
- `references/co-branding.md` — document signé par deux marques : partage de territoire, tokens du
  partenaire, lockup, interdits
- `references/standard-moderne.md` — les 13 points en critères vérifiables + auto-contrôle
- `references/archetypes.md` — les 3 archétypes, leurs règles de choix et leurs composants
- `references/blocs-composes.md` — la palette de formes complémentaires (duo KPI, bande do/don't,
  page de données, annexe en 2 colonnes, 3 variantes d'ouverture) **avec le coût en pages de chacune**
- `references/pdf-production.md` — HTML autoporté, `@page`, WeasyPrint, fallback, contrôle page par page
- `../lead-magnet-review/scripts/check_alignements.py` — contrôle statique des alignements,
  à lancer AVANT la première conversion
- `assets/template-lead-magnet.html` — base tokenisée (composants des 9 types de blocs)
