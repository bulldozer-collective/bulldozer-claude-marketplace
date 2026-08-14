# Le rapport de review — format et commandes

> Le rapport est un document de travail, pas un compte rendu. Il est lu par deux skills qui doivent
> pouvoir exécuter sans interpréter. D'où : une localisation, un problème constaté, une correction
> attendue, une priorité.

## Modèle de rapport (`review-N.md`)

```markdown
# Review N — [Client] · [Titre] · [date]

**Verdict : corrections mineures**
PDF relu page par page (18 pages) · check_rythme.py exécuté · 2 bloquants, 6 mineurs.

## Corrections de fond → lead-magnet-content

| # | Priorité | Où | Problème constaté | Correction attendue |
| - | -------- | -- | ----------------- | ------------------- |
| F1 | bloquant | ch3, §2 | « 42 % des ETI » sans source dans le manifeste | sourcer ou retirer le chiffre ; si introuvable, reformuler sans quantifier |
| F2 | mineur | exec summary | l'enseignement 3 n'est démontré nulle part dans le corps | le rattacher au ch2, ou le supprimer du résumé |
| F3 | mineur | ch1 ouverture | généralité creuse (« le marché se transforme ») | ouvrir sur le constat chiffré du ch1 |

## Commandes design → lead-magnet-design

| # | Priorité | Page / section | Problème constaté | Correction attendue |
| - | -------- | -------------- | ----------------- | ------------------- |
| D1 | bloquant | p.8 / ch2 | hiérarchie H2/H3 illisible (même corps apparent) | porter le H2 à ≥ 1,4× le H3 |
| D2 | bloquant | p.15 / ch3 | page remplie à 41 % (trou blanc hors exception) | remonter le premier bloc de la p.16 ; agrandir la figure a5 |
| D3 | mineur | p.12 / ch2 | 6 paragraphes de prose consécutifs | promouvoir le chiffre du 3ᵉ paragraphe en carte KPI |
| D4 | mineur | p.4 / sommaire | numéros de page décalés d'une unité | régénérer le sommaire après la dernière conversion |

## Remarques (hors périmètre de correction)
- L'angle « coût organisationnel » est plus fort que ce que le titre annonce — à garder en tête pour une
  éventuelle v2 du titre. Signalé une fois, non traité dans cette boucle.

## Ce qui reste ouvert
- [rien] | [liste des points non résolus après 2 boucles, à arbitrer par l'opérateur]
```

## Format machine des commandes design

Quand la review est consommée par la skill design en mode « commandes », les commandes sont aussi
fournies en JSON — c'est ce que `check_rythme.py --json` produit déjà pour les défauts qu'il détecte :

```json
[
  { "page": 15, "section": "ch3", "probleme": "page remplie à 41 % (seuil 66 %)",
    "correction": "remonter le premier bloc de la page 16 ; agrandir la figure a5",
    "priorite": "bloquant" },
  { "page": 12, "section": "ch2", "probleme": "6 paragraphes de prose consécutifs (max 4)",
    "correction": "promouvoir un chiffre en carte KPI ou une idée en pull-quote",
    "priorite": "mineur" }
]
```

## Bonnes et mauvaises commandes

| ❌ Vague | ✅ Actionnable |
| -------- | -------------- |
| « améliorer le design » | « p.8 : hiérarchie H2/H3 illisible → porter le H2 à ≥ 1,4× le H3 » |
| « la page 15 est vide » | « p.15 : remplie à 41 % → remonter le premier bloc de la p.16 et agrandir la figure a5 » |
| « rendre le chapitre 2 plus dynamique » | « p.12 : 6 paragraphes consécutifs → promouvoir le chiffre du 3ᵉ en carte KPI » |
| « le tableau est moche » | « chap.2 : colonne « Ce qu'il faut vérifier » trop étroite, le texte se casse en 6 lignes → répartir les largeurs de colonnes, ou passer le tableau en 2 colonnes » |
| « revoir les couleurs » | « p.6 : le bleu #2E6BE6 du graphique n'est pas un token → dériver la palette de --accent » |

Une commande utile répond à trois questions : **où** exactement, **ce qui cloche**, **ce qu'on attend**.
Si l'une manque, la skill de production devra deviner — et une correction devinée revient en review.

## Rédiger une correction de fond sans écrire à la place

La review dit **quoi** corriger et **pourquoi**, pas le texte de remplacement. « Ouvrir sur le constat
chiffré du chapitre » est une correction ; réécrire le paragraphe dans le rapport ne l'est pas — ça
court-circuite la skill qui porte le ton de voix du client, et ça brouille la trace de ce qui a changé.

Exception : citer la phrase fautive entre guillemets pour la localiser. Localiser n'est pas réécrire.

## Compteur de boucle

Chaque rapport porte son numéro (`review-1.md`, `review-2.md`). **La boucle autonome s'arrête à 2.** Le
second rapport se termine toujours par la section « Ce qui reste ouvert » — même vide, pour que
l'orchestrateur sache qu'elle a été renseignée et puisse la reporter au rapport de complétude.

### Ce que la borne de 2 interdit, et ce qu'elle n'interdit pas

| Situation | Autorisé ? |
| --------- | ---------- |
| La chaîne relance une 3ᵉ passe **d'elle-même**, sur les mêmes points | ❌ non — c'est du raffinage sans fin, et c'est ce que la borne existe pour empêcher |
| L'**opérateur** signale un défaut après la livraison et rouvre une passe | ✅ oui — il est le point de passage humain (R6), sa remarque est une nouvelle entrée, pas une itération de la boucle |

Dans le second cas, écrire un `review-3.md` (ou 4, 5…) qui **cite la remarque d'origine** et repart d'un
compteur propre. Un rapport qui rouvre la boucle sans dire qui l'a rouverte est illisible six mois plus
tard.

> Cas vécu : un titre orphelin et une absence d'images ont traversé deux reviews sans être vus, et ont
> été signalés par l'opérateur. Les deux étaient dans la grille depuis le début. La borne de 2 n'était
> pas le problème — l'inspection l'était (voir « ce que le script ne voit pas » dans
> `grille-review.md` : une planche contact à 72 dpi ne montre pas un titre isolé).
