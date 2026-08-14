# Protocole d'extraction de charte — les 7 tokens + le logo

> Objectif : que le document ressemble au client, pas à un template. Tout se dérive de **7 tokens**
> extraits du **CSS de production** du site client. Jamais une couleur au jugé, jamais une police de
> substitution sans vérification.
>
> Ce protocole s'appuie sur les briques existantes — ne pas les réécrire :
> `emetteur-brand-kit` (charte, assets et preuves du client) et `logo-resolver` (logo en fichier réel).

## Les 7 tokens

| Token | Ce que c'est | Où le lire |
| ----- | ------------ | ---------- |
| `--fond` | la couleur de fond dominante du document | `background` du `body` / des sections principales |
| `--accent` | la couleur signature de la marque | boutons/CTA, liens, `<meta name="theme-color">`, éléments actifs |
| `--texte` | la couleur du texte courant | `color` du `body` — souvent pas un noir pur |
| `--typo-display` | la police des titres | `font-family` des `h1`/`h2` + la source (Google Fonts, fichier local) |
| `--typo-texte` | la police du corps | `font-family` du `body` |
| `--radius` | l'arrondi de la marque | `border-radius` des boutons et cartes — **0 est une valeur, pas une absence** |
| `--casse` | la casse des titres | `text-transform` **calculé** des `h1`/`h2` sur le site : `none` (sentence case) ou `uppercase`. Relever aussi la **graisse et la largeur réelles** (Bold ? Black ? Extended ?) |

> ⭐ `--casse` est le token le plus souvent faux, parce qu'il ne se lit pas dans une palette : il se lit
> dans le rendu. Un guide de marque écrit « titres en Extended Black » ; le site compose en Standard Bold
> sentence case. **Le même texte dans la bonne police mais la mauvaise casse ne ressemble pas à la
> marque.** Lire le `text-transform` calculé (`getComputedStyle`), pas le HTML source — un titre écrit
> en capitales dans le markup avec `text-transform: none` reste une décision de contenu, pas de charte.

Tokens dérivés (calculés, jamais choisis) : `--accent-hover` (accent éclairci ~12 %), `--accent-soft`
(accent très désaturé, pour les fonds d'encadré), `--accent-ink` (couleur du texte **posé sur** l'accent),
`--texte-secondaire`, `--filet`.

> ⭐ `--accent-ink` est le token qu'on oublie et qui casse le document. Accent clair (lime `#DDFF56`) →
> texte foncé. Accent foncé (violet `#7A00E6`) → texte blanc. Partout où un bloc a l'accent en fond
> (carte KPI, bandeau, surlignage), le texte prend `--accent-ink`, et le logo prend sa variante adaptée.

## Ordre de fiabilité des sources

**Le site de production fait foi.** C'est le seul artefact dont on sait qu'il est vivant : c'est ce que
le marché voit aujourd'hui. Tout le reste est une déclaration d'intention, potentiellement périmée.

1. **CSS de production du site client** — variables CSS (`:root`), styles calculés dans le navigateur,
   couleur des boutons, `<meta name="theme-color">`, fonds header/footer, `border-radius` réels.
2. **Fichiers projet OS** (`bdzListProjectFiles`, workspace) — charte officielle, brandbook, logo.
   Excellent pour les **fichiers sources** (logo vectoriel, polices, textures) — voir plus bas. Mais
   pour les **valeurs** (couleurs, casse, arrondis), il ne prime jamais sur le site.
3. **Page presse / kit de marque public** du client.
4. **Extraction HTML brute** (backgrounds, classes de boutons) — dernier recours, à vérifier.

Si un doute subsiste sur une couleur : **ne pas deviner, demander**. Une couleur fausse traverse les
20 pages.

### ⛔ Le piège du brandbook périmé — la faute la plus coûteuse de cette skill

Un brandbook interne, un `CLAUDE.md`, une skill « charte maison » ou un PDF de charte décrivent souvent
la marque **telle qu'elle était**, pas telle qu'elle est. Ils sont écrits une fois et ne suivent pas les
refontes. Les faire primer sur le site produit un document méconnaissable — et le client le voit en
trois secondes.

> **Faute réellement commise (août 2026, guide « Budget marketing 2027 »).** La charte interne Bulldozer
> décrivait « noir `#000` / jaune `#DDFF56` / blanc, **0 border-radius** ». Un document entier a été
> produit là-dessus : fond noir, titres en capitales étirées, angles vifs. Le site réel était
> l'inverse — **fond plâtre clair texturé, titres en sentence case, angles arrondis partout, vert
> acide en aplats**. Verdict du client : « je ne sais pas où tu es allé chercher cette DA, il n'y a que
> la police qui est bonne. » Tout le design était à refaire.

**Protocole obligatoire quand une source interne existe :**

1. Extraire les tokens **du site de production d'abord**, avant même d'ouvrir le brandbook.
2. Ouvrir ensuite la source interne et **comparer token par token**.
3. En cas de divergence : **le site gagne**, sans exception.
4. **Consigner la divergence** dans le brandbook de mission (section « Divergences constatées ») et
   la **remonter à l'opérateur** — une charte interne fausse est un problème qui dépasse ce livrable et
   qu'il faut faire corriger à la source.

```
[ ] tokens extraits du site AVANT lecture de toute charte interne
[ ] comparaison site ↔ charte interne faite et écrite
[ ] divergences listées et remontées à l'opérateur
```

### Se méfier de ce qu'on croit savoir de la marque

Le réflexe « je connais cette marque » est le vecteur principal du problème ci-dessus. Deux marques
piègent particulièrement :

- **Le client lui-même**, quand on a déjà travaillé pour lui : sa DA a pu changer depuis.
- **Bulldozer**, quand le document est co-brandé : la charte interne est la plus lue et la plus
  ancienne. **Aller voir bulldozer-collective.com, systématiquement.**

## Vérification obligatoire des polices

Une police lue dans le CSS n'est pas une police disponible pour la conversion PDF. Pour chaque typo :

- vérifier qu'un fichier est accessible (Google Fonts, fichier projet, système) ;
- si elle ne l'est pas, choisir un **fallback explicite de même classe** (grotesque → grotesque,
  serif → serif) et **le consigner** dans le brandbook comme un écart assumé ;
- ne jamais laisser la conversion choisir seule : le PDF sortirait en police système par défaut,
  ce qui se voit immédiatement.

### Chercher la police AVANT de se rabattre sur un fallback

Le fallback est un dernier recours, pas une commodité. Une police propriétaire (GT Pressura, Söhne,
Founders…) est très souvent **déjà installée sur la machine de l'opérateur**, parce qu'il travaille pour
ce client. Ordre à épuiser :

1. `~/Library/Fonts` et `/Library/Fonts` (macOS), `~/.fonts` (Linux) — `ls | grep -i <famille>` ;
2. fichiers projet OS (`bdzListProjectFiles`) ;
3. Google Fonts / dépôt public ;
4. fallback de même classe, consigné comme écart.

### Embarquer la police en data URI (sous-set woff2)

Une police trouvée localement doit être **sous-settée puis embarquée** : le HTML reste autoporté, le PDF
sort dans la vraie police, et le fichier reste petit (~20-25 Ko par graisse en latin).

```bash
python3 -m fontTools.subset "GT-Pressura-Standard-Bold.otf" \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+2018-201A,U+201C-201E,U+2013,U+2014,U+2026,U+2192,U+20AC,U+00D7" \
  --layout-features="kern,liga" --flavor=woff2 --output-file="Standard-Bold.woff2"
```

Puis, à la génération, remplacer un placeholder par le base64 :

```python
b64 = base64.b64encode(open('Standard-Bold.woff2','rb').read()).decode()
html = html.replace('__STD_BOLD__', b64)
# @font-face{font-family:"X";src:url(data:font/woff2;base64,__STD_BOLD__) format("woff2");font-weight:700}
```

Nécessite `fontTools` + `brotli` (`python3 -c "import fontTools, brotli"`). Prendre **uniquement les
graisses réellement utilisées** — 5 à 7 fichiers suffisent pour un document complet.

> ⚖️ **Droits d'usage.** Embarquer une fonderie payante dans un fichier diffusé engage la licence du
> client. Le sous-set latin d'un webfont pour un document que le client diffuse lui-même est l'usage
> courant ; en cas de doute sur une fonderie, **le signaler à l'opérateur** plutôt que de trancher seul.

## Les autres éléments de marque : textures, motifs, fonds

Beaucoup de chartes récentes reposent autant sur une **matière** que sur une couleur (plâtre, grain,
papier, bruit). L'ignorer donne un document techniquement conforme et pourtant plat.

- **Demander les fichiers sources à l'opérateur** ou les récupérer sur le site — ne jamais simuler une
  texture au `feTurbulence` quand la vraie existe : le grain procédural ne ressemble à rien de précis.
- Les échantillons fournis sont souvent des **swatches à coins arrondis avec alpha** : détourer la zone
  100 % opaque avant tout usage, sinon un liseré apparaît au raccord.
- **Rendre la tuile répétable par décalage et fondu**, jamais par symétrie : le miroir crée un axe de
  symétrie très visible (effet papier peint kaléidoscope). Décaler d'une demi-tuile (`np.roll`), puis
  fondre les coutures désormais centrales avec un masque adouci.
- Recaler la valeur sur celle du site (souvent un voile blanc de 40-60 % par-dessus la texture brute).
- **En PDF, ne pas inonder toutes les pages** : réserver la texture à la couverture et aux blocs foncés.
  15 pages de fond texturé sont illisibles à l'impression et lourdes à l'encre.

### La signature graphique : le trait, la courbe, la forme récurrente

Une matière n'est pas la seule chose qu'un document rate quand il se contente des couleurs. Beaucoup
de marques ont un **motif de trait** qui traverse tout leur site — une courbe, un arc, une diagonale,
un jeu de chevrons — et c'est souvent lui, plus que le violet ou le bleu, qui fait dire « c'est eux ».
Un document qui prend les HEX et le logo mais laisse un simple filet droit à la place du motif est
**techniquement conforme et anonyme**.

**Le chercher, dans cet ordre.** Il n'est presque jamais dans un `<svg>` de contenu :

```js
// 1. images de fond des grandes sections (le cas le plus fréquent)
document.querySelectorAll('*').forEach(el => {
  const r = el.getBoundingClientRect(); if (r.width < 400) return;
  const bg = getComputedStyle(el).backgroundImage;
  if (bg && bg !== 'none') console.log(el.className, r.width, bg.slice(0, 200));
});
// 2. grands SVG décoratifs présents dans le DOM
document.querySelectorAll('svg').forEach(s => {
  if (s.getBoundingClientRect().width > 300) console.log(s.getAttribute('viewBox'), s.outerHTML.slice(0, 300));
});
// 3. halos et dégradés d'ambiance : souvent des div dédiées à radial-gradient
```

**Le REDESSINER en vectoriel, pas le réutiliser en bitmap.** Un motif de production est presque
toujours un PNG de plusieurs Mo, dans UNE couleur, calibré pour UNE largeur. Dans un livre blanc il
doit changer de couleur selon le fond (clair / encre), rester net à toutes les échelles et peser
quelques kilo-octets. On relève sa géométrie et on la retrace en `<path>` — en citant l'URL de
l'asset d'origine en commentaire, pour que la fidélité soit vérifiable.

**Le motif doit toucher les deux bords.** Un tracé relevé commence à `x=0` : posé tel quel, son
extrémité démarre au milieu de la page et se lit comme un trait coupé. Prolonger le tracé **hors
cadre** des deux côtés (et ouvrir la viewBox d'autant) pour que l'encre sorte du cadre.

**Il se pose dans les bandes vides, jamais sur du texte.** Un motif qui traverse un titre ou un
paragraphe n'est plus une signature, c'est une salissure. Le vérifier sur le PDF rasterisé, page par
page — à l'écran, un trait à 40 % d'opacité passe inaperçu et ressort à l'impression.

**Le doser.** Deux ou trois apparitions suffisent : l'ouverture (couverture), la clôture (page CTA),
éventuellement une respiration. Sur chaque ouverture de chapitre, il devient un tic de gabarit — et
s'il est pleine largeur, il coûte sa hauteur en pagination (mesuré : 44 mm par occurrence sur A4,
soit 2 pages sur un document de 16).

> Un motif **inventé** — une courbe « dans l'esprit de la marque » — est exactement la faute que R9
> interdit sur les couleurs. Pas de motif trouvé sur le site = pas de motif dans le document, et un
> filet sobre dérivé des tokens à la place.

## Le logo

Priorité stricte :

1. **Fichier projet OS** (`bdzListProjectFiles` / `bdzGetProjectFile`).
2. **Site de production** du client — SVG inline capturé, fichier de la page presse, `og:image` HD.
3. **Échelle `logo-resolver`** : officiel → rehost → banque (Clearbit/Brandfetch) → recréation SVG
   fidèle, en visant le **logotype complet**, pas l'icône carrée.

Règles :

- **Variantes fond clair ET fond sombre** (`logo-resolver` → `scripts/normalize_logo.py`) : beaucoup de
  SVG portent leur `fill` sur chaque `path`, changer le `fill` du `<svg>` ne fait rien.
- **Jamais rogné** : marge de sécurité ≥ 4 % du bord, en couverture comme en pied de page.
- **Jamais généré par IA**, jamais aplati en JPEG s'il est transparent (halo gris).
- Le **niveau atteint est consigné** — une icône seule utilisée faute de logotype se signale, elle ne se
  fait pas passer pour le logo officiel.

## Le brandbook (`brandbook-[client].md`)

Écrit dans le dossier de mission, il rend l'extraction vérifiable — et réutilisable sur le prochain
livrable du même client.

```markdown
# Brandbook — [Client]

## Tokens
| Token | Valeur | Source |
| ----- | ------ | ------ |
| --fond | #FFFFFF | body background, site prod (2026-08-13) |
| --accent | #7A00E6 | var(--brand-primary) dans :root, site prod |
| --texte | #14121A | body color, site prod |
| --typo-display | "Söhne", fallback Inter | @font-face site prod — fichier non accessible, fallback assumé |
| --typo-texte | Inter | Google Fonts, chargé par le site |
| --radius | 4px | border-radius des boutons |
| --casse | none (sentence case), display en Bold | getComputedStyle(h1).textTransform, site prod |

## Dérivés
--accent-ink: #FFFFFF (accent foncé) · --accent-soft: #F3E9FE · --accent-hover: #8E1AF0

## Logo
- Fichier : assets/logo-client.svg — niveau : officiel (SVG inline capturé sur le site, 2026-08-13)
- Variantes : logo-client-dark.svg (fond clair) · logo-client-white.svg (fond sombre)

## Polices
- Standard Bold — trouvée dans ~/Library/Fonts, sous-settée woff2 (24 Ko), embarquée en data URI
- [ou] Söhne — introuvable en fichier → fallback Inter, écart assumé

## Textures / matières
- assets/plaster-light.webp — source fournie par l'opérateur, détourée, tuile sans raccord
  (décalage + fondu), voile blanc 56 % pour recaler sur le site. Réservée à la couverture en PDF.

## Signature graphique
- assets/[motif].svg — **retracé en vectoriel** d'après [URL de l'asset de production], relevé le
  [date]. Prolongé hors cadre à gauche et à droite pour toucher les deux bords. Couleur figée à la
  génération (variante par fond). Posé : couverture + page CTA. Niveau : relevé / absent.

## Divergences constatées (source interne ↔ site de production)
| Token | Charte interne dit | Site dit | Retenu |
| ----- | ------------------ | -------- | ------ |
| --radius | 0 | 10-30px | **site** — signalé à l'opérateur le 2026-08-13 |

## Do / don't visuels
- [ex. aucun dégradé, ombres interdites, photos toujours en noir et blanc…]

## Écarts assumés
- [ex. police display non embarquable → fallback Inter]
```

## Auto-contrôle

```
[ ] tokens extraits du SITE avant toute lecture de charte interne
[ ] divergences site ↔ charte interne écrites et remontées à l'opérateur
[ ] les 7 tokens ont chacun une valeur ET une source datée
[ ] --casse relevé sur le text-transform CALCULÉ, pas sur le markup
[ ] --accent-ink calculé et appliqué partout où l'accent est en fond
[ ] polices cherchées en local (~/Library/Fonts) avant tout fallback
[ ] polices trouvées : sous-settées woff2 et embarquées en data URI
[ ] polices vérifiées comme disponibles, ou fallback explicite consigné
[ ] logo = fichier réel, niveau consigné, variantes clair/sombre produites
[ ] aucune couleur du document hors des 7 tokens et de leurs dérivés
[ ] radius = valeur de la marque appliquée partout (y compris 0)
```
