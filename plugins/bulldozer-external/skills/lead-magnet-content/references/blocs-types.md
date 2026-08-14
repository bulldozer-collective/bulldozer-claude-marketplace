# Les blocs typés + le manifeste de contenu

> C'est l'interface entre le fond, les assets et le design. Un design ne peut composer que ce que le
> contenu lui donne : si tout arrive en prose, le document sortira en mur de texte, quelle que soit la
> qualité de la mise en page. D'où le découpage en amont.

## Les 9 types

| Type | Ce que c'est | Quand l'utiliser | Ce que le design en fait |
| ---- | ------------ | ---------------- | ------------------------ |
| `prose` | Paragraphes courants | Le corps de l'argumentation | Colonne de lecture, 65-75 caractères |
| `contacts` | Les interlocuteurs réels : photo, nom, rôle, point de contact | **En clôture**, quand le CTA est « parlez à quelqu'un » plutôt que « remplissez un formulaire » | Grille de cartes portrait, contact souligné à l'accent |
| `kpi` | Un chiffre isolé + son libellé + sa source | Un chiffre porte une idée à lui seul | Carte KPI à l'accent, gros corps |
| `quote` | Une idée-force du texte, en 1-2 phrases | Une phrase mérite d'être lue seule | Pull-quote à filet d'accent |
| `testimonial` | Verbatim **réel** + nom, fonction, entreprise | Une preuve par la parole d'un client | Bloc dédié (initiales/logo, attribution) |
| `checklist` | Points à vérifier / do-don't | Le lecteur doit pouvoir contrôler quelque chose | Liste stylée, colonnes si do/don't |
| `steps` | Étapes ordonnées | Un process, une méthode, une séquence | Timeline ou étapes numérotées |
| `table` | Tableau comparatif ou de données | Comparer, ou montrer une structure | Tableau sur la largeur de la colonne, titre solidaire (jamais `<caption>`) |
| `encart` | Aparté : définition, méthode, mise en garde | Une précision utile qui casserait le fil | Encadré à fond léger |

Deux règles de choix :

- **Un bloc naît du fond, pas du besoin de décorer.** Si un chiffre n'ajoute rien, il ne devient pas une
  carte KPI ; on le supprime.
- **Un même contenu ne se dédouble pas.** Une idée mise en `quote` n'est pas répétée telle quelle dans la
  prose adjacente : le pull-quote reprend l'idée, la prose la développe.

### Le bloc `contacts` — mettre des visages sur le CTA

Un lead magnet finit presque toujours sur un formulaire. Donner à la place **les personnes** à qui
écrire transforme la conversion : le lecteur choisit un interlocuteur au lieu d'entrer dans un tunnel.
À privilégier quand le client vend du conseil, de l'accompagnement ou un cycle long.

Contraintes, toutes bloquantes :

- **Photos réelles**, fournies par l'opérateur ou tirées des fichiers projet. Jamais un portrait généré,
  jamais une banque d'images : on met en avant des gens qui existent.
- **Le point de contact ne s'invente pas** (R3). Une adresse email est une donnée, pas un motif à
  déduire. Si l'on ne connaît qu'une adresse et qu'on extrapole les autres (`prénom@domaine`), c'est
  une **hypothèse** : la signaler explicitement à l'opérateur et la faire confirmer **avant** diffusion.
  Une adresse fausse dans un document envoyé à des prospects est un défaut visible et irrattrapable.
- **Le rôle affiché doit être sourcé.** À défaut d'information fiable sur la spécialité de chacun, un
  titre commun (« Business Partner ») vaut mieux qu'une spécialisation inventée — mais le signaler :
  un interlocuteur par domaine rendrait la prise de contact bien plus efficace.
- **Ordre** : celui donné par l'opérateur, jamais un ordre alphabétique ou hiérarchique supposé.

```yaml
:::contacts
titre: Les Business Partners
accroche: Écrivez directement à l'un d'eux.
personnes:
  - nom: Prénom Nom
    role: Business Partner
    photo: assets/portraits/prenom-nom.webp
    contact: prenom@domaine.com
    contact_verifie: true      # false → à confirmer avant diffusion, remonté au rapport
:::
```

## Syntaxe markdown (`contenu.md`)

Blocs délimités par des fences `:::` avec un en-tête YAML minimal. La prose reste du markdown standard.

````markdown
## Chapitre 2 — Pourquoi les migrations dérapent au troisième mois

> idée directrice : le coût réel n'est pas technique, il est organisationnel.

La bascule technique se passe presque toujours bien. Ce qui casse, c'est la reprise…

:::kpi
value: "68 %"
label: "des dépassements de budget apparaissent après la mise en production"
source: s3
:::

Le mécanisme est connu des équipes qui l'ont vécu deux fois…

:::quote
text: "Un projet de migration ne se termine pas à la bascule : il se termine quand plus personne ne
       maintient l'ancien système."
attribution: null
:::

:::steps
title: "Les 4 jalons à poser avant la bascule"
items:
  - "Geler le périmètre fonctionnel 6 semaines avant"
  - "Nommer un propriétaire de la reprise de données"
  - "Chiffrer le coût de maintien du double système"
  - "Fixer la date d'extinction de l'ancien système"
:::

:::testimonial
quote: "On avait budgété la bascule, pas les six mois de double run."
name: "Claire Moreau"
role: "DSI"
company: "[Entreprise]"
source: review-4711
:::
````

Champs par type :

| Type | Champs |
| ---- | ------ |
| `kpi` | `value`, `label`, `source` (id de source, obligatoire si le chiffre est externe) |
| `quote` | `text`, `attribution` (`null` si c'est une idée du document) |
| `testimonial` | `quote`, `name`, `role`, `company`, `source` (id de l'avis — **obligatoire**) |
| `checklist` | `title`, `items[]`, ou `do[]` / `dont[]` |
| `steps` | `title`, `items[]` (ordonnés) |
| `table` | `title`, `columns[]`, `rows[][]`, `source` si données externes |
| `encart` | `kind` (`definition` / `methode` / `attention`), `title`, `body` |

## Le manifeste (`manifeste-contenu.json`)

Il décrit la structure réelle du document produit. Il est **régénéré à chaque modification du contenu** —
un manifeste désynchronisé fait composer le design à partir de blocs qui n'existent plus.

```json
{
  "meta": {
    "client": "Nom du client",
    "titre": "…",
    "sous_titre": "…",
    "langue": "fr",
    "date": "2026-08-13",
    "icp": "…",
    "objectif_business": "…",
    "cta": { "label": "…", "url": "…", "contact": "…" },
    "longueur_cible_pages": 16
  },
  "sections": [
    {
      "id": "ch2",
      "type": "chapter",
      "index": 2,
      "titre": "Pourquoi les migrations dérapent au troisième mois",
      "idee_directrice": "Le coût réel n'est pas technique, il est organisationnel.",
      "blocks": [
        { "id": "ch2-b1", "type": "prose", "mots": 210 },
        { "id": "ch2-b2", "type": "kpi", "value": "68 %", "source": "s3" },
        { "id": "ch2-b3", "type": "prose", "mots": 160 },
        { "id": "ch2-b4", "type": "quote" },
        { "id": "ch2-b5", "type": "steps", "items": 4 },
        { "id": "ch2-b6", "type": "testimonial", "source": "review-4711" }
      ],
      "assets_suggeres": [
        {
          "emplacement": "ch2-b3",
          "type": "graphique",
          "sujet": "Répartition des dépassements par phase de projet",
          "donnees": ["s3", "s7"],
          "intention": "montrer que le pic est post-bascule"
        }
      ]
    }
  ],
  "sources": [
    {
      "id": "s3",
      "affirmation": "68 % des dépassements apparaissent après la mise en production",
      "emetteur": "…",
      "date": "2026-03",
      "url": "https://…"
    }
  ],
  "gaps": [
    { "emplacement": "ch3", "manque": "chiffre du coût moyen de double run", "action": "à compléter par l'opérateur" }
  ]
}
```

Types de section : `cover`, `exec_summary`, `toc`, `chapter`, `annexes`, `cta`.
Types d'asset suggéré : `illustration`, `graphique`, `schema` (voir `lead-magnet-assets`).

## Auto-contrôle avant de rendre la main

```
[ ] chaque chapitre a ≥ 1 bloc non-prose
[ ] aucun bloc `testimonial` sans `source`
[ ] aucun `kpi` externe sans `source`
[ ] chaque id de `source` référencé existe dans `sources[]`
[ ] chaque entrée `gaps[]` est aussi visible dans contenu.md sous la forme « [à compléter] »
[ ] le manifeste reflète le contenu réel (blocs comptés, pas estimés)
[ ] la somme des `mots` est cohérente avec la longueur cible (≈ 350-450 mots par page de prose,
    moins dès qu'un chapitre porte des blocs)
```
