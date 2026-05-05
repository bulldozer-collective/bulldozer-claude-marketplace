#!/usr/bin/env python3
"""
Google API credential management — Bulldozer SEO Agent.

Adapted from AgriciDaniel/claude-seo for use with Bulldozer env vars.
Supports: PageSpeed Insights, CrUX, CrUX History, GSC, Indexing API, GA4.

Env vars (from .env):
    PAGESPEED_API_KEY           — used for PSI, CrUX, CrUX History, NLP APIs
    GOOGLE_APPLICATION_CREDENTIALS — path to service account JSON (GSC, GA4, Indexing)
    GA4_SERVICE_ACCOUNT_PATH    — alternative path for GA4 service account
    GA4_PROPERTY_ID             — GA4 property ID (e.g. properties/123456789)
    GSC_PROPERTY                — default GSC property

Usage:
    python google_auth.py --check                  # Check all credentials
    python google_auth.py --check gsc              # Check specific service
    python google_auth.py --tier                   # Show detected credential tier
    python google_auth.py --setup                  # Show setup instructions
"""

import argparse
import json
import os
import sys
import time
from typing import Optional

TOKEN_PATH = os.path.expanduser("~/.config/bulldozer-seo/oauth-token.json")
OAUTH_SCOPES = (
    "https://www.googleapis.com/auth/indexing "
    "https://www.googleapis.com/auth/webmasters "
    "https://www.googleapis.com/auth/analytics.readonly"
)
OAUTH_REDIRECT_URI = "http://localhost:8085"

SERVICE_AUTH = {
    "psi": "api_key",
    "crux": "api_key",
    "crux_history": "api_key",
    "nlp": "api_key",
    "gsc": "oauth_or_sa",
    "indexing": "oauth_or_sa",
    "ga4": "oauth_or_sa",
}

SERVICE_NAMES = {
    "psi": "PageSpeed Insights v5",
    "crux": "Chrome UX Report (CrUX) API",
    "crux_history": "CrUX History API",
    "nlp": "Cloud Natural Language API",
    "gsc": "Google Search Console API",
    "indexing": "Google Indexing API v3",
    "ga4": "GA4 Data API v1beta",
}


def load_config() -> dict:
    """
    Load configuration from environment variables.
    Falls back to .env file variables loaded by the shell.
    """
    config = {
        "service_account_path": None,
        "api_key": None,
        "default_property": None,
        "ga4_property_id": None,
    }

    # API key — PAGESPEED_API_KEY is the primary, GOOGLE_API_KEY as fallback
    config["api_key"] = (
        os.environ.get("PAGESPEED_API_KEY")
        or os.environ.get("GOOGLE_API_KEY")
    )

    # Service account — GA4_SERVICE_ACCOUNT_PATH takes precedence
    config["service_account_path"] = (
        os.environ.get("GA4_SERVICE_ACCOUNT_PATH")
        or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    )

    config["ga4_property_id"] = os.environ.get("GA4_PROPERTY_ID")
    config["default_property"] = os.environ.get("GSC_PROPERTY")

    return config


def get_service_account_credentials(scopes: list):
    """Load Google service account credentials."""
    try:
        from google.oauth2 import service_account
    except ImportError:
        print(
            "Error: google-auth library required. Install with: pip install google-auth",
            file=sys.stderr,
        )
        return None

    config = load_config()
    sa_path = config.get("service_account_path")

    if not sa_path:
        return None

    sa_path = os.path.expanduser(sa_path)
    if not os.path.exists(sa_path):
        print(f"Error: Service account file not found: {sa_path}", file=sys.stderr)
        return None

    try:
        credentials = service_account.Credentials.from_service_account_file(sa_path, scopes=scopes)
        return credentials
    except Exception as e:
        print(f"Error loading service account: {e}", file=sys.stderr)
        return None


def _load_oauth_token() -> Optional[dict]:
    if not os.path.exists(TOKEN_PATH):
        return None
    try:
        with open(TOKEN_PATH, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def _save_oauth_token(token_data: dict):
    os.makedirs(os.path.dirname(TOKEN_PATH), exist_ok=True)
    with open(TOKEN_PATH, "w") as f:
        json.dump(token_data, f, indent=2)


def _load_oauth_client(creds_path: str) -> Optional[dict]:
    try:
        with open(creds_path, "r") as f:
            data = json.load(f)
        return data.get("web", data.get("installed", {}))
    except (json.JSONDecodeError, IOError) as e:
        print(f"Error reading OAuth client file: {e}", file=sys.stderr)
        return None


def _refresh_oauth_token(client: dict, token_data: dict) -> Optional[dict]:
    import urllib.parse
    import urllib.request

    if not token_data.get("refresh_token"):
        return None

    params = urllib.parse.urlencode({
        "client_id": client["client_id"],
        "client_secret": client["client_secret"],
        "refresh_token": token_data["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()

    try:
        req = urllib.request.Request(
            client.get("token_uri", "https://oauth2.googleapis.com/token"), data=params
        )
        with urllib.request.urlopen(req) as resp:
            new_data = json.loads(resp.read())
        token_data["access_token"] = new_data["access_token"]
        token_data["expires_at"] = time.time() + new_data.get("expires_in", 3600)
        _save_oauth_token(token_data)
        return token_data
    except Exception as e:
        print(f"Error refreshing OAuth token: {e}", file=sys.stderr)
        return None


def get_oauth_credentials(scopes: list):
    """Get OAuth credentials from saved token, refreshing if needed."""
    token_data = _load_oauth_token()
    if token_data and token_data.get("access_token"):
        if time.time() > token_data.get("expires_at", 0) - 60:
            if token_data.get("refresh_token"):
                # Try to refresh — needs client secret, skip if not configured
                pass

        if token_data and token_data.get("access_token"):
            try:
                from google.oauth2.credentials import Credentials
                return Credentials(
                    token=token_data["access_token"],
                    refresh_token=token_data.get("refresh_token"),
                    token_uri="https://oauth2.googleapis.com/token",
                    client_id=token_data.get("client_id"),
                )
            except ImportError:
                pass

    return get_service_account_credentials(scopes)


def run_oauth_flow(creds_path: str):
    """Run OAuth browser-based authentication flow."""
    import http.server
    import urllib.parse
    import urllib.request
    import webbrowser

    client = _load_oauth_client(creds_path)
    if not client:
        print("Error: Could not load OAuth client credentials.", file=sys.stderr)
        sys.exit(1)

    auth_url = (
        f"{client.get('auth_uri', 'https://accounts.google.com/o/oauth2/auth')}"
        f"?client_id={client['client_id']}"
        f"&redirect_uri={urllib.parse.quote(OAUTH_REDIRECT_URI)}"
        f"&response_type=code"
        f"&scope={urllib.parse.quote(OAUTH_SCOPES)}"
        f"&access_type=offline&prompt=consent"
    )

    auth_code = [None]

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if "code" in params:
                auth_code[0] = params["code"][0]
                self.send_response(200)
                self.send_header("Content-Type", "text/html")
                self.end_headers()
                self.wfile.write(b"<h1>Authentication successful!</h1><p>Fermez cet onglet.</p>")
            else:
                self.send_response(400)
                self.end_headers()

        def log_message(self, *a):
            pass

    server = http.server.HTTPServer(("localhost", 8085), Handler)
    server.timeout = 300

    print(f"\nOuvrez cette URL dans votre navigateur :\n\n{auth_url}\n")
    print("En attente de l'authentification (5 minutes max)...")

    try:
        webbrowser.open(auth_url)
    except Exception:
        pass

    server.handle_request()
    server.server_close()

    if not auth_code[0]:
        print("\nAuthentification échouée ou expirée.", file=sys.stderr)
        sys.exit(1)

    _exchange_code(client, auth_code[0])


def _exchange_code(client: dict, code: str):
    import urllib.parse
    import urllib.request

    params = urllib.parse.urlencode({
        "code": code,
        "client_id": client["client_id"],
        "client_secret": client["client_secret"],
        "redirect_uri": OAUTH_REDIRECT_URI,
        "grant_type": "authorization_code",
    }).encode()

    try:
        req = urllib.request.Request(
            client.get("token_uri", "https://oauth2.googleapis.com/token"), data=params
        )
        with urllib.request.urlopen(req) as resp:
            token_data = json.loads(resp.read())
        token_data["expires_at"] = time.time() + token_data.get("expires_in", 3600)
        token_data["client_id"] = client["client_id"]
        token_data.pop("client_secret", None)
        _save_oauth_token(token_data)
        print(f"Token OAuth sauvegardé dans : {TOKEN_PATH}")
    except Exception as e:
        print(f"Erreur lors de l'échange du code : {e}", file=sys.stderr)
        sys.exit(1)


def validate_url(url: str) -> bool:
    """Validate a URL for use with Google APIs. Rejects private/loopback addresses."""
    from urllib.parse import urlparse

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    if not parsed.hostname:
        return False
    blocked = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal"]
    if parsed.hostname in blocked:
        return False
    try:
        import ipaddress
        ip = ipaddress.ip_address(parsed.hostname)
        if ip.is_private or ip.is_loopback or ip.is_link_local:
            return False
    except ValueError:
        pass
    return True


def get_api_key() -> Optional[str]:
    """Get the Google API key from env vars."""
    return load_config().get("api_key")


def build_service(api_name: str, version: str, scopes: list):
    """Build a Google API discovery service client."""
    try:
        from googleapiclient.discovery import build
    except ImportError:
        print(
            "Error: google-api-python-client required. "
            "Install with: pip install google-api-python-client",
            file=sys.stderr,
        )
        return None

    credentials = get_oauth_credentials(scopes)
    if not credentials:
        return None

    try:
        return build(api_name, version, credentials=credentials)
    except Exception as e:
        print(f"Error building {api_name} service: {e}", file=sys.stderr)
        return None


def check_credentials(service: str) -> dict:
    """Validate credentials for a specific Google API service."""
    result = {
        "available": False,
        "method": SERVICE_AUTH.get(service, "unknown"),
        "service": SERVICE_NAMES.get(service, service),
        "error": None,
    }

    config = load_config()

    if SERVICE_AUTH.get(service) == "api_key":
        api_key = config.get("api_key")
        if api_key:
            result["available"] = True
        else:
            result["error"] = (
                "Clé API manquante. Définir PAGESPEED_API_KEY dans le fichier .env"
            )

    elif SERVICE_AUTH.get(service) == "oauth_or_sa":
        token_data = _load_oauth_token()
        if token_data and token_data.get("access_token"):
            result["available"] = True
            result["method"] = "oauth_token"
            if time.time() > token_data.get("expires_at", 0) - 60:
                if not token_data.get("refresh_token"):
                    result["available"] = False
                    result["error"] = "Token OAuth expiré. Relancer --auth."
        else:
            sa_path = config.get("service_account_path")
            if not sa_path:
                result["error"] = (
                    "Aucun token OAuth ni service account. Définir "
                    "GA4_SERVICE_ACCOUNT_PATH ou GOOGLE_APPLICATION_CREDENTIALS dans .env"
                )
            else:
                sa_path = os.path.expanduser(sa_path)
                if not os.path.exists(sa_path):
                    result["error"] = f"Fichier service account introuvable : {sa_path}"
                else:
                    try:
                        with open(sa_path, "r") as f:
                            sa_data = json.load(f)
                        if "client_email" not in sa_data or "private_key" not in sa_data:
                            result["error"] = "Fichier service account invalide (client_email ou private_key manquant)"
                        else:
                            result["available"] = True
                            result["method"] = "service_account"
                            result["client_email"] = sa_data.get("client_email")
                    except (json.JSONDecodeError, IOError) as e:
                        result["error"] = f"Fichier service account illisible : {e}"

        if service == "ga4" and result["available"]:
            ga4_id = config.get("ga4_property_id")
            if not ga4_id:
                result["available"] = False
                result["error"] = "Credentials OK mais GA4_PROPERTY_ID manquant dans .env"

    return result


def detect_tier() -> dict:
    """Detect the credential tier available."""
    config = load_config()

    has_api_key = bool(config.get("api_key"))
    has_authenticated = False
    has_ga4 = False

    token_data = _load_oauth_token()
    if token_data and token_data.get("access_token"):
        has_authenticated = True

    if not has_authenticated:
        sa_path = config.get("service_account_path")
        if sa_path:
            sa_path = os.path.expanduser(sa_path)
            if os.path.exists(sa_path):
                try:
                    with open(sa_path, "r") as f:
                        sa_data = json.load(f)
                    if "client_email" in sa_data and "private_key" in sa_data:
                        has_authenticated = True
                except (json.JSONDecodeError, IOError):
                    pass

    if has_authenticated and config.get("ga4_property_id"):
        has_ga4 = True

    if has_ga4:
        return {
            "tier": 2,
            "description": "Complet (API key + Service Account + GA4)",
            "capabilities": [
                "PageSpeed Insights", "CrUX", "CrUX History", "Cloud NLP",
                "Search Console", "URL Inspection", "Sitemaps",
                "Indexing API", "GA4 Organic Traffic",
            ],
            "missing": None,
        }
    elif has_authenticated:
        return {
            "tier": 1,
            "description": "Authentifié (API key + OAuth/Service Account)",
            "capabilities": [
                "PageSpeed Insights", "CrUX", "CrUX History", "Cloud NLP",
                "Search Console", "URL Inspection", "Indexing API",
            ],
            "missing": "Ajouter GA4_PROPERTY_ID dans .env pour débloquer les rapports GA4",
        }
    elif has_api_key:
        return {
            "tier": 0,
            "description": "API Key uniquement",
            "capabilities": ["PageSpeed Insights", "CrUX", "CrUX History", "Cloud NLP"],
            "missing": "Ajouter un service account pour débloquer Search Console et GA4",
        }
    else:
        return {
            "tier": -1,
            "description": "Aucune credential configurée",
            "capabilities": [],
            "missing": "Définir PAGESPEED_API_KEY dans .env (minimum requis)",
        }


def main():
    parser = argparse.ArgumentParser(description="Google API credential management — Bulldozer SEO Agent")
    parser.add_argument("--check", nargs="?", const="all", metavar="SERVICE",
                        help="Vérifier les credentials. Service : psi, crux, gsc, indexing, ga4, nlp")
    parser.add_argument("--tier", action="store_true", help="Afficher le tier de credentials détecté")
    parser.add_argument("--setup", action="store_true", help="Afficher les instructions de configuration")
    parser.add_argument("--auth", action="store_true", help="Lancer le flux OAuth")
    parser.add_argument("--creds", help="Chemin vers le client_secret JSON (pour --auth)")
    parser.add_argument("--json", action="store_true", help="Sortie JSON")
    args = parser.parse_args()

    if args.auth:
        if not args.creds:
            print("Erreur : --creds requis avec --auth", file=sys.stderr)
            sys.exit(1)
        run_oauth_flow(args.creds)
        return

    if args.setup:
        print("""
Configuration Bulldozer SEO Agent — APIs Google
================================================

1. CRÉER UNE CLÉ API (pour PSI, CrUX, NLP)
   console.cloud.google.com → APIs & Services → Credentials → Create API Key
   Activer : PageSpeed Insights API, Chrome UX Report API, Cloud Natural Language API
   → Ajouter dans .env : PAGESPEED_API_KEY=AIzaSy...

2. CRÉER UN SERVICE ACCOUNT (pour GSC, GA4, Indexing API)
   IAM & Admin → Service Accounts → Create → Télécharger JSON
   → Ajouter dans .env : GA4_SERVICE_ACCOUNT_PATH=/chemin/vers/sa.json

3. DONNER L'ACCÈS
   - GSC : Paramètres → Utilisateurs → Ajouter le client_email du service account (Propriétaire)
   - GA4 : Admin → Gestion des accès → Ajouter le client_email (Lecteur)

4. ID DE PROPRIÉTÉ GA4
   → Ajouter dans .env : GA4_PROPERTY_ID=properties/123456789

5. VÉRIFIER
   python mcp-servers/google_auth.py --check
""")
        return

    if args.tier:
        tier_info = detect_tier()
        if args.json:
            print(json.dumps(tier_info, indent=2))
        else:
            print(f"Tier : {tier_info['tier']} — {tier_info['description']}")
            if tier_info["capabilities"]:
                print(f"APIs disponibles : {', '.join(tier_info['capabilities'])}")
            if tier_info["missing"]:
                print(f"Prochain tier : {tier_info['missing']}")
        return

    if args.check:
        services = list(SERVICE_AUTH.keys()) if args.check == "all" else [args.check]
        results = {}
        for svc in services:
            if svc not in SERVICE_AUTH:
                results[svc] = {"available": False, "error": f"Service inconnu : {svc}"}
                continue
            results[svc] = check_credentials(svc)

        if args.json:
            print(json.dumps({"tier": detect_tier(), "services": results}, indent=2))
        else:
            tier_info = detect_tier()
            print(f"Tier : {tier_info['tier']} — {tier_info['description']}\n")
            for svc, result in results.items():
                status = "OK" if result["available"] else "MANQUANT"
                print(f"  [{status}] {result.get('service', svc)}")
                if result.get("error"):
                    print(f"         {result['error']}")
                if result.get("client_email"):
                    print(f"         Service account : {result['client_email']}")
            if tier_info["missing"]:
                print(f"\nTip : {tier_info['missing']}")
        return

    tier_info = detect_tier()
    if args.json:
        print(json.dumps(tier_info, indent=2))
    else:
        print(f"Tier : {tier_info['tier']} — {tier_info['description']}")
        if tier_info["missing"]:
            print("Lancer --setup pour les instructions de configuration.")


if __name__ == "__main__":
    main()
