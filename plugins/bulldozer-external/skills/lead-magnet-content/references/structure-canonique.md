# La structure canonique en détail

> Six sections, dans cet ordre. La structure ne se discute pas ; ce qu'on met dedans est un jugement
> éditorial. Cette page dit ce que chaque section doit accomplir, et à quoi on voit qu'elle est ratée.

## 1 — Couverture

**Ce qu'elle accomplit** : donner en 3 secondes le sujet, la promesse et l'émetteur.

Contient : le **titre** (celui du cadrage), un **sous-titre = promesse de lecture** (ce que le lecteur
saura faire après), le **nom du client**, la **date**.

Le sous-titre est une promesse tenable, formulée côté lecteur : « Le cadre en 5 étapes pour arbitrer vos
migrations sans arrêter la production » vaut mieux que « Un regard sur la migration en 2026 ».

**Raté si** : le titre est un thème sans angle ; le sous-titre répète le titre ; la date manque (un lead
magnet non daté vieillit mal et ne se met jamais à jour).

## 2 — Executive summary

**Ce qu'il accomplit** : permettre à un décideur qui ne lira pas le reste d'en tirer l'essentiel — et de
donner envie de lire la suite à celui qui hésite.

Gabarit :

```
Le problème            2-4 phrases. Le constat, pas l'introduction du sujet.
Les 3-5 enseignements  Une phrase chacun, chacun étayé par une donnée ou une observation du corps.
Ce que vous saurez     2-3 phrases : ce que le lecteur pourra faire après lecture.
faire après
```

**Écrit en dernier.** Il résume le document tel qu'il a été écrit, pas tel qu'il a été prévu. Chaque
enseignement doit pouvoir être pointé dans un chapitre : un enseignement du résumé qui n'existe nulle
part dans le corps est une promesse en l'air.

**Raté si** : c'est une introduction (« dans ce livre blanc, nous verrons… ») ; les enseignements sont
des généralités que le lecteur connaissait déjà ; il fait plus d'une page.

## 3 — Sommaire

Généré **depuis la structure réelle** et paginé sur le PDF réellement produit. La pagination se cale
après une première conversion (voir `lead-magnet-design`).

**Raté si** : les numéros de page sont approximatifs, ou les titres diffèrent de ceux des chapitres.

## 4 — Chapitres

**3 minimum**, plus si le sujet l'exige. Le nombre est un jugement éditorial : mieux vaut 3 chapitres qui
démontrent que 6 qui survolent.

Chaque chapitre porte :

- **une idée directrice** — formulable en une phrase, et différente de celle des autres chapitres ;
- **une progression** — le lecteur ne sait pas la même chose au début et à la fin ;
- **au moins un élément concret** — une donnée sourcée, un exemple réel, ou un framework actionnable ;
- **au moins un bloc de variation** (kpi / quote / checklist / steps / table / encart / testimonial).

Trame utile (à adapter, pas à appliquer mécaniquement) :

```
Ouverture       Le constat ou le chiffre qui pose le problème du chapitre.
Développement   2-4 mouvements. Chacun apporte une pièce : mécanisme, donnée, exemple, contre-exemple.
Concret         Le framework, la checklist, la méthode — ce que le lecteur emporte.
Transition      Ce que le chapitre suivant va résoudre.
```

**Raté si** : le chapitre pourrait s'appeler autrement sans que rien ne change ; il n'apporte aucun
élément concret ; son idée directrice recouvre celle du chapitre précédent ; il n'existe que pour
atteindre une pagination.

## 5 — Annexes

Selon pertinence : **méthodologie** (comment les données ont été collectées ou calculées), **données
détaillées** (tableaux complets dont le corps ne montre que l'essentiel), **glossaire** (si le lecteur du
cadrage n'est pas expert du domaine).

**Sources : obligatoire dès qu'une donnée est citée (R3).** Format dans `sourcing.md`.

**Raté si** : une donnée du corps n'apparaît pas dans les sources ; l'annexe méthodologie décrit une
méthode qui n'a pas été suivie.

## 6 — CTA final

**Ce qu'il accomplit** : transformer un lecteur convaincu en contact — c'est la raison d'être d'un lead
magnet.

Une page, alignée sur l'objectif business du cadrage. Contient : ce que le client propose concrètement,
pourquoi c'est la suite logique de ce que le lecteur vient de lire, et **une action unique** (lien de
prise de RDV, contact nommé, ressource suivante). Les coordonnées réelles viennent du cadrage ou du
contexte API — jamais inventées ; à défaut, un `[à compléter]` visible.

**Raté si** : trois actions concurrentes ; un discours commercial sans lien avec le contenu ; une page
« merci d'avoir lu » sans action.

## Le ratio 90 / 10

Le document démontre l'expertise du client **par la valeur qu'il donne**, pas par le nombre de fois où le
nom du client apparaît. Le client entre en scène quand il apporte quelque chose : une donnée maison, une
méthode éprouvée, un cas client réel, un verbatim.

Test simple, chapitre par chapitre : si on retirait le nom du client, le chapitre perdrait-il en
valeur ? Si non, c'est de la valeur. Si le chapitre s'effondre parce qu'il n'était qu'un argumentaire,
c'est de la plaquette — à réécrire.

Seul le CTA final assume d'être 100 % client. C'est son rôle.
