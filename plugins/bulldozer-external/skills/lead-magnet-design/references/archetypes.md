# Les 3 archétypes de mise en page

> La forme s'adapte au fond, pas l'inverse. L'archétype se **choisit d'après le manifeste de contenu**,
> avant de composer — pas au fil de l'eau. Les trois partagent les mêmes composants et le même standard
> (13 points) : ils diffèrent par la hiérarchie qu'ils installent.

## Comment choisir

Compter, dans `manifeste-contenu.json`, la répartition des blocs hors `prose` :

| Signal dans le manifeste | Archétype |
| ------------------------ | --------- |
| Blocs `kpi` + `table` + graphiques ≥ 40 % des blocs non-prose | **Data-driven** |
| Blocs `quote` + `testimonial` + `encart` dominants, prose longue | **Éditorial** |
| Peu de blocs, chapitres courts, lecteur dirigeant (ICP C-level), longueur ≤ 14 pages | **Premium minimal** |

En cas d'égalité, trancher par le lecteur du cadrage : un praticien lit du data-driven, un dirigeant lit
du premium minimal, un lecteur en découverte lit de l'éditorial.

L'archétype retenu et sa justification (une ligne) se consignent dans le brandbook ou en tête du HTML —
c'est ce qui permet à la review de juger la forme sur la bonne grille.

---

## Éditorial

**Pour** : sujets d'analyse, prose longue, peu de chiffres, beaucoup d'idées à mettre en exergue.

- Ouvertures de chapitre en **pleine page**, numéro en très grand corps sur fond `--accent` ou `--texte`.
- Colonne de lecture large (70-75 caractères), interlignage 1,55-1,6.
- **Pull-quotes structurants** : une par 2-3 pages, sur toute la largeur de la colonne, filet d'accent
  à gauche.
- Illustrations sur toute la largeur de la colonne en ouverture de chapitre ; images d'ambiance
  **attendues** aux respirations éditoriales (R8), et utilisables pour combler un bas de page
  sous-rempli (point 12).
- Lettrine ou premier paragraphe en corps légèrement supérieur : marque l'entrée dans le chapitre.
- Risque à surveiller : le mur de texte. C'est l'archétype où le point 9 se viole le plus facilement.

## Data-driven

**Pour** : études, benchmarks, contenus chiffrés — quand la démonstration passe par les données.

- Ouvertures de chapitre en **demi-page**, avec le chiffre-clé du chapitre déjà présent.
- **Grille de cartes KPI** : 2 ou 3 colonnes, chiffre en très grand corps, libellé et source dessous.
- **Data-viz sur toute la largeur de la colonne de texte** — pas de la page (point 13) : les SVG sont
  dessinés « encre bord à bord » et posés dans la colonne. Une par chapitre au minimum quand les
  données le permettent, palette dérivée des tokens.
- Tableaux sur toute la largeur de la colonne, en-tête sur fond `--accent-soft`, lignes alternées très
  légères, titre solidaire du tableau (`.tbl` + `.tbl-title`, jamais `<caption>`).
- Colonne de lecture plus courte (65 caractères) : la prose sert de liant entre les données.
- Risque à surveiller : l'empilement de chiffres sans récit. Chaque donnée doit être commentée en une
  phrase — sinon c'est un tableau de bord, pas un livre blanc.

## Premium minimal

**Pour** : cibles dirigeantes, documents courts et denses en pensée, positionnement haut de gamme.

- Ouvertures de chapitre en **pleine page très vide** : numéro + titre, rien d'autre.
- Contraste fort : fond `--texte` ou `--fond` inversé sur les pages d'ouverture.
- Très peu d'éléments par page, **échelle typographique poussée** (rapport ≥ 6 entre le plus grand et le
  plus petit corps).
- Une seule idée forte par double page ; pull-quotes rares mais très grands.
- Pas ou peu d'illustrations : la typographie et le blanc font le travail.
- Risque à surveiller : le trou blanc. Ici, le point 12 se viole facilement — les pages de respiration
  sont **les ouvertures de chapitre**, pas les pages de contenu.

---

---

## Ce que l'archétype ne règle pas

L'archétype dit **ce qui domine**, pas comment éviter que les chapitres se ressemblent entre eux.
La palette de formes complémentaires — duo KPI inégal, bande do/don't, page de données pleine page,
annexe en deux colonnes — est dans `blocs-composes.md`, avec le coût en pages de chacune.

**Nuance mesurée sur les ouvertures pleine page**, prescrites ci-dessus pour l'éditorial et le
premium minimal : elles forcent un saut de page et laissent la fin du chapitre précédent en
page-queue — **+5 pages et 6 pages remplies à 20-55 %** sur un document de 4 chapitres. Le coût est
acceptable en premium minimal, où les pages de respiration SONT les ouvertures. Il ne l'est pas en
data-driven, où le bloc en retrait reste le bon choix.

## Ce que les trois partagent

- Les 7 tokens et leurs dérivés, sans exception.
- Les mêmes composants (cartes KPI, pull-quote, testimonial, checklist, steps, table, encart, figure).
- Le header/footer discret et la pagination `XX / YY`.
- Le standard des 13 points, y compris rythme, échelle, zéro trou blanc et alignement sur la colonne.

Changer d'archétype ne change ni la charte ni les composants : ça change **ce qui domine**. Un document
qui a l'air d'un autre design parce qu'on a changé d'archétype est un document mal tokenisé.
