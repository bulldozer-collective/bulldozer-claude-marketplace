#!/usr/bin/env python3
"""
PageSpeed Insights v5 + CrUX API — données lab ET terrain.

Combine l'analyse Lighthouse (données lab) avec les vraies données utilisateurs
Chrome (CrUX field data, 28 jours glissants) pour un diagnostic CWV complet.

Source originale : AgriciDaniel/claude-seo (MIT) — adapté pour Bulldozer SEO Agent.

Usage:
    python pagespeed_check.py https://example.com
    python pagespeed_check.py https://example.com --strategy mobile
    python pagespeed_check.py https://example.com --crux-only
    python pagespeed_check.py https://example.com --psi-only --json
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

PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
CRUX_ENDPOINT = "https://chromeuxreport.googleapis.com/v1/records:queryRecord"

# Core Web Vitals thresholds (2026)
CWV_THRESHOLDS = {
    "largest_contentful_paint": {"good": 2500, "poor": 4000, "unit": "ms", "label": "LCP"},
    "interaction_to_next_paint": {"good": 200, "poor": 500, "unit": "ms", "label": "INP"},
    "cumulative_layout_shift": {"good": 0.1, "poor": 0.25, "unit": "", "label": "CLS"},
    "first_contentful_paint": {"good": 1800, "poor": 3000, "unit": "ms", "label": "FCP"},
    "experimental_time_to_first_byte": {"good": 800, "poor": 1800, "unit": "ms", "label": "TTFB"},
}

PSI_METRIC_MAP = {
    "LARGEST_CONTENTFUL_PAINT_MS": "largest_contentful_paint",
    "INTERACTION_TO_NEXT_PAINT": "interaction_to_next_paint",
    "CUMULATIVE_LAYOUT_SHIFT_SCORE": "cumulative_layout_shift",
    "FIRST_CONTENTFUL_PAINT_MS": "first_contentful_paint",
    "EXPERIMENTAL_TIME_TO_FIRST_BYTE": "experimental_time_to_first_byte",
}


def rate_metric(metric_name: str, value: float) -> str:
    thresholds = CWV_THRESHOLDS.get(metric_name)
    if not thresholds:
        return "unknown"
    if value <= thresholds["good"]:
        return "good"
    elif value <= thresholds["poor"]:
        return "needs-improvement"
    else:
        return "poor"


def run_pagespeed(
    url: str,
    strategy: str = "mobile",
    api_key: Optional[str] = None,
    categories: Optional[list] = None,
) -> dict:
    """
    Run PageSpeed Insights v5 (Lighthouse lab analysis).

    Returns lab metrics, Lighthouse scores, opportunities, and failed audits.
    """
    result = {
        "url": url,
        "strategy": strategy,
        "lighthouse_scores": {},
        "lab_metrics": {},
        "field_metrics": {},
        "opportunities": [],
        "diagnostics": [],
        "failed_audits": [],
        "passed_audits_count": 0,
        "seo_audits": [],
        "accessibility_audits": [],
        "audit_details": {},
        "analysis_timestamp": None,
        "error": None,
    }

    if not validate_url(url):
        result["error"] = "URL invalide. Seules les URLs http/https publiques sont acceptées."
        return result

    if categories is None:
        categories = ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"]

    params = {"url": url, "strategy": strategy.upper()}
    params["category"] = categories
    if api_key:
        params["key"] = api_key

    try:
        resp = requests.get(PSI_ENDPOINT, params=params, timeout=120)
        resp.raise_for_status()
        data = resp.json()
    except requests.exceptions.Timeout:
        result["error"] = "PageSpeed Insights timeout (120s). La page cible est peut-être très lente."
        return result
    except requests.exceptions.HTTPError as e:
        if resp.status_code == 429:
            result["error"] = "PSI rate limit dépassé (240 QPM / 25 000 QPD). Attendre et réessayer."
        elif resp.status_code == 400:
            result["error"] = f"URL ou paramètres invalides : {resp.text}"
        else:
            result["error"] = f"Erreur API PSI {resp.status_code} : {e}"
        return result
    except requests.exceptions.RequestException as e:
        result["error"] = f"Requête échouée : {e}"
        return result

    result["analysis_timestamp"] = data.get("analysisUTCTimestamp")

    lr = data.get("lighthouseResult", {})
    for cat_key, cat_data in lr.get("categories", {}).items():
        result["lighthouse_scores"][cat_key] = round(cat_data.get("score", 0) * 100)

    audits = lr.get("audits", {})
    lab_audit_ids = [
        "first-contentful-paint", "largest-contentful-paint",
        "total-blocking-time", "cumulative-layout-shift",
        "speed-index", "interactive",
    ]
    for audit_id in lab_audit_ids:
        audit = audits.get(audit_id, {})
        if audit.get("numericValue") is not None:
            result["lab_metrics"][audit_id] = {
                "value": audit["numericValue"],
                "display": audit.get("displayValue", ""),
                "score": audit.get("score"),
            }

    # Field data from PSI loading experience
    for exp_key in ["loadingExperience", "originLoadingExperience"]:
        exp = data.get(exp_key, {})
        metrics = exp.get("metrics", {})
        if metrics:
            field_source = "url" if exp_key == "loadingExperience" else "origin"
            for psi_name, crux_name in PSI_METRIC_MAP.items():
                metric_data = metrics.get(psi_name, {})
                if metric_data:
                    p75 = metric_data.get("percentile")
                    if p75 is not None:
                        p75_val = p75 / 100 if (crux_name == "cumulative_layout_shift" and p75 > 1) else p75
                        result["field_metrics"][f"{field_source}_{crux_name}"] = {
                            "p75": p75_val,
                            "rating": metric_data.get("category", "NONE").lower().replace("_", "-"),
                            "source": f"PSI {field_source}-level",
                        }

    # Opportunities (ranked by time savings)
    for audit_id, audit in audits.items():
        if audit.get("details", {}).get("type") == "opportunity":
            savings = audit.get("details", {}).get("overallSavingsMs")
            if savings and savings > 0:
                result["opportunities"].append({
                    "id": audit_id,
                    "title": audit.get("title", audit_id),
                    "savings_ms": savings,
                    "description": audit.get("description", ""),
                })
    result["opportunities"].sort(key=lambda x: x["savings_ms"], reverse=True)

    # Diagnostics
    diagnostic_ids = [
        "dom-size", "render-blocking-resources", "uses-long-cache-ttl",
        "total-byte-weight", "mainthread-work-breakdown", "bootup-time",
        "font-display", "third-party-summary", "largest-contentful-paint-element",
        "layout-shifts", "long-tasks", "duplicated-javascript",
        "legacy-javascript", "unused-javascript", "unused-css-rules",
    ]
    for diag_id in diagnostic_ids:
        audit = audits.get(diag_id, {})
        if audit:
            result["diagnostics"].append({
                "id": diag_id,
                "title": audit.get("title", diag_id),
                "display": audit.get("displayValue", ""),
                "score": audit.get("score"),
            })

    # Failed audits
    opportunity_ids = {o["id"] for o in result["opportunities"]}
    passed_count = 0
    for audit_id, audit in audits.items():
        score = audit.get("score")
        if score is None:
            continue
        if score >= 0.9:
            passed_count += 1
            continue
        if audit_id in opportunity_ids:
            continue
        result["failed_audits"].append({
            "id": audit_id,
            "title": audit.get("title", audit_id),
            "score": score,
            "display": audit.get("displayValue", ""),
        })
    result["passed_audits_count"] = passed_count
    result["failed_audits"].sort(key=lambda x: x.get("score", 1))

    # SEO audits
    seo_cat = lr.get("categories", {}).get("seo", {})
    for ref in seo_cat.get("auditRefs", []):
        audit = audits.get(ref.get("id"), {})
        if audit and audit.get("score") is not None:
            result["seo_audits"].append({
                "id": ref["id"],
                "title": audit.get("title", ref["id"]),
                "score": audit["score"],
                "pass": audit["score"] >= 0.9,
            })

    return result


def query_crux(
    url_or_origin: str,
    api_key: str,
    form_factor: Optional[str] = None,
) -> dict:
    """
    Query the CrUX API for real field data (28-day rolling average).

    Contrairement à PSI (lab), CrUX reflète l'expérience réelle des utilisateurs Chrome.
    """
    result = {
        "target": url_or_origin,
        "metrics": {},
        "collection_period": None,
        "form_factor": form_factor or "ALL",
        "error": None,
    }

    if not validate_url(url_or_origin):
        result["error"] = "URL invalide."
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
        resp = requests.post(f"{CRUX_ENDPOINT}?key={api_key}", json=body, timeout=30)

        if resp.status_code == 404:
            target_type = "origin" if is_origin else "URL"
            result["error"] = (
                f"Pas de données CrUX pour cet {target_type}. "
                "Le site n'a pas suffisamment de trafic Chrome pour être éligible."
            )
            return result

        if resp.status_code == 429:
            result["error"] = "Rate limit CrUX dépassé (150 QPM). Attendre et réessayer."
            return result

        resp.raise_for_status()
        data = resp.json()
    except requests.exceptions.RequestException as e:
        result["error"] = f"Requête CrUX échouée : {e}"
        return result

    record = data.get("record", {})

    cp = record.get("collectionPeriod", {})
    if cp:
        first = cp.get("firstDate", {})
        last = cp.get("lastDate", {})
        result["collection_period"] = {
            "first": f"{first.get('year')}-{first.get('month', 0):02d}-{first.get('day', 0):02d}",
            "last": f"{last.get('year')}-{last.get('month', 0):02d}-{last.get('day', 0):02d}",
        }

    for metric_name, metric_data in record.get("metrics", {}).items():
        p75s = metric_data.get("percentiles", {})
        p75 = p75s.get("p75")
        if p75 is None:
            continue

        if metric_name == "cumulative_layout_shift":
            try:
                p75_val = float(str(p75))
            except (ValueError, TypeError):
                p75_val = 0.0
        else:
            try:
                p75_val = int(p75)
            except (ValueError, TypeError):
                try:
                    p75_val = float(p75)
                except (ValueError, TypeError):
                    continue

        rating = rate_metric(metric_name, p75_val)
        thresholds = CWV_THRESHOLDS.get(metric_name, {})

        result["metrics"][metric_name] = {
            "p75": p75_val,
            "rating": rating,
            "label": thresholds.get("label", metric_name),
            "unit": thresholds.get("unit", ""),
            "good_threshold": thresholds.get("good"),
            "poor_threshold": thresholds.get("poor"),
        }

        histogram = metric_data.get("histogram", [])
        if histogram:
            densities = [bin_data.get("density", 0) for bin_data in histogram]
            if len(densities) >= 3:
                result["metrics"][metric_name]["distribution"] = {
                    "good": round(densities[0] * 100, 1),
                    "needs_improvement": round(densities[1] * 100, 1),
                    "poor": round(densities[2] * 100, 1),
                }

    return result


def combined_check(url: str, api_key: Optional[str] = None, strategy: str = "both") -> dict:
    """Run combined PSI + CrUX check (lab + field data)."""
    result = {"url": url, "psi": {}, "crux": None, "error": None}

    strategies = ["mobile", "desktop"] if strategy == "both" else [strategy]
    for strat in strategies:
        psi_result = run_pagespeed(url, strategy=strat, api_key=api_key)
        result["psi"][strat] = psi_result
        if psi_result.get("error"):
            result["error"] = psi_result["error"]

    if api_key:
        crux_result = query_crux(url, api_key)
        result["crux"] = crux_result
        # Fallback to origin-level if URL has insufficient traffic
        if crux_result.get("error") and "suffisamment" in crux_result.get("error", ""):
            parsed = urlparse(url)
            origin = f"{parsed.scheme}://{parsed.netloc}"
            origin_result = query_crux(origin, api_key)
            if not origin_result.get("error"):
                result["crux"] = origin_result
                result["crux"]["note"] = "Données URL indisponibles — affichage des données origine"

    return result


def main():
    parser = argparse.ArgumentParser(description="PageSpeed Insights v5 + CrUX — lab + field data")
    parser.add_argument("url", help="URL à analyser")
    parser.add_argument("--strategy", "-s", choices=["mobile", "desktop", "both"], default="both")
    parser.add_argument("--api-key", help="Clé API Google (override PAGESPEED_API_KEY)")
    parser.add_argument("--crux-only", action="store_true", help="CrUX field data uniquement")
    parser.add_argument("--psi-only", action="store_true", help="PSI Lighthouse uniquement")
    parser.add_argument("--form-factor", choices=["PHONE", "DESKTOP", "TABLET"])
    parser.add_argument("--json", "-j", action="store_true", help="Sortie JSON")
    args = parser.parse_args()

    api_key = args.api_key or get_api_key()

    if args.crux_only:
        if not api_key:
            print("Erreur : CrUX nécessite une clé API. Définir PAGESPEED_API_KEY dans .env", file=sys.stderr)
            sys.exit(1)
        result = query_crux(args.url, api_key, form_factor=args.form_factor)
    elif args.psi_only:
        strategies = ["mobile", "desktop"] if args.strategy == "both" else [args.strategy]
        result = {"psi": {}}
        for strat in strategies:
            result["psi"][strat] = run_pagespeed(args.url, strategy=strat, api_key=api_key)
    else:
        result = combined_check(args.url, api_key=api_key, strategy=args.strategy)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        if args.crux_only:
            _print_crux_summary(result)
        elif args.psi_only:
            for strat, psi in result.get("psi", {}).items():
                _print_psi_summary(psi)
        else:
            for strat, psi in result.get("psi", {}).items():
                _print_psi_summary(psi)
            if result.get("crux"):
                print()
                _print_crux_summary(result["crux"])

    if isinstance(result, dict) and result.get("error"):
        sys.exit(1)


def _print_psi_summary(psi: dict):
    if psi.get("error"):
        print(f"PSI Erreur ({psi.get('strategy', '?')}) : {psi['error']}")
        return

    print(f"\n=== PageSpeed Insights ({psi.get('strategy', 'unknown')}) ===")
    print(f"URL : {psi.get('url')}")

    scores = psi.get("lighthouse_scores", {})
    if scores:
        print("\nScores Lighthouse :")
        for cat, score in scores.items():
            print(f"  {cat} : {score}/100")

    lab = psi.get("lab_metrics", {})
    if lab:
        print("\nMétriques Lab :")
        for metric_id, data in lab.items():
            print(f"  {metric_id} : {data.get('display', data.get('value'))}")

    opps = psi.get("opportunities", [])
    if opps:
        print("\nOpportunités d'optimisation :")
        for opp in opps[:5]:
            print(f"  - {opp['title']} (économie ~{opp['savings_ms']}ms)")

    failed = psi.get("failed_audits", [])
    if failed:
        print(f"\nAudits échoués ({len(failed)}) :")
        for a in failed[:10]:
            score_pct = f"{a['score']:.0%}" if a['score'] is not None else "?"
            print(f"  [{score_pct}] {a['title']} {a.get('display', '')}")

    seo = psi.get("seo_audits", [])
    seo_failed = [a for a in seo if not a.get("pass")]
    if seo_failed:
        print(f"\nProblèmes SEO ({len(seo_failed)}) :")
        for a in seo_failed:
            print(f"  [FAIL] {a['title']}")


def _print_crux_summary(crux: dict):
    if crux.get("error"):
        print(f"CrUX Erreur : {crux['error']}")
        return

    print(f"=== CrUX Field Data ({crux.get('form_factor', 'ALL')}) ===")
    print(f"Cible : {crux.get('target')}")

    if crux.get("note"):
        print(f"Note : {crux['note']}")

    cp = crux.get("collection_period", {})
    if cp:
        print(f"Période : {cp.get('first')} → {cp.get('last')}")

    metrics = crux.get("metrics", {})
    if metrics:
        print("\nCore Web Vitals (p75 — vraies données utilisateurs Chrome) :")
        for name, data in metrics.items():
            label = data.get("label", name)
            p75 = data.get("p75")
            unit = data.get("unit", "")
            rating = data.get("rating", "?")
            good = data.get("good_threshold")

            rating_label = {"good": "BON", "needs-improvement": "À AMÉLIORER", "poor": "MAUVAIS"}.get(rating, "?")

            if name == "cumulative_layout_shift":
                print(f"  {label} : {p75:.3f} [{rating_label}] (seuil : ≤{good})")
            else:
                print(f"  {label} : {p75}{unit} [{rating_label}] (seuil : ≤{good}{unit})")

            dist = data.get("distribution")
            if dist:
                print(f"       Bon : {dist['good']}% | À améliorer : {dist['needs_improvement']}% | Mauvais : {dist['poor']}%")


if __name__ == "__main__":
    main()
