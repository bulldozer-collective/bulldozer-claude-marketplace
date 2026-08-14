# Production technique — HTML autoporté → PDF → contrôle

> Le PDF est le livrable. Le HTML est la source qui permet de le corriger. Les deux se livrent (règle du
> master). Ce qui suit reprend le pattern `bulldozer:pdf-report` et les pannes déjà payées.

## 1. HTML autoporté

- **CSS inline dans le document** (une balise `<style>`), aucune feuille externe, aucune police chargée
  depuis un CDN au moment de la conversion : ce qui n'est pas local ne sera pas rendu.
- **Images en chemins locaux relatifs** (`assets/…`). Une URL distante dans un HTML destiné à WeasyPrint
  produit un cadre vide, silencieusement.
- **Polices** : `@font-face` avec un fichier local, ou fallback système explicite (voir
  `charte-extraction.md`).
- Tokens en `:root` : c'est ce qui rend le document rethémable en changeant 6 valeurs.

## 2. Règles `@page`

```css
@page {
  size: A4;
  margin: 20mm 18mm 16mm 18mm;
  @bottom-center { content: counter(page) " / " counter(pages); font-size: 7.5pt; color: var(--texte-secondaire); }
}
@page :first { margin: 0; @bottom-center { content: none; } }   /* couverture pleine page */
.chapter-opener { page-break-before: always; }
h1, h2, h3 { break-after: avoid; }                               /* jamais de titre orphelin */
.kpi-card, .pullquote, .testimonial, .encart, figure, table { break-inside: avoid; }
p { orphans: 3; widows: 3; }
```

`break-after: avoid` sur les titres et `break-inside: avoid` sur les blocs sont les deux réglages qui
évitent 90 % des défauts de pagination. `orphans/widows: 3` évite la ligne seule en haut ou en bas de
page.

## 2 bis. Les quatre pièges de pagination déjà payés

Mesurés sur le guide « Budget marketing 2027 » (août 2026), en comparant des variantes de CSS et en
chiffrant le vide (voir §5). **Ne pas les redécouvrir.**

### a) `padding-block: 0` en print décolle… et recolle tout

Neutraliser l'espacement écran des sections (`section { padding-block: 0 }`) les fait se **toucher bord
à bord** en PDF : un sommaire vient se coller au bloc précédent, sans respiration. Compenser
explicitement :

```css
section + section { margin-top: 14mm; }
#chapitre-ouvrant, .band, .cta { margin-top: 0; }   /* déjà en break-before: page */
```

> Le second sélecteur n'est pas cosmétique : sans lui, la marge s'ajoute **en haut d'une page déjà
> neuve** et pousse le pied de page seul sur une page supplémentaire.

### b) Forcer un saut de page par section est mesurablement pire

`break-before: page` sur chaque chapitre paraît propre. Mesuré : **des pages vides à 86 %**, parce que
chaque section repart en haut de page quelle que soit sa longueur. Laisser le contenu **couler**, et ne
poser `break-before: page` que sur les vraies ouvertures (couverture, bandeaux pleine page, clôture).

| Stratégie | Pages | Pire page |
| --------- | ----- | --------- |
| flux + `break-inside: avoid` sur les blocs | **14** | **26 % de vide** |
| `break-before: page` par chapitre | 19 | 86 % de vide |

### c) Un bloc plus haut qu'une page fabrique un trou de 47 %

`break-inside: avoid` sur un bloc qui ne rentre pas dans l'espace restant le bascule à la page
suivante — et laisse le trou derrière lui. Deux issues, à arbitrer :

- **réduire le bloc de 5 %** (corps du `pre`, interligne, padding) pour qu'il rentre : c'est presque
  toujours la bonne réponse, et 0,5 pt suffit souvent ;
- **autoriser la coupe** (`break-inside: auto`) si le bloc dépasse structurellement une page — un long
  listing se coupe mieux qu'il ne laisse une demi-page blanche.

Le choix appartient à l'opérateur quand il change la lecture : un bloc de prompt coupé en deux gêne
plus qu'une demi-page vide, l'inverse est vrai pour un tableau long.

### d) Le filet de séparation qui tombe en haut de page

Un `border-top` de séparation entre blocs devient, une fois sur trois, un **trait isolé en haut de
page** qui ressemble à un bug d'export. Séparer par une **marge**, pas par un filet — ou n'utiliser le
filet que sur des blocs dont on maîtrise la position. Corollaire : si l'on garde un filet supérieur,
mettre `border-radius: 0` sur ce bloc en print, sinon le rayon dessine un arc parasite.

## 3. Conversion

```bash
weasyprint lead-magnet.html lead-magnet.pdf
```

Si WeasyPrint est absent :

```bash
pip install weasyprint     # dépend de pango/cairo — peut échouer selon la machine
```

Fallback assumé et **signalé** si l'installation échoue — impression navigateur headless :

```bash
chrome --headless --disable-gpu --print-to-pdf=lead-magnet.pdf --no-pdf-header-footer lead-magnet.html
```

Le fallback rend correctement la plupart des mises en page. Testé sur `assets/template-lead-magnet.html`
(Chrome headless, macOS, août 2026) : les boîtes de marge `@bottom-left` / `@bottom-right`, les compteurs
`counter(page)` / `counter(pages)` et les pages nommées (`@page opener`) sont bien rendus. Ce n'est pas
garanti sur toutes les versions : **vérifier la pagination et le sommaire sur le PDF**, systématiquement.

> Les sections pleine page (couverture, ouvertures, CTA) utilisent la classe `.fullbleed` du template :
> hauteur 296 mm + marges négatives calées sur celles de `@page`. C'est ce qui rend le fond perdu
> portable entre WeasyPrint et l'impression navigateur. Ne pas remplacer par `height: 297mm` + `margin: 0`
> sur une page nommée : le bloc déborde alors d'un millimètre et crée une page blanche parasite
> (défaut constaté au test).

## 4. Sommaire paginé juste

Le sommaire ne peut pas être écrit avant la conversion : les numéros de page n'existent pas encore.

1. Convertir une première fois avec un sommaire provisoire.
2. Lire les pages réelles de chaque ouverture de chapitre sur le PDF.
3. Réécrire les numéros dans le HTML, reconvertir.
4. Vérifier que l'ajout n'a pas décalé la pagination (un sommaire qui gagne une ligne peut pousser tout
   le document d'une page — recontrôler, ne pas supposer).

## 5. Contrôle page par page (obligatoire)

Un PDF non inspecté n'est pas validé. Deux niveaux :

**Automatique** — le script de la skill review repère les défauts mesurables :

```bash
python3 ../lead-magnet-review/scripts/check_rythme.py lead-magnet.pdf --min-fill 0.66 --max-prose-run 4
```

Il sort, par page : le taux de remplissage, les suites de prose trop longues, le contraste d'échelle
typographique, et un verdict global.

> **Arbitrer une variante de CSS print, c'est mesurer — pas regarder.** Quand une pagination est
> discutable, produire deux PDF avec deux réglages, passer `check_rythme.py` sur les deux, et garder
> celui qui minimise le vide. C'est ce qui a tranché le tableau du §2 bis b : l'intuition disait
> « un chapitre par page, c'est plus propre », la mesure disait l'inverse.
>
> Repli sans dépendance si `check_rythme.py` est indisponible — mesure du vide en bas de page à partir
> du rendu image, ce qui capte aussi les blocs graphiques :
>
> ```bash
> pdftoppm -png -r 72 doc.pdf pg   # puis, par page : dernière ligne non blanche / hauteur utile
> ```

**Visuel** — rasteriser et regarder. Ce qu'aucun script ne voit :

- un titre en bas de page dont le texte commence à la page suivante ;
- une image coupée par un saut de page ou débordant de sa colonne ;
- une carte KPI dont le chiffre passe à la ligne ;
- un logo posé sur un fond qui l'avale (contraste insuffisant) ;
- une page « techniquement remplie » mais visuellement morte (tout au même corps).

## 6. Auto-contrôle avant de rendre la main

```
[ ] HTML autoporté (aucune ressource externe), images en chemins locaux
[ ] polices embarquées ou fallback explicite consigné
[ ] @page configuré : format, marges, pagination, couverture sans header/footer
[ ] break-after/break-inside posés sur titres et blocs
[ ] espacement entre sections vérifié en PDF (padding-block:0 les recolle — §2 bis a)
[ ] aucun bloc coupé, OU coupe assumée et arbitrée (§2 bis c)
[ ] tout CTA masqué à l'impression a son équivalent texte (URL, email) en clair
[ ] pas de filet de séparation isolé en haut d'une page (§2 bis d)
[ ] PDF généré APRÈS la dernière modification du HTML
[ ] check_rythme.py passé, défauts traités ou consignés
[ ] inspection visuelle page par page effectuée
[ ] sommaire recontrôlé après la dernière conversion
[ ] les deux fichiers (HTML + PDF) existent et s'ouvrent
```
