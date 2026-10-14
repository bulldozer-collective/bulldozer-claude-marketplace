# Briques réutilisées (R4)

| Besoin | Brique | Note |
| ------ | ------ | ---- |
| Résolution projet | `bulldozer-project-chooser` | étape ❶ ; si le client n'y est pas → mode hors-base (site validé par l'humain) |
| Charte réelle du client (7 tokens) + logo fichier | protocole `charte-extraction.md` | **étape ❶**, avant tout visuel — `brandbook-[client].md` produit une fois, lu tel quel par ❹ et ❺. Pas des skills séparées : `emetteur-brand-kit` et `logo-resolver` n'existent pas dans le périmètre actuel, le protocole complet (tokens + logo) est écrit dans ce fichier de référence, à suivre tel quel |
| Illustrations | `bulldozer-studio` | `bdzCreateStudioJob` — préciser dans le prompt de ne pas incruster de texte/typographie dans l'image (l'outil n'a pas de paramètre dédié pour ça), `useTov=true` si le ton de marque doit infuser le prompt. **Couverture visuelle par défaut (R8)** |
| Graphiques | `dataviz` | palette dérivée des tokens client |
| PDF | `pdf-report` (pattern WeasyPrint) | conversion + fallback |
| Niveau rédactionnel | critères tenus en clair dans `lead-magnet-content` | pas de grille externe à charger — zéro remplissage, un lecteur unique, ton du client |
| Publication en URL publique | `bulldozer-hosting` + `bulldozer-fridge` | étape ❼, si demandée au cadrage — zip `index.html` + PDF, `HOSTING_TYPE_STATIC_SITE` |
| Document co-brandé (2 marques) | `co-branding.md` | accord partenaire confirmé par l'opérateur |
| Avis clients réels (testimonials) | `bdzListReviews` / `bdzSearchReviews` | R3 : jamais de verbatim inventé |
