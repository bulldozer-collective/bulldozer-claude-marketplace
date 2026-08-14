# Studio — recettes de prompts et rapatriement

> Objectif : une série d'illustrations qui se ressemblent, qui portent la charte du client, et qui ne
> contiennent **ni texte, ni chiffre, ni logo**. Tout ce qui doit être lisible est incrusté en post par
> le design — un rendu IA écrit mal et falsifie les logos.

## Le prompt de style de base

Écrit une seule fois, il fixe l'identité visuelle de toute la série. Il contient cinq ingrédients :

1. **Médium** — ex. « illustration vectorielle plate », « rendu 3D doux », « photographie éditoriale
   faible profondeur de champ », « line-art géométrique ».
2. **Palette** — les tokens du client, nommés par leur valeur HEX, avec leur rôle (dominante, accent,
   fond). Ne pas dire « moderne et professionnel » : donner les couleurs.
3. **Lumière / matière** — ex. « lumière rasante, ombres douces », « aplats sans dégradé ».
4. **Niveau d'abstraction** — figuratif, semi-abstrait, purement géométrique. C'est ce qui rend la série
   cohérente quand les sujets changent.
5. **Cadrage** — ex. « composition centrée, large marge négative en bas pour la typographie ».

Exemple de structure (à remplir avec les tokens réels du client) :

```
Illustration vectorielle plate, aplats sans dégradé. Palette stricte : #7A00E6 en accent,
#14121A pour les formes, fond #FFFFFF. Lumière neutre, ombres absentes. Semi-abstrait :
formes géométriques évoquant [le sujet], aucun visage reconnaissable. Composition centrée,
large zone vide en partie basse. no text, no letters, no numbers, no logos, no watermark,
no stock cliché, no distorted hands.
```

Ensuite, chaque commande ne change que **le sujet** — jamais le style.

## La recette de la couverture (R8) — la plus rentable de la suite

C'est l'image que tout le monde verra, et la seule obligatoire par défaut. Elle a une contrainte que
les autres n'ont pas : **du texte va se poser dessus**. Une belle photo mal composée rend le titre
illisible et se recadre mal.

**Prompter la composition, pas seulement le sujet.** Demander explicitement où le sujet doit être et
où le cadre doit être vide :

```
Vertical portrait format. [style de base]. [Le sujet], photographié [angle].
The subject is positioned in the LOWER THIRD of the frame. The upper two thirds is
deliberately empty, softly lit, clean negative space with nothing in it.
no text, no letters, no numbers, no logos, no watermark, no signage.
```

Le format se prompte et fonctionne : « Vertical portrait format » a rendu du 768×1376, « Wide
horizontal banner format, very letterboxed » du 1584×672. Il n'y a pas de paramètre d'aspect à passer
à `bdzCreateStudioJob` — c'est le prompt qui le porte.

**Le voile est bâti sur les tokens, et son contraste se mesure.** L'image passe en
`background-image` sous un dégradé construit sur le token sombre du client, opaque là où il y a du
texte et ouvert là où il y a le sujet :

```css
background-image:
  linear-gradient(180deg,
    rgba(<ENCRE_RGB>,.93) 0%,     /* zone de titre : le blanc doit rester ≥ 11:1 */
    rgba(<ENCRE_RGB>,.90) 46%,
    rgba(<ENCRE_RGB>,.62) 68%,
    rgba(<ENCRE_RGB>,.30) 100%),  /* le sujet reste visible en bas */
  url("assets/<cover>.jpg");
background-size:cover, cover;
background-position:center center, center bottom;
```

Trois écueils, dans l'ordre de fréquence :

1. **Voile uniforme** : soit le texte est illisible, soit la photo est noyée. Le dégradé asymétrique
   règle les deux.
2. **Contraste supposé** : mesurer le ratio du blanc sur la couleur du voile à son opacité maximale.
   Un voile à 30 % ne porte pas de texte, jamais.
3. **Texte en bas de couverture** : si le sujet est dans le tiers bas, la date et les mentions
   remontent en haut, à côté du logo. Ne pas les laisser sur la zone claire.

**Le bandeau de respiration**, s'il est demandé au cadrage : format très letterboxé, sujet centré,
posé en `figure.band` (hauteur fixe, `object-fit:cover`). Il se place en fin de chapitre lourd ou
avant le CTA — jamais au milieu d'un raisonnement chiffré.

## Négatifs systématiques

```
no text, no letters, no numbers, no logos, no watermark, no stock cliché,
no distorted hands, no fake brand marks
```

Si un rendu contient malgré tout du faux texte : durcir les négatifs et régénérer. Ne pas « recadrer pour
cacher » — l'artefact ressortira à l'impression.

## Paramètres

- `bdzCreateStudioJob` avec `mediaType = STUDIO_MEDIA_TYPE_IMAGE` pour un lead magnet (la vidéo n'a pas
  d'usage dans un PDF).
- **`useTov`** : demander/confirmer **une fois** au début de la série, puis l'appliquer à toutes les
  commandes. Changer de réglage en cours de série casse la cohérence.
  Si `bdzGetProjectToneOfVoice` renvoie 404, il n'y a **rien à appliquer** : passer `useTov: false` et
  le consigner, plutôt que d'activer un réglage sans contenu.
- **Assets importés** : référencés par `{{asset:uuid}}` dans le prompt. **Jamais d'URL d'image dans un
  prompt** — l'import est obligatoire.
- Cohérence entre deux visuels d'une même série : passer un asset déjà généré comme référence.
- Polling `bdzGetStudioJob` jusqu'à `completed` (une image met ~10-40 s ; poller plusieurs fois).

## Rapatriement — le point critique

Les sorties vivent sur S3 avec un lien **présigné ~1 h**, et `bdzGetStudioJob` ne re-signe pas.

1. Dès `status = completed` : **télécharger immédiatement** dans `assets/`.
2. Optimiser : opaque → JPEG q≈82, ≤ 1600 px de large ; transparent → PNG (jamais aplati en JPEG, halo
   gris garanti).
3. Vérifier que le fichier existe et s'ouvre — un `curl` qui renvoie une page d'erreur produit un fichier
   de 200 octets qui « existe » sans être une image.

Si l'egress bloque le téléchargement (`X-Proxy-Error: blocked-by-allowlist`) : produire une **galerie de
récupération** `apercu-assets.html` avec, pour chaque image, un `<a download="a3-…jpg">` sur le lien
présigné, et prévenir que les liens expirent. Câbler `assets/` en fallback dans le document.

## Contrôle visuel de chaque rendu

Un asset généré n'est pas un asset validé. Regarder :

- texte parasite, lettres inventées, chiffres fantômes ;
- mains, visages, objets déformés ;
- couleurs qui dérivent de la charte (l'accent qui « bave » dans toute l'image) ;
- zone vide effectivement disponible si la commande prévoyait une incrustation en post ;
- cohérence avec les autres visuels de la série — les poser côte à côte et vérifier qu'ils appartiennent
  au même document.

Deux échecs consécutifs sur la même commande : ne pas s'acharner. Basculer le type (schéma SVG,
data-viz) ou proposer la suppression, et le consigner.
