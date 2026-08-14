#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_rythme.py — contrôle automatique du rythme d'un lead magnet, sur le PDF converti.

Trois défauts mesurables du standard "lead magnet moderne" :
  1. trou blanc        — page remplie à moins de --min-fill (défaut 2/3), hors pages exemptées
  2. mur de texte      — plus de --max-prose-run paragraphes de prose consécutifs sans rupture
  3. monotonie d'échelle — double page dont le rapport (plus grand corps / plus petit corps) < --min-scale

Le script REPÈRE, il ne juge pas à la place de l'œil : titres orphelins, images coupées, logos avalés
par leur fond ne se mesurent pas ici (voir references/grille-review.md).

Usage :
    python3 check_rythme.py lead-magnet.pdf
    python3 check_rythme.py lead-magnet.pdf --min-fill 0.66 --max-prose-run 4 --json
    python3 check_rythme.py --selftest        # vérifie la logique sans PDF ni dépendance

Backends lus dans l'ordre : PyMuPDF (fitz), puis pdfplumber.
    pip install pymupdf     # ou : pip install pdfplumber
Code retour : 0 si aucun défaut bloquant, 1 sinon (utilisable en gate).
"""

import argparse
import json
import sys

ROWS = 200  # granularité verticale de la mesure de remplissage


# --------------------------------------------------------------------------- #
# Modèle de page (indépendant du backend PDF)                                   #
# --------------------------------------------------------------------------- #

class Block:
    """Un bloc de contenu : texte (avec sa taille de police) ou image."""

    def __init__(self, top, bottom, size=0.0, chars=0, is_image=False):
        self.top = float(top)
        self.bottom = float(bottom)
        self.size = float(size)      # taille de police dominante du bloc, en points
        self.chars = int(chars)      # nombre de caractères (0 pour une image)
        self.is_image = bool(is_image)


class Page:
    def __init__(self, number, height, blocks):
        self.number = number         # 1-indexé, comme dans un lecteur PDF
        self.height = float(height)
        self.blocks = blocks


# --------------------------------------------------------------------------- #
# Mesures                                                                       #
# --------------------------------------------------------------------------- #

def content_band(pages):
    """Bande verticale réellement utilisée par le document (haut/bas de page utile).

    On la déduit du document lui-même plutôt que de supposer des marges : un lead magnet peut
    avoir des marges très différentes d'un archétype à l'autre. Les percentiles évitent qu'une
    page presque vide ou une couverture pleine page ne fausse la mesure.
    """
    tops, bottoms = [], []
    for p in pages:
        if not p.blocks:
            continue
        tops.append(min(b.top for b in p.blocks))
        bottoms.append(max(b.bottom for b in p.blocks))
    if not tops:
        return 0.0, 1.0
    tops.sort()
    bottoms.sort()
    top = tops[max(0, int(len(tops) * 0.10))]
    bottom = bottoms[min(len(bottoms) - 1, int(len(bottoms) * 0.90))]
    if bottom - top < 1:
        return 0.0, max(p.height for p in pages)
    return top, bottom


def fill_ratio(page, band_top, band_bottom):
    """Part de la bande utile couverte par du contenu, mesurée en lignes horizontales.

    On mesure verticalement (et non en aire) parce que le défaut visé est « la page s'arrête
    au tiers » : une colonne de lecture n'occupe jamais toute la largeur, une mesure en aire
    signalerait des trous blancs partout.
    """
    span = band_bottom - band_top
    if span <= 0:
        return 0.0
    covered = [False] * ROWS
    for b in page.blocks:
        lo = max(band_top, b.top)
        hi = min(band_bottom, b.bottom)
        if hi <= lo:
            continue
        i0 = int((lo - band_top) / span * ROWS)
        i1 = int((hi - band_top) / span * ROWS + 0.999)
        for i in range(max(0, i0), min(ROWS, max(i1, i0 + 1))):
            covered[i] = True
    return sum(covered) / float(ROWS)


def body_size(pages):
    """Taille de police du corps = la taille la plus représentée en volume de caractères."""
    weight = {}
    for p in pages:
        for b in p.blocks:
            if b.is_image or b.chars <= 0 or b.size <= 0:
                continue
            key = round(b.size * 2) / 2.0     # regroupement au demi-point
            weight[key] = weight.get(key, 0) + b.chars
    if not weight:
        return 0.0
    return max(weight.items(), key=lambda kv: kv[1])[0]


def is_prose(block, body, min_chars=180):
    """Un bloc de prose : du texte au corps du document, assez long pour être un paragraphe."""
    if block.is_image or block.chars < min_chars or block.size <= 0 or body <= 0:
        return False
    return abs(block.size - body) <= 1.0


def scale_contrast(page):
    """Rapport entre le plus grand et le plus petit corps de texte de la page."""
    sizes = [b.size for b in page.blocks if not b.is_image and b.size > 0 and b.chars > 0]
    if len(sizes) < 2:
        return 1.0
    lo = min(sizes)
    return (max(sizes) / lo) if lo > 0 else 1.0


def detect_exempt(pages, body):
    """Pages où un faible remplissage est légitime : couverture, ouvertures de chapitre, CTA final.

    Heuristique volontairement large — mieux vaut ne pas signaler une ouverture de chapitre que
    noyer le rapport de faux positifs. Une page contestée se force avec --exempt / --no-exempt.
    """
    if not pages:
        return set()
    exempt = {pages[0].number, pages[-1].number}
    for p in pages:
        texts = [b for b in p.blocks if not b.is_image and b.chars > 0]
        if not texts:
            continue
        big = max(b.size for b in texts)
        prose_blocks = sum(1 for b in texts if is_prose(b, body))
        if body > 0 and big >= 2.5 * body and prose_blocks <= 1 and len(texts) <= 5:
            exempt.add(p.number)
    return exempt


# --------------------------------------------------------------------------- #
# Analyse                                                                       #
# --------------------------------------------------------------------------- #

def analyse(pages, min_fill=0.66, max_prose_run=4, min_scale=2.0, exempt=None):
    body = body_size(pages)
    band_top, band_bottom = content_band(pages)
    exempt = set(exempt) if exempt is not None else detect_exempt(pages, body)

    per_page, defauts = [], []

    # 1. remplissage
    for p in pages:
        fill = fill_ratio(p, band_top, band_bottom)
        contrast = scale_contrast(p)
        per_page.append({
            "page": p.number,
            "fill": round(fill, 3),
            "contraste_echelle": round(contrast, 2),
            "blocs": len(p.blocks),
            "exempte": p.number in exempt,
        })
        if p.number not in exempt and fill < min_fill:
            defauts.append({
                "page": p.number,
                "section": None,
                "type": "trou_blanc",
                "probleme": "page remplie à %d %% (seuil %d %%)" % (fill * 100, min_fill * 100),
                "correction": "recomposer, dans cet ordre : rendre coupable un bloc inutilement "
                              "atomique, remonter un bloc de la page suivante, promouvoir une idée en "
                              "pull-quote, puis COMBLER PAR UNE IMAGE de respiration (légende qui "
                              "relie au propos, placée à une rupture de mouvement) — jamais étirer "
                              "marges, interlignage ou texte",
                "priorite": "bloquant",
            })

    # 2. murs de texte — la suite de prose se compte dans l'ordre de lecture, pages comprises
    run, run_start = 0, None
    for p in pages:
        for b in p.blocks:
            if is_prose(b, body):
                run += 1
                if run_start is None:
                    run_start = p.number
            else:
                if run > max_prose_run:
                    defauts.append(_mur(run_start, p.number, run, max_prose_run))
                run, run_start = 0, None
    if run > max_prose_run:
        defauts.append(_mur(run_start, pages[-1].number, run, max_prose_run))

    # 3. monotonie d'échelle, par double page (2-3, 4-5, …)
    by_num = {p.number: p for p in pages}
    for start in range(2, (pages[-1].number if pages else 1) + 1, 2):
        spread = [by_num[n] for n in (start, start + 1) if n in by_num]
        if not spread or all(p.number in exempt for p in spread):
            continue
        contrast = max(scale_contrast(p) for p in spread)
        if contrast < min_scale:
            defauts.append({
                "page": start,
                "section": None,
                "type": "monotonie_echelle",
                "probleme": "double page %s sans contraste de taille (rapport %.1f, seuil %.1f)"
                            % ("-".join(str(p.number) for p in spread), contrast, min_scale),
                "correction": "promouvoir un chiffre en carte KPI ou une idée en pull-quote sur cette double page",
                "priorite": "mineur",
            })

    return {
        "corps_detecte_pt": body,
        "pages": per_page,
        "defauts": sorted(defauts, key=lambda d: (d["page"], d["type"])),
    }


def _mur(page_debut, page_fin, run, seuil):
    return {
        "page": page_debut,
        "section": None,
        "type": "mur_de_texte",
        "probleme": "%d paragraphes de prose consécutifs (max %d), p.%s→%s"
                    % (run, seuil, page_debut, page_fin),
        "correction": "insérer une rupture : carte KPI, pull-quote, encadré, checklist ou visuel. "
                      "Si le contenu n'en fournit pas, le signaler à lead-magnet-content",
        "priorite": "mineur" if run <= seuil + 2 else "bloquant",
    }


# --------------------------------------------------------------------------- #
# Lecture du PDF                                                                #
# --------------------------------------------------------------------------- #

def read_pdf(path):
    try:
        return _read_fitz(path)
    except ImportError:
        pass
    try:
        return _read_pdfplumber(path)
    except ImportError:
        sys.exit("Aucun backend PDF disponible. Installer l'un des deux :\n"
                 "    pip install pymupdf\n    pip install pdfplumber")


def _read_fitz(path):
    import fitz  # PyMuPDF
    pages = []
    with fitz.open(path) as doc:
        for i, page in enumerate(doc, start=1):
            blocks = []
            data = page.get_text("dict")
            for blk in data.get("blocks", []):
                if blk.get("type") == 1:  # image
                    x0, y0, x1, y1 = blk["bbox"]
                    blocks.append(Block(y0, y1, is_image=True))
                    continue
                chars, sizes = 0, []
                for line in blk.get("lines", []):
                    for span in line.get("spans", []):
                        text = span.get("text", "")
                        chars += len(text.strip())
                        if text.strip():
                            sizes.append((span.get("size", 0.0), len(text.strip())))
                if chars == 0:
                    continue
                dominant = max(sizes, key=lambda s: s[1])[0] if sizes else 0.0
                x0, y0, x1, y1 = blk["bbox"]
                blocks.append(Block(y0, y1, size=dominant, chars=chars))
            pages.append(Page(i, page.rect.height, blocks))
    return pages


def _read_pdfplumber(path):
    import pdfplumber
    pages = []
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            blocks = []
            for img in page.images:
                blocks.append(Block(img["top"], img["bottom"], is_image=True))
            # pdfplumber n'expose pas de blocs : on regroupe les lignes proches en paragraphes
            lines = []
            for word in page.extract_words(extra_attrs=["size"]):
                lines.append((float(word["top"]), float(word["bottom"]),
                              float(word.get("size", 0.0)), len(word["text"])))
            lines.sort(key=lambda w: w[0])
            current = None
            for top, bottom, size, chars in lines:
                if current and top - current[1] < (size * 1.6 if size else 12):
                    current = (current[0], max(current[1], bottom),
                               max(current[2], size), current[3] + chars)
                else:
                    if current:
                        blocks.append(Block(current[0], current[1], size=current[2], chars=current[3]))
                    current = (top, bottom, size, chars)
            if current:
                blocks.append(Block(current[0], current[1], size=current[2], chars=current[3]))
            pages.append(Page(i, float(page.height), blocks))
    return pages


# --------------------------------------------------------------------------- #
# Rendu                                                                         #
# --------------------------------------------------------------------------- #

def print_report(result, min_fill):
    print("Corps détecté : %.1f pt\n" % result["corps_detecte_pt"])
    print("%-6s %-10s %-12s %-7s %s" % ("Page", "Remplie", "Échelle", "Blocs", ""))
    for p in result["pages"]:
        flag = ""
        if p["exempte"]:
            flag = "(exemptée)"
        elif p["fill"] < min_fill:
            flag = "← trou blanc"
        print("%-6d %-10s %-12s %-7d %s"
              % (p["page"], "%d %%" % (p["fill"] * 100), "×%.1f" % p["contraste_echelle"],
                 p["blocs"], flag))

    defauts = result["defauts"]
    print("\n%d défaut(s) — %d bloquant(s)"
          % (len(defauts), sum(1 for d in defauts if d["priorite"] == "bloquant")))
    for d in defauts:
        print("  [%s] p.%s · %s : %s\n      → %s"
              % (d["priorite"], d["page"], d["type"], d["probleme"], d["correction"]))


# --------------------------------------------------------------------------- #
# Autotest (aucune dépendance)                                                  #
# --------------------------------------------------------------------------- #

def selftest():
    def prose(top, h=60):
        return Block(top, top + h, size=10.5, chars=400)

    def liste(top):                      # checklist : rompt la prose sans changer d'échelle
        return Block(top, top + 50, size=10.5, chars=60)

    def plate(page_no):                  # page dense mais plate : aucun contraste de taille
        return Page(page_no, 842, [prose(60), prose(140), liste(220), prose(300),
                                   prose(380), prose(460), prose(540), prose(620, 140)])

    pages = [
        # p.1 couverture : un titre énorme, page peu remplie → exemptée
        Page(1, 842, [Block(200, 320, size=78, chars=40)]),
        # p.2 page saine : prose + KPI + pull-quote, bien remplie
        Page(2, 842, [prose(60), prose(140), Block(220, 300, size=48, chars=12),
                      prose(320), Block(400, 470, size=26, chars=90), prose(500),
                      prose(580), prose(660, 100)]),
        # p.3 mur de texte : 8 paragraphes de prose sans rupture
        Page(3, 842, [prose(60), prose(140), prose(220), prose(300), prose(380),
                      prose(460), prose(540), prose(620, 140)]),
        # p.4-5 double page plate : tout au même corps → monotonie d'échelle
        plate(4), plate(5),
        # p.6 trou blanc : contenu qui s'arrête au quart
        Page(6, 842, [prose(60), Block(140, 190, size=26, chars=80)]),
        # p.7 CTA final : dernière page, exemptée
        Page(7, 842, [Block(150, 260, size=40, chars=60), Block(300, 600, size=10.5, chars=200)]),
    ]

    r = analyse(pages, min_fill=0.66, max_prose_run=4, min_scale=2.0)
    types = [d["type"] for d in r["defauts"]]
    pages_flagged = {d["type"]: d["page"] for d in r["defauts"]}

    checks = [
        ("corps détecté à 10.5 pt", abs(r["corps_detecte_pt"] - 10.5) < 0.01),
        ("couverture exemptée", r["pages"][0]["exempte"] is True),
        ("dernière page exemptée", r["pages"][-1]["exempte"] is True),
        ("trou blanc détecté p.6", "trou_blanc" in types and pages_flagged["trou_blanc"] == 6),
        ("page 2 non signalée en trou blanc",
         not any(d["type"] == "trou_blanc" and d["page"] == 2 for d in r["defauts"])),
        ("mur de texte détecté", "mur_de_texte" in types),
        ("monotonie détectée sur la double page 4-5",
         any(d["type"] == "monotonie_echelle" and d["page"] == 4 for d in r["defauts"])),
        ("double page 2-3 non signalée en monotonie",
         not any(d["type"] == "monotonie_echelle" and d["page"] == 2 for d in r["defauts"])),
        ("page 2 bien remplie (> 66 %)", r["pages"][1]["fill"] > 0.66),
        ("pages 4-5 bien remplies (> 66 %)",
         r["pages"][3]["fill"] > 0.66 and r["pages"][4]["fill"] > 0.66),
    ]
    ok = True
    for label, passed in checks:
        print(("  OK   " if passed else "  FAIL ") + label)
        ok = ok and passed
    print("\nselftest : %s" % ("OK" if ok else "ÉCHEC"))
    return 0 if ok else 1


# --------------------------------------------------------------------------- #

def main():
    ap = argparse.ArgumentParser(description="Contrôle du rythme d'un lead magnet sur son PDF.")
    ap.add_argument("pdf", nargs="?", help="chemin du PDF converti")
    ap.add_argument("--min-fill", type=float, default=0.66,
                    help="taux de remplissage minimum d'une page (défaut 0.66)")
    ap.add_argument("--max-prose-run", type=int, default=4,
                    help="paragraphes de prose consécutifs tolérés (défaut 4)")
    ap.add_argument("--min-scale", type=float, default=2.0,
                    help="contraste d'échelle minimum par double page (défaut 2.0)")
    ap.add_argument("--exempt", default=None,
                    help="pages exemptées de la règle de remplissage, ex. 1,5,9,18 "
                         "(sinon détection automatique : couverture, ouvertures, dernière page)")
    ap.add_argument("--no-exempt", action="store_true",
                    help="désactive toute exemption (contrôle strict)")
    ap.add_argument("--json", action="store_true", help="sortie JSON (commandes design)")
    ap.add_argument("--selftest", action="store_true", help="teste la logique sans PDF")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(selftest())
    if not args.pdf:
        ap.error("chemin du PDF manquant (ou utiliser --selftest)")

    pages = read_pdf(args.pdf)
    if not pages:
        sys.exit("PDF vide ou illisible : %s" % args.pdf)

    exempt = None
    if args.no_exempt:
        exempt = set()
    elif args.exempt:
        exempt = {int(n) for n in args.exempt.replace(" ", "").split(",") if n}

    result = analyse(pages, args.min_fill, args.max_prose_run, args.min_scale, exempt)

    if args.json:
        print(json.dumps(result["defauts"], ensure_ascii=False, indent=2))
    else:
        print_report(result, args.min_fill)

    sys.exit(1 if any(d["priorite"] == "bloquant" for d in result["defauts"]) else 0)


if __name__ == "__main__":
    main()
