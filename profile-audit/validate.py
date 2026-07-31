"""Valida uma saida de auditoria (subagent-out ou answers) ANTES do merge.

Uso:
    python profile-audit/validate.py <catalog> <id> [caminho-do-json]

Exemplos:
    python profile-audit/validate.py personality nietzsche
    python profile-audit/validate.py ideology socialismo-lassalliano
    python profile-audit/validate.py personality nietzsche profile-audit/subagent-out/personality/nietzsche.json

Roda TRES niveis de checagem, nesta ordem:

  [FORMA]     12 eixos, 20 respostas por eixo, ids corretos, codigos DT/D/N/C/CT,
              personaBrief nao vazio.
  [NEUTROS]   taxa de "N" no total e por eixo. Cada "N" vale exatamente 0.50 (o
              ponto morto), entao um eixo cheio de N nao mede a posicao do perfil -
              apenas colapsa artificialmente para ~50.
  [CONTEUDO]  direcao dos eixos conferida contra perfis-ancora reais, vizinhos mais
              proximos no catalogo (duplicata) e coerencia com o perfil declarado
              (personalityId da ideologia, ou ideologias que citam a personalidade).

Sai com codigo 1 se qualquer checagem BLOQUEANTE falhar. Avisos nao bloqueiam.

Por que este script existe: auditorias formalmente impecaveis ja foram mescladas
com erros graves de conteudo. Ver "Modos de falha conhecidos" em README.md.
"""
import json
import os
import sys
import collections
import importlib.util

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, "..", "backend", "src", "main", "resources", "data")

_spec = importlib.util.spec_from_file_location("compat", os.path.join(BASE, "compatibility.py"))
compat = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(compat)

AXES = compat.AXIS_IDS
VALID = {"DT", "D", "N", "C", "CT"}
SCORE = {"DT": 0, "D": 0.25, "N": 0.5, "C": 0.75, "CT": 1}

# Limites de neutros. Um "N" vale 0.50 e puxa o eixo para o ponto morto.
MAX_N_TOTAL = 0.18       # bloqueia acima disso
MAX_N_AXIS = 0.30        # bloqueia acima disso
WARN_N_AXIS = 0.25       # avisa a partir daqui

# Quao perto uma ideologia pode ficar de outra antes de ser considerada duplicata.
DUP_WARN = 93.0
DUP_BLOCK = 95.0
# Quao longe o perfil pode ficar da personalidade/ideologia que ele declara representar.
MISMATCH_WARN = 92.0

# Direcao REAL de cada eixo, medida nos dados (nao no axes-explained.md, que tem
# `religiao` e `imigracao` invertidos em relacao a implementacao).
# Formato: eixo -> (rotulo do polo 0, rotulo do polo 100, ancora_baixa, ancora_alta)
AXIS_POLES = {
    "estrutura":     ("centralizado/unitario", "descentralizado/federal", "stalin", "rothbard"),
    "representacao": ("autocracia", "democracia", "kim-jong-un", "jose-mujica"),
    "poder":         ("liberdade civil", "ordem/vigilancia", "rothbard", "stalin"),
    "imigracao":     ("multicultural/aberto", "assimilacionista/fechado", "justin-trudeau", "hitler"),
    "diplomacia":    ("pacifista", "militarista", "dalai-lama", "hitler"),
    "intervencao":   ("nacionalista assertivo", "nao-intervencionista", "hitler", "dalai-lama"),
    "economia":      ("privado/mercado", "publico/coletivo", "rothbard", "stalin"),
    "controle":      ("livre mercado", "planejamento", "rothbard", "stalin"),
    "comercio":      ("livre comercio/globalista", "protecionista", "milton-friedman", "hitler"),
    "religiao":      ("religioso", "irreligioso/secular", "khomeini", "stalin"),
    "moral":         ("tradicionalista", "progressista", "francisco-franco", "foucault"),
    "tecnologia":    ("biologia/naturalista", "tecnofilo", "ted-kaczynski", "ray-kurzweil"),
}

CATALOGS = {
    "personality": ("personality-profiles.json", "personalityId", "personalities.json"),
    "ideology": ("ideology-profiles.json", "ideologyId", "ideologies.json"),
    "country": ("countries-profiles.json", "countryId", "countries.json"),
}


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


def vectors(catalog):
    pf, key, _ = CATALOGS[catalog]
    return {p[key]: p["vector"] for p in load(pf)}


def names(catalog):
    _, _, meta = CATALOGS[catalog]
    return {p["id"]: p["name"] for p in load(meta)}


def compute_vector(answers_by_axis, qmap):
    vec = {}
    for axis, obj in answers_by_axis.items():
        if axis not in AXES:
            continue
        total = 0.0
        for qid, ans in obj["answers"].items():
            q = qmap[qid]
            s = SCORE[ans]
            total += s if q["agreePole"] == "LEFT" else 1 - s
        vec[axis] = round(total / len(obj["answers"]) * 100, 1)
    return vec


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    catalog, pid = sys.argv[1], sys.argv[2]
    if catalog not in CATALOGS:
        print(f"catalog invalido: {catalog}")
        sys.exit(1)

    if len(sys.argv) > 3:
        path = sys.argv[3]
    else:
        path = os.path.join(BASE, "subagent-out", catalog, f"{pid}.json")
        if not os.path.exists(path):
            path = os.path.join(BASE, "answers", catalog, f"{pid}.json")
    if not os.path.exists(path):
        print(f"arquivo nao encontrado: {path}")
        sys.exit(1)

    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    qp = load("questions-pool.json")
    qmap = {q["id"]: q for q in qp}
    pool = collections.defaultdict(set)
    for q in qp:
        pool[q["axisId"]].add(q["id"])

    errors, warnings = [], []
    print(f"validando {catalog}:{pid}\n  {path}\n")

    # ---------- [FORMA] ----------
    for ax in AXES:
        if ax not in data:
            errors.append(f"[FORMA] eixo ausente: {ax}")
            continue
        obj = data[ax]
        ans = obj.get("answers", {})
        if not str(obj.get("personaBrief", "")).strip():
            errors.append(f"[FORMA] {ax}: personaBrief vazio")
        if len(ans) != 20:
            errors.append(f"[FORMA] {ax}: {len(ans)} respostas (esperado 20)")
        missing = pool[ax] - set(ans)
        unknown = set(ans) - pool[ax]
        if missing:
            errors.append(f"[FORMA] {ax}: ids faltando {sorted(missing)}")
        if unknown:
            errors.append(f"[FORMA] {ax}: ids desconhecidos {sorted(unknown)}")
        bad = {k: v for k, v in ans.items() if v not in VALID}
        if bad:
            errors.append(f"[FORMA] {ax}: codigos invalidos {bad} (use so DT/D/N/C/CT)")
    extra = [k for k in data if k not in AXES]
    if extra:
        warnings.append(f"[FORMA] chaves extras ignoradas: {extra}")

    if errors:
        print("FALHOU NA FORMA - corrija antes de seguir:")
        for e in errors:
            print("  " + e)
        sys.exit(1)

    # ---------- [NEUTROS] ----------
    total_n = 0
    for ax in AXES:
        vals = list(data[ax]["answers"].values())
        n = collections.Counter(vals)["N"]
        total_n += n
        frac = n / 20
        if frac > MAX_N_AXIS:
            errors.append(
                f"[NEUTROS] {ax}: {n}/20 = {frac:.0%} de N (limite {MAX_N_AXIS:.0%}). "
                f"Cada N vale 0.50; este eixo esta colapsando para o ponto morto."
            )
        elif frac >= WARN_N_AXIS:
            warnings.append(f"[NEUTROS] {ax}: {n}/20 = {frac:.0%} de N (perto do limite)")
    tfrac = total_n / 240
    print(f"[NEUTROS] total {total_n}/240 = {tfrac:.1%}")
    if tfrac > MAX_N_TOTAL:
        errors.append(f"[NEUTROS] total {tfrac:.1%} acima do limite {MAX_N_TOTAL:.0%}")

    # ---------- [CONTEUDO] ----------
    vec = compute_vector(data, qmap)
    pvec, ivec = vectors("personality"), vectors("ideology")
    pname, iname = names("personality"), names("ideology")

    print("\n[CONTEUDO] vetor e direcao real dos eixos")
    print(f"  {'eixo':15s} {'valor':>6s}  0 <--------> 100")
    for ax in AXES:
        lo, hi, alo, ahi = AXIS_POLES[ax]
        print(f"  {ax:15s} {vec[ax]:6.1f}  {lo} <-> {hi}")

    # ancoras: o vetor esta do mesmo lado de quem deveria?
    print("\n[CONTEUDO] ancoras de referencia (para conferir se o lado faz sentido)")
    for ax in AXES:
        lo, hi, alo, ahi = AXIS_POLES[ax]
        if alo in pvec and ahi in pvec:
            print(f"  {ax:15s} {vec[ax]:6.1f}   | {pname.get(alo,alo)}={pvec[alo][ax]:.0f} .. {pname.get(ahi,ahi)}={pvec[ahi][ax]:.0f}")

    # duplicata dentro do proprio catalogo
    same = vectors(catalog)
    sim = sorted(
        ((compat.compatibility(v, vec), k) for k, v in same.items() if k != pid),
        reverse=True,
    )[:3]
    print(f"\n[CONTEUDO] mais proximos em {catalog} (duplicata?)")
    for s, k in sim:
        flag = ""
        if s >= DUP_BLOCK:
            flag = "  <<< BLOQUEIA"
            errors.append(
                f"[CONTEUDO] {s:.1f}% identico a '{k}' - perfil redundante, "
                f"nao acrescenta nada ao catalogo"
            )
        elif s >= DUP_WARN:
            flag = "  <<< aviso"
            warnings.append(f"[CONTEUDO] {s:.1f}% proximo de '{k}'")
        print(f"  {s:5.1f}%  {k}{flag}")

    # coerencia com o perfil declarado
    if catalog == "ideology":
        meta = {i["id"]: i for i in load("ideologies.json")}
        if pid in meta:
            ref = meta[pid].get("personalityId")
            if ref in pvec:
                s = compat.compatibility(pvec[ref], vec)
                print(f"\n[CONTEUDO] coerencia com personalityId declarado ({ref}): {s:.1f}%")
                if s < MISMATCH_WARN:
                    warnings.append(
                        f"[CONTEUDO] so {s:.1f}% com '{ref}', que esta declarado como a "
                        f"personalidade desta ideologia. Um dos dois vetores esta errado - "
                        f"compare eixo a eixo antes de mesclar."
                    )
                gaps = sorted(((abs(pvec[ref][a] - vec[a]), a) for a in AXES), reverse=True)[:3]
                print("  maiores divergencias: " + ", ".join(
                    f"{a} ({pvec[ref][a]:.0f} vs {vec[a]:.0f})" for _, a in gaps))
    else:
        citing = [i for i in load("ideologies.json") if i.get("personalityId") == pid]
        if citing:
            print(f"\n[CONTEUDO] ideologias que declaram esta personalidade")
            for i in citing:
                if i["id"] in ivec:
                    s = compat.compatibility(ivec[i["id"]], vec)
                    print(f"  {s:5.1f}%  {i['id']}")
                    if s < MISMATCH_WARN:
                        warnings.append(
                            f"[CONTEUDO] so {s:.1f}% com '{i['id']}', ideologia que declara "
                            f"este perfil. Um dos dois vetores esta errado."
                        )

    # ---------- resultado ----------
    print()
    if warnings:
        print("AVISOS (nao bloqueiam, mas confira):")
        for w in warnings:
            print("  " + w)
    if errors:
        print("\nERROS (bloqueiam o merge):")
        for e in errors:
            print("  " + e)
        sys.exit(1)
    print("OK - passou nas tres checagens.")


if __name__ == "__main__":
    main()
