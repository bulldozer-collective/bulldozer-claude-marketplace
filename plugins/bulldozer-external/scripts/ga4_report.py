#!/usr/bin/env python3
"""
Google Analytics 4 — rapports trafic organique via OAuth.

Utilise le refresh token GSC (qui couvre analytics.readonly) pour interroger
l'API GA4 Data. Pas de service account requis.

Usage:
    python ga4_report.py --property 279989936 --list-properties
    python ga4_report.py --property 279989936 --report organic --days 365
    python ga4_report.py --property 279989936 --report channels --days 90 --json
    python ga4_report.py --property 279989936 --report pages --days 365

Rapports disponibles :
    organic     Vue d'ensemble trafic organique (sessions, users, engagement)
    channels    Mix canaux d'acquisition
    pages       Top 20 pages de destination organiques
    all         Tous les rapports
"""

import argparse
import json
import sys
import urllib.parse
import urllib.request
import urllib.error
import os
from typing import Optional

# Lecture du .env depuis la racine du projet
def _load_env() -> dict:
    env = {}
    # Cherche .env depuis le répertoire courant ou parent
    for path in ['.env', '../.env']:
        if os.path.exists(path):
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        env[k.strip()] = v.strip()
            break
    # Fallback env vars
    for key in ['GSC_CLIENT_ID', 'GSC_CLIENT_SECRET', 'GSC_REFRESH_TOKEN']:
        if key not in env:
            env[key] = os.environ.get(key, '')
    return env


def get_access_token(env: dict) -> str:
    """Obtenir un access token frais via le refresh token GSC."""
    if not env.get('GSC_REFRESH_TOKEN'):
        raise RuntimeError(
            "GSC_REFRESH_TOKEN manquant dans .env. "
            "Lancer python mcp-servers/google_auth.py --auth --creds /tmp/client_secret.json"
        )

    params = urllib.parse.urlencode({
        'client_id': env['GSC_CLIENT_ID'],
        'client_secret': env['GSC_CLIENT_SECRET'],
        'refresh_token': env['GSC_REFRESH_TOKEN'],
        'grant_type': 'refresh_token',
    }).encode()

    req = urllib.request.Request('https://oauth2.googleapis.com/token', data=params)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
        if 'error' in data:
            raise RuntimeError(f"Erreur OAuth : {data['error']} — {data.get('error_description', '')}")
        return data['access_token']
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Erreur refresh token : {e.code} {e.read().decode()}")


def ga4_request(access_token: str, property_id: str, body: dict) -> dict:
    """Appel à l'API GA4 Data v1beta."""
    # Accepte le format avec ou sans préfixe 'properties/'
    prop = property_id if property_id.startswith('properties/') else f'properties/{property_id}'
    url = f'https://analyticsdata.googleapis.com/v1beta/{prop}:runReport'

    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    })

    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise RuntimeError(f"Erreur API GA4 {e.code} : {error_body}")


def list_properties(access_token: str) -> list:
    """Lister toutes les propriétés GA4 accessibles."""
    # Lister les comptes d'abord
    req = urllib.request.Request(
        'https://analyticsadmin.googleapis.com/v1beta/accounts',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            accounts_data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Erreur listage comptes GA4 : {e.code} {e.read().decode()}")

    properties = []
    for account in accounts_data.get('accounts', []):
        account_id = account['name'].split('/')[-1]
        req2 = urllib.request.Request(
            f'https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:accounts/{account_id}',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        try:
            with urllib.request.urlopen(req2) as resp2:
                props_data = json.loads(resp2.read())
            for prop in props_data.get('properties', []):
                properties.append({
                    'property_id': prop['name'].split('/')[-1],
                    'name': prop['name'],
                    'display_name': prop.get('displayName', ''),
                    'account': account.get('displayName', account_id),
                })
        except urllib.error.HTTPError:
            pass

    return properties


def report_organic(access_token: str, property_id: str, days: int = 365) -> dict:
    """
    Vue d'ensemble du trafic organique sur N jours.
    Sessions, users, taux d'engagement, durée moyenne de session.
    """
    body = {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "date"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "activeUsers"},
            {"name": "engagementRate"},
            {"name": "averageSessionDuration"},
            {"name": "screenPageViews"},
        ],
        "dimensionFilter": {
            "filter": {
                "fieldName": "sessionDefaultChannelGroup",
                "stringFilter": {"matchType": "CONTAINS", "value": "Organic"}
            }
        },
        "orderBys": [{"dimension": {"dimensionName": "date"}}],
        "limit": 400,
    }

    raw = ga4_request(access_token, property_id, body)

    # Agréger les totaux
    totals = {"sessions": 0, "users": 0, "pageviews": 0, "engagement_rate": [], "avg_session_duration": []}
    rows = []

    for row in raw.get("rows", []):
        dims = [d["value"] for d in row.get("dimensionValues", [])]
        vals = [m["value"] for m in row.get("metricValues", [])]
        sessions = int(vals[0]) if vals[0] else 0
        users = int(vals[1]) if vals[1] else 0
        engagement = float(vals[2]) if vals[2] else 0
        duration = float(vals[3]) if vals[3] else 0
        pageviews = int(vals[4]) if vals[4] else 0

        totals["sessions"] += sessions
        totals["users"] += users
        totals["pageviews"] += pageviews
        if engagement:
            totals["engagement_rate"].append(engagement)
        if duration:
            totals["avg_session_duration"].append(duration)

        rows.append({
            "date": dims[0] if dims else "",
            "sessions": sessions,
            "users": users,
            "engagement_rate": round(engagement * 100, 1),
            "avg_session_duration_s": round(duration),
            "pageviews": pageviews,
        })

    avg_engagement = (
        round(sum(totals["engagement_rate"]) / len(totals["engagement_rate"]) * 100, 1)
        if totals["engagement_rate"] else 0
    )
    avg_duration = (
        round(sum(totals["avg_session_duration"]) / len(totals["avg_session_duration"]))
        if totals["avg_session_duration"] else 0
    )

    return {
        "period_days": days,
        "totals": {
            "sessions": totals["sessions"],
            "users": totals["users"],
            "pageviews": totals["pageviews"],
            "avg_engagement_rate_pct": avg_engagement,
            "avg_session_duration_s": avg_duration,
        },
        "daily_rows": rows,
    }


def report_channels(access_token: str, property_id: str, days: int = 365) -> dict:
    """Mix canaux d'acquisition — part organique vs paid vs direct vs social."""
    body = {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "sessionDefaultChannelGroup"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "activeUsers"},
            {"name": "engagementRate"},
        ],
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": 20,
    }

    raw = ga4_request(access_token, property_id, body)

    channels = []
    total_sessions = 0
    for row in raw.get("rows", []):
        dims = [d["value"] for d in row.get("dimensionValues", [])]
        vals = [m["value"] for m in row.get("metricValues", [])]
        sessions = int(vals[0]) if vals[0] else 0
        total_sessions += sessions
        channels.append({
            "channel": dims[0] if dims else "Unknown",
            "sessions": sessions,
            "users": int(vals[1]) if vals[1] else 0,
            "engagement_rate_pct": round(float(vals[2]) * 100, 1) if vals[2] else 0,
        })

    # Ajouter le % du total
    for ch in channels:
        ch["pct_total"] = round(ch["sessions"] / total_sessions * 100, 1) if total_sessions else 0

    organic_sessions = next((c["sessions"] for c in channels if "Organic" in c["channel"]), 0)
    organic_pct = round(organic_sessions / total_sessions * 100, 1) if total_sessions else 0

    return {
        "period_days": days,
        "total_sessions": total_sessions,
        "organic_sessions": organic_sessions,
        "organic_pct": organic_pct,
        "channels": channels,
    }


def report_pages(access_token: str, property_id: str, days: int = 365) -> dict:
    """Top 20 pages de destination avec trafic organique."""
    body = {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "landingPage"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "activeUsers"},
            {"name": "engagementRate"},
            {"name": "averageSessionDuration"},
            {"name": "conversions"},
        ],
        "dimensionFilter": {
            "filter": {
                "fieldName": "sessionDefaultChannelGroup",
                "stringFilter": {"matchType": "CONTAINS", "value": "Organic"}
            }
        },
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": 20,
    }

    raw = ga4_request(access_token, property_id, body)

    pages = []
    for row in raw.get("rows", []):
        dims = [d["value"] for d in row.get("dimensionValues", [])]
        vals = [m["value"] for m in row.get("metricValues", [])]
        pages.append({
            "page": dims[0] if dims else "",
            "sessions": int(vals[0]) if vals[0] else 0,
            "users": int(vals[1]) if vals[1] else 0,
            "engagement_rate_pct": round(float(vals[2]) * 100, 1) if vals[2] else 0,
            "avg_session_duration_s": round(float(vals[3])) if vals[3] else 0,
            "conversions": int(float(vals[4])) if vals[4] else 0,
        })

    return {
        "period_days": days,
        "top_pages": pages,
    }


def main():
    parser = argparse.ArgumentParser(description="GA4 rapports trafic organique via OAuth")
    parser.add_argument("--property", "-p", help="ID de propriété GA4 (ex: 279989936)")
    parser.add_argument("--list-properties", action="store_true", help="Lister les propriétés accessibles")
    parser.add_argument(
        "--report", "-r",
        choices=["organic", "channels", "pages", "all"],
        default="all",
        help="Type de rapport (défaut : all)",
    )
    parser.add_argument("--days", "-d", type=int, default=365, help="Période en jours (défaut : 365)")
    parser.add_argument("--json", "-j", action="store_true", help="Sortie JSON")
    args = parser.parse_args()

    env = _load_env()

    try:
        access_token = get_access_token(env)
    except RuntimeError as e:
        print(f"Erreur auth : {e}", file=sys.stderr)
        sys.exit(1)

    if args.list_properties:
        properties = list_properties(access_token)
        if args.json:
            print(json.dumps(properties, indent=2, ensure_ascii=False))
        else:
            print("Propriétés GA4 accessibles :")
            for p in properties:
                print(f"  {p['property_id']} — {p['display_name']} ({p['account']})")
        return

    if not args.property:
        print("Erreur : --property requis (ou --list-properties pour voir les IDs disponibles)", file=sys.stderr)
        sys.exit(1)

    result = {"property_id": args.property, "reports": {}}

    try:
        if args.report in ("organic", "all"):
            result["reports"]["organic"] = report_organic(access_token, args.property, args.days)

        if args.report in ("channels", "all"):
            result["reports"]["channels"] = report_channels(access_token, args.property, args.days)

        if args.report in ("pages", "all"):
            result["reports"]["pages"] = report_pages(access_token, args.property, args.days)
    except RuntimeError as e:
        print(f"Erreur : {e}", file=sys.stderr)
        sys.exit(1)

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    # Affichage lisible
    reports = result["reports"]

    if "organic" in reports:
        r = reports["organic"]
        t = r["totals"]
        print(f"\n=== Trafic Organique ({r['period_days']} jours) ===")
        print(f"  Sessions      : {t['sessions']:,}")
        print(f"  Utilisateurs  : {t['users']:,}")
        print(f"  Pages vues    : {t['pageviews']:,}")
        print(f"  Engagement    : {t['avg_engagement_rate_pct']}%")
        print(f"  Durée moy.    : {t['avg_session_duration_s']}s")

    if "channels" in reports:
        r = reports["channels"]
        print(f"\n=== Mix Canaux ({r['period_days']} jours) ===")
        print(f"  Total sessions : {r['total_sessions']:,}")
        print(f"  Part organique : {r['organic_pct']}% ({r['organic_sessions']:,} sessions)")
        print()
        for ch in r["channels"]:
            print(f"  {ch['channel']:<30} {ch['sessions']:>8,} sessions  {ch['pct_total']:>5}%")

    if "pages" in reports:
        r = reports["pages"]
        print(f"\n=== Top Pages Organiques ({r['period_days']} jours) ===")
        for p in r["top_pages"]:
            print(f"  {p['page']:<50} {p['sessions']:>6,} sessions  {p['engagement_rate_pct']}% eng.")


if __name__ == "__main__":
    main()