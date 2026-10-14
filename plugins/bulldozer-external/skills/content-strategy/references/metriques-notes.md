# Métriques de contenu — notes techniques sur les outils OS

Détail derrière les mises en garde compactes du texte principal (sections « Input »,
« Distribution Plan » et « Success Metrics ») sur l'usage de `bdzListCmsPages`,
`bdzGetProjectToneOfVoice`, `bdzCreateLinkedInPost`, `bdzGetCmsTrafficReport`,
`bdzGetCmsTopPagesReport` et `bdzGetSeoDomainKeywords`.

## Trois appels mal utilisés en pratique (vérifié par appel réel)

- **`bdzListCmsPages`** exige un `siteId` (en plus de `customerId`/`projectId`) — ce n'est
  pas un paramètre optionnel. Il vient de `bdzListCmsSites`, qui liste les sites Webflow
  connectés au projet avec leur `id`. L'appeler sans — en supposant qu'il se déduit du
  projet — échoue avec un 400 ("siteId: expected a UUID, got 'null'"). Vérifié par appel
  réel : `bdzListCmsSites` sur le projet interne Bulldozer renvoie un seul site, et son
  `id` passé en `siteId` à `bdzListCmsPages` renvoie bien les pages (133 au total).
- **`bdzGetProjectToneOfVoice`** exige trois identifiants, pas deux : `customerId`,
  `projectId`, et `targetProjectId` (le projet dont on veut le ton de voix — en pratique
  le projet courant, donc souvent identique à `projectId`). Un appel qui n'en passe que
  deux échoue en 400 ("Invalid project id in path"). Un 404 ne veut pas dire que l'appel a
  échoué — il veut dire qu'aucun ton de voix n'a été configuré pour ce projet ; écrire le
  plan dans un ton neutre plutôt que de traiter ça comme une panne. Un 402 veut dire que le
  palier d'abonnement du compte n'inclut pas ce champ — le signaler à l'opérateur, pas le
  retenter. Vérifié par appel réel sur le projet interne Bulldozer avec les trois IDs : un
  objet de ton de voix complet est bien renvoyé.
- **`bdzCreateLinkedInPost`** exige `message` dans tous les cas, y compris pour un
  document post : `customerId`, `projectId` et `message` sont les trois seuls champs
  obligatoires de son schéma, `documentUrl` n'en dispense pas. Un appel qui ne passe que
  `documentUrl` sans texte échoue en 400 ("message: must not be blank") — ce n'est pas le
  document qui se publie avec une légende vide, c'est l'appel entier qui échoue. Toujours
  rédiger le texte du post (la légende du carrousel) avant d'appeler l'outil.

## Un 409 sur un rapport Analyze a deux causes possibles

`bdzGetCmsTrafficReport` et `bdzGetCmsTopPagesReport` renvoient un 409 soit parce que
l'add-on Webflow Analyze n'est pas acheté par le client, soit parce que la connexion
Webflow du site a besoin d'être reconnectée avec de nouveaux scopes (le jeton a été
rejeté). Le texte exact de l'erreur mélange les deux causes dans le même message — ne
jamais supposer qu'un 409 signifie uniquement l'absence de l'add-on : vérifier aussi que
la connexion Webflow du site porte bien les scopes requis avant de renvoyer le client
vers l'achat de l'add-on.

## Ne jamais appeler plusieurs rapports Analyze en parallèle

Un suivi trimestriel complet de ce tableau touche deux rapports Analyze —
`bdzGetCmsTrafficReport` et `bdzGetCmsTopPagesReport`. Les deux exigent l'add-on Webflow
Analyze, et les deux précisent explicitement dans leur propre schéma qu'appeler plusieurs
rapports Analyze en parallèle n'est pas pris en charge. Les tirer un par un, jamais en
même temps.

## La donnée de mots-clés est une photo datée, pas un flux continu

`bdzGetSeoDomainKeywords` ne se rafraîchit pas en temps réel : chaque ligne porte le mois
et l'année de la photo dont elle provient, et cette photo peut être en retard de plusieurs
mois sur la date de l'appel. Vérifié en conditions réelles : un appel avec
`whenLatest=true` sur un domaine client en production, en octobre 2026, a renvoyé une photo
datée de juin 2026 — le même retard déjà constaté sur l'outil voisin
`bdzGetSeoBacklinksOverview` pour ce même domaine.

Un suivi « mensuel » construit sur cet outil n'avance que si la photo sous-jacente a
vraiment changé entre deux vérifications. Toujours lire `metadata.month`/`metadata.year`
avant d'annoncer un changement de position, et ne jamais promettre au client un
classement plus frais que ce que la donnée porte réellement.
