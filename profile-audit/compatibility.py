"""Calcula compatibilidade (mesmo algoritmo de ProfileMatchScorer.java) entre um vetor
de 12 eixos e todos os perfis dos catalogos personality/ideology/country.

Uso:
    python profile-audit/compatibility.py <catalog> <id> [--religion <valor>] [--sem-filtro]

Exemplo:
    python profile-audit/compatibility.py personality zohran-mamdani
    python profile-audit/compatibility.py country quenia --religion catholic

Aplica a regra do filtro de religiao (espelho de ReligionFilter.java): por padrao o ranking
e calculado como o usuario que escolheu a(s) religiao(oes) selecionavel(is) do proprio perfil
(`religions` no JSON de metadados), uma secao por religiao; perfil sem religiao selecionavel
(`[]` ou so `other`) imprime o ranking sem filtro. `--religion X` forca uma preferencia
(catholic, protestant, orthodox, judaism, islam, buddhism, christianity) e `--sem-filtro`
volta ao ranking geral. A compatibilidade nao muda; muda so quem entra no ranking.

Imprime os 2 matches de cada catalogo. Ao auditar um perfil de ideologia, imprime os 3
vizinhos ideologicos e suas categorias cadastradas para apoiar a revisao de categoria.
Exclui o proprio perfil da lista quando o catalogo pesquisado e o mesmo.
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
DIRECTION_AUGMENT_RADIUS = 8.0

BASE = os.path.join(os.path.dirname(__file__), "..", "backend", "src", "main", "resources", "data")

CATALOGS = {
    "personality": ("personality-profiles.json", "personalityId", "personalities.json"),
    "ideology": ("ideology-profiles.json", "ideologyId", "ideologies.json"),
    "country": ("countries-profiles.json", "countryId", "countries.json"),
}


# Espelho de backend/.../service/ReligionFilter.java.
CHRISTIAN = ["catholic", "protestant", "orthodox"]
LEGACY_CHRISTIANITY = "christianity"
SELECTABLE = ["catholic", "protestant", "orthodox", "judaism", "islam", "buddhism"]
ONLY = "only"


def religion_allows(religions, preference):
    """Mesma regra de ReligionFilter.allows: o filtro exclui, nao exige."""
    if not religions:
        return True
    if preference is None:
        preferred = []
    elif preference == LEGACY_CHRISTIANITY:
        preferred = CHRISTIAN
    else:
        preferred = [preference]
    matches = any(r in preferred for r in religions)
    if ONLY in religions:
        has_selectable = any(r in SELECTABLE for r in religions)
        return matches if has_selectable else preference is None
    if preference is None:
        return True
    return matches or not any(r in SELECTABLE for r in religions)


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
    # Cosseno aumentado (espelho de ProfileMatchScorer.directionSimilarity).
    augment = len(AXIS_IDS) * DIRECTION_AUGMENT_RADIUS * DIRECTION_AUGMENT_RADIUS
    cosine = (dot + augment) / math.sqrt((un + augment) * (tn + augment))
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


def top_matches(vector, catalog, exclude_id=None, top_n=2, religion=None):
    profiles_file, key_field, meta_file = CATALOGS[catalog]
    profiles = json.load(open(os.path.join(BASE, profiles_file), encoding="utf-8"))
    metadata = json.load(open(os.path.join(BASE, meta_file), encoding="utf-8"))
    meta = {p["id"]: p["name"] for p in metadata}
    religions = {p["id"]: p.get("religions", []) for p in metadata}
    results = []
    for p in profiles:
        pid = p[key_field]
        if pid == exclude_id:
            continue
        if religion is not None and not religion_allows(religions.get(pid, []), religion):
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


def own_religions(catalog, pid):
    """Religioes selecionaveis do proprio perfil (ordem do JSON)."""
    _, _, meta_file = CATALOGS[catalog]
    for p in json.load(open(os.path.join(BASE, meta_file), encoding="utf-8")):
        if p["id"] == pid:
            return [r for r in p.get("religions", []) if r in SELECTABLE]
    return []


def print_rankings(catalog, pid, vector, ideology_meta, religion):
    for target_catalog, label in [("personality", "PERSONALIDADES"), ("ideology", "IDEOLOGIAS"), ("country", "PAISES")]:
        exclude = pid if target_catalog == catalog else None
        top_n = 3 if catalog == "ideology" and target_catalog == "ideology" else 2
        matches = top_matches(vector, target_catalog, exclude_id=exclude, top_n=top_n, religion=religion)
        print(f"=== TOP {top_n} {label} ===")
        for score, mid, name in matches:
            if catalog == "ideology" and target_catalog == "ideology":
                category = ideology_meta.get(mid, {}).get("category", "categoria desconhecida")
                print(f"{score}%  {name} ({mid}) — {category}")
            else:
                print(f"{score}%  {name} ({mid})")
        print()


def main():
    args = sys.argv[1:]
    forced = None
    no_filter = False
    if "--sem-filtro" in args:
        no_filter = True
        args.remove("--sem-filtro")
    if "--religion" in args:
        i = args.index("--religion")
        if i + 1 >= len(args):
            print(__doc__)
            sys.exit(1)
        forced = args[i + 1].strip().lower()
        del args[i:i + 2]
        if forced not in SELECTABLE + [LEGACY_CHRISTIANITY]:
            print(f"religiao invalida: {forced} (use {', '.join(SELECTABLE)} ou {LEGACY_CHRISTIANITY})")
            sys.exit(1)
    if len(args) != 2:
        print(__doc__)
        sys.exit(1)
    catalog, pid = args
    if catalog not in CATALOGS:
        print(f"catalog invalido: {catalog} (use personality/ideology/country)")
        sys.exit(1)

    vector = vector_for(catalog, pid)

    ideology_meta = {
        item["id"]: item
        for item in json.load(open(os.path.join(BASE, "ideologies.json"), encoding="utf-8"))
    }

    if no_filter:
        preferences = [None]
    elif forced:
        preferences = [forced]
    else:
        preferences = own_religions(catalog, pid) or [None]

    for religion in preferences:
        if religion is None:
            print("--- SEM FILTRO DE RELIGIAO ---\n")
        else:
            print(f"--- FILTRO DE RELIGIAO: {religion} (usuario que escolheu {religion}) ---\n")
        print_rankings(catalog, pid, vector, ideology_meta, religion)


if __name__ == "__main__":
    main()
