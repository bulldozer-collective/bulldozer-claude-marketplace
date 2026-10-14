# Alignement, calibrage et le piège du `fill` — SVG (graphiques et schémas)

> Détail technique de l'Étape 2 — Production (Graphiques / Schémas) de `PROPOSITION.md`. À lire
> avant de produire ou de corriger un SVG inline.

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

### Le piège du `fill` — la parade s'inverse selon le mode d'intégration

Il existe deux mécanismes opposés, déjà payés et consignés dans `references/pannes-et-parades.md`,
qui se confondent facilement parce qu'ils produisent le même symptôme (du texte dans la mauvaise
couleur à la conversion) :

- **SVG chargé en fichier séparé (`<img src="assets/….svg">`)** — le cas des **graphiques** produits
  par `dataviz`. Une règle CSS du document (`.t { fill: … }`) **l'emporte sur l'attribut de
  présentation** `fill="…"` d'un `<text>` : c'est la cascade normale, et un navigateur peut masquer
  le défaut. → Poser la couleur en **`style="fill:…"` inline sur chaque `<text>`**, qui gagne contre
  une classe dans tous les moteurs.
- **SVG inliné directement dans le HTML du document** — le cas des **schémas** de cette skill
  (toujours écrits « inline », jamais en fichier séparé). WeasyPrint ne connaît pas `fill` comme
  propriété CSS et **jette toute déclaration `style="fill:…"`** : tous les libellés sortent alors en
  **noir**, quelle que soit la couleur voulue. → Poser la couleur en **attribut de présentation
  `fill="…"`** — aucune classe CSS ne doit cibler ces `<text>`.

**Pour cette skill : schéma → attribut `fill=`. Graphique (fichier `dataviz`) → `style="fill:…"`
inline.** Appliquer la parade de l'un à l'autre reproduit le même symptôme sans qu'on comprenne
pourquoi. `lead-magnet-design` décide de l'intégration finale, pas cette skill : en cas de doute,
contrôler sur le **PDF converti**, jamais sur l'aperçu HTML — le rendu navigateur ne distingue pas
les deux moteurs. `check_alignements.py` vérifie le sens choisi.
