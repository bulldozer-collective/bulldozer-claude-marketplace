# Étape ❶ : contexte client, mode OS et mode hors-base

**1. Chercher le projet dans l'OS — vraiment.** Invoquer `bulldozer-project-chooser`
(la liste vient de `bdzListUserProjectMemberships`). Si le client demandé n'y apparaît pas, chercher par
nom avant de conclure : un projet peut exister sous une raison sociale ou une orthographe différentes.

**2a. Le projet existe → mode OS.** `(customerId, projectId)` persistés dans `bulldozer.json`, puis
tirer le contexte via l'API, dans cet ordre :
`bdzGetProject` (identité du projet) · `bdzGetProjectToneOfVoice` · `bdzGetProjectValueProposition` ·
`bdzGetProjectMarketPositioning` · `bdzGetProjectMarketPerception` · `bdzListProjectIcpProfiles` ·
`bdzGetProjectObjectives` · `bdzGetCompetitors` · `bdzListProjectFiles` (logo, assets de marque).
Sept de ces neuf appels (tous sauf `bdzGetCompetitors` et `bdzListProjectFiles`) exigent en plus un
troisième identifiant, `targetProjectId` — ici la même valeur que `projectId`, à repasser explicitement
à chaque appel : voir `contexte-api.md`.

**2b. Le projet n'existe pas → mode hors-base.** Trois gestes, dans cet ordre :

1. **Demander le client** : « Je ne trouve pas [client] dans le Bulldozer OS. C'est bien pour
   [client] ? Donne-moi son nom exact. » L'opérateur peut aussi corriger : ce n'était pas le bon nom.
2. **Faire valider le site.** Chercher le site officiel, présenter **le ou les candidats trouvés avec
   ce qui les identifie** (raison sociale, activité, pays), et **attendre la confirmation explicite**.
   Aucune URL retenue sans validation humaine — c'est ce site qui donnera la charte, le logo, le ton et
   les preuves : se tromper de site contamine tout le document.
3. **Reconstruire le contexte depuis le site validé** : lire les pages qui portent le positionnement
   (accueil, produit, à propos, clients, blog) et en tirer les mêmes briques que l'API aurait données —
   positionnement, promesse, vocabulaire, ton, preuves, lecteur visé. Ce qui ne se trouve pas sur le
   site se demande à l'opérateur au cadrage.

**3. Dans les deux modes : extraire la charte avant de clore cette étape.** Le protocole des 7 tokens
+ logo (`charte-extraction.md`) s'exécute ici — pas à la mise en forme — et produit
`brandbook-[client].md` avant que la rédaction ou les visuels ne commencent. C'est ce même fichier, et
lui seul, que liront ensuite `lead-magnet-assets` (❹, pour la palette des illustrations et des
graphiques) et `lead-magnet-design` (❺, qui l'applique et le reconfirme, sans le réextraire). Extraire
la charte seulement à ❺ produit des visuels commandés sans la DA réelle du client — un défaut qui ne
se repeint pas après coup, il se refait. `bdzListProjectFiles` n'a pas de catégorie dédiée au logo ou à
la marque (les six valeurs de son filtre `category` sont toutes stratégie/marché) : lister tous les
fichiers du projet et repérer le bon par son nom et son type, ne pas chercher à filtrer dessus.

**4. Dans les deux modes : chaque brique manquante est notée et remontée au cadrage** — jamais comblée
par invention (R3). Le mode retenu (`os` ou `hors-base`) est **consigné dans le cadrage** : la review
ne juge pas la cohérence de la même façon selon la source du contexte.

Ce que chaque appel apporte, quoi faire quand il revient vide, et la procédure complète du mode
hors-base : `contexte-api.md`.
