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
for required_locale in ("en", "fr"):
    if not (ROOT / "i18n" / required_locale).is_dir():
        errors.append(f"Missing locale: {required_locale}")
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
            if locale_dir.name == "fr":
                display_field = {"countries": "period", "personalities": "lifespan"}.get(source_name)
                if display_field and source[profile_id].get(display_field):
                    if not overlay[profile_id].get(display_field, "").strip():
                        errors.append(f"fr/{overlay_name}: {profile_id} missing {display_field}")

for question in json.loads((ROOT / "archetype-questions.json").read_text(encoding="utf-8")):
    texts = [("label", question["label"]), ("text", question["text"])]
    texts += [(option["id"], option["text"]) for option in question["options"]]
    for field, translations in texts:
        for locale in ("pt", "en", "fr"):
            if not isinstance(translations.get(locale), str) or not translations[locale].strip():
                errors.append(f"archetypes/{question['id']}/{field}: missing {locale}")

for book in json.loads((ROOT / "books.json").read_text(encoding="utf-8")):
    for locale in ("pt", "en", "fr"):
        if not isinstance(book["title"].get(locale), str) or not book["title"][locale].strip():
            errors.append(f"books/{book['personalityId']}: missing {locale} title")
        if locale not in book["url"] or not isinstance(book["url"][locale], str):
            errors.append(f"books/{book['personalityId']}: missing {locale} URL setting")

if errors:
    raise SystemExit("\n".join(errors))
print("All catalog locale overlays cover the current source data.")
