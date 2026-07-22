"""Calcula compatibilidade (mesmo algoritmo de ProfileMatchScorer.java) entre um vetor
de 12 eixos e todos os perfis dos catalogos personality/ideology/country.

Uso:
    python profile-audit/compatibility.py <catalog> <id>

Exemplo:
    python profile-audit/compatibility.py personality zohran-mamdani

Imprime o top 5 de personalidades, ideologias e paises mais proximos (exclui o proprio
perfil da lista, se ele aparecer no catalogo pesquisado).
"""
import json
import math
import sys
import os

AXIS_IDS = [
    "estrutura", "representacao", "poder", "imigracao", "diplomacia", "intervencao",
    "economia", "controle", "comercio", "religiao", "moral", "tecnologia",
]
CENTER = 50.0
AXIS_SPREAD = 50.0
AXIS_WEIGHT = 0.42
DIRECTION_WEIGHT = 0.33
MAGNITUDE_WEIGHT = 0.18
OUTLIER_WEIGHT = 0.07
OPPOSITE_SIDE_MAX_PENALTY = 0.45
OPPOSITE_SIDE_SPREAD = 25.0
OUTLIER_FULL_SPREAD = 100.0
OUTLIER_EXPONENT = 2.5

BASE = os.path.join(os.path.dirname(__file__), "..", "backend", "src", "main", "resources", "data")

CATALOGS = {
    "personality": ("personality-profiles.json", "personalityId", "personalities.json"),
    "ideology": ("ideology-profiles.json", "ideologyId", "ideologies.json"),
    "country": ("countries-profiles.json", "countryId", "countries.json"),
}


def opposite_side_factor(u, t):
    us = abs(u - CENTER)
    ts = abs(t - CENTER)
    penalty = OPPOSITE_SIDE_MAX_PENALTY * math.tanh(us / OPPOSITE_SIDE_SPREAD) * math.tanh(ts / OPPOSITE_SIDE_SPREAD)
    return 1.0 - penalty


def axis_similarity(uv, tv):
    total = 0.0
    for ax in AXIS_IDS:
        u = uv.get(ax, CENTER)
        t = tv.get(ax, CENTER)
        diff = abs(u - t)
        sim = max(0.0, 1.0 - (diff / AXIS_SPREAD) ** 2)
        if (u - CENTER) * (t - CENTER) < 0.0:
            sim *= opposite_side_factor(u, t)
        total += sim
    return 100.0 * total / len(AXIS_IDS)


def direction_similarity(uv, tv):
    dot = 0.0
    un = 0.0
    tn = 0.0
    for ax in AXIS_IDS:
        cu = uv.get(ax, CENTER) - CENTER
        ct = tv.get(ax, CENTER) - CENTER
        dot += cu * ct
        un += cu * cu
        tn += ct * ct
    if un == 0.0 or tn == 0.0:
        return CENTER
    cosine = dot / (math.sqrt(un) * math.sqrt(tn))
    return CENTER + CENTER * cosine


def avg_dist_from_center(v):
    return sum(abs(v.get(ax, CENTER) - CENTER) for ax in AXIS_IDS) / len(AXIS_IDS)


def magnitude_similarity(uv, tv):
    return 100.0 - 2.0 * abs(avg_dist_from_center(uv) - avg_dist_from_center(tv))


def outlier_similarity(uv, tv):
    maxdiff = 0.0
    for ax in AXIS_IDS:
        maxdiff = max(maxdiff, abs(uv.get(ax, CENTER) - tv.get(ax, CENTER)))
    return 100.0 * max(0.0, 1.0 - (maxdiff / OUTLIER_FULL_SPREAD) ** OUTLIER_EXPONENT)


def compatibility(uv, tv):
    a = axis_similarity(uv, tv)
    d = direction_similarity(uv, tv)
    m = magnitude_similarity(uv, tv)
    o = outlier_similarity(uv, tv)
    raw = AXIS_WEIGHT * a + DIRECTION_WEIGHT * d + MAGNITUDE_WEIGHT * m + OUTLIER_WEIGHT * o
    return round(max(0.0, min(100.0, raw)), 1)


def top_matches(vector, catalog, exclude_id=None, top_n=2):
    profiles_file, key_field, meta_file = CATALOGS[catalog]
    profiles = json.load(open(os.path.join(BASE, profiles_file), encoding="utf-8"))
    meta = {p["id"]: p["name"] for p in json.load(open(os.path.join(BASE, meta_file), encoding="utf-8"))}
    results = []
    for p in profiles:
        pid = p[key_field]
        if pid == exclude_id:
            continue
        score = compatibility(vector, p["vector"])
        results.append((score, pid, meta.get(pid, pid)))
    results.sort(reverse=True)
    return results[:top_n]


def vector_for(catalog, pid):
    profiles_file, key_field, _ = CATALOGS[catalog]
    profiles = json.load(open(os.path.join(BASE, profiles_file), encoding="utf-8"))
    for p in profiles:
        if p[key_field] == pid:
            return p["vector"]
    raise SystemExit(f"id '{pid}' nao encontrado em {profiles_file}")


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    catalog, pid = sys.argv[1], sys.argv[2]
    if catalog not in CATALOGS:
        print(f"catalog invalido: {catalog} (use personality/ideology/country)")
        sys.exit(1)

    vector = vector_for(catalog, pid)

    for target_catalog, label in [("personality", "PERSONALIDADES"), ("ideology", "IDEOLOGIAS"), ("country", "PAISES")]:
        exclude = pid if target_catalog == catalog else None
        matches = top_matches(vector, target_catalog, exclude_id=exclude, top_n=2)
        print(f"=== TOP 2 {label} ===")
        for score, mid, name in matches:
            print(f"{score}%  {name} ({mid})")
        print()


if __name__ == "__main__":
    main()
