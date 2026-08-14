# Blocs composés — la palette de formes, et ce que chacune coûte

> Les composants de base (carte KPI, pull-quote, encart, tableau) suffisent à produire un document
> correct. Ils ne suffisent pas à produire un document qui ne ressemble pas au précédent.
>
> Cette page est une **palette complémentaire**, pas une liste à dérouler. On y pioche selon ce que
> le manifeste contient, et chaque forme est chiffrée : une mise en page qui coûte deux pages et
> quatre pages-queues doit être choisie en connaissance de cause, pas découverte à la conversion.

## Le défaut que cette page corrige

La suite garantit un niveau constant quel que soit l'opérateur — c'est son intérêt. C'est aussi sa
limite : appliquée telle quelle, elle produit **quatre chapitres identiques**, chacun ouvert par le
même bandeau sombre et rythmé par la même grille de cartes. Un client qui reçoit deux livrables de
la suite le voit immédiatement.

> Remonté par l'opérateur sur une production réelle : « tu reprends un peu la même structure de
> chapitre que [le livrable précédent], c'est ce qu'il y a dans le plugin. Est-ce qu'on pourrait pas
> varier ? »

**Objectif opposable : au moins 5 formes distinctes** dans un document de 15-20 pages, et une
alternance visible entre ce qui traverse la page et ce qui reste en retrait.

## La règle d'alternance

Le défaut le plus commun n'est pas le manque de blocs, c'est que **tout est en pleine largeur**. Un
bandeau qui traverse la page pour porter un seul chiffre laisse une grande zone morte à droite ; et
s'il tombe en haut d'une page, il laisse au-dessus de lui une bande blanche de 20 mm (la marge de
`@page`) qui se lit comme un défaut d'assemblage.

| Ce qui mérite la pleine largeur | Ce qui doit rester un bloc en retrait |
| ------------------------------- | ------------------------------------- |
| Photographies et bandeaux d'ambiance | Ouvertures de chapitre |
| Le motif / trait de marque | Cartes et duos KPI |
| Pages de données à fond perdu | Encarts, checklists, do-don't |
| Couverture et page CTA | Tableaux (déjà à la largeur de colonne) |

Test : si le bloc contient **moins de texte que la largeur qu'il occupe**, c'est un bloc, pas un
bandeau.

---

## 1. Ouverture de chapitre — trois variantes, trois coûts

C'est l'élément le plus structurant, et le plus coûteux à mal choisir. Les trois donnent le même
repère de navigation ; elles ne se paient pas pareil.

| Variante | Ce que ça donne | Coût mesuré (document de 16-17 pages A4) |
| -------- | --------------- | ---------------------------------------- |
| **Bloc en retrait** (`.chapter-opener`, défaut recommandé) | Bloc sombre arrondi dans la colonne, numéro sur la ligne de base du titre | Neutre. Aucun saut forcé, aucune bande blanche parasite : un bloc assume ses marges |
| **Bandeau pleine largeur** (`.chapter-opener.bleed`) | Le bloc sort dans les marges latérales | Neutre en pagination, mais **bande blanche de 20 mm** au-dessus quand il tombe en haut de page |
| **Pleine page** (`.chapter-opener.full-page`) | Une page entière par chapitre | **+5 pages et 6 pages remplies à 20-55 %** sur 4 chapitres. Chaque ouverture force un saut de page et laisse la fin du chapitre précédent en page-queue |

**Garder l'ouverture COURTE.** Un bloc d'ouverture trop haut ne trouve plus sa place en bas de page
et migre, en laissant un trou derrière lui. Mesuré : compacter les ouvertures (numéro ramené de 52 à
30 pt et posé sur la ligne du titre, titre de 31 à 24 pt, padding 12 → 10 mm) a fait passer un
document de **18 à 17 pages et de 8 à 5 pages signalées**, sans toucher une ligne de texte.

> La pleine page reste le bon choix pour l'archétype **premium minimal**, où les pages de respiration
> SONT les ouvertures. Sur un data-driven, elle se paie en trous.

## 2. KPI en duo inégal — quand un chiffre porte la thèse

Deux blocs côte à côte de tailles **différentes** : le chiffre porteur à 58 %, plein accent ; le
second à 42 %, sur fond doux. C'est une composition, pas une grille.

- **Quand** : un chapitre a un chiffre qui porte sa thèse et un second qui l'étaye. C'est le cas le
  plus fréquent, et la grille de deux cartes égales le traite mal — elle met les deux au même niveau.
- **Quand pas** : deux ordres de grandeur qui se lisent ensemble et se valent (là, `.kpi-grid` est
  juste), ou trois chiffres et plus.
- **Ne pas en faire un bandeau pleine largeur** : un seul chiffre, même à 96 pt, ne remplit pas
  166 mm. La version bandeau laissait une zone morte sur toute la moitié droite.

## 3. Bande do / don't — le passage du constat à la recommandation

Le bloc do-don't posé sur une **bande pleine largeur à fond `--accent-soft`**, avec un titre au-dessus
des deux colonnes.

- **Quand** : le moment du document où l'on bascule de « voilà ce qui se passe » à « voilà quoi
  faire ». La forme dit le changement de régime.
- **Une seule fois par document.** Deux bandes de ce type et l'effet retombe.
- ⚠ Le conteneur à deux colonnes est en `display:table`, **jamais en flex** — voir
  `pannes-et-parades.md`.

## 4. Page de données pleine page — pour LE fait central

Une page entière à fond perdu sur `--encre`, portant un graphique en **palette inversée**, son
kicker, son titre et sa lecture. Trois groupes ancrés (`justify-content:space-between`), pas un bloc
centré.

- **Quand** : le document a un fait qui vaut à lui seul le détour — celui qu'on citerait si on ne
  devait en retenir qu'un. Un seul par document.
- **Ce que ça coûte** : le bloc fait 296 mm, il démarre donc toujours sur une page neuve et laisse
  une page-queue derrière lui. Le placer **après un bloc long** (un tableau, une figure) plutôt
  qu'après deux paragraphes : la page qui précède se remplit alors toute seule.
- **La figure doit exister en version sombre** : mêmes données, mêmes proportions, palette dérivée
  de `--accent-on-ink` mélangé sur `--encre`. Ne pas poser un graphique clair sur un fond sombre.
- C'est ici qu'il faut dépenser la page entière — sur du CONTENU — plutôt que sur un intercalaire.

> Le script `check_rythme.py` signale cette page comme sous-remplie : il mesure la couverture d'encre
> et ne sait pas exempter un fond perdu autre que la couverture. **Faux positif attendu**, à
> consigner tel quel au rapport plutôt qu'à « corriger ».

## 5. Annexe des sources en deux colonnes

Les notices de sources sont un appareil de référence, pas de la lecture suivie : deux colonnes,
corps 7-7,5 pt, interlignes resserrés.

- Fait tenir 9 à 12 notices sur une page au lieu de deux.
- ⚠ `break-inside:avoid` **n'est pas honoré** par WeasyPrint sur un conteneur multi-colonnes. Si les
  dernières notices débordent quand même, donner sa page à l'annexe
  (`break-before:page` sur son titre) : une page « Sources » est une convention normale, une page à
  8 % n'en est pas une.

## 6. Le trait de marque

Voir `charte-extraction.md` → « La signature graphique ». Ce n'est pas un composant du template : il
est propre à chaque client, et son absence sur le site du client vaut absence dans le document.

---

## L'arithmétique de la pagination

À garder en tête avant de choisir, sur A4 marges 22 mm :

| Élément | Hauteur occupée |
| ------- | --------------- |
| Trait de marque pleine largeur | ~44 mm |
| Ouverture en bloc compact | ~75-80 mm |
| Ouverture en bandeau | ~90-110 mm |
| Ouverture pleine page | 297 mm + la page-queue qu'elle laisse |
| Duo KPI | ~65 mm |
| Bande do / don't | ~85 mm |
| Page de données | 297 mm + la page-queue qu'elle laisse |

Tout bloc `break-inside:avoid` de plus de ~80 mm a une chance sur deux de ne pas tenir en bas de
page. **Plus un bloc atomique est haut, plus il fabrique de trous** — c'est la seule règle à retenir
de ce tableau.

## Auto-contrôle avant de rendre la main

```
[ ] au moins 5 formes distinctes dans le document
[ ] alternance visible : tout n'est pas en pleine largeur
[ ] aucune forme « premium » utilisée deux fois (duo KPI, bande do/don't, page de données)
[ ] chaque forme choisie est justifiable par le CONTENU du chapitre, pas par l'envie de varier
[ ] le coût en pages de chaque forme pleine page est assumé et consigné
[ ] les faux positifs du check_rythme (page de données, annexe sources) sont identifiés comme tels
```
