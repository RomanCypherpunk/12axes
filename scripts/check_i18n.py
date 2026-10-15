"""Check that each available catalog locale covers the current source catalog."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "backend/src/main/resources/data"
CATALOGS = {
    "axes": ("axes", ("label", "leftPole", "rightPole")),
    "questions-pool": ("questions", ("text",)),
    "ideologies": ("ideologies", ("name", "category", "description", "phrase")),
    "countries": ("countries", ("name", "category", "description")),
    "personalities": ("personalities", ("name", "role", "description")),
}


def read_items(path):
    items = json.loads(path.read_text(encoding="utf-8"))
    ids = [item["id"] for item in items]
    if len(ids) != len(set(ids)):
        raise ValueError(f"Duplicate IDs in {path}")
    return {item["id"]: item for item in items}


errors = []
for locale_dir in sorted((ROOT / "i18n").iterdir()):
    if not locale_dir.is_dir():
        continue
    for source_name, (overlay_name, required_fields) in CATALOGS.items():
        source = read_items(ROOT / f"{source_name}.json")
        overlay_path = locale_dir / f"{overlay_name}.json"
        if not overlay_path.exists():
            errors.append(f"{locale_dir.name}/{overlay_name}: overlay missing")
            continue
        overlay = read_items(overlay_path)
        for profile_id in sorted(source.keys() - overlay.keys()):
            errors.append(f"{locale_dir.name}/{overlay_name}: missing {profile_id}")
        for profile_id in sorted(overlay.keys() - source.keys()):
            errors.append(f"{locale_dir.name}/{overlay_name}: unknown {profile_id}")
        for profile_id in sorted(source.keys() & overlay.keys()):
            for field in required_fields:
                if not isinstance(overlay[profile_id].get(field), str) or not overlay[profile_id][field].strip():
                    errors.append(f"{locale_dir.name}/{overlay_name}: {profile_id} missing {field}")

# O glossário tem formato próprio: cada idioma traz term, definition e os trechos (match)
# que acionam o termo; match pode ser vazio quando o idioma não usa o termo.
glossary = read_items(ROOT / "glossary.json")
for locale_dir in sorted((ROOT / "i18n").iterdir()):
    if not locale_dir.is_dir():
        continue
    overlay_path = locale_dir / "glossary.json"
    if not overlay_path.exists():
        errors.append(f"{locale_dir.name}/glossary: overlay missing")
        continue
    overlay = read_items(overlay_path)
    for term_id in sorted(glossary.keys() - overlay.keys()):
        errors.append(f"{locale_dir.name}/glossary: missing {term_id}")
    for term_id in sorted(overlay.keys() - glossary.keys()):
        errors.append(f"{locale_dir.name}/glossary: unknown {term_id}")
    for term_id in sorted(glossary.keys() & overlay.keys()):
        for field in ("term", "definition"):
            if not isinstance(overlay[term_id].get(field), str) or not overlay[term_id][field].strip():
                errors.append(f"{locale_dir.name}/glossary: {term_id} missing {field}")
        match = overlay[term_id].get("match")
        if not isinstance(match, list) or any(not isinstance(m, str) or not m.strip() for m in match):
            errors.append(f"{locale_dir.name}/glossary: {term_id} has invalid match")
# Explicação de cada pergunta (o que concordar e discordar significam): toda pergunta precisa
# de entrada na fonte e em cada idioma; note é opcional, e os exemplos vêm aos pares.
question_ids = set(read_items(ROOT / "questions-pool.json"))
help_sources = [("question-help", ROOT / "question-help.json")] + [
    (f"{d.name}/question-help", d / "question-help.json")
    for d in sorted((ROOT / "i18n").iterdir()) if d.is_dir()
]
for label, path in help_sources:
    if not path.exists():
        errors.append(f"{label}: file missing")
        continue
    entries = read_items(path)
    for qid in sorted(question_ids - entries.keys()):
        errors.append(f"{label}: missing {qid}")
    for qid in sorted(entries.keys() - question_ids):
        errors.append(f"{label}: unknown {qid}")
    for qid, entry in entries.items():
        for field in ("agree", "disagree"):
            if not isinstance(entry.get(field), str) or not entry[field].strip():
                errors.append(f"{label}: {qid} missing {field}")
        for field in ("note", "agreeExample", "disagreeExample"):
            if field in entry and (not isinstance(entry[field], str) or not entry[field].strip()):
                errors.append(f"{label}: {qid} has an empty {field}")
        if ("agreeExample" in entry) != ("disagreeExample" in entry):
            errors.append(f"{label}: {qid} needs both examples or neither")
for term_id, entry in glossary.items():
    if not entry.get("match"):
        errors.append(f"glossary: {term_id} has no match in the source language")

if errors:
    raise SystemExit("\n".join(errors))
print("All catalog locale overlays cover the current source data.")
