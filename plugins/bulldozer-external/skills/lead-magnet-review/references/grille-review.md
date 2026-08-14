# Grille de review — les deux volets

> Ce qui est marqué **[B]** est bloquant : le document ne peut pas être livré avec ce défaut. Le reste
> est mineur : signalé, priorisé, mais n'empêche pas la livraison si l'opérateur arbitre.

## Volet FOND

### Exactitude

```
[B] chaque chiffre du document a une source identifiable (manifeste → sources[])
[B] aucune donnée inventée, aucun ordre de grandeur "raisonnable" non sourcé
[B] chaque testimonial a une source réelle (avis OS, contexte API, opérateur)
[ ] chaque source dit bien ce que le document lui fait dire (périmètre, date, unité, population)
[ ] les chiffres du client sont attribués au client, pas présentés comme des données de marché
[ ] les [à compléter] restants sont listés au rapport (pas laissés silencieusement dans le PDF)
[B] aucun [à compléter] dans une page destinée au lecteur final sans que l'opérateur l'ait acté
```

### Cohérence avec le contexte OS

```
[ ] ton de voix conforme à bdzGetProjectToneOfVoice (registre, adresse, niveau de jargon)
[B] le document parle au lecteur du cadrage (ICP), pas à un public générique
[ ] le positionnement du client est respecté : rien de promis qu'il ne peut pas tenir
[ ] la langue est celle du cadrage, de bout en bout (y compris légendes, sources, CTA)
[ ] ratio ~90/10 tenu : le document donne de la valeur, il ne se vend pas
```

Test du lecteur unique : prendre trois paragraphes au hasard et se demander « à qui parle cette
phrase ? ». Si la réponse varie d'un paragraphe à l'autre, le document a perdu son lecteur.

### Qualité éditoriale (grille anti-slop)

```
[ ] aucun paragraphe de remplissage (qui pourrait figurer dans n'importe quel document du secteur)
[ ] aucune généralité creuse en ouverture de chapitre ("le digital transforme les entreprises")
[ ] pas de répétition d'une idée d'un chapitre à l'autre sans progression
[B] la promesse du titre est tenue par le corps du document
[ ] chaque chapitre a une idée directrice distincte, identifiable en une phrase
[ ] chaque chapitre apporte au moins un élément concret (donnée, exemple, framework)
[ ] les titres de chapitre annoncent une idée, pas un thème
```

### Mécanique lead magnet

```
[ ] l'executive summary donne envie de lire la suite (et ne se contente pas d'annoncer le plan)
[ ] chaque enseignement du résumé est démontré quelque part dans le corps
[B] le CTA final existe, est unique, et est aligné sur l'objectif business du cadrage
[ ] le CTA est relié à ce que le lecteur vient de lire (pas un encart commercial plaqué)
[ ] les coordonnées / liens du CTA sont réels (ou [à compléter] explicitement acté)
```

## Volet FORME

### Standard moderne (les 13 points)

```
[ ] couverture pleine page, titre dominant, logo entier, aucun clipart
[B] registre visuel du cadrage respecté (R8) : image de couverture présente si arbitrée
[ ] colonne de lecture 65-75 caractères
[ ] chaque chapitre s'ouvre en pleine ou demi-page (jamais un H2 dans le flux)
[ ] chaque bloc kpi/quote/testimonial du manifeste a bien son composant dédié
[ ] data-viz aux tokens client, source affichée, aucun défaut de librairie
[ ] header/footer discrets, pagination juste, absents de la couverture
[B] aucune couleur hors des 7 tokens et de leurs dérivés
[B] logo = fichier réel du client (jamais une recréation approximative)
[ ] testimonials mis en scène (attribution complète)
```

### Alignement (point 13) — contrôle automatique puis repères superposés

```bash
python3 scripts/check_alignements.py .        # sur les sources, avant toute conversion
```

```
[B] contenu des figures aligné sur la colonne de texte (bord gauche ET bord droit)
[B] aucun libellé de graphique rogné par sa viewBox
[ ] SVG dessinés « encre bord à bord » (x=0 à x=W)
[ ] aucun titre ni note de source écrits DANS un SVG (ils vont au <figcaption>)
[ ] titres de figure et titres de tableau au même style, à la même position (au-dessus)
[B] aucun <caption> : boîte détachable, elle produit des titres orphelins (voir pannes-et-parades)
[ ] colonnes numériques alignées à droite, chiffres tabulaires
[B] aucune couleur de texte SVG posée par attribut fill= sous une classe qui définit un fill
[B] @font-face déclarés par graisse — une plage de police variable supprime tout le gras
```

**Le contrôle visuel avec repères est obligatoire sur toute page portant une figure.** Rasteriser la
page et superposer deux filets verticaux aux bords de la colonne (à 150 dpi sur A4 : 106 px et
1134 px). Un décalage de 3 mm ne se voit pas autrement, et se voit une fois imprimé.

> Le contrôle dans un navigateur ne remplace pas le PDF : Chrome et WeasyPrint ne traitent pas la
> cascade SVG de la même façon. Une couleur juste à l'écran peut être fausse dans le PDF.

> ⚠ **Une planche contact à 72 dpi ne suffit pas.** Un titre resté seul en bas de page y ressemble à un
> intertitre : le défaut a traversé deux reviews avant d'être vu par l'opérateur. Rasteriser à ≥ 90 dpi
> les pages que `check_rythme.py` signale sous le seuil, et les regarder une par une.

### Rythme, page par page sur le PDF converti

```
[ ] aucune suite > 4 paragraphes de prose sans rupture visuelle      → sinon commande design
[ ] aucune page < ~2/3 remplie hors couverture / ouvertures / CTA    → sinon commande design
[B] aucun titre (de tableau, de figure, de bloc) seul en bas de page → voir la hiérarchie du point 12
[ ] aucune double page sans contraste de taille (rapport max/min < 2) → sinon commande design
[ ] chaque double page mélange ≥ 2 types de blocs
```

### Variété des formes — le défaut que la suite fabrique toute seule

Appliquée sans jugement, la chaîne ouvre les quatre chapitres par le même bandeau et les rythme par
la même grille de cartes. Deux livrables d'affilée se ressemblent alors, et le client le voit.

```
[ ] au moins 5 formes de blocs distinctes dans le document
[ ] alternance visible : tout n'est pas en pleine largeur
[ ] aucune forme « premium » (duo KPI, bande do/don't, page de données) utilisée deux fois
[ ] chaque forme est justifiable par le CONTENU du chapitre, pas par l'envie de varier
```

Palette et coût en pages de chaque forme : `lead-magnet-design/references/blocs-composes.md`.

> ⚠ **Deux faux positifs connus de `check_rythme.py`**, à identifier comme tels au lieu de les
> « corriger » : la **page de données à fond perdu** (le script mesure la couverture d'encre et ne
> sait exempter que la couverture) et l'**annexe des sources en deux colonnes**. Les signaler au
> rapport avec la mention « faux positif », sans commande design associée.

**Les quatre leviers de comblement**, dans l'ordre (détail : `lead-magnet-design/references/standard-moderne.md`,
point 12) : rendre coupable un bloc inutilement atomique · remonter un bloc de la page suivante ·
promouvoir une idée en pull-quote · **combler par une image de respiration**. Ce dernier est légitime,
pas un pis-aller : il sert le remplissage, le rythme et le registre d'un seul geste — à condition que
l'image porte une légende qui la relie au propos et se place à une rupture de mouvement.

Repérage automatique : `scripts/check_rythme.py`. Ce qu'il ne voit pas et qui se contrôle à l'œil :

```
[B] aucun titre orphelin en bas de page
[ ] aucune veuve/orpheline de ligne isolée
[B] aucune image coupée par un saut de page ou débordant de sa colonne
[ ] aucun tableau qui déborde de la largeur utile
[ ] aucun tableau court coupé en laissant une ligne orpheline sur la page suivante
[ ] aucun chiffre de carte KPI qui passe à la ligne
[B] aucun logo illisible sur son fond
[B] texte lisible sur une image de fond : voile mesuré, pas supposé (≥ 4,5:1 en petit corps)
[B] aucune image utilisée DEUX FOIS dans le document (immanquable, surtout en clôture)
[B] occupation de la colonne ≥ 90 % : la prose ne s'arrête pas avant tableaux et figures
[ ] page de clôture : trois groupes ancrés, texte à la largeur de la colonne, creux bas comblé
[B] sommaire paginé sur les pages réelles du PDF
[ ] nombre de pages conforme au cadrage (± 2)
```

## Comment prioriser

Un défaut est **bloquant** s'il rend le document faux (donnée non sourcée, promesse non tenue), illisible
(page cassée, image coupée, logo invisible) ou inutile (pas de CTA). Tout le reste est mineur : ça
améliore le document, ça ne conditionne pas sa livraison.

En cas de doute, le test est : *si le client l'ouvre demain devant son comité de direction, est-ce que ça
lui coûte ?* Si oui, c'est bloquant.

## Ce que la review ne fait pas

- Elle ne rouvre pas les choix du cadrage (thématique, angle, longueur, archétype). Un désaccord se dit
  **une fois**, en remarque de fin de rapport, pas en commande.
- Elle ne réécrit pas une phrase pour montrer ce qu'elle voulait dire — elle décrit le problème et la
  correction attendue. C'est `lead-magnet-content` qui écrit.
- Elle ne modifie pas le HTML, même pour un « détail ». La boucle a besoin de savoir qui a changé quoi.
