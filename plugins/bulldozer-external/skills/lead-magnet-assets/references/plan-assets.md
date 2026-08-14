# Le plan d'assets — schéma, décision, contrôle

> Le plan est ce qui empêche deux dérives symétriques : le document sans images (mur de texte) et le
> document décoré (images qui n'apprennent rien). On produit un visuel quand il fait comprendre plus vite
> qu'un paragraphe — sinon on garde le paragraphe.

## Schéma complet

```json
{
  "style_base": "Prompt de style commun à toutes les illustrations : médium, palette (tokens client),
                 lumière, niveau d'abstraction, cadrage. Écrit une fois, réutilisé tel quel.",
  "use_tov": true,
  "tokens": { "accent": "#7A00E6", "fond": "#FFFFFF", "texte": "#14121A" },
  "commandes": [
    {
      "id": "a1",
      "emplacement": "ch1-opener",
      "type": "illustration",
      "sujet": "Ce que représente le visuel, en une phrase concrète",
      "donnees": [],
      "intention": "Ce que le lecteur doit comprendre / ressentir en le regardant",
      "format": "16:9",
      "statut": "à produire | produit | échec",
      "fichier": "assets/a1-ouverture-ch1.jpg",
      "prompt": "Le prompt réellement envoyé (pour pouvoir regénérer après un reset de sandbox)",
      "raison": "si échec : pourquoi",
      "proposition": "si échec : retry | remplacement | suppression"
    }
  ]
}
```

Le champ `prompt` n'est pas facultatif : les URLs Studio expirent et les sandbox se réinitialisent. Sans
le prompt conservé, l'asset est irrécupérable et le document devient non reproductible.

## Règles de décision

| Signal dans le contenu | Asset | Pourquoi |
| ---------------------- | ----- | -------- |
| ≥ 3 chiffres comparables, un `table` de données, une évolution temporelle | **graphique** | la comparaison se voit, elle ne se lit pas |
| Un bloc `steps`, un framework, une architecture, un cycle | **schéma** | la structure d'un process est spatiale |
| Ouverture de chapitre, concept abstrait, changement de registre | **illustration** | marquer une entrée, installer un climat |
| Un seul chiffre isolé | **rien** — c'est un bloc `kpi`, le design s'en charge | une carte KPI fait le travail |
| Une idée-force | **rien** — c'est un `quote` | un pull-quote fait le travail |

Les deux dernières lignes comptent autant que les autres : beaucoup de « besoins d'image » sont en réalité
des besoins de **composition typographique**, déjà couverts par le design.

## La commande de couverture est obligatoire par défaut (R8)

Le plan **commence** par elle. Elle n'est absente que si l'opérateur a explicitement retenu le
registre « typographique assumé » au cadrage.

```json
{
  "id": "a0",
  "emplacement": "cover",
  "type": "illustration",
  "sujet": "Le sujet du document, incarné — pas une métaphore abstraite",
  "intention": "installer le sujet et le registre avant la première ligne",
  "contrainte": "sujet dans le tiers bas, deux tiers hauts vides : du texte se pose dessus",
  "statut": "à produire",
  "prompt": "…",
  "integration": "background-image sous voile dégradé bâti sur le token sombre, contraste mesuré"
}
```

Recette complète, voile et écueils : `studio-prompts.md`.

## Densité recommandée

Pour un document de 12-20 pages : **1 à 2 visuels par chapitre**, plus la couverture. Au-delà, le
document devient un diaporama ; en deçà, le point 9 du standard design (rythme) devient difficile à
tenir avec les seuls blocs typés.

Les **bandeaux de respiration** ne comptent pas dans cette densité : ce sont des images de registre,
pas des figures. Un à trois maximum sur un document, en fin de chapitre lourd ou avant le CTA.

Un chapitre sans visuel est acceptable **s'il est écrit pourquoi** dans le plan (ex. « chapitre court,
porté par un pull-quote et une checklist, un visuel l'alourdirait »). Une absence non justifiée est
traitée comme un oubli par la review.

## Contrôle avant production

```
[ ] chaque commande a une intention formulée (pas juste un sujet)
[ ] chaque chapitre a ≥ 1 commande, ou une absence justifiée par écrit
[ ] chaque commande de type graphique pointe vers des ids de sources réels du manifeste
[ ] aucune commande de graphique sans données (sinon : supprimer, ne pas illustrer)
[ ] le style_base est écrit et sera appliqué à toutes les illustrations
[ ] les formats sont cohérents avec l'archétype de mise en page prévu
[ ] la commande de couverture existe, sauf registre « typographique assumé » au cadrage (R8)
[ ] la commande de couverture porte sa contrainte de composition (zone vide pour le titre)
```

## Contrôle après production

```
[ ] chaque commande est en statut produit ou échec — aucune en "à produire"
[ ] chaque fichier existe réellement dans assets/ et s'ouvre
[ ] aucun fichier n'est une URL S3 (les liens expirent, les fichiers non)
[ ] les illustrations partagent visiblement la même direction artistique
[ ] aucune image ne contient de texte, de chiffres ou de logo générés par l'IA
[ ] les graphiques affichent leur source — dans le <figcaption>, PAS dans le SVG
[ ] chaque SVG est dessiné « encre bord à bord » : x=0 à x=W (check_alignements.py)
[ ] aucun libellé de SVG ne dépasse sa viewBox (il serait rogné à la conversion)
[ ] aucune couleur de texte SVG posée par attribut fill= sous une classe qui définit un fill
[ ] le contraste du texte posé sur une image est mesuré, pas supposé
[ ] les échecs sont documentés avec une proposition
[ ] les prompts sont conservés dans plan-assets.json
```
