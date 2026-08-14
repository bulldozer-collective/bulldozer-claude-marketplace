# Lead magnet co-brandé — deux marques, deux territoires

> Cas d'usage : le document est signé **client × partenaire** (éditeur de logiciel, plateforme,
> fonderie technologique, école, média). Le partenaire n'est pas un client Bulldozer OS : sa charte ne
> vient pas de l'API, elle vient de **son** site.
>
> Ce n'est **pas** de l'ABM 1-to-1 tiré de l'actualité d'un compte cible — ça, c'est `abm-newsjacking`.
> Ici, deux marques assument ensemble un contenu de fond.

## La règle : partager un territoire, pas juxtaposer deux logos

Le réflexe est de poser les deux logos côte à côte en couverture et de garder la charte du client
partout ailleurs. Le résultat est un document monomarque avec un logo invité — le partenaire n'y est
pas vraiment, et le co-branding ne se voit pas.

**Donner à chaque marque une zone du document où elle est chez elle**, selon ce qu'elle apporte
réellement au lecteur :

| | Marque A (le client) | Marque B (le partenaire) |
| --- | --- | --- |
| Ce qu'elle apporte | la méthode, le point de vue, l'expérience terrain | l'outil, le calcul, la donnée, la techno |
| Où elle règne | fond du document, structure, titres, encadrés | les blocs où son outil agit |
| Ses tokens | les 7 tokens client | fond, texte et accent **du partenaire** |

Le lecteur doit pouvoir dire, sans lire la légende : *ce bloc-là, c'est le partenaire.*

> **Exemple vécu (Bulldozer × Claude, guide budget 2027).** Bulldozer tient le fond plâtre clair et le
> vert acide : c'est la méthode. Anthropic tient le crème `#F0EEE6`, les cartes `#E7E1D4`, le corail
> `#D97757` et un serif : ce sont les **blocs de prompt**, là où Claude travaille. Chaque prompt est
> visuellement une carte Anthropic posée dans une page Bulldozer. Une bande « ce que chacun apporte »
> juste sous le hero explicite le partage en deux phrases.

## Ce qu'il faut extraire de la marque partenaire

Le protocole de `charte-extraction.md` s'applique **à l'identique** au partenaire — site de production
d'abord, jamais un souvenir de la marque. Au minimum :

- son **fond** et son **texte** (souvent un couple crème/encre plutôt que blanc/noir) ;
- son **accent** ;
- sa **classe typographique** (un serif éditorial ? un grotesque ?) — à défaut de la police exacte,
  un fallback de même classe suffit à porter le registre ;
- son **logo en fichier réel**, jamais redessiné.

> ⚠️ **Le logo redessiné se voit.** Un monogramme reconstruit « à peu près » en SVG passe à 16 px et
> saute aux yeux à 34 px. Demander le fichier à l'opérateur dès le cadrage : c'est une question de
> plus, elle évite une reprise complète. Idem pour le partenaire : prendre son logo officiel.

## Répartition du lockup

- **Couverture** : lockup complet `[logo A] Nom A × ✳ Nom B`, centré, au-dessus du titre.
- **Nav / en-tête HTML** : même lockup, à gauche.
- **Pied de page** : lockup réduit.
- **Dans le corps** : la marque du bloc, seule — pas le lockup, qui alourdirait.
- L'ordre est **A × B**, A étant celui qui signe et diffuse le document.

## Ce qui reste interdit

- ❌ Utiliser le nom, le logo ou la charte d'un partenaire **sans que l'opérateur ait confirmé
  l'accord**. Le co-branding est un engagement commercial, pas une décision de mise en page.
  En cas de doute : poser la question au cadrage, ne pas produire.
- ❌ Faire dire au partenaire quelque chose qu'il n'a pas dit (faux verbatim, faux chiffre, fausse
  recommandation) — R3 s'applique aux deux marques.
- ❌ Mélanger les deux accents dans un même bloc : chaque zone a **un** accent.
- ❌ Redessiner un logo, l'aplatir, ou le générer.

## Auto-contrôle

```
[ ] accord de co-branding confirmé par l'opérateur
[ ] tokens du partenaire extraits de SON site de production
[ ] logos des deux marques = fichiers réels, niveau consigné
[ ] chaque marque a une zone identifiable, pas seulement un logo en couverture
[ ] un seul accent par bloc
[ ] le partage des rôles est explicité quelque part dans le document
```
