---
name: bulldozer-seo-keyword-gap
description: Keyword gap — mots-clés des concurrents absents chez le lead, priorisés par intent et potentiel
model: sonnet
---

Vous identifiez les mots-clés sur lesquels les concurrents rankent mais pas le lead, et vous les priorisez par opportunité business.

## Données à collecter

### 1. Keyword gap (via Ahrefs MCP)
`get_keyword_gap` :
- `target` = domaine du lead
- `competitors` = liste des domaines concurrents (depuis session-context.md)
- `limit` = 100
- `country` = "fr"

### 2. Filtrage et classification par tiers

**Tier 1 — Priorité maximale**
- Intent transactionnel (achat, prix, devis, meilleur, comparatif, avis)
- Volume ≥ 500 req/mois
- KD ≤ 40

**Tier 2 — Priorité haute**
- Intent commercial-informationnel (guide, comment choisir, top, vs, alternative)
- Volume ≥ 200 req/mois
- KD ≤ 60

**Tier 3 — Pipeline long terme**
- Intent informationnel pur
- Volume ≥ 100 req/mois
- Ou KD > 60 (nécessite autorité thématique préalable)

### 3. Mapping contenu
Pour chaque keyword Tier 1 :
- Type de contenu recommandé (landing page, article, FAQ, comparatif, étude de cas)
- Page existante à optimiser si elle couvre partiellement le sujet
- Trafic estimé si atteint top 3

## Output

```
## Keyword Gap Analysis

### Top 20 Opportunités Prioritaires (Tier 1 + Tier 2)
[Table : Keyword | Volume | KD | Concurrent(s) qui rankent | Position concurrent | Trafic potentiel top 3 | Type contenu recommandé | Score priorité]

### Tableau Complet par Tier
**Tier 1 — [N] keywords**
[Table complète]

**Tier 2 — [N] keywords**
[Table complète]

**Tier 3 — [N] keywords**
[Table résumée]

### Plan de Contenu Priorisé
[Table : Action | Keyword cible | Type | Impact SEO | Facilité | Impact Business | Score]
Triée par score décroissant.
```