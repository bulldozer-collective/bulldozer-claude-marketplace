# Contexte API — ce que chaque appel apporte, et quoi faire quand il revient vide

> Le Bulldozer OS est la source de vérité du contexte client **quand le client y est** (R1). Ce fichier
> dit **à quoi sert chaque appel dans un lead magnet** — pas juste « appeler l'API ». Un appel dont on ne
> sait pas quoi faire du résultat ne sert à rien : il gonfle le contexte et dilue l'attention.
>
> Et quand le client n'est pas dans l'OS, il dit comment reconstruire le même contexte depuis son site :
> voir « Mode hors-base » en bas de page.

## Résolution du projet (préalable)

`bulldozer:bulldozer-project-chooser` → `(customerId, projectId)` persistés dans `bulldozer.json`.
La liste vient de `bdzListUserProjectMemberships` : **les projets auxquels l'opérateur est assigné**.
Un projet visible dans l'OS mais où l'opérateur n'est pas membre n'est pas un projet éligible.

**Avant de conclure à l'absence**, chercher par nom : un client peut exister sous sa raison sociale
(« Acme SAS » pour « Acme »), une orthographe différente, ou une marque commerciale distincte. Le mode
hors-base est un repli légitime, pas un raccourci — l'annoncer alors que le projet existe prive le
document de tout le contexte que le client a lui-même déposé.

Si le connecteur MCP Bulldozer n'est pas authentifié : le dire, proposer de l'autoriser — et si
l'opérateur préfère avancer, basculer en mode hors-base plutôt que de s'arrêter.

> ⚠️ **La plupart des appels ci-dessous exigent un troisième identifiant, `targetProjectId`, en plus
> de `customerId`/`projectId`** — vérifié sur le schéma réel de chacun. Dans cette chaîne à un seul
> projet, `targetProjectId` prend la même valeur que `projectId` : il se repasse en clair au même
> endroit, ce n'est pas un identifiant à aller chercher ailleurs. Seuls `bdzGetCompetitors` et
> `bdzListProjectFiles`, dans la liste ci-dessous, s'en passent. Un appel construit avec seulement
> `(customerId, projectId)` échoue sur les sept autres.

## Les appels de contexte

| Appel | Ce qu'on en tire pour le lead magnet | Si vide |
| ----- | ------------------------------------ | ------- |
| `bdzGetProject` | l'identité du projet : nom du client, société | demander à l'opérateur de décrire le client en 3 lignes ; noter le trou |
| `bdzGetProjectToneOfVoice` | **R7** — registre, tutoiement/vouvoiement, niveau de jargon, interdits de langage | demander au cadrage : « quel ton ? » + proposer le ton dominant du site |
| `bdzGetProjectValueProposition` | ce que le client peut légitimement démontrer → nourrit le 10 % « client » du document et le CTA | ne pas inventer une promesse : rester sur le fond, CTA neutre (« parler à un expert ») |
| `bdzGetProjectMarketPositioning` | ce que le document doit prouver, et ce qu'il ne doit pas promettre | demander la position en une phrase |
| `bdzGetProjectMarketPerception` | comment le marché voit le client → quelles objections traiter dans le corps | ignorable sans perte majeure ; noter |
| `bdzListProjectIcpProfiles` | **le lecteur unique** du document (choisi au cadrage) | demander à l'opérateur de décrire le lecteur : fonction, ce qu'il sait, ce qui le bloque |
| `bdzGetProjectObjectives` | l'objectif business auquel rattacher le CTA final | demander l'objectif au cadrage |
| `bdzGetCompetitors` | pour **angler sans copier** : savoir ce qui est déjà dit ailleurs | ignorable ; à défaut, une recherche web rapide sur le sujet |
| `bdzListProjectFiles` | **logo réel** + assets de marque (charte, photos, rapports internes) | passer par le site de production (protocole `charte-extraction.md`) ; noter le niveau atteint |
| `bdzListReviews` / `bdzSearchReviews` | **testimonials réels** (R3) — verbatims utilisables tels quels | pas d'avis = pas de bloc testimonial. Ne jamais écrire un verbatim « représentatif » |

## Trois des neuf appels renvoient une analyse IA asynchrone, pas une fiche statique

`bdzGetProjectValueProposition`, `bdzGetProjectMarketPositioning` et `bdzGetProjectMarketPerception`
ne renvoient pas un simple objet rempli : chacun porte un `state` (`RUNNING`/`SUCCESS`/`ERROR`) et
un run peut être en cours. Trois points vérifiés directement sur le schéma réel des trois outils :

- **`RUNNING` n'est jamais permanent** : un run est auto-échoué en `ERROR` au bout de 60 minutes.
  Un `RUNNING` trouvé vieux (regarder `startedAt`, jamais `createdAt` — la ligne est réutilisée d'un
  run à l'autre, `createdAt` reste figé au tout premier lancement) n'est pas un outil cassé : c'est un
  run qui va s'auto-échouer, ou qui l'est déjà.
- **Les champs ne sont pas de simples valeurs** mais des objets `{value, override, overridden}` —
  `value` = ce que l'IA a produit, `override` = la correction humaine. Afficher `override` quand
  `overridden` vaut `true`, `value` sinon ; `override` est absent du tout quand il vaut `null`. Ne
  jamais recopier l'objet brut dans le document ou le brief de cadrage.
- **Si le projet n'a encore aucun résultat** (`ERROR`, ou `RUNNING` manifestement bloqué), c'est un
  trou de contexte comme un autre — traiter comme « Si vide » dans le tableau ci-dessus, pas comme une
  panne à signaler dans `pannes-et-parades.md`. Relancer l'analyse dans le Bulldozer OS reste
  un geste de l'opérateur, pas de cette skill (on est en lecture seule sur ces briques).

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

- **Mode : os** (le projet existe dans le Bulldozer OS)
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

---

# Mode hors-base — le client n'est pas dans l'OS

Un client peut être réel, actif, en cours de signature, et absent de l'OS : projet pas encore créé,
opérateur non assigné, prospect pour qui on produit une démonstration. Ce n'est pas une raison de ne pas
produire. C'est une raison de **remplacer une source par une autre, explicitement**.

Le principe : ce que l'API aurait donné, on va le chercher sur le **site officiel du client** — un site
que l'opérateur a **validé**. Le reste de la chaîne ne change pas d'un iota.

## Les trois gestes, dans l'ordre

**1. Demander de quel client il s'agit.**

> Je ne trouve pas **[client]** dans le Bulldozer OS (j'ai cherché dans tes projets et par nom).
> On peut le faire quand même en partant de son site. C'est bien pour **[client]** ? Donne-moi le nom
> exact, tel qu'il doit apparaître dans le document.

L'opérateur peut corriger le nom, indiquer une marque commerciale différente de la raison sociale, ou
signaler que le projet existe sous un autre libellé — auquel cas on repasse en mode OS.

**2. Faire valider le site — le geste qui ne se saute pas.**

Chercher le site officiel, puis présenter **les candidats avec ce qui les distingue**, jamais une URL
seule :

> J'ai trouvé deux sites pour ce nom :
> — `acme.fr` — Acme SAS, logiciel de gestion des notes de frais, Paris
> — `acme.com` — Acme Inc., quincaillerie industrielle, Ohio
> Lequel est ton client ? (ou colle-moi l'URL si aucun des deux)

Et **attendre la réponse**. Ce site va donner la charte, le logo, le ton, le positionnement et les
preuves : une erreur ici ne se rattrape pas en review, elle se découvre à la livraison. Un seul candidat
trouvé ne dispense pas de la confirmation — l'homonymie est fréquente, et une entreprise peut avoir un
site institutionnel distinct de son site produit.

**3. Reconstruire le contexte depuis le site validé.**

Lire réellement les pages, ne pas se contenter de la page d'accueil :

| Page | Ce qu'on y prend | Remplace |
| ---- | ---------------- | -------- |
| Accueil | promesse principale, vocabulaire, ton | `bdzGetProject`, `bdzGetProjectToneOfVoice` |
| Produit / solutions | ce que le client sait faire, ses bénéfices | `bdzGetProjectValueProposition` |
| À propos / manifeste | positionnement, ce qu'il revendique | `bdzGetProjectMarketPositioning` |
| Clients / cas clients | preuves, logos, chiffres, verbatims | `bdzListReviews`, réassurance |
| Blog / ressources | sujets déjà traités, niveau du lecteur visé | `bdzGetCompetitors` (angler sans répéter) |
| Tarifs, pages secteur | segment réel, taille des comptes adressés | `bdzListProjectIcpProfiles` |
| CSS de production + presse | **les 7 tokens et le logo** | `bdzListProjectFiles` |

Ce que le site ne dit pas — l'objectif business du magnet, le lecteur exact, les chiffres internes — se
**demande à l'opérateur au cadrage**. C'est exactement le traitement d'un trou en mode OS.

## Ce qui ne change pas

- **R3 tient intégralement.** Le mode hors-base autorise une autre source, pas des données inventées.
  Chaque élément retenu porte sa page d'origine et sa date de lecture. Un ton de voix « déduit de
  l'ambiance générale » sans page à citer est une invention.
- **Le logo reste un fichier réel** (protocole `charte-extraction.md`, échelle habituelle), jamais une recréation.
- **Les testimonials restent réels** : verbatims publiés sur le site avec leur attribution, ou fournis
  par l'opérateur. Pas d'avis OS = pas de bloc testimonial, comme d'habitude.
- **Les deux validations humaines** (cadrage, livraison) sont inchangées. La validation du site
  s'y ajoute, elle ne les remplace pas.

## Ce qui va dans `contexte-api.md` du dossier, en mode hors-base

```markdown
# Contexte — [Client]

- **Mode : hors-base** (absent du Bulldozer OS — recherche chooser + par nom faite le [date])
- **Site validé par [opérateur] le [date] : https://…**

## Reconstruit depuis le site
- Ton de voix : […] — source : /a-propos, lu le [date]
- Lecteur visé : […] — source : /solutions/[segment]
- Promesse / value proposition : […] — source : /produit
- Positionnement : […] — source : /manifeste
- Preuves exploitables : […] — source : /clients
- Tokens de charte + logo : voir brandbook-[client].md

## Trous relevés (à arbitrer au cadrage)
- Objectif business du magnet : introuvable sur le site → à demander
- [brique] : absente du site → [ce qu'on demande à l'opérateur]
```

## À la livraison

Signaler le mode dans le rapport de complétude, et **proposer** — sans l'imposer, et sans rien écrire
dans l'OS sans autorisation — de créer le projet dans le Bulldozer OS pour que le prochain livrable
parte du contexte plutôt que du site. C'est le process qui se corrige, comme pour toute donnée mission
manquante.
