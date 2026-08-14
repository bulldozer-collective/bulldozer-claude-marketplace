# Pannes connues & parades — chaîne lead magnet

> Chaque entrée a été payée en vrai sur des productions précédentes (playbook GTM, ABM, LP de
> rapprochement). Ne pas repayer. **À lire avant la production d'assets et avant la conversion PDF.**

## Bulldozer Studio (illustrations)

| Panne | Symptôme | Parade |
| ----- | -------- | ------ |
| URLs S3 présignées ~1 h | l'image téléchargeable à 14 h est morte à 15 h | **télécharger dans `assets/` immédiatement** après `status=completed`. Jamais d'URL Studio dans un livrable |
| `bdzGetStudioJob` ne re-signe pas | après reprise de session, l'URL est périmée, l'asset est perdu | relancer un job identique → **conserver tous les prompts** dans `plan-assets.json` pour pouvoir regénérer |
| Texte déformé dans l'image | lettres mutilées, faux mots | générer **textless** (« no text, no letters, no numbers, no logos ») et incruster titres/chiffres **en post** (HTML/CSS) |
| Logo généré par l'IA | logo faux, marque déformée | **jamais de logo dans un prompt**. Le logo réel se pose en overlay HTML |
| Styles hétérogènes entre images | 5 illustrations = 5 univers | un **prompt de style de base** commun à toute la série + `useTov` confirmé une fois et appliqué partout |
| Plugin non autorisé | `bdzCreateStudioJob` refusé | le dire, proposer : (a) autoriser le plugin, (b) l'opérateur fournit ses visuels, (c) SVG/data-viz on-brand sans Studio. Jamais de stock cliché en silence |
| **Crédits du fournisseur épuisés** | le job passe en `status: failed` avec `error: "429 … Your prepayment credits are depleted"` — le job est bien accepté, il meurt à l'exécution | l'erreur est **spécifique au modèle**. Parade immédiate : relancer avec l'autre moteur, `imageModel: STUDIO_IMAGE_MODEL_GPT_IMAGE_2` (le 429 Gemini renvoie vers `ai.studio`, celui d'OpenAI est indépendant). Si les deux sont à sec : le dire, ne pas boucler, et proposer (a) recharger les crédits, (b) l'opérateur fournit l'image, (c) livrer le registre typographique et consigner l'absence. **Toujours vérifier `status` ET `error`** : un job « accepté » n'est pas un job réussi |

## Egress du sandbox

| Panne | Symptôme | Parade |
| ----- | -------- | ------ |
| Domaine bloqué | `X-Proxy-Error: blocked-by-allowlist` au téléchargement d'un logo ou d'une image | **tester avant de promettre** : `curl -s -o /dev/null -w "%{http_code}" [url]`. Si bloqué : demander l'ouverture du domaine, faire déposer le fichier, ou descendre l'échelle `logo-resolver` — et le **signaler** |
| Rapatriement Studio impossible | images générées mais inaccessibles | produire une **galerie de récupération** HTML avec des `<a download>` sur les liens présignés, et câbler `assets/` en fallback |

## Rendu SVG (graphiques et schémas)

| Panne | Symptôme | Parade |
| ----- | -------- | ------ |
| **`fill` d'attribut écrasé par une classe** — SVG chargé via `<img>` | libellés blancs sur fond foncé qui ressortent en gris foncé dans le PDF, alors qu'ils sont blancs dans le navigateur | une règle CSS (`.t{fill:…}`) l'emporte sur l'attribut de présentation `fill="…"` : c'est la cascade normale, et Chrome peut masquer le défaut. **Poser les couleurs de texte en `style="fill:…"` inline.** Détecté par `check_alignements.py`. ⚠ **Ne vaut QUE pour un SVG externe — voir la ligne suivante** |
| **`style="fill:…"` IGNORÉ — SVG inliné dans le HTML** | `WARNING: Ignored 'fill:#191B1B' at 1:1, unknown property`, et **tous les libellés des figures sortent en NOIR** | la parade ci-dessus s'inverse selon le mode d'insertion. Inliné, le SVG est parsé par le moteur CSS de WeasyPrint, qui ne connaît pas `fill` comme propriété CSS et **jette la déclaration entière**. Parade : **attribut de présentation `fill="…"`** — aucune classe CSS ne cible ces `<text>`, il est donc à la fois sûr et le seul lu. Retenir la règle : `<img>` → `style` inline ; inliné → attribut |
| **Figures dans une autre police que le document** | le PDF embarque Arial (ou une autre) en plus de la police du client ; invisible à l'œil, visible dans `pdffonts` | le SVG demandait la famille par son nom « public » (`Inter`) alors que le document la déclare sous un autre nom en `@font-face` (`InterDoc`, nom de sous-set…). La famille n'existe pas sous ce nom → fallback silencieux. Parade : **la pile de polices du SVG cite le nom déclaré en `@font-face`**, et `pdffonts` ne doit lister QUE les graisses du client |
| **`stroke="currentColor"` non résolu** | un motif, un filet ou une icône vectorielle sort en **noir** quelle que soit la couleur héritée | WeasyPrint ne résout pas `currentColor` dans un SVG. Parade : **figer la couleur à la génération** et produire une variante par fond (claire / sombre). Interdit de compter sur une seule variante rethémable par CSS |
| **Glyphe absent du sous-ensemble latin** | une puce, une flèche ou un signe change de dessin au milieu du document ; une police parasite apparaît dans `pdffonts` | les fichiers `@fontsource` sont sous-settés : `✓` (U+2713), `→` (U+2192), `‑` (U+2011), `№` (U+2116) en sont typiquement absents. Parade : **vérifier le cmap avant de composer** (`fontTools` : `set(TTFont(f).getBestCmap())`), dessiner les puces en CSS plutôt qu'en caractères, et remplacer les flèches par des tirets cadratins. Contrôle final : extraire le texte du PDF et croiser chaque caractère non-ASCII avec le cmap |
| **Libellé rogné** | « Auvergne-Rhône-Alpes » s'affiche « urvergne-Rhône-Alpes » | la colonne de libellés était dimensionnée sur un libellé plus court : le texte sort de la viewBox et se coupe sans avertissement. **Dimensionner sur le libellé le plus long** ; `check_alignements.py` l'estime |
| **Graphique désaligné du texte** | le bord gauche du graphique ne tombe pas sur la colonne | figure en pleine largeur (marge négative de 18 mm) alors que le SVG garde ~14 mm de marge interne. **Dessiner « encre bord à bord » (x=0 à W) et poser la figure dans la colonne** |
| **Titre dupliqué** | le titre apparaît dans le SVG et dans la légende | le titre écrit dans le SVG échappe à l'échelle typographique du document. **Titres et sources dans le HTML** (`.fig-title` + `<figcaption>`) |

## Conversion PDF

| Panne | Symptôme | Parade |
| ----- | -------- | ------ |
| WeasyPrint absent | `command not found` / `ImportError` | `pip install weasyprint` (dépend de pango/cairo). Si l'install échoue : repli **impression navigateur** (Chrome headless `--print-to-pdf`), en le signalant. Voir `bulldozer:pdf-report` |
| **`pip install weasyprint` installé mais toujours cassé** | « WeasyPrint could not import some external libraries » alors que pango est installé, et `DYLD_FALLBACK_LIBRARY_PATH` n'y change rien | sur macOS, **SIP efface les variables `DYLD_*`** pour les binaires système : le Python de CommandLineTools ne verra jamais les dylibs de Homebrew. Parade : `brew install weasyprint` (formule bottled, embarque son propre Python) |
| **Police variable = plus aucun gras** | avertissement « Ignored `font-weight:100 900` », puis un PDF entièrement en graisse normale | WeasyPrint refuse les plages de graisse en `@font-face`, et Google Fonts ne sert plus que des fichiers variables. Parade : **un `@font-face` par graisse avec des fichiers statiques**, par ex. `cdn.jsdelivr.net/npm/@fontsource/<famille>/files/<famille>-latin-700-normal.woff2`. Vérifier avec `pdffonts` que les graisses sont bien embarquées |
| **Séparateur de milliers invisible** | « 1 180 € » s'imprime « 1180 € » | U+202F (espace fine insécable) est absent du sous-ensemble latin des polices Google Fonts → glyphe manquant. Parade : **U+00A0** |
| **`color-mix()` ignoré → NOIR PUR** | pieds de page, filets de tableau et textes secondaires sortent en noir franc alors que les tokens dérivés étaient calculés | WeasyPrint 69 ne supporte pas `color-mix()` : il jette **la déclaration entière**, la couleur retombe donc sur la valeur héritée. C'est le plus sournois des pièges, parce que le document reste beau — juste faux. Parade : **calculer les dérivés à la main** (mélange sur `--fond`) et écrire la valeur en dur, avec le calcul en commentaire. Vérifié le 2026-08-13 sur WeasyPrint 69.0 |
| **Variables CSS dans les boîtes de marge `@page`** | pied de page sans couleur, ou couleur par défaut | les boîtes `@bottom-left` / `@bottom-right` n'héritent pas de `:root`. Parade : y recopier la valeur du dérivé, et le dire en commentaire |
| **`width:max-content` ignoré** | un bouton ou une pastille prend toute la largeur | propriété non supportée : avertissement discret dans la sortie de conversion. Parade : `display:inline-block` |
| **Bloc flex insécable mal placé** | une ouverture de chapitre migre à la page suivante et laisse une page à moitié vide, même quand la place suffit | WeasyPrint fragmente mal les conteneurs flex avec `break-inside:avoid`. Parade : **passer le bloc en `display:block`** quand le flex ne servait qu'à centrer |
| **Pages-queues à moitié vides** | 10 pages sous le seuil de remplissage, certaines à 17 % | chaque chapitre forçait `page-break-before:always`, et tableaux, listes et blocs do/don't étaient tous `break-inside:avoid`. Parade : **rendre coupables les blocs de type liste et tableau** (ligne insécable, `thead` en `table-header-group`), et **supprimer le saut forcé** quand les ouvertures sont en demi-page |
| **Tableau court coupé** | une seule ligne orpheline avec son en-tête répété sur la page suivante | parade : `break-inside:avoid` sur les **tableaux courts** seulement (classe dédiée), coupe autorisée pour les longs |
| **`<caption>` détachée de son tableau** | le titre du tableau reste **seul** en bas d'une page, le tableau est sur la suivante — et ce, malgré `break-inside:avoid` sur le tableau | `<caption>` est une boîte distincte du corps du tableau dans le modèle de fragmentation : la protection du tableau ne la couvre pas. Parade : **ne pas utiliser `<caption>`**. Mettre un bloc titre AVANT le tableau, les deux dans un conteneur (`.tbl` + `.tbl-title` du template), avec `break-after:avoid` sur le titre. Le titre suit alors son tableau, ou reste en bas de page suivi de ses premières lignes |
| **`break-inside:avoid` ignoré sur un conteneur multi-colonnes** | les dernières entrées d'une liste en 2 colonnes débordent seules sur une page remplie à 8 % | la propriété n'est pas honorée sur un conteneur `column-count`. Parade : **donner sa page au bloc** (`break-before:page` sur son titre). Une page « Sources » dédiée est une convention normale ; une page à 8 % n'en est pas une |
| **SVG en `background-image` étiré sur toute la page** | le motif de marque, posé en fond avec `background-size:100% auto`, occupe soudain 160 mm de haut au lieu de 44 | WeasyPrint ne respecte pas le ratio intrinsèque d'un SVG en couche de fond. Parade : **poser le motif en ÉLÉMENT** (`<img>` avec marges négatives) plutôt qu'en `background-image`. Comportement prévisible, et le positionnement reste contrôlable |
| **Bloc atomique haut = trou garanti** | une page sur deux se termine au tiers, sans qu'aucune règle ne soit violée | tout bloc `break-inside:avoid` de plus de ~80 mm a une chance sur deux de ne pas tenir en bas de page. Parade : **compacter les blocs atomiques avant d'ajouter des images pour combler**. Mesuré : compacter les ouvertures de chapitre a fait passer un document de 18 à 17 pages et de 8 à 5 pages signalées, sans toucher au texte |
| **Lire la sortie de conversion** | — | WeasyPrint écrit ses avertissements sur la sortie standard et convertit quand même. **Une conversion « réussie » avec des avertissements est une conversion à relire** |
| Polices non embarquées | le PDF affiche une police de substitution | déclarer la police en `@font-face` avec un fichier local, ou choisir un fallback système explicite. **Vérifier sur le PDF converti**, jamais sur l'aperçu HTML |
| Images externes non chargées | cadres vides dans le PDF | chemins **locaux relatifs** uniquement (`assets/…`), jamais d'URL distante dans le HTML destiné à la conversion |
| Sauts de page sauvages | titre orphelin en bas de page, tableau coupé | `break-after: avoid` sur les titres, `break-inside: avoid` sur cartes/tableaux/figures. **Se contrôle page par page sur le PDF, pas sur le HTML** |
| Sommaire faux | numéros de page inventés ou décalés | générer le sommaire **après** une première conversion, en lisant les pages réelles |

## Hébergement (aperçu optionnel)

| Panne | Symptôme | Parade |
| ----- | -------- | ------ |
| `HOSTING_TYPE_STATIC_SITE` instable | 403 AccessDenied sur `*.bulldozer-os.fr` | préférer **SINGLE_FILE** — le lead magnet HTML est autoporté, c'est le bon cas |
| Lien présigné = 1 h | le lien envoyé le matin est mort l'après-midi | le dire ; l'hébergement reste valide, regénérer un lien via `bdzExploreHosting` |
| Fridge : < 25 Mo, vie ~2 h | upload OK mais hosting créé plus tard → source disparue | enchaîner fridge → `bdzCreateHosting` **dans la foulée** |
| Poids | HTML autoporté de plusieurs Mo qui saccade | JPEG q≈82, ≤ 1600 px, PNG réservé aux transparents. Pour le contrôle visuel, préférer une version à assets liés ; livrer l'autoportée une fois validée |

## Reset du sandbox

`assets/` vidé, scripts perdus. Parade : tout est regénérable depuis le dossier de mission — prompts dans
`plan-assets.json`, contenu dans `contenu.md`, tokens dans `brandbook-[client].md`. Aucun état
uniquement en mémoire.

## Règle générale

Quand quelque chose est indisponible : **le dire** (quoi, pourquoi, impact) → **proposer le repli** →
**le consigner** au rapport de complétude (⚠️ dégradé / ❌ manquant). Jamais inventer une donnée pour
combler un trou — une couleur « de mémoire », un chiffre « plausible », un verbatim « représentatif »
sont exactement ce que R3 interdit.

## Maintenance

Une nouvelle panne vécue s'ajoute ici (panne / symptôme / parade), et se remonte au produit via
`anthropic-skills:feedback-bug-os` si c'est un bug de l'OS.
