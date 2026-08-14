#!/usr/bin/env python3
"""Contrôle statique des alignements et des pièges de rendu d'un lead magnet.

Complément de `check_rythme.py`, qui mesure le RYTHME sur le PDF converti. Ce script-ci
contrôle l'ALIGNEMENT et les pièges de moteur sur les sources (HTML + SVG), avant même la
conversion. Il attrape en quelques millisecondes des défauts qui, sinon, ne se voient qu'à
l'œil sur un PDF rasterisé — quand on pense à regarder.

Chaque contrôle correspond à un défaut réellement payé en production (voir
`lead-magnet/references/pannes-et-parades.md`).

Usage :
    python3 check_alignements.py [dossier]           # défaut : dossier courant
    python3 check_alignements.py --html x.html --assets assets/
    python3 check_alignements.py --json
    python3 check_alignements.py --selftest

Sortie : liste de défauts (bloquant / mineur) + code de retour ≠ 0 si un bloquant subsiste.
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

# Largeur moyenne d'un glyphe, en fraction du corps, pour Inter et Nunito en graisse
# normale à semi-gras. Mesuré grossièrement : suffisant pour repérer un débordement,
# pas pour composer.
GLYPH_W = 0.55
GLYPH_W_BOLD = 0.60


# ────────────────────────────────────────────────────────────────── utilitaires

class Finding:
    def __init__(self, kind, severity, where, message, fix):
        self.kind, self.severity, self.where = kind, severity, where
        self.message, self.fix = message, fix

    def as_dict(self):
        return {"controle": self.kind, "priorite": self.severity, "ou": self.where,
                "probleme": self.message, "correction": self.fix}

    def __str__(self):
        tag = "bloquant" if self.severity == "bloquant" else "mineur"
        return f"  [{tag}] {self.where} · {self.kind} : {self.message}\n      → {self.fix}"


def strip_comments(css_or_html: str) -> str:
    s = re.sub(r"/\*.*?\*/", "", css_or_html, flags=re.S)
    return re.sub(r"<!--.*?-->", "", s, flags=re.S)


def text_extent(content: str, font_size: float, bold: bool) -> float:
    """Largeur approximative d'un <text> SVG, en unités de viewBox."""
    n = len(content)
    return n * font_size * (GLYPH_W_BOLD if bold else GLYPH_W)


# ────────────────────────────────────────────────────────────── contrôles HTML

def check_html(html: str, name: str) -> list[Finding]:
    out: list[Finding] = []
    clean = strip_comments(html)

    # A1 — figures en pleine largeur : marges négatives non compensées
    if re.search(r"figure\.full\s*\{[^}]*margin-left\s*:\s*-", clean) or \
       re.search(r"figure[^{]*\{[^}]*margin\s*:[^;}]*-\d+mm", clean):
        out.append(Finding(
            "figure_pleine_largeur", "bloquant", name,
            "une figure sort de la colonne de texte par marge négative. Si le SVG garde sa "
            "propre marge interne, son contenu ne tombe plus sur la colonne : rien n'est aligné",
            "poser les figures DANS la colonne, et dessiner les SVG « encre bord à bord » "
            "(x=0 à x=W) — ou compenser la marge négative exactement dans le SVG"))

    # A2 — chaque figure porte un titre ou une légende.
    #      Exception : une image de REGISTRE sur la page de clôture (CTA) ou en couverture
    #      n'a ni source ni enseignement à citer — son alt suffit. Une légende y serait un
    #      parasite sur une page dont le rôle est de porter une action unique.
    cta_zone = clean[clean.find('class="fullbleed cta"'):] if 'class="fullbleed cta"' in clean else ""
    figs = re.findall(r"<figure\b.*?</figure>", clean, re.S)
    for i, f in enumerate(figs, 1):
        if f in cta_zone or "cloture" in f:
            continue
        if "figcaption" not in f and "fig-title" not in f:
            out.append(Finding(
                "figure_sans_legende", "mineur", f"{name} · figure {i}",
                "figure sans titre ni légende : sa source et son enseignement ne sont nulle part",
                "ajouter un .fig-title au-dessus et un <figcaption> avec la source en dessous"))

    # A3 — @font-face avec plage de graisse : WeasyPrint refuse, tout le gras disparaît
    for m in re.finditer(r"@font-face\s*\{[^}]*\}", clean):
        if re.search(r"font-weight\s*:\s*\d+\s+\d+", m.group(0)):
            out.append(Finding(
                "police_variable", "bloquant", name,
                "@font-face déclare une plage de graisse (police variable) : WeasyPrint "
                "l'ignore et le document perd tout son gras",
                "déclarer un @font-face par graisse, avec des fichiers statiques "
                "(ex. @fontsource/<famille>/files/<famille>-latin-700-normal.woff2)"))
            break

    # A4 — propriétés non supportées par WeasyPrint
    for prop in ("width:max-content", "height:max-content", "width:fit-content",
                 "position:sticky", "aspect-ratio:"):
        if prop.replace(" ", "") in clean.replace(" ", ""):
            out.append(Finding(
                "propriete_non_supportee", "mineur", name,
                f"`{prop}` n'est pas supportée par WeasyPrint : la règle est ignorée "
                f"silencieusement et le bloc prend toute la largeur",
                "utiliser display:inline-block, ou fixer une largeur explicite"))

    # A5 — espace fine insécable absente des sous-ensembles latins courants
    if " " in html:
        out.append(Finding(
            "espace_fine", "bloquant", name,
            "U+202F (espace fine insécable) présent : absent du sous-ensemble latin des "
            "polices Google Fonts, il se rend comme glyphe manquant — « 1 180 » devient « 1180 »",
            "remplacer par U+00A0 (insécable standard)"))

    # A6 — conteneur flex insécable : WeasyPrint le place mal dans une page entamée
    for m in re.finditer(r"\{[^}]*\}", clean):
        b = m.group(0).replace(" ", "")
        if "display:flex" in b and "break-inside:avoid" in b and "min-height" in b:
            out.append(Finding(
                "flex_insecable", "mineur", name,
                "bloc flex à la fois insécable et à hauteur minimale : WeasyPrint fragmente "
                "mal le flex et refuse souvent de le poser dans l'espace libre d'une page "
                "entamée, ce qui crée une page à moitié vide",
                "passer le bloc en display:block quand le flex ne sert qu'à centrer"))
            break

    # A6b — <caption> : boîte détachable du corps du tableau → titre orphelin en bas de page
    if re.search(r"<caption\b", clean):
        out.append(Finding(
            "caption_detachable", "bloquant", name,
            "un tableau utilise <caption> : c'est une boîte distincte du corps du tableau, que "
            "WeasyPrint détache même sous break-inside:avoid — le titre se retrouve seul en bas "
            "d'une page et le tableau sur la suivante",
            "remplacer par un bloc titre AVANT le tableau, les deux dans un conteneur "
            "(.tbl + .tbl-title du template), avec break-after:avoid sur le titre"))

    # A7 — @page configuré
    if "@page" not in clean:
        out.append(Finding(
            "page_non_configuree", "bloquant", name,
            "aucune règle @page : format, marges et pagination ne sont pas maîtrisés",
            "déclarer @page avec size, margin et les boîtes de marge de pagination"))

    # A9 — la même image posée deux fois : immanquable, surtout en page de clôture
    imgs = re.findall(r'<img[^>]+src="(assets/[^"]+\.(?:jpg|jpeg|png|webp))"', clean)
    dups = {f for f in imgs if imgs.count(f) > 1}
    for f in sorted(dups):
        out.append(Finding(
            "image_en_double", "bloquant", name,
            f"« {os.path.basename(f)} » est utilisée {imgs.count(f)} fois dans le document",
            "générer une image inédite pour le second emplacement (1 à 2 jetons), ou retirer "
            "la seconde occurrence. Un doublon photographique se repère au premier coup d'œil"))

    # A10 — la colonne DOIT être égale à la mesure (point 2 du standard).
    #       Un max-width sur p nettement plus étroit que la colonne fait flotter la prose :
    #       ligne correcte, mais bande vide à droite et document « inachevé ».
    mp = re.search(r"@page\s*\{[^}]*margin\s*:\s*[\d.]+mm\s+([\d.]+)mm", clean)
    mw = re.search(r"(?<![\w.-])p\s*\{[^}]*max-width\s*:\s*([\d.]+)em", clean)
    mc = re.search(r"--corps\s*:\s*([\d.]+)pt", clean)
    if mp and mw and mc:
        marge, em, corps = float(mp.group(1)), float(mw.group(1)), float(mc.group(1))
        colonne = 210 - 2 * marge                 # A4
        mesure = em * corps * 25.4 / 72
        if mesure < colonne * 0.90:
            out.append(Finding(
                "colonne_plus_large_que_la_mesure", "bloquant", name,
                f"la prose est bridée à {mesure:.0f} mm dans une colonne de {colonne:.0f} mm "
                f"({mesure/colonne*100:.0f} %) : la ligne est peut-être bonne, mais la prose "
                f"s'arrête loin du bord alors que tableaux et figures vont jusqu'au bout",
                f"régler la COLONNE sur la mesure via les marges de page, pas par un max-width. "
                f"Pour {corps} pt, une colonne de {mesure:.0f} mm demande des marges de "
                f"{(210-mesure)/2:.0f} mm — ou retirer le max-width et monter le corps "
                f"(voir la table marges/corps du point 2 du standard)"))

    # A8 — couleurs hors des tokens déclarés dans :root
    root = re.search(r":root\s*\{(.*?)\}", clean, re.S)
    if root:
        declared = {c.upper() for c in re.findall(r"#[0-9a-fA-F]{6}", root.group(1))}
        used = {c.upper() for c in re.findall(r"#[0-9a-fA-F]{6}", clean)}
        extra = used - declared
        if extra:
            out.append(Finding(
                "couleur_hors_tokens", "bloquant", name,
                f"{len(extra)} couleur(s) en dur hors des tokens de :root — {sorted(extra)}",
                "déclarer la valeur comme token ou dérivé dans :root, et la référencer. "
                "Les boîtes de marge @page n'acceptant pas les variables, y recopier la "
                "valeur du dérivé et le dire en commentaire"))
    return out


# ─────────────────────────────────────────────────────────────── contrôles SVG

def check_svg(svg: str, name: str) -> list[Finding]:
    out: list[Finding] = []

    vb = re.search(r'viewBox="\s*(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)', svg)
    if not vb:
        out.append(Finding("viewbox_absente", "bloquant", name,
                           "pas de viewBox : la figure ne se met pas à l'échelle de la colonne",
                           'ajouter viewBox="0 0 W H"'))
        return out
    x0, y0, W, H = (float(vb.group(i)) for i in range(1, 5))
    if (x0, y0) != (0.0, 0.0):
        out.append(Finding("viewbox_decalee", "mineur", name,
                           f"viewBox ne commence pas à 0 0 (mais {x0} {y0})",
                           "ramener l'origine à 0 0 pour que l'alignement soit lisible"))

    tol = max(6.0, W * 0.012)   # calage bord à bord : ~1,2 % de la largeur
    # Rognage : tolérance serrée. Tout dépassement de la viewBox coupe l'encre, et
    # l'estimateur de largeur est volontairement pessimiste (il vaut mieux un faux
    # positif qu'un libellé tronqué découvert sur le PDF).
    tol_clip = 2.0

    # B1 — un <text> avec attribut fill, alors qu'une classe définit déjà un fill :
    #      la règle CSS gagne, l'attribut est écrasé (Chrome peut masquer le défaut)
    style_block = re.search(r"<style>(.*?)</style>", svg, re.S)
    class_sets_fill = bool(style_block and re.search(r"fill\s*:", style_block.group(1)))
    if class_sets_fill:
        bad = [t for t in re.findall(r"<text\b[^>]*>", svg)
               if re.search(r'\sfill="', t) and 'class="' in t]
        if bad:
            out.append(Finding(
                "fill_ecrase", "bloquant", name,
                f"{len(bad)} <text> posent leur couleur par attribut fill= alors qu'une règle "
                f"de classe définit déjà fill : la règle CSS l'emporte et la couleur est "
                f"écrasée (libellés blancs qui ressortent en foncé, etc.)",
                'passer la couleur en style="fill:…" inline, qui gagne contre la classe — '
                "MAIS uniquement si ce SVG est chargé via <img> : inliné dans le HTML, "
                "WeasyPrint jette style=\"fill:…\" (propriété CSS inconnue) et tout sort en "
                "noir. Inliné, la bonne réponse est de supprimer la règle de classe et de "
                "garder l'attribut fill="))

    # B2 — encre bord à bord
    xs: list[float] = []
    for m in re.finditer(r'<(?:rect|line|circle)\b[^>]*>', svg):
        tag = m.group(0)
        if (xm := re.search(r'\sx="(-?[\d.]+)"', tag)):
            x = float(xm.group(1)); xs.append(x)
            if (wm := re.search(r'\swidth="([\d.]+)"', tag)):
                xs.append(x + float(wm.group(1)))
        for a in ("x1", "x2"):
            if (am := re.search(rf'\s{a}="(-?[\d.]+)"', tag)):
                xs.append(float(am.group(1)))
        if (cm := re.search(r'\scx="(-?[\d.]+)"', tag)):
            xs.append(float(cm.group(1)))
    for m in re.finditer(r'<text\b([^>]*)>([^<]*)<', svg):
        attrs, content = m.group(1), m.group(2)
        if not (xm := re.search(r'\sx="(-?[\d.]+)"', attrs)):
            continue
        x = float(xm.group(1))
        fs = float(fm.group(1)) if (fm := re.search(r'font-size="([\d.]+)"', attrs)) else 11.0
        bold = "font-weight" in attrs and re.search(r'font-weight="?(600|700|800|bold)', attrs)
        w = text_extent(content, fs, bool(bold))
        anchor = am.group(1) if (am := re.search(r'text-anchor="(\w+)"', attrs)) else "start"
        lo = x - w if anchor == "end" else x - w / 2 if anchor == "middle" else x
        xs.extend([lo, lo + w])
        # B3 — texte qui déborde de la viewBox : il sera rogné à la conversion
        if lo < -tol_clip or lo + w > W + tol_clip:
            out.append(Finding(
                "texte_rogne", "bloquant", name,
                f'le texte « {content[:34]}{"…" if len(content) > 34 else ""} » s\'étend de '
                f'{lo:.0f} à {lo+w:.0f} alors que la viewBox va de 0 à {W:.0f} : il sera rogné',
                "élargir la colonne de libellés, réduire le corps, ou raccourcir le libellé"))
    if xs:
        lo, hi = min(xs), max(xs)
        if lo > tol:
            out.append(Finding(
                "encre_non_calee_gauche", "mineur", name,
                f"l'encre commence à x={lo:.0f} au lieu de 0 : la figure sera en retrait de "
                f"{lo/W*174:.0f} mm par rapport à la colonne de texte",
                "caler le premier élément visible à x=0 (libellés d'axe calés à droite sur "
                "leur colonne, barres et socles démarrant à 0)"))
        if hi < W - tol:
            out.append(Finding(
                "encre_non_calee_droite", "mineur", name,
                f"l'encre finit à x={hi:.0f} au lieu de {W:.0f} : la figure n'occupe pas "
                f"toute la colonne",
                'caler le dernier élément visible sur W (text-anchor="end" à x=W)'))

    # B4 — un SVG ne porte pas sa source : elle doit vivre dans le <figcaption>
    for m in re.finditer(r"<text\b[^>]*>([^<]*)<", svg):
        if re.match(r"\s*Sources?\s*:", m.group(1)):
            out.append(Finding(
                "source_dans_le_svg", "mineur", name,
                "la note de source est écrite dans le SVG : elle échappe à l'échelle "
                "typographique du document et double souvent la légende HTML",
                "déplacer la source dans le <figcaption>"))
            break
    return out


# ──────────────────────────────────────────────────────────────────── exécution

def run(html_path, assets_dir):
    findings = []
    if html_path and os.path.exists(html_path):
        findings += check_html(open(html_path, encoding="utf-8").read(),
                               os.path.basename(html_path))
    for f in sorted(glob.glob(os.path.join(assets_dir or ".", "*.svg"))):
        if "logo" in os.path.basename(f).lower():
            continue            # un logo est un fichier de marque, pas une figure
        findings += check_svg(open(f, encoding="utf-8").read(), os.path.basename(f))
    return findings


def selftest():
    ok = True

    def expect(findings, kind, present, label):
        nonlocal ok
        got = any(f.kind == kind for f in findings)
        good = got == present
        ok &= good
        print(f"  {'OK  ' if good else 'ÉCHEC'} {label}")

    expect(check_html('<style>@font-face{font-weight:100 900}@page{size:A4}'
                      ':root{--a:#FFFFFF}</style>', "t"),
           "police_variable", True, "plage de graisse détectée")
    expect(check_html('<style>@font-face{font-weight:700}@page{size:A4}'
                      ':root{--a:#FFFFFF}</style>', "t"),
           "police_variable", False, "graisse statique acceptée")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}</style>'
                      '<p>1 180 €</p>', "t"),
           "espace_fine", True, "U+202F détecté")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}</style>'
                      '<p>1 180 €</p>', "t"),
           "espace_fine", False, "U+00A0 accepté")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}'
                      '.x{color:#123456}</style>', "t"),
           "couleur_hors_tokens", True, "couleur hors tokens détectée")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}'
                      'figure.full{margin-left:-18mm}</style>', "t"),
           "figure_pleine_largeur", True, "figure hors colonne détectée")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}</style>'
                      '<table><caption>T</caption></table>', "t"),
           "caption_detachable", True, "<caption> détachable détectée")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}</style>'
                      '<div class="tbl"><p class="tbl-title">T</p><table></table></div>', "t"),
           "caption_detachable", False, "titre de tableau solidaire accepté")

    expect(check_html('<style>@page{size:A4;margin:20mm 18mm 16mm 18mm}'
                      ':root{--a:#FFFFFF;--corps:10.5pt}p{max-width:34em}</style>', "t"),
           "colonne_plus_large_que_la_mesure", True, "prose bridée dans une colonne trop large")
    expect(check_html('<style>@page{size:A4;margin:20mm 22mm 16mm 22mm}'
                      ':root{--a:#FFFFFF;--corps:12pt}</style>', "t"),
           "colonne_plus_large_que_la_mesure", False, "colonne accordée à la mesure acceptée")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}</style>'
                      '<img src="assets/b.jpg"><img src="assets/b.jpg">', "t"),
           "image_en_double", True, "image en double détectée")
    expect(check_html('<style>@page{size:A4}:root{--a:#FFFFFF}</style>'
                      '<img src="assets/b.jpg"><img src="assets/c.jpg">', "t"),
           "image_en_double", False, "images distinctes acceptées")

    # texte rogné : « Auvergne-Rhône-Alpes » calé à droite sur une colonne trop étroite
    svg_clip = ('<svg viewBox="0 0 700 100"><rect x="0" y="0" width="700" height="4"/>'
                '<text x="122" text-anchor="end" font-size="11.5">Auvergne-Rhône-Alpes</text>'
                '</svg>')
    expect(check_svg(svg_clip, "clip.svg"), "texte_rogne", True, "libellé rogné détecté")
    svg_ok = ('<svg viewBox="0 0 700 100"><rect x="0" y="0" width="700" height="4"/>'
              '<text x="152" text-anchor="end" font-size="11">Auvergne-Rhône-Alpes</text>'
              '</svg>')
    expect(check_svg(svg_ok, "ok.svg"), "texte_rogne", False, "libellé au large accepté")

    svg_fill = ('<svg viewBox="0 0 700 100"><style>.t{fill:#111}</style>'
                '<rect x="0" y="0" width="700" height="4"/>'
                '<text class="t" x="10" fill="#FFFFFF">bonjour</text></svg>')
    expect(check_svg(svg_fill, "fill.svg"), "fill_ecrase", True, "fill écrasé détecté")
    svg_fill_ok = ('<svg viewBox="0 0 700 100"><style>.t{fill:#111}</style>'
                   '<rect x="0" y="0" width="700" height="4"/>'
                   '<text class="t" x="10" style="fill:#FFFFFF">bonjour</text></svg>')
    expect(check_svg(svg_fill_ok, "fillok.svg"), "fill_ecrase", False, "fill inline accepté")

    svg_inset = ('<svg viewBox="0 0 700 100">'
                 '<rect x="40" y="0" width="600" height="4"/></svg>')
    expect(check_svg(svg_inset, "inset.svg"), "encre_non_calee_gauche", True,
           "encre en retrait détectée")

    print("\nselftest :", "OK" if ok else "ÉCHEC")
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(description="Contrôle des alignements d'un lead magnet.")
    ap.add_argument("dossier", nargs="?", default=".")
    ap.add_argument("--html")
    ap.add_argument("--assets")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()

    if a.selftest:
        return selftest()

    html = a.html or os.path.join(a.dossier, "lead-magnet.html")
    assets = a.assets or os.path.join(a.dossier, "assets")
    findings = run(html, assets)

    if a.json:
        print(json.dumps([f.as_dict() for f in findings], ensure_ascii=False, indent=2))
    else:
        blk = [f for f in findings if f.severity == "bloquant"]
        if not findings:
            print("alignements : aucun défaut détecté ✔")
        else:
            print(f"{len(findings)} défaut(s) — {len(blk)} bloquant(s)\n")
            for f in sorted(findings, key=lambda x: x.severity != "bloquant"):
                print(f)
    return 1 if any(f.severity == "bloquant" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
