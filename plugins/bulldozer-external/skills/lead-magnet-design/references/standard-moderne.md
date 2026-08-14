# Le standard « lead magnet moderne » — critères vérifiables

> Les 13 points du SKILL.md, traduits en critères qu'on peut constater sur le PDF converti. Un standard
> qui ne se vérifie pas n'est pas un standard : c'est une intention.

## 1. Couverture pleine page

- Le titre occupe une part **dominante** de la page (typo display, corps ≥ 4× celui de la prose).
- Fond : aplat ou dégradé **dérivé de l'accent**, pas une image d'illustration générique.
- Logo client présent, **entier**, marge de sécurité ≥ 4 % du bord.
- Présents : sous-titre (promesse de lecture), nom du client, date.
- Absents : clipart, icônes décoratives, photo de stock.

## 2. Grille éditoriale aérée — et la colonne DOIT être égale à la mesure

- Colonne de lecture **65-75 caractères** (mesurer sur une ligne pleine, pas estimer).
- Interlignage du corps : 1,45 à 1,6.
- **La densité est un défaut** : deux colonnes serrées de 9 pt font « rapport », pas « contenu de marque ».

### La règle qui manquait, et qui coûte le plus cher

Respecter « 65-75 caractères » ne suffit pas. Si on bride la prose par un `max-width` **dans une
colonne plus large**, la ligne est bonne mais la prose flotte : elle s'arrête loin du bord tandis que
tableaux et figures vont jusqu'au bout. Le lecteur voit un document **inachevé**, sans savoir nommer
pourquoi.

> **La largeur de la colonne de texte doit être égale à la mesure.** Pas plus large avec un
> `max-width` de rattrapage. Ce sont les **marges de page** qui règlent la colonne, pas une bride sur
> les paragraphes.

Défaut vécu et mesuré : colonne de 174 mm (marges 18 mm), prose bridée à 34 em = 126 mm.
Ligne à 65 caractères — conforme. Mais **70 % d'occupation** et une bande vide de 53 mm, avec
seulement 23 % des lignes atteignant le bord (les tableaux). Corrigé, on passe à **93 %**.

### Comment régler marges et corps ensemble

Les deux se règlent d'un coup, jamais séparément :

```
caractères ≈ largeur_colonne_mm / (corps_pt × 0,55 × 25,4/72)
```

Sur A4 (210 mm), quelques couples qui tiennent la cible :

| Marges latérales | Colonne | Corps | Caractères |
| ---------------- | ------- | ----- | ---------- |
| 30 mm | 150 mm | 11,5 pt | 67 |
| 26 mm | 158 mm | 11,8 pt | 69 |
| **22 mm** | **166 mm** | **12 pt** | **70** ← bon compromis |
| 20 mm | 170 mm | 12,5 pt | 70 |
| 18 mm | 174 mm | 13 pt | 69 |

Deux enseignements de ce tableau :

1. **Resserrer les marges oblige à monter le corps.** Réduire les marges sans toucher au corps
   ramène la bande vide.
2. **Un corps plus grand ne coûte pas forcément des pages** : la colonne s'élargit en même temps.
   Mesuré : passer de 30 mm/11,5 pt à 22 mm/12 pt a fait gagner **deux pages**, à occupation
   identique. Et 12 pt se lit mieux à l'écran qu'un 10,5 pt, ce qui est le bon registre pour un
   document grand public.

### Mesurer l'occupation, ne pas l'estimer

Compter les caractères sur du texte extrait est trompeur : les blocs volontairement étroits
(pull-quote, steps, CTA) écrasent la médiane. Mesurer la **géométrie** :

```bash
pdftotext -bbox lead-magnet.pdf sortie.xml
```

Regrouper les `<word>` par `yMin` pour reconstituer les lignes, ne garder que les lignes « pleines »
(> 60 mm), puis relever la médiane des `xMax`. La comparer au bord droit de la colonne.

```
occupation = (xMax_médian − marge_gauche) / largeur_colonne
```

**Seuil : ≥ 90 %.** En dessous, la prose est bridée trop court pour sa colonne.

**Raté si** : la prose s'arrête visiblement avant les tableaux et les figures ; un `max-width` sur `p`
est plus étroit que la colonne de plus de 10 % ; l'occupation mesurée est sous 90 %.

## 2 bis. La page de clôture se structure, elle ne se centre pas

La dernière page est la plus regardée après la couverture, et la plus souvent ratée : on centre tout
son contenu verticalement, et la moitié basse reste flottante. Le document se termine sur une
impression d'inachevé.

Trois règles, toutes vérifiables :

- **Trois groupes ancrés, pas un bloc centré** : logo en haut, message et action au centre, mentions
  légales et coordonnées collées au bas de page (`justify-content: space-between` sur trois enfants).
- **Le texte de la page de clôture est à la largeur de la colonne**, comme le reste du document. Un
  `max-width` plus étroit y saute aux yeux, parce que la page est un aplat : l'œil voit le vide.
- **Le creux entre l'action et les mentions se comble par une image de clôture** — et par une image
  **inédite**, jamais une des précédentes : un doublon sur la dernière page est immanquable. Cette
  image est la seule du document dispensée de légende : son rôle est le registre, pas la démonstration.

**Raté si** : la moitié basse est vide ; le texte y est plus étroit qu'ailleurs ; les mentions
flottent au milieu ; l'image de clôture est déjà utilisée ailleurs.

## 3. Hiérarchie typographique franche

- Chaque chapitre s'ouvre sur une **pleine ou demi-page** : numéro de chapitre en très grand corps
  (≥ 6× la prose) + titre.
- Écart de corps net entre H2 et H3 (≥ 1,4× ), et entre H3 et la prose.
- Jamais un chapitre introduit par un simple H2 dans le flux du texte.

## 4. Chiffres clés en gros

- Tout bloc `kpi` du manifeste devient une **carte ou un encart**, jamais une phrase.
- Corps du chiffre ≥ 4× la prose ; libellé en petit corps sous le chiffre ; source rappelée.
- La carte porte l'accent (fond ou filet), avec `--accent-ink` si le fond est l'accent.

## 5. Encadrés et pull-quotes

- Tout bloc `quote` devient un pull-quote : corps ≥ 2,5× la prose, filet d'accent, jamais entre guillemets
  au fil du texte.
- Tout bloc `encart` a un fond `--accent-soft` ou un filet, et un label court (Définition / Méthode /
  Attention).

## 6. Data-viz propre

- Produite via la skill `dataviz`, **palette dérivée des 7 tokens** — jamais les couleurs par défaut
  d'une librairie (le bleu Matplotlib et le violet Recharts se reconnaissent au premier coup d'œil).
- Axes lisibles, unités présentes, source sous le graphique.
- Aucun effet 3D, aucune ombre portée, aucun camembert à plus de 5 parts.

## 7. Header / footer discrets

- Pagination `XX / YY` cohérente, titre courant, logo en petit format.
- Corps ≤ 8 pt, couleur `--texte-secondaire`. Présents mais **effacés** : on ne doit pas les remarquer.
- Absents de la couverture et des ouvertures de chapitre.

## 8. Une seule famille d'accent

- Toutes les couleurs du document sont **les 7 tokens ou leurs dérivés calculés**. Aucune couleur
  « décorative » ajoutée en cours de route.
- Test : basculer les tokens vers une autre charte doit produire le même document, cohérent, sans
  retouche. Si un bloc casse, c'est qu'il avait une couleur en dur.

## 9. Rythme éditorial — jamais de mur de texte

- **Jamais plus de 3-4 paragraphes de prose consécutifs** sans rupture visuelle.
- **Chaque double page mélange au moins 2 types de blocs.**
- Se contrôle sur le PDF, page par page — le script
  `lead-magnet-review/scripts/check_rythme.py` automatise le repérage.
- Si le contenu ne fournit pas de quoi rompre, le problème est **en amont** : le signaler à
  `lead-magnet-content`, ne pas inventer un bloc décoratif.

## 10. Jouer avec l'échelle

- Rapport entre le plus grand et le plus petit corps de la page ≥ 4 sur les pages qui portent un KPI ou
  une citation.
- Une double page où tous les corps tiennent dans un rapport < 2 est plate : promouvoir une idée en
  pull-quote ou un chiffre en carte.
- L'échelle est le principal levier de dynamisme d'un document sans images.

## 11. Testimonials mis en scène

- Bloc dédié : initiales (ou logo entreprise), nom, fonction, entreprise, verbatim en exergue.
- Verbatim en corps ≥ 2× la prose, attribution en petit corps.
- **Uniquement des verbatims réels fournis par le manifeste** (R3). Pas de bloc testimonial sans
  `source` — le design n'invente jamais cette matière.

## 12. Zéro gros trou blanc

- **Aucune page remplie à moins de ~2/3.** Exceptions légitimes : couverture, ouvertures de chapitre,
  dernière page CTA.
- **Interdit** : gonfler l'interlignage, étirer les marges, allonger le texte pour remplir. Ces
  corrections se voient et dégradent tout le document.

### Un titre ne reste JAMAIS seul en bas de page

C'est le cas particulier le plus fréquent, et le plus laid. Un titre de tableau ou de figure qui reste
en bas d'une page pendant que son bloc part à la suivante ne se corrige pas en « laissant comme ça » :

```
Ordre de préférence, du meilleur au moins bon :
  1. le titre descend à la page suivante AVEC son bloc      (break-after:avoid sur le titre)
  2. le titre reste en bas de page SUIVI du début du bloc   (bloc coupable, en-tête répété)
  3. l'espace ainsi libéré est comblé par une IMAGE         (voir ci-dessous)
Jamais : le titre seul en bas de page.
```

⚠ `<caption>` ne permet aucune des trois. C'est une boîte distincte du corps du tableau, que
WeasyPrint détache **même sous `break-inside:avoid`**. Utiliser un bloc titre avant le tableau, les
deux dans un conteneur — voir `assets/template-lead-magnet.html` (`.tbl` / `.tbl-title`).

### Les leviers de recomposition, dans l'ordre

1. **Remonter un bloc** de la page suivante, ou déplacer un saut de page.
2. **Rendre coupable** un bloc qui n'avait pas de raison d'être atomique (liste, tableau long).
3. **Promouvoir** une idée en pull-quote, un chiffre en carte KPI.
4. **Combler par une image** — le levier le plus efficace, et le plus souvent oublié.

**Combler un bas de page par une image est légitime, pas un pis-aller.** Une bande photographique en
fin de mouvement éditorial (après un graphique, avant un tableau, en fin de chapitre) remplit la page
*et* sert le rythme (point 9) *et* sert le registre (R8). Trois objectifs d'un seul geste.

Deux garde-fous :

- l'image a une **légende qui la relie au propos** de la page — sinon c'est de la décoration ;
- elle se place à une **rupture de mouvement**, jamais au milieu d'un raisonnement chiffré.

Mesuré sur une production réelle : deux bandes posées dans deux bas de page ont fait passer le document
de 6 à 4 pages sous le seuil, sans toucher au texte.

## 13. Tout aligne sur la colonne de texte

Le point le plus visible et le plus souvent raté. Un lecteur ne sait pas nommer un défaut
d'alignement, mais il voit un document « mal fichu ».

- **Une seule colonne de référence.** Prose, titres, tableaux, encadrés, légendes et **contenu des
  figures** partagent le même bord gauche et le même bord droit.
- **Les figures s'alignent par leur encre, pas par leur cadre.** Un SVG posé pleine largeur avec une
  marge interne de 14 mm dans un document à marges de 18 mm ne s'aligne sur rien. Les SVG se dessinent
  « encre bord à bord » (x=0 à x=W, voir `lead-magnet-assets`) et se posent dans la colonne.
- **Les seuls éléments autorisés à sortir de la colonne** sont ceux qui l'assument comme un aplat :
  couverture, ouvertures de chapitre, page CTA, bandeau d'ambiance. Un aplat qui déborde est un choix ;
  un graphique qui déborde est un défaut.
- **Titre de figure = `<caption>` de tableau.** Même famille, même corps, même couleur, même position
  (au-dessus). Deux conventions différentes pour deux familles de figures se remarquent.
- **Colonnes numériques à droite**, chiffres tabulaires (`font-variant-numeric: tabular-nums`), unités
  alignées.
- **Aucun libellé rogné.** Une colonne de libellés se dimensionne sur le libellé le plus long. Un
  texte qui dépasse sa viewBox est coupé à la conversion, sans avertissement.

**Comment le vérifier, et pas seulement l'affirmer** — deux niveaux :

```bash
# 1. statique, sur les sources, avant la première conversion
python3 ../lead-magnet-review/scripts/check_alignements.py .
```

```
# 2. visuel, sur le PDF rasterisé : superposer les repères de colonne
#    (à 150 dpi sur A4 : 1240 px de large, 18 mm = 106 px)
pdftoppm -png -r 150 -f <page> -l <page> lead-magnet.pdf /tmp/p
# puis afficher l'image avec deux filets verticaux à 106 px et 1134 px
# et vérifier que tout se pose dessus
```

Le contrôle visuel avec repères est le seul qui attrape un décalage de 3 mm. À l'œil nu, sans repère,
ce décalage passe — et c'est exactement celui qu'on voit une fois le document imprimé.

**Raté si** : le bord gauche d'un graphique ne coïncide pas avec celui du texte ; un titre de figure
n'a pas le même style qu'un `<caption>` ; un libellé d'axe est tronqué ; une colonne de chiffres est
alignée à gauche.

## Auto-contrôle avant de rendre la main

```
[ ] couverture : titre dominant, logo entier, aucun clipart
[ ] couverture : image présente si le cadrage a retenu un registre visuel (R8)
[ ] tout aligne sur la colonne : prose, tableaux, encadrés, légendes, contenu des figures
[ ] check_alignements.py passe sans bloquant
[ ] contrôle visuel avec repères de colonne effectué sur les pages à figures
[ ] aucun libellé de graphique rogné
[ ] colonne de lecture mesurée entre 65 et 75 caractères
[ ] LARGEUR DE COLONNE = MESURE : occupation mesurée ≥ 90 % (pdftotext -bbox)
[ ] aucun max-width sur p plus étroit que la colonne de plus de 10 %
[ ] page de clôture : trois groupes ancrés, texte à la largeur de la colonne, creux comblé
[ ] aucune image utilisée deux fois dans le document
[ ] chaque chapitre s'ouvre en pleine ou demi-page
[ ] chaque bloc kpi/quote/testimonial du manifeste a son composant dédié
[ ] data-viz aux tokens client, source affichée
[ ] header/footer présents, discrets, absents de la couverture
[ ] aucune couleur hors tokens et dérivés
[ ] aucune séquence > 4 paragraphes de prose sans rupture
[ ] chaque double page mélange ≥ 2 types de blocs
[ ] aucune page < 2/3 remplie (hors couverture, ouvertures, CTA)
[ ] sommaire paginé sur les pages réelles
[ ] aucun titre orphelin en bas de page, aucune image coupée
[ ] PDF ouvert et inspecté page par page
```
