"""Audita qual personalidade e categoria melhor cobrem cada ideologia.

Usa exatamente o scorer de ``compatibility.py`` e grava um relatório Markdown
ordenado pela compatibilidade do melhor resultado.
"""
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path

from compatibility import compatibility


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "backend" / "src" / "main" / "resources" / "data"
REPORT = Path(__file__).resolve().parent / "reports" / "ideology-personality-category-coverage.md"


def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def main():
    ideologies = {item["id"]: item for item in load("ideologies.json")}
    personalities = {item["id"]: item for item in load("personalities.json")}
    ideology_profiles = load("ideology-profiles.json")
    personality_profiles = load("personality-profiles.json")

    rows = []
    for ideology_profile in ideology_profiles:
        ideology_id = ideology_profile["ideologyId"]
        matches = []
        for personality_profile in personality_profiles:
            personality_id = personality_profile["personalityId"]
            score = compatibility(ideology_profile["vector"], personality_profile["vector"])
            matches.append((score, personality_id))
        score, personality_id = max(matches)
        personality = personalities[personality_id]
        rows.append({
            "ideology": ideologies[ideology_id]["name"],
            "ideologyId": ideology_id,
            "personality": personality["name"],
            "personalityId": personality_id,
            "category": personality["category"],
            "score": score,
        })

    rows.sort(key=lambda row: (row["score"], row["ideology"].casefold()))
    category_counts = Counter(row["category"] for row in rows)
    weak = [row for row in rows if row["score"] < 80.0]

    lines = [
        "# Cobertura de categorias por ideologia",
        "",
        f"Gerado em {datetime.now(timezone.utc).isoformat(timespec='seconds')} com o mesmo scorer de `ProfileMatchScorer`.",
        "",
        f"Ideologias avaliadas: **{len(rows)}**. Personalidades disponíveis: **{len(personality_profiles)}**.",
        f"Melhores resultados abaixo de 80%: **{len(weak)}**.",
        "",
        "## Distribuição da categoria da personalidade mais próxima",
        "",
        "| Categoria | Ideologias cobertas |",
        "|---|---:|",
    ]
    for category, count in sorted(category_counts.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"| {category} | {count} |")

    lines.extend([
        "",
        "## Cobertura completa (mais fraca primeiro)",
        "",
        "| Ideologia | Personalidade mais próxima | Categoria | Compatibilidade |",
        "|---|---|---|---:|",
    ])
    for row in rows:
        lines.append(
            f"| {row['ideology']} (`{row['ideologyId']}`) | "
            f"{row['personality']} (`{row['personalityId']}`) | {row['category']} | {row['score']:.1f}% |"
        )

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"report={REPORT}")
    print(f"ideologies={len(rows)} personalities={len(personality_profiles)} weak_below_80={len(weak)}")
    print("categories=" + ", ".join(f"{key}:{value}" for key, value in category_counts.most_common()))
    print("weakest=" + "; ".join(
        f"{row['ideologyId']}->{row['personalityId']} ({row['category']}, {row['score']:.1f}%)"
        for row in rows[:10]
    ))


if __name__ == "__main__":
    main()
