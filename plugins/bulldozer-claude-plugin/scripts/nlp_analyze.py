#!/usr/bin/env python3
"""
Google Cloud Natural Language API — analyse sémantique NLP.

Extrait les entités (salience scoring), l'analyse de sentiment et la classification
thématique d'une page ou d'un texte. Utile pour évaluer la richesse sémantique
et les signaux E-E-A-T d'un contenu.

Source originale : AgriciDaniel/claude-seo (MIT) — adapté pour Bulldozer SEO Agent.

Prérequis :
    - Activer Cloud Natural Language API dans Google Cloud Console
    - Tier gratuit : 5 000 unités/mois par feature
    - Tarif payant : 0,001$/1 000 caractères pour entités/sentiment

Usage:
    python nlp_analyze.py --url https://example.com --json
    python nlp_analyze.py --text "Votre contenu ici" --features entities,sentiment,classify
    python nlp_analyze.py --url https://example.com --features entities,classify
"""

import argparse
import json
import sys
from typing import Optional

try:
    import requests
except ImportError:
    print("Error: requests library required. Install with: pip install requests", file=sys.stderr)
    sys.exit(1)

import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from google_auth import get_api_key, validate_url

NLP_ENDPOINT = "https://language.googleapis.com/v2/documents:annotateText"

FEATURES = {
    "entities": "extractEntities",
    "sentiment": "extractDocumentSentiment",
    "classify": "classifyText",
    "categories": "classifyText",
    "moderate": "moderateText",
}


def analyze_text(
    text: str,
    features: Optional[list] = None,
    api_key: Optional[str] = None,
    language: str = "fr",
) -> dict:
    """
    Analyze text using Google Cloud Natural Language API.

    Returns entities (with salience scores), document sentiment, and content categories.
    """
    result = {
        "text_length": len(text),
        "language": language,
        "entities": [],
        "sentiment": None,
        "categories": [],
        "moderation": [],
        "error": None,
    }

    key = api_key or get_api_key()
    if not key:
        result["error"] = "Clé API manquante. Définir PAGESPEED_API_KEY dans .env"
        return result

    if features is None:
        features = ["entities", "sentiment", "classify"]

    feature_map = {}
    for f in features:
        api_feature = FEATURES.get(f)
        if api_feature:
            feature_map[api_feature] = True

    body = {
        "document": {
            "type": "PLAIN_TEXT",
            "content": text[:100000],
            "languageCode": language,
        },
        "features": feature_map,
        "encodingType": "UTF8",
    }

    try:
        resp = requests.post(f"{NLP_ENDPOINT}?key={key}", json=body, timeout=30)

        if resp.status_code == 403:
            result["error"] = (
                "Accès Cloud Natural Language API refusé. "
                "Activer l'API dans GCP Console (APIs & Services > Library > Cloud Natural Language API). "
                "La facturation doit être activée sur le projet."
            )
            return result

        if resp.status_code == 429:
            result["error"] = "Quota NLP dépassé. Tier gratuit : 5 000 unités/mois."
            return result

        resp.raise_for_status()
        data = resp.json()
    except requests.exceptions.RequestException as e:
        result["error"] = f"Requête NLP échouée : {e}"
        return result

    # Entities — triées par salience (importance dans le document)
    for entity in data.get("entities", []):
        mentions = entity.get("mentions", [])
        result["entities"].append({
            "name": entity.get("name", ""),
            "type": entity.get("type", "UNKNOWN"),
            "salience": round(entity.get("salience", 0), 4),
            "sentiment_score": entity.get("sentiment", {}).get("score"),
            "mention_count": len(mentions),
            "metadata": entity.get("metadata", {}),
        })
    result["entities"].sort(key=lambda e: e["salience"], reverse=True)

    # Document sentiment
    doc_sentiment = data.get("documentSentiment", {})
    if doc_sentiment:
        score = doc_sentiment.get("score", 0)
        magnitude = doc_sentiment.get("magnitude", 0)

        if score > 0.25:
            tone = "positif"
        elif score < -0.25:
            tone = "négatif"
        else:
            tone = "neutre"

        result["sentiment"] = {
            "score": round(score, 3),
            "magnitude": round(magnitude, 3),
            "tone": tone,
        }

        sentences = data.get("sentences", [])
        if sentences:
            result["sentiment"]["sentence_count"] = len(sentences)

    # Content categories (Google taxonomy)
    for cat in data.get("categories", []):
        result["categories"].append({
            "name": cat.get("name", ""),
            "confidence": round(cat.get("confidence", 0), 4),
        })

    # Moderation flags (> 50% confidence)
    for mod in data.get("moderationCategories", []):
        if mod.get("confidence", 0) > 0.5:
            result["moderation"].append({
                "name": mod.get("name", ""),
                "confidence": round(mod.get("confidence", 0), 4),
            })

    return result


def analyze_url(
    url: str,
    features: Optional[list] = None,
    api_key: Optional[str] = None,
    language: str = "fr",
) -> dict:
    """
    Fetch a URL's text content and analyze it with NLP.

    Extrait le texte de la page (supprime nav, footer, scripts, styles),
    puis analyse via Google Cloud NLP.
    """
    if not validate_url(url):
        return {"error": "URL invalide. Seules les URLs http/https publiques sont acceptées."}

    try:
        resp = requests.get(url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (compatible; BulldozerSEO/1.0 NLP Analyzer)"
        })
        resp.raise_for_status()
        html = resp.text
    except requests.exceptions.RequestException as e:
        return {"error": f"Impossible de récupérer l'URL : {e}"}

    # Text extraction
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
    except ImportError:
        import re
        text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()

    if not text or len(text) < 50:
        return {"error": "Texte extrait trop court pour une analyse NLP significative."}

    result = analyze_text(text, features=features, api_key=api_key, language=language)
    result["source_url"] = url
    result["extracted_text_length"] = len(text)
    return result


def main():
    parser = argparse.ArgumentParser(
        description="Google Cloud NLP — analyse sémantique (entités, sentiment, classification)"
    )
    parser.add_argument("--text", "-t", help="Texte à analyser")
    parser.add_argument("--url", "-u", help="URL à fetcher et analyser")
    parser.add_argument(
        "--features", "-f",
        default="entities,sentiment,classify",
        help="Features : entities, sentiment, classify, moderate (défaut : entities,sentiment,classify)",
    )
    parser.add_argument("--language", "-l", default="fr", help="Code langue (défaut : fr)")
    parser.add_argument("--api-key", help="Clé API (override PAGESPEED_API_KEY)")
    parser.add_argument("--json", "-j", action="store_true", help="Sortie JSON")
    args = parser.parse_args()

    if not args.text and not args.url:
        print("Erreur : fournir --text ou --url.", file=sys.stderr)
        sys.exit(1)

    features = [f.strip() for f in args.features.split(",")]

    if args.url:
        result = analyze_url(args.url, features=features, api_key=args.api_key, language=args.language)
    else:
        result = analyze_text(args.text, features=features, api_key=args.api_key, language=args.language)

    if result.get("error"):
        print(f"Erreur : {result['error']}", file=sys.stderr)
        if not args.json:
            sys.exit(1)

    if args.json:
        print(json.dumps(result, indent=2))
        return

    if result.get("source_url"):
        print(f"=== Analyse NLP : {result['source_url']} ===")
        print(f"Texte extrait : {result.get('extracted_text_length', 0):,} caractères")
    else:
        print(f"=== Analyse NLP ({result.get('text_length', 0):,} caractères) ===")

    sent = result.get("sentiment")
    if sent:
        print(f"\nSentiment : {sent['tone'].upper()} (score : {sent['score']}, magnitude : {sent['magnitude']})")

    entities = result.get("entities", [])
    if entities:
        print(f"\nEntités principales ({len(entities)} total) :")
        for e in entities[:15]:
            print(f"  [{e['type']:12s}] {e['name']} (salience : {e['salience']:.3f}, mentions : {e['mention_count']})")

    categories = result.get("categories", [])
    if categories:
        print(f"\nCatégories thématiques (Google taxonomy) :")
        for c in categories:
            print(f"  {c['name']} ({c['confidence']:.1%})")

    moderation = result.get("moderation", [])
    if moderation:
        print(f"\nSignaux de modération :")
        for m in moderation:
            print(f"  {m['name']} ({m['confidence']:.1%})")


if __name__ == "__main__":
    main()
