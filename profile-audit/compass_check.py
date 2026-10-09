"""Onde cada ideologia cai na bussola politica 2D, comparado com a categoria cadastrada.

A pagina de resultados calcula a posicao do usuario na bussola (esquerda-direita x
libertario-autoritario) a partir dos 12 eixos e a compara com a categoria da ideologia mais
compativel. Quando as duas nao coincidem, a frase mostra "Entre X e Y" (ou "Centro-esquerda" e
"Centro-direita" quando um dos lados e o Centro). Este script faz a mesma conta com o vetor de
cada ideologia do catalogo, para ver de antemao quais perfis caem fora da propria categoria.

A formula e a grade espelham o frontend e precisam ser mantidas em sincronia com eles:
  - posicao:  frontend/src/utils/politicalCompass.ts  (computeCompass, compassRegion, centerSide)
  - categoria: frontend/src/utils/ideologyColors.ts  (aliases de categoria)
  - regioes:  frontend/src/components/results/PoliticalCompassSection.tsx (mapa de cores)

Uso (a partir da raiz do repo):
  python profile-audit/compass_check.py                       # todas as ideologias
  python profile-audit/compass_check.py --diff                # so as que divergem
  python profile-audit/compass_check.py --pair centro,direita # so um par de categorias
  python profile-audit/compass_check.py libertarismo anarcocapitalismo   # ids especificos
  python profile-audit/compass_check.py --diff --urls         # com link de teste local
  python profile-audit/compass_check.py --csv > bussola.csv   # saida em CSV
"""

import argparse
import csv
import json
import math
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "backend" / "src" / "main" / "resources" / "data"

# Ordem dos eixos em axes.json e as chaves curtas da URL de resultado compartilhado.
AXIS_ORDER = ["estrutura", "representacao", "poder", "imigracao", "diplomacia", "intervencao",
              "economia", "controle", "comercio", "religiao", "moral", "tecnologia"]
URL_KEYS = ["est", "rep", "pod", "imi", "dip", "int", "eco", "con", "com", "rel", "mor", "tec"]

# --- espelha politicalCompass.ts -------------------------------------------------------------
WEIGHT_ECONOMIA, WEIGHT_CONTROLE, WEIGHT_COMERCIO, WEIGHT_IMIGRACAO, WEIGHT_MORAL = 0.2, 0.3, 0.2, 0.25, 0.05
GAIN_LEFT, GAIN_RIGHT = 1.6, 2.6
GRID_SIZE = 9


def stretch(average: float) -> float:
    distance = average - 50
    gain = GAIN_LEFT if distance < 0 else GAIN_RIGHT
    return 50 + 50 * math.tanh(distance * gain / 50)


def compass(v: dict) -> tuple[float, float, float]:
    """(direita, autoritario, tradicionalista), cada um de 0 a 100. `v` guarda leftPercent por eixo."""
    right = stretch(
        WEIGHT_ECONOMIA * (100 - v["economia"])
        + WEIGHT_CONTROLE * (100 - v["controle"])
        + WEIGHT_COMERCIO * (100 - v["comercio"])
        + WEIGHT_IMIGRACAO * v["imigracao"]
        + WEIGHT_MORAL * (100 - v["moral"])
    )
    authoritarian = (v["poder"] + (100 - v["representacao"]) + (100 - v["estrutura"])) / 3
    return right, authoritarian, 100 - v["moral"]


def cell(percent: float) -> int:
    return max(0, min(GRID_SIZE - 1, math.floor(percent / 100 * GRID_SIZE)))


def region(right: float, authoritarian: float) -> str:
    column, row = cell(right), cell(100 - authoritarian)
    if row <= 2:
        return "esq-radical" if column <= 2 else "terceira" if column <= 5 else "ext-direita"
    if row <= 6:
        return "esquerda" if column <= 2 else "centro" if column <= 5 else "direita"
    if column <= 3:
        return "anarquismo"
    if column >= 5:
        return "libertario"
    return "anarquismo" if right < 50 else "libertario"


def center_side(first: str, second: str) -> str | None:
    if first == second or "centro" not in (first, second):
        return None
    if "esquerda" in (first, second):
        return "esquerda"
    if "direita" in (first, second):
        return "direita"
    return None


# --- espelha ideologyColors.ts ----------------------------------------------------------------
ALIASES = {
    "esquerda radical": "esq-radical", "radical left": "esq-radical", "left-radical": "esq-radical",
    "esquerda": "esquerda", "left": "esquerda",
    "centro": "centro", "center": "centro",
    "direita": "direita", "right": "direita",
    "extrema direita": "ext-direita", "far-right": "ext-direita", "right-extreme": "ext-direita",
    "terceira posição": "terceira", "third position": "terceira", "third-position": "terceira",
    "libertário": "libertario", "libertarian": "libertario",
    "anarquismo": "anarquismo", "anarquista": "anarquismo", "anarchist": "anarquismo",
}
NAMES = {
    "esq-radical": "Esquerda radical", "esquerda": "Esquerda", "centro": "Centro", "direita": "Direita",
    "ext-direita": "Extrema direita", "terceira": "Terceira posição", "libertario": "Libertarismo",
    "anarquismo": "Anarquismo",
}


def category_key(category: str) -> str:
    return ALIASES.get(category.strip().lower(), "centro")


def verdict(category: str, where: str) -> str:
    """O que a pagina de resultados mostraria quando essa ideologia fica no topo."""
    if category == where:
        return "coincide"
    side = center_side(category, where)
    if side:
        return f"Centro-{side}"
    return f"Entre {NAMES[category]} e {NAMES[where]}"


def load() -> list[dict]:
    ideologies = json.loads((DATA / "ideologies.json").read_text(encoding="utf-8"))
    vectors = {p["ideologyId"]: p["vector"] for p in json.loads((DATA / "ideology-profiles.json").read_text(encoding="utf-8"))}
    rows = []
    for item in ideologies:
        vector = vectors.get(item["id"])
        if not vector:
            continue
        right, authoritarian, traditional = compass(vector)
        cat, where = category_key(item["category"]), region(right, authoritarian)
        rows.append({
            "id": item["id"], "name": item["name"], "category": item["category"], "cat": cat,
            "region": where, "right": right, "authoritarian": authoritarian, "traditional": traditional,
            "verdict": verdict(cat, where), "vector": vector,
        })
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description="Posicao de cada ideologia na bussola 2D vs a categoria cadastrada.")
    parser.add_argument("ids", nargs="*", help="ids de ideologias (padrao: todas)")
    parser.add_argument("--diff", action="store_true", help="mostrar so as que divergem da categoria")
    parser.add_argument("--pair", help="so o par de categorias, ex.: centro,direita (em qualquer ordem)")
    parser.add_argument("--urls", action="store_true", help="incluir link de teste local do resultado")
    parser.add_argument("--csv", action="store_true", help="saida em CSV")
    args = parser.parse_args()

    sys.stdout.reconfigure(encoding="utf-8")
    rows = load()
    if args.ids:
        wanted = set(args.ids)
        missing = wanted - {r["id"] for r in rows}
        if missing:
            print(f"ids sem vetor ou inexistentes: {', '.join(sorted(missing))}", file=sys.stderr)
        rows = [r for r in rows if r["id"] in wanted]
    total = len(rows)
    if args.pair:
        pair = {p.strip() for p in args.pair.split(",")}
        unknown = pair - set(NAMES)
        if unknown or len(pair) != 2:
            print(f"--pair espera duas das chaves: {', '.join(NAMES)}", file=sys.stderr)
            return 2
        rows = [r for r in rows if {r["cat"], r["region"]} == pair]
    elif args.diff:
        rows = [r for r in rows if r["cat"] != r["region"]]

    def url(r: dict) -> str:
        query = "&".join(f"{k}={r['vector'][a]}" for k, a in zip(URL_KEYS, AXIS_ORDER))
        return f"http://localhost:5173/results?{query}#bussola"

    if args.csv:
        out = csv.writer(sys.stdout, lineterminator="\n")
        out.writerow(["id", "nome", "categoria", "regiao_bussola", "direita", "autoritario", "tradicionalista", "resultado"])
        for r in sorted(rows, key=lambda r: r["name"]):
            out.writerow([r["id"], r["name"], r["category"], NAMES[r["region"]],
                          round(r["right"]), round(r["authoritarian"]), round(r["traditional"]), r["verdict"]])
        return 0

    width = max((len(r["name"]) for r in rows), default=10)
    for r in sorted(rows, key=lambda r: (r["verdict"] != "coincide", r["verdict"], r["name"])):
        mark = "  " if r["verdict"] == "coincide" else "! "
        print(f"{mark}{r['name']:<{width}}  cat={NAMES[r['cat']]:<16} bussola={NAMES[r['region']]:<16} "
              f"dir={r['right']:>3.0f} aut={r['authoritarian']:>3.0f}  -> {r['verdict']}")
        if args.urls:
            print(f"     {url(r)}")

    divergent = [r for r in rows if r["cat"] != r["region"]]
    print(f"\n{len(rows)} ideologias exibidas (de {total} no recorte); {len(divergent)} divergem da categoria.")
    if divergent:
        for kind, count in Counter(r["verdict"] if r["verdict"].startswith("Centro-") else "Entre ..." for r in divergent).most_common():
            print(f"  {kind}: {count}")
        pairs = Counter(" + ".join(sorted((NAMES[r["cat"]], NAMES[r["region"]]))) for r in divergent)
        print("Pares:")
        for pair_name, count in pairs.most_common():
            print(f"  {pair_name}: {count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
