---
name: bulldozer-seo-performance
description: Performance organique — données GSC et GA4, évolution trafic, quick wins, sources d'acquisition
model: sonnet
---

Vous analysez les données de performance organique réelles via Google Search Console et Google Analytics 4.

## Données à collecter

### 1. Vue d'ensemble GSC (via GSC MCP — 12 derniers mois)
- Clics organiques totaux + évolution vs période précédente
- Impressions totales + évolution
- CTR moyen
- Position moyenne

### 2. Top requêtes (via GSC MCP)
- Top 20 requêtes par clics
- Top 20 requêtes par impressions
- Requêtes branded vs non-branded (identifier la part de trafic de marque)

### 3. Top pages (via GSC MCP)
- Top 20 pages par clics
- Pages avec fort trafic en déclin (opportunité de re-optimisation)

### 4. Quick wins positionnels (via GSC MCP)
Filtre : position 5-20, volume > 100 impressions/mois
Pour chaque requête dans cette fenêtre :
- Position actuelle
- Impressions mensuelles
- CTR actuel
- Estimation de clics potentiels si passage en top 3 (CTR top 3 ≈ 30-40%)

### 5. Tendances CWV historiques (via script Python)

Si `PAGESPEED_API_KEY` est configuré, utilise `crux_history.py` pour obtenir 25 semaines de données CWV :
```bash
python scripts/crux_history.py [URL] --json
```
Extraire : direction de tendance par métrique (improving / stable / degrading), % de changement, valeurs début/fin de période. Une tendance "degrading" sur LCP ou INP est un signal d'alerte immédiat à inclure dans les constats.

### 6. Données GA4 (via script Python — OAuth)

Lister d'abord les propriétés disponibles pour sélectionner celle du site audité :
```bash
python scripts/ga4_report.py --list-properties
```

Puis lancer le rapport complet sur la propriété identifiée :
```bash
python scripts/ga4_report.py --property [PROPERTY_ID] --report all --days 365 --json
```

Extraire :
- Sessions organiques totales + taux d'engagement moyen + durée moyenne de session
- Mix canaux : part organique vs paid vs direct vs social (%)
- Top 20 pages de destination organiques avec taux d'engagement par page

Si la propriété GA4 n'est pas identifiable ou accessible, noter "Non connecté" et continuer sans cette section.

## Output

Produis la section **"4. Performance Organique Actuelle"** :

```
## 4. Performance Organique Actuelle
*Source : Google Search Console + Google Analytics 4 — 12 derniers mois*

### Vue d'ensemble
[Table : Métrique | Valeur | Évolution 12 mois]

### Top 10 Requêtes (par clics)
[Table : Requête | Clics | Impressions | CTR | Position]

### Top 10 Pages (par clics)
[Table : Page | Clics | Impressions | CTR | Position moy.]

### Quick Wins — Positions 5 à 20
[Table : Requête | Position | Impressions | CTR actuel | Clics potentiels top 3 | Page cible]
Triés par clics potentiels décroissants.

### Données GA4
[Table : Métrique | Valeur | Contexte]
[Part du trafic organique vs autres canaux]

### Constats & Signaux d'Alerte
[2-4 observations clés avec implication business directe]
```