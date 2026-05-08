#!/usr/bin/env python3
"""
Generate ideology profiles for all 155 ideologies in ideologies.json.

Convention (high = leftPole alignment):
  estrutura:    100=Federal/descentralizado,    0=Unitário/centralizado
  representacao:100=Democracia,                  0=Autocracia
  poder:        100=Segurança/ordem,             0=Liberdade
  imigracao:    100=Assimilacionista,            0=Multiculturalista
  diplomacia:   100=Militarista,                 0=Pacifista
  intervencao:  100=Não intervencionista,        0=Nacionalista intervencionista
  economia:     100=Serviço público,             0=Serviço privado
  controle:     100=Planejamento econômico,      0=Livre mercado
  comercio:     100=Protecionismo,               0=Globalismo
  religiao:     100=Irreligioso,                 0=Religioso
  moral:        100=Progressista,                0=Tradicionalista
  tecnologia:   100=Tecnologia,                  0=Bioconservacionismo
"""
import json
from pathlib import Path

AXIS_KEYS = [
    "estrutura", "representacao", "poder", "imigracao", "diplomacia",
    "intervencao", "economia", "controle", "comercio", "religiao",
    "moral", "tecnologia",
]


def v(estrutura, representacao, poder, imigracao, diplomacia, intervencao,
      economia, controle, comercio, religiao, moral, tecnologia):
    return {
        "estrutura": estrutura,
        "representacao": representacao,
        "poder": poder,
        "imigracao": imigracao,
        "diplomacia": diplomacia,
        "intervencao": intervencao,
        "economia": economia,
        "controle": controle,
        "comercio": comercio,
        "religiao": religiao,
        "moral": moral,
        "tecnologia": tecnologia,
    }


# Vectors for each ideology (155 total)
PROFILES = {
    # ========== ESQUERDA AUTORITÁRIA ==========
    "marxismo-leninismo":         v(22, 8,  90, 60, 70, 35, 95, 95, 75, 90, 65, 70),
    "stalinismo":                 v(15, 4,  96, 35, 78, 20, 96, 96, 82, 88, 50, 65),
    "maoismo":                    v(18, 6,  94, 40, 72, 25, 95, 95, 80, 88, 55, 55),
    "trotskismo":                 v(28, 22, 80, 75, 60, 50, 92, 92, 50, 88, 78, 72),
    "luxemburguismo":             v(40, 40, 70, 75, 50, 55, 88, 80, 55, 80, 80, 70),
    "titoismo":                   v(45, 25, 80, 60, 50, 35, 80, 70, 55, 70, 60, 60),
    "comunismo-nacional":         v(20, 15, 88, 35, 65, 18, 90, 90, 80, 80, 50, 55),
    "blanquismo":                 v(20, 12, 88, 50, 70, 35, 88, 85, 65, 85, 65, 60),
    "pol-potismo":                v(10, 2,  98, 30, 80, 18, 96, 96, 90, 92, 35, 12),
    "dengismo":                   v(25, 15, 82, 50, 50, 30, 60, 60, 35, 80, 50, 75),
    "socialismo-de-estado":       v(25, 25, 80, 50, 55, 40, 92, 92, 70, 75, 55, 60),
    "baathismo":                  v(20, 12, 88, 30, 75, 22, 80, 80, 70, 70, 45, 55),
    "progressivismo-autoritario": v(25, 20, 82, 60, 55, 50, 80, 80, 55, 80, 88, 75),
    "ingsoc":                     v(8,  2,  98, 20, 75, 15, 95, 95, 90, 95, 30, 35),
    "posadismo":                  v(30, 18, 84, 70, 78, 45, 92, 90, 60, 88, 75, 92),
    "neobolchevismo":             v(22, 12, 88, 60, 65, 40, 95, 95, 70, 90, 70, 70),
    "marxismo-reformista":        v(45, 60, 60, 65, 35, 60, 85, 78, 50, 75, 75, 70),
    "kemalismo":                  v(20, 30, 78, 30, 60, 28, 65, 65, 60, 80, 65, 70),
    "nacional-bolchevismo":       v(15, 8,  92, 25, 80, 12, 88, 88, 85, 50, 35, 55),
    "strasserismo":               v(18, 10, 90, 25, 75, 15, 80, 75, 85, 35, 30, 50),

    # ========== DIREITA AUTORITÁRIA ==========
    "fascismo":                   v(20, 8,  92, 85, 88, 10, 38, 72, 82, 35, 18, 55),
    "nacional-socialismo":        v(15, 4,  96, 92, 92, 6,  42, 76, 88, 30, 12, 50),
    "fascismo-britanico":         v(22, 10, 90, 88, 82, 12, 40, 70, 80, 30, 18, 55),
    "fascismo-clerical":          v(20, 8,  92, 85, 80, 12, 40, 68, 80, 8,  10, 35),
    "falangismo":                 v(20, 10, 90, 85, 75, 15, 38, 65, 78, 12, 15, 45),
    "falangismo-polones":         v(22, 12, 88, 82, 72, 18, 40, 65, 78, 15, 18, 45),
    "legionarismo":               v(18, 8,  92, 88, 82, 10, 42, 68, 80, 8,  12, 40),
    "integralismo-brasileiro":    v(22, 10, 90, 80, 70, 18, 45, 65, 78, 12, 15, 45),
    "pinochetismo":               v(25, 12, 90, 70, 75, 22, 18, 18, 30, 25, 15, 60),
    "capitalismo-autoritario":    v(28, 18, 86, 60, 60, 35, 22, 22, 38, 50, 30, 70),
    "capitalismo-nacional":       v(28, 22, 80, 50, 55, 25, 25, 28, 75, 45, 28, 65),
    "alt-right":                  v(40, 35, 80, 88, 70, 25, 30, 25, 75, 30, 12, 60),
    "alt-lite":                   v(50, 50, 70, 75, 55, 35, 32, 28, 60, 50, 25, 65),
    "aceleracionismo-de-direita": v(30, 12, 88, 75, 80, 25, 25, 25, 40, 40, 15, 90),
    "nacionalismo-racial":        v(20, 10, 92, 95, 85, 10, 35, 50, 80, 25, 8,  45),
    "nacionalismo-branco":        v(22, 12, 92, 95, 82, 12, 35, 48, 78, 28, 8,  50),
    "nacionalismo-negro":         v(28, 18, 85, 90, 75, 20, 55, 55, 65, 30, 25, 55),
    "volkismo":                   v(25, 10, 90, 92, 75, 12, 50, 55, 78, 20, 8,  20),
    "odalismo":                   v(40, 20, 85, 90, 70, 18, 60, 60, 80, 18, 8,  10),
    "neoconservadorismo":         v(40, 55, 70, 65, 78, 8,  35, 30, 30, 30, 22, 70),
    "darwinismo-social":          v(35, 25, 80, 70, 70, 30, 15, 18, 35, 50, 15, 75),
    "culto-a-morte-death-worship":v(15, 5,  98, 80, 95, 10, 60, 70, 75, 50, 18, 45),
    "futurismo":                  v(25, 15, 88, 75, 88, 12, 45, 55, 55, 55, 22, 95),
    "monarquismo-absoluto":       v(15, 4,  92, 70, 65, 30, 45, 60, 65, 12, 8,  30),
    "conservadorismo-autoritario":v(25, 20, 85, 70, 60, 25, 40, 50, 65, 18, 12, 40),
    "conservadorismo-nacional":   v(35, 35, 78, 78, 62, 22, 40, 45, 75, 28, 18, 50),
    "conservadorismo-paternalista":v(30, 35, 78, 65, 55, 30, 55, 55, 55, 22, 18, 45),
    "nacionalismo-etnico":        v(25, 18, 88, 92, 72, 18, 45, 50, 78, 28, 15, 50),
    "nacionalismo-cultural":      v(35, 35, 80, 88, 60, 25, 45, 50, 70, 30, 22, 55),
    "neorreacionarismo":          v(15, 5,  92, 70, 60, 35, 25, 30, 50, 25, 8,  85),
    "reacionarismo":              v(18, 8,  90, 75, 60, 25, 40, 50, 70, 12, 5,  20),
    "kraterocracria":             v(20, 5,  98, 60, 90, 10, 40, 50, 60, 55, 25, 70),
    "quarta-teoria-politica":     v(40, 20, 85, 50, 60, 30, 55, 60, 70, 30, 20, 30),
    "democracia-nacional":        v(40, 60, 75, 75, 50, 25, 50, 50, 70, 35, 28, 55),
    "hivemind-coletivismo-total": v(12, 4,  98, 30, 60, 30, 95, 95, 70, 70, 50, 90),

    # ========== CENTRO ==========
    "liberalismo":                v(60, 82, 28, 60, 35, 60, 38, 32, 28, 65, 70, 75),
    "liberalismo-classico":       v(65, 80, 22, 60, 30, 70, 25, 22, 22, 60, 60, 70),
    "libertarianismo":            v(78, 78, 14, 55, 25, 78, 18, 12, 18, 55, 60, 78),
    "liberalismo-verde":          v(65, 85, 35, 55, 25, 60, 50, 45, 35, 70, 80, 65),
    "liberalismo-social":         v(60, 85, 38, 65, 32, 65, 65, 55, 38, 70, 80, 75),
    "liberalismo-radical":        v(70, 90, 25, 70, 25, 75, 55, 45, 30, 80, 88, 78),
    "liberalismo-conservador":    v(55, 75, 38, 55, 45, 50, 35, 28, 35, 35, 35, 65),
    "liberaltarianismo":          v(70, 82, 18, 60, 28, 75, 50, 40, 25, 60, 75, 75),
    "panarchismo":                v(95, 90, 20, 50, 25, 80, 50, 50, 35, 60, 60, 65),
    "georgismo":                  v(60, 80, 30, 60, 30, 65, 60, 50, 32, 65, 70, 70),
    "geolibertarianismo":         v(72, 82, 18, 55, 28, 75, 45, 35, 25, 60, 70, 75),
    "piratismo":                  v(75, 90, 18, 65, 25, 75, 60, 45, 25, 80, 88, 95),
    "feminismo":                  v(60, 85, 35, 65, 32, 60, 75, 60, 40, 70, 92, 75),
    "feminismo-liberal":          v(60, 88, 28, 65, 32, 65, 55, 45, 35, 70, 90, 75),
    "liberalismo-de-estado":      v(40, 70, 45, 55, 40, 50, 60, 55, 45, 60, 60, 70),
    "ambientalismo":              v(55, 75, 40, 60, 25, 55, 70, 65, 50, 65, 75, 35),
    "conservadorismo":            v(45, 70, 60, 30, 55, 35, 35, 35, 50, 25, 22, 45),
    "progressivismo":             v(55, 85, 38, 65, 32, 60, 70, 60, 42, 75, 90, 78),
    "aceleracionismo":            v(55, 60, 45, 60, 50, 50, 45, 45, 35, 70, 75, 98),
    "nacionalismo":               v(35, 55, 65, 75, 60, 25, 55, 55, 70, 40, 35, 55),
    "nacionalismo-civico":        v(45, 70, 55, 70, 45, 35, 55, 55, 60, 50, 50, 65),
    "pan-asianismo":              v(40, 50, 65, 60, 60, 30, 65, 65, 60, 45, 45, 70),
    "pan-eslavismo":              v(35, 45, 70, 55, 65, 28, 60, 60, 65, 30, 35, 55),
    "sionismo":                   v(45, 65, 65, 75, 75, 18, 50, 45, 50, 25, 40, 70),
    "fordismo":                   v(40, 60, 50, 55, 50, 40, 35, 32, 45, 45, 35, 75),
    "autoritarismo-social":       v(30, 35, 80, 55, 45, 45, 70, 65, 55, 60, 50, 60),
    "indigenismo":                v(75, 70, 40, 25, 30, 50, 75, 70, 60, 30, 50, 25),
    "saadismo":                   v(35, 45, 70, 50, 55, 45, 65, 60, 55, 30, 35, 55),
    "conservadorismo-socialista": v(35, 50, 65, 50, 55, 40, 80, 75, 65, 30, 25, 50),
    "centrismo":                  v(50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50),

    # ========== ESQUERDA LIBERTÁRIA ==========
    "anarquismo":                 v(95, 95, 5,  35, 18, 80, 85, 65, 50, 75, 88, 60),
    "anarcocomunismo":            v(95, 92, 8,  30, 18, 75, 98, 95, 65, 85, 90, 65),
    "anarcocoletivismo":          v(95, 92, 10, 30, 22, 78, 95, 90, 60, 80, 88, 60),
    "anarcossindicalismo":        v(92, 90, 12, 35, 25, 75, 92, 88, 65, 75, 85, 60),
    "sindicalismo":               v(80, 85, 25, 40, 30, 65, 88, 80, 60, 70, 80, 60),
    "socialismo-libertario":      v(85, 90, 18, 45, 28, 70, 88, 80, 55, 75, 88, 65),
    "marxismo-libertario":        v(80, 88, 22, 50, 30, 65, 92, 85, 55, 88, 85, 70),
    "socialismo-de-mercado-libertario":v(80, 88, 18, 50, 28, 75, 70, 50, 40, 70, 80, 70),
    "socialismo-de-mercado":      v(60, 80, 35, 55, 35, 60, 70, 50, 40, 65, 75, 70),
    "mutualismo":                 v(88, 90, 18, 50, 25, 78, 75, 55, 45, 65, 78, 60),
    "minarco-mutualismo":         v(82, 88, 22, 50, 28, 78, 65, 50, 45, 65, 75, 65),
    "minarco-socialismo":         v(75, 85, 25, 50, 30, 70, 75, 60, 50, 70, 80, 65),
    "socialismo-individualista":  v(80, 85, 22, 55, 30, 75, 70, 55, 50, 70, 82, 70),
    "comunalismo":                v(90, 88, 18, 35, 25, 70, 88, 78, 60, 60, 78, 50),
    "socialismo-cristao":         v(65, 80, 30, 40, 30, 50, 78, 65, 55, 18, 50, 45),
    "socialismo-religioso":       v(60, 75, 35, 40, 32, 50, 78, 65, 55, 15, 45, 45),
    "social-democracia":          v(55, 90, 32, 60, 28, 60, 78, 60, 50, 70, 80, 75),
    "socialismo":                 v(60, 75, 35, 55, 35, 50, 88, 80, 60, 70, 80, 70),
    "socialismo-liberal":         v(60, 88, 28, 60, 30, 60, 75, 60, 45, 70, 82, 75),
    "libertarianismo-social":     v(80, 88, 18, 60, 28, 75, 75, 60, 45, 70, 85, 75),
    "zapatismo":                  v(92, 88, 22, 25, 28, 65, 88, 75, 65, 50, 75, 35),
    "ecossocialismo":             v(75, 85, 28, 50, 25, 60, 88, 80, 55, 70, 88, 35),
    "ecofeminismo":               v(80, 88, 22, 45, 22, 65, 85, 75, 55, 65, 92, 30),
    "ecologia-profunda":          v(80, 80, 30, 35, 22, 65, 75, 70, 60, 50, 70, 8),
    "anarquismo-agrario":         v(95, 90, 12, 25, 22, 75, 80, 70, 70, 50, 55, 18),
    "anarquismo-verde":           v(95, 92, 10, 30, 18, 78, 85, 75, 60, 65, 80, 18),
    "anarcofeminismo":            v(95, 95, 8,  35, 20, 80, 85, 70, 55, 75, 95, 65),
    "anarquismo-queer":           v(95, 95, 8,  40, 22, 80, 80, 65, 50, 80, 98, 70),
    "anarcopacifismo":            v(95, 95, 5,  35, 5,  88, 80, 65, 50, 75, 90, 55),
    "anarquismo-cristao":         v(92, 90, 10, 35, 12, 75, 75, 60, 55, 5,  50, 35),
    "anarquismo-religioso":       v(90, 88, 12, 40, 15, 70, 75, 60, 55, 8,  45, 35),
    "anarquismo-taoista":         v(95, 90, 8,  35, 8,  78, 75, 60, 60, 25, 60, 25),
    "anarco-naturalismo":         v(95, 90, 10, 30, 12, 75, 75, 65, 65, 35, 60, 12),
    "anarcoprimitivismo":         v(98, 88, 8,  20, 10, 80, 80, 75, 80, 40, 50, 2),
    "soulismo":                   v(85, 85, 18, 45, 22, 70, 78, 65, 55, 65, 80, 60),
    "anarquismo-social":          v(95, 95, 8,  35, 20, 80, 90, 70, 50, 75, 90, 65),
    "geoanarquismo":              v(92, 90, 12, 50, 25, 78, 70, 50, 40, 65, 75, 65),
    "socialismo-paleolibertario": v(75, 80, 22, 35, 35, 65, 78, 65, 65, 25, 25, 40),

    # ========== DIREITA LIBERTÁRIA ==========
    "anarquismo-egoista":         v(95, 88, 12, 50, 28, 80, 25, 18, 30, 75, 80, 75),
    "anarcocapitalismo":          v(95, 85, 8,  60, 18, 85, 5,  4,  10, 50, 55, 78),
    "minarquismo":                v(75, 85, 18, 55, 28, 78, 12, 8,  18, 55, 55, 75),
    "austrolibertarianismo":      v(80, 80, 12, 55, 25, 82, 8,  6,  12, 50, 50, 75),
    "paleolibertarianismo":       v(78, 75, 22, 35, 30, 75, 12, 10, 25, 22, 18, 55),
    "libertarianismo-de-chicago": v(70, 78, 18, 55, 30, 75, 10, 8,  15, 55, 55, 78),
    "capitalismo":                v(50, 65, 35, 55, 40, 50, 18, 15, 25, 50, 55, 75),
    "capitalismo-rosa-pink-capitalism":v(55, 75, 32, 60, 35, 55, 22, 18, 25, 65, 88, 78),
    "ecocapitalismo":             v(60, 70, 32, 55, 30, 60, 25, 22, 30, 55, 65, 60),
    "ecoconservadorismo":         v(50, 65, 50, 50, 45, 45, 35, 35, 45, 30, 30, 25),
    "econacionalismo":            v(40, 55, 60, 75, 55, 25, 45, 45, 75, 40, 30, 50),
    "voluntarismo":               v(95, 85, 8,  55, 18, 88, 12, 8,  15, 55, 60, 75),
    "agorismo":                   v(98, 88, 5,  55, 15, 92, 8,  5,  10, 55, 65, 80),
    "criptoanarquismo":           v(98, 90, 5,  60, 15, 92, 10, 5,  10, 75, 75, 98),
    "anarco-transhumanismo":      v(95, 88, 8,  55, 18, 80, 30, 22, 25, 80, 88, 99),
    "libertarianismo-bleeding-heart":v(72, 85, 20, 65, 25, 72, 38, 30, 25, 65, 75, 75),
    "libertarianismo-verde":      v(78, 82, 18, 55, 22, 75, 35, 30, 30, 60, 70, 65),
    "libertarianismo-nacional":   v(60, 70, 30, 75, 35, 60, 18, 15, 60, 35, 30, 65),
    "monarquismo-libertario":     v(60, 30, 35, 55, 35, 65, 25, 22, 35, 18, 25, 55),
    "conservadorismo-libertario": v(70, 75, 30, 50, 35, 70, 18, 15, 30, 25, 22, 60),
    "feminismo-libertario":       v(80, 88, 15, 60, 25, 78, 30, 22, 25, 70, 90, 78),
    "pacifismo-libertario":       v(80, 90, 12, 55, 5,  92, 25, 18, 22, 60, 70, 70),
    "anarcoconservadorismo":      v(85, 75, 18, 50, 35, 78, 25, 22, 35, 18, 18, 40),
    "anarcomonarquismo":          v(80, 25, 28, 55, 38, 70, 28, 25, 40, 18, 22, 50),
    "anarco-fronteirismo":        v(90, 80, 18, 70, 32, 78, 22, 18, 30, 50, 45, 65),
    "anarcodistributismo":        v(88, 82, 22, 35, 25, 75, 50, 40, 60, 25, 30, 35),
    "anarcoindividualismo":       v(95, 88, 8,  60, 22, 85, 22, 15, 22, 65, 75, 75),
    "avaritismo":                 v(80, 60, 22, 60, 35, 70, 8,  6,  12, 60, 55, 80),
    "korwinismo":                 v(60, 50, 35, 55, 50, 50, 12, 10, 30, 35, 18, 65),
    "hidrarcria":                 v(85, 80, 22, 60, 35, 78, 25, 22, 18, 65, 70, 80),
    "pos-libertarianismo":        v(75, 75, 22, 55, 30, 65, 35, 30, 35, 60, 65, 80),
    "anarco-fascismo":            v(75, 30, 60, 80, 70, 35, 28, 30, 50, 30, 18, 60),
}


def main():
    repo = Path(__file__).parent
    ideologies_path = repo / "backend/src/main/resources/data/ideologies.json"
    profiles_path = repo / "backend/src/main/resources/data/ideology-profiles.json"

    with ideologies_path.open(encoding="utf-8") as f:
        ideologies = json.load(f)

    ideology_ids = [i["id"] for i in ideologies]

    missing = [i for i in ideology_ids if i not in PROFILES]
    extra = [k for k in PROFILES if k not in ideology_ids]

    if missing:
        raise SystemExit(f"Missing profiles for: {missing}")
    if extra:
        raise SystemExit(f"Extra profiles (not in ideologies.json): {extra}")

    # Validate vectors
    for ideology_id, vec in PROFILES.items():
        for axis_key in AXIS_KEYS:
            if axis_key not in vec:
                raise SystemExit(f"Missing axis '{axis_key}' for {ideology_id}")
            value = vec[axis_key]
            if not (0 <= value <= 100):
                raise SystemExit(f"Out of range axis '{axis_key}' for {ideology_id}: {value}")

    output = []
    for ideology in ideologies:
        ideology_id = ideology["id"]
        output.append({
            "ideologyId": ideology_id,
            "vector": PROFILES[ideology_id],
        })

    with profiles_path.open("w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Wrote {len(output)} profiles to {profiles_path.relative_to(repo)}")


if __name__ == "__main__":
    main()
