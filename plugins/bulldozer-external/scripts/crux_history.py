#!/usr/bin/env python3
"""
CrUX History API — tendances Core Web Vitals sur 25 semaines.

Identifie si les performances s'améliorent, sont stables ou se dégradent
pour chaque métrique CWV. Indispensable pour contextualiser un audit dans le temps.

Source originale : AgriciDaniel/claude-seo (MIT) — adapté pour Bulldozer SEO Agent.

Usage:
    python crux_history.py https://example.com
    python crux_history.py https://example.com --form-factor PHONE --json
    python crux_history.py https://example.com --origin
"""

import argparse
import json
import sys
from typing import Optional
from urllib.parse import urlparse

try:
    import requests
except ImportError:
    print("Error: requests library required. Install with: pip install requests")
    sys.exit(1)

import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from google_auth import get_api_key, validate_url

CRUX_HISTORY_ENDPOINT = "https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord"

CWV_THRESHOLDS = {
    "largest_contentful_paint": {"good": 2500, "poor": 4000, "label": "LCP", "unit": "ms"},
    "interaction_to_next_paint": {"good": 200, "poor": 500, "label": "INP", "unit": "ms"},
    "cumulative_layout_shift": {"good": 0.1, "poor": 0.25, "label": "CLS", "unit": ""},
    "first_contentful_paint": {"good": 1800, "poor": 3000, "label": "FCP", "unit": "ms"},
    "experimental_time_to_first_byte": {"good": 800, "poor": 1800, "label": "TTFB", "unit": "ms"},
}


def query_history(
    url_or_origin: str,
    api_key: str,
    form_factor: Optional[str] = None,
) -> dict:
    """
    Query CrUX History API for weekly CWV trends (up to 25 data points).

    Retourne les séries temporelles p75 + analyse de tendance (amélioration/stable/dégradation).
    """
    result = {
        "target": url_or_origin,
        "form_factor": form_factor or "ALL",
        "metrics": {},
        "collection_periods": [],
        "trends": {},
        "error": None,
    }

    if not validate_url(url_or_origin):
        result["error"] = "URL invalide. Seules les URLs http/https publiques sont acceptées."
        return result

    parsed = urlparse(url_or_origin)
    is_origin = parsed.path in ("", "/") and not parsed.query

    body = {}
    if is_origin:
        body["origin"] = f"{parsed.scheme}://{parsed.netloc}"
    else:
        body["url"] = url_or_origin

    if form_factor:
        body["formFactor"] = form_factor.upper()

    try:
        resp = requests.post(
            f"{CRUX_HISTORY_ENDPOINT}?key={api_key}",
            json=body,
            timeout=30,
        )

        if resp.status_code == 404:
            target_type = "origin" if is_origin else "URL"
            result["error"] = (
                f"Pas de données CrUX History pour cet {target_type}. "
                "Trafic Chrome insuffisant pour être éligible."
            )
            return result

        if resp.status_code == 429:
            result["error"] = "Rate limit CrUX History dépassé (150 QPM partagés). Attendre et réessayer."
            return result

        resp.raise_for_status()
        data = resp.json()
    except requests.exceptions.RequestException as e:
        result["error"] = f"Requête CrUX History échouée : {e}"
        return result

    record = data.get("record", {})

    # Collection periods (weekly)
    periods = record.get("collectionPeriods", [])
    for period in periods:
        first = period.get("firstDate", {})
        last = period.get("lastDate", {})
        result["collection_periods"].append({
            "first": f"{first.get('year')}-{first.get('month', 0):02d}-{first.get('day', 0):02d}",
            "last": f"{last.get('year')}-{last.get('month', 0):02d}-{last.get('day', 0):02d}",
        })

    # Metrics timeseries
    for metric_name, metric_data in record.get("metrics", {}).items():
        if metric_name not in CWV_THRESHOLDS:
            continue

        thresholds = CWV_THRESHOLDS[metric_name]
        p75s_data = metric_data.get("percentilesTimeseries", {})
        p75s_raw = p75s_data.get("p75s", [])

        p75s = []
        for val in p75s_raw:
            if val is None:
                p75s.append(None)
            elif metric_name == "cumulative_layout_shift":
                try:
                    p75s.append(float(str(val)))
                except (ValueError, TypeError):
                    p75s.append(None)
            else:
                try:
                    p75s.append(int(val))
                except (ValueError, TypeError):
                    try:
                        p75s.append(float(val))
                    except (ValueError, TypeError):
                        p75s.append(None)

        # Distribution histograms (good / needs-improvement / poor %)
        histogram_ts = metric_data.get("histogramTimeseries", [])
        good_pcts, ni_pcts, poor_pcts = [], [], []

        if len(histogram_ts) >= 3:
            for bin_idx, target_list in [(0, good_pcts), (1, ni_pcts), (2, poor_pcts)]:
                bin_densities = histogram_ts[bin_idx].get("densities", [])
                for d in bin_densities:
                    if d is None or str(d) == "NaN":
                        target_list.append(None)
                    else:
                        try:
                            target_list.append(round(float(d) * 100, 1))
                        except (ValueError, TypeError):
                            target_list.append(None)

        result["metrics"][metric_name] = {
            "label": thresholds["label"],
            "unit": thresholds["unit"],
            "p75_values": p75s,
            "good_percentages": good_pcts,
            "needs_improvement_percentages": ni_pcts,
            "poor_percentages": poor_pcts,
            "latest_p75": p75s[-1] if p75s and p75s[-1] is not None else None,
            "good_threshold": thresholds["good"],
            "poor_threshold": thresholds["poor"],
        }

    result["trends"] = detect_trends(result["metrics"])
    return result


def detect_trends(metrics: dict) -> dict:
    """
    Compare la moyenne des 4 premières semaines vs les 4 dernières semaines.

    Direction : improving (< -5%) / stable (±5%) / degrading (> +5%)
    Note : pour les CWV, une valeur plus basse = meilleure performance.
    """
    trends = {}

    for metric_name, data in metrics.items():
        p75s = data.get("p75_values", [])
        valid = [v for v in p75s if v is not None]

        if len(valid) < 8:
            trends[metric_name] = {
                "direction": "données_insuffisantes",
                "label": data.get("label", metric_name),
            }
            continue

        first_4 = valid[:4]
        last_4 = valid[-4:]
        avg_first = sum(first_4) / len(first_4)
        avg_last = sum(last_4) / len(last_4)

        change_pct = ((avg_last - avg_first) / avg_first * 100) if avg_first != 0 else 0

        # Pour les CWV : baisse = amélioration
        if abs(change_pct) < 5:
            direction = "stable"
        elif change_pct < 0:
            direction = "improving"
        else:
            direction = "degrading"

        is_cls = data.get("unit") == ""
        trends[metric_name] = {
            "direction": direction,
            "change_pct": round(change_pct, 1),
            "earliest_avg": round(avg_first, 3) if is_cls else round(avg_first),
            "latest_avg": round(avg_last, 3) if is_cls else round(avg_last),
            "label": data.get("label", metric_name),
            "unit": data.get("unit", ""),
            "data_points": len(valid),
        }

    return trends


def main():
    parser = argparse.ArgumentParser(
        description="CrUX History — tendances Core Web Vitals sur 25 semaines"
    )
    parser.add_argument("url", help="URL ou origine à analyser")
    parser.add_argument("--form-factor", choices=["PHONE", "DESKTOP", "TABLET"])
    parser.add_argument("--api-key", help="Clé API Google (override PAGESPEED_API_KEY)")
    parser.add_argument("--origin", action="store_true", help="Forcer une requête au niveau de l'origine")
    parser.add_argument("--json", "-j", action="store_true", help="Sortie JSON")
    args = parser.parse_args()

    api_key = args.api_key or get_api_key()
    if not api_key:
        print("Erreur : clé API requise. Définir PAGESPEED_API_KEY dans .env", file=sys.stderr)
        sys.exit(1)

    target = args.url
    if args.origin:
        parsed = urlparse(target)
        target = f"{parsed.scheme}://{parsed.netloc}"

    result = query_history(target, api_key, form_factor=args.form_factor)

    if args.json:
        print(json.dumps(result, indent=2))
        sys.exit(1 if result.get("error") else 0)

    if result.get("error"):
        print(f"Erreur : {result['error']}", file=sys.stderr)
        sys.exit(1)

    print(f"=== CrUX History ({result.get('form_factor', 'ALL')}) ===")
    print(f"Cible : {result.get('target')}")

    periods = result.get("collection_periods", [])
    if periods:
        print(f"Période : {periods[0]['first']} → {periods[-1]['last']} ({len(periods)} semaines)")

    print("\nAnalyse de tendance (4 premières semaines vs 4 dernières) :")
    direction_labels = {
        "improving": "EN AMÉLIORATION",
        "stable": "STABLE",
        "degrading": "EN DÉGRADATION",
        "données_insuffisantes": "DONNÉES INSUFFISANTES",
    }
    for name, trend in result.get("trends", {}).items():
        label = trend.get("label", name)
        direction = trend.get("direction", "?")
        direction_fr = direction_labels.get(direction, direction)

        if direction == "données_insuffisantes":
            print(f"  {label} : {direction_fr}")
            continue

        change = trend.get("change_pct", 0)
        earliest = trend.get("earliest_avg")
        latest = trend.get("latest_avg")
        unit = trend.get("unit", "")
        print(f"  {label} : {direction_fr} ({change:+.1f}%) | {earliest}{unit} → {latest}{unit}")


if __name__ == "__main__":
    main()
