# Sourcing — méthode, format, et gestion des trous

> R3 en pratique. Un livre blanc tire sa crédibilité de la traçabilité de ses chiffres. Un seul chiffre
> inventé repéré par le client détruit la confiance dans les 19 autres pages — et dans Bulldozer.

## Où chercher, dans cet ordre

1. **Le contexte API du projet** — value proposition, positionnement, contexte IA, fichiers projet.
   Ce sont les chiffres du client : les plus différenciants, et les seuls que personne d'autre n'a.
2. **L'opérateur** — il a souvent des données internes non publiées (résultats de missions, benchmarks
   maison). Demandées au cadrage, ou en cours de route si un manque apparaît.
3. **La recherche sourcée** — `bdzWebExplorerSearch` puis `bdzWebExplorerExtractContents` pour lire
   réellement la source ; `WebSearch` / `WebFetch` en complément.

## La règle du « lire avant de citer »

Un résultat de recherche n'est pas une source. Un chiffre repris d'un titre d'article, d'un extrait de
moteur de recherche ou d'une synthèse trouve souvent son origine dans une autre étude, mal citée, parfois
vieille de six ans.

Avant de citer : ouvrir la source, vérifier **qui** a produit la donnée, **quand**, et **sur quel
périmètre** (marché, pays, taille d'entreprise). Si la source primaire est introuvable, la donnée est
faible : soit on la présente comme telle (« selon [média], qui cite [étude non retrouvée] »), soit on ne
l'utilise pas comme argument porteur.

Signaux d'une donnée à écarter : aucune date, aucun périmètre, chiffre rond suspect repris partout sans
origine, étude commanditée par un acteur qui vend la solution au problème mesuré (à citer alors avec
cette précision).

## Format d'une source

```json
{
  "id": "s3",
  "affirmation": "68 % des dépassements apparaissent après la mise en production",
  "emetteur": "Nom de l'organisme / média / entreprise",
  "date": "2026-03",
  "url": "https://…",
  "perimetre": "ETI européennes, secteur industriel",
  "confiance": "haute | moyenne | faible"
}
```

Dans l'annexe Sources du document, une ligne lisible par un humain :

```
[3] Nom de l'organisme, « Titre de l'étude », mars 2026 — ETI européennes, secteur industriel.
    https://…
```

## Les trous — « [à compléter] », jamais un chiffre plausible

Quand une donnée manque et qu'aucune source ne tient :

1. **Demander** si l'opérateur peut l'avoir (c'est souvent le cas pour les chiffres maison).
2. Sinon, écrire la phrase **sans le chiffre** quand elle tient debout autrement — souvent le chiffre
   n'était qu'un ornement.
3. Sinon, laisser une mention visible :

```markdown
Le coût de maintien du double système représente [à compléter : coût moyen mensuel du double run]
sur la période de transition.
```

Et l'inscrire dans `gaps[]` du manifeste. L'orchestrateur la remontera au rapport de complétude.

Ce qui est **interdit** : produire un ordre de grandeur « raisonnable », arrondir un chiffre à la hausse
« pour l'effet », attribuer une donnée réelle à un émetteur plus prestigieux, ou transformer une
estimation en mesure.

## Cas particulier : les chiffres du client

Un chiffre fourni par le client (« nous réduisons les délais de 30 % ») est une **affirmation du
client**, pas une donnée de marché. Il se présente comme tel dans le document, et sa source est le
client. Le confondre avec une donnée indépendante affaiblit les deux.

## Auto-contrôle

```
[ ] chaque chiffre du document a un id de source, ou est un [à compléter] visible
[ ] chaque source a été réellement ouverte et lue
[ ] chaque source porte émetteur + date + périmètre
[ ] les chiffres du client sont attribués au client, pas maquillés en données de marché
[ ] aucune donnée dont le périmètre contredit l'usage qu'on en fait (ex. chiffre US utilisé pour
    décrire le marché français sans le dire)
```
