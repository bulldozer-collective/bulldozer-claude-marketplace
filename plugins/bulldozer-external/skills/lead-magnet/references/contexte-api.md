# Contexte API — ce que chaque appel apporte, et quoi faire quand il revient vide

> Le Bulldozer OS est la source de vérité du contexte client (R1). Ce fichier dit **à quoi sert chaque
> appel dans un lead magnet** — pas juste « appeler l'API ». Un appel dont on ne sait pas quoi faire du
> résultat ne sert à rien : il gonfle le contexte et dilue l'attention.

## Résolution du projet (préalable)

`bulldozer:bulldozer-project-chooser` → `(customerId, projectId)` persistés dans `bulldozer.json`.
La liste vient de `bdzListUserProjectMemberships` : **les projets auxquels l'opérateur est assigné**.
Un projet visible dans l'OS mais où l'opérateur n'est pas membre n'est pas un projet éligible.

Si le connecteur MCP Bulldozer n'est pas authentifié : le dire, expliquer que la suite entière en dépend,
et s'arrêter. Ce n'est pas un cas dégradé — c'est R1.

## Les appels de contexte

| Appel | Ce qu'on en tire pour le lead magnet | Si vide |
| ----- | ------------------------------------ | ------- |
| `bdzGetProjectAiContext` | le brief général : métier, marché, vocabulaire maison | demander à l'opérateur de décrire le client en 3 lignes ; noter le trou |
| `bdzGetProjectToneOfVoice` | **R7** — registre, tutoiement/vouvoiement, niveau de jargon, interdits de langage | demander au cadrage : « quel ton ? » + proposer le ton dominant du site |
| `bdzGetProjectValueProposition` | ce que le client peut légitimement démontrer → nourrit le 10 % « client » du document et le CTA | ne pas inventer une promesse : rester sur le fond, CTA neutre (« parler à un expert ») |
| `bdzGetProjectMarketPositioning` | ce que le document doit prouver, et ce qu'il ne doit pas promettre | demander la position en une phrase |
| `bdzGetProjectMarketPerception` | comment le marché voit le client → quelles objections traiter dans le corps | ignorable sans perte majeure ; noter |
| `bdzListProjectIcpProfiles` | **le lecteur unique** du document (choisi au cadrage) | demander à l'opérateur de décrire le lecteur : fonction, ce qu'il sait, ce qui le bloque |
| `bdzGetProjectObjectives` | l'objectif business auquel rattacher le CTA final | demander l'objectif au cadrage |
| `bdzGetCompetitors` | pour **angler sans copier** : savoir ce qui est déjà dit ailleurs | ignorable ; à défaut, une recherche web rapide sur le sujet |
| `bdzListProjectFiles` | **logo réel** + assets de marque (charte, photos, rapports internes) | passer par le site de production (voir `logo-resolver`) ; noter le niveau atteint |
| `bdzListReviews` / `bdzSearchReviews` | **testimonials réels** (R3) — verbatims utilisables tels quels | pas d'avis = pas de bloc testimonial. Ne jamais écrire un verbatim « représentatif » |

## Deux erreurs à ne pas commettre

**Confondre contexte et sujet (R2).** Le contexte API dit *pour qui* et *comment* on écrit. Il ne dit
jamais *sur quoi*. Un `bdzGetProjectObjectives` très clair n'autorise pas à choisir la thématique : il
aide à formuler le CTA.

**Traiter un trou comme un vide à remplir.** Une brique manquante n'est pas une invitation à improviser
un positionnement ou un ICP « plausible ». C'est une ligne du cadrage, arbitrée par l'opérateur, puis une
ligne du rapport de complétude si elle reste ouverte.

## Ce qui va dans `contexte-api.md` du dossier de mission

```markdown
# Contexte OS — [Client]

- Projet : [nom] · customerId `…` · projectId `…` · récupéré le [date]

## Récupéré
- Ton de voix : […]
- ICP retenus : […]
- Value proposition : […]
- Positionnement : […]
- Perception marché : […]
- Objectifs : […]
- Concurrents (pour angler sans copier) : […]
- Fichiers projet utiles : [logo, charte, docs]
- Avis exploitables comme testimonials : [N avis, dont N nominatifs]

## Trous relevés (à arbitrer au cadrage)
- [brique] : vide / erreur / visiblement périmé → [ce qu'on demande à l'opérateur]
```

Ce fichier est relu par `lead-magnet-review` (volet fond) pour vérifier que le document parle bien au
lecteur du cadrage et respecte le positionnement. C'est pour ça qu'il est écrit, pas seulement lu.
