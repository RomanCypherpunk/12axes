#!/usr/bin/env python3
"""Tradução incremental do catálogo. Só o que mudou no inglês volta a ser traduzido.

A fonte é backend/src/main/resources/data/i18n/en/. Os novos idiomas ficam em i18n/<lang>/ e são gerados:
não edite esses arquivos à mão (uma mudança no inglês sobrescreve o campo). locks/<lang>.json guarda o hash do
texto em inglês de cada campo traduzido.

    python i18n-tools/sync.py status es        o que falta traduzir
    python i18n-tools/sync.py extract es       escreve os lotes em work/es/in/
    (traduza cada lote de work/es/in/ para work/es/out/, mesmo nome e formato; veja translate-guide.es.md)
    python i18n-tools/sync.py apply es         valida os lotes, grava em i18n/es/ e atualiza o lock

Reauditar um perfil muda só o vetor e não gera tradução nenhuma.
"""
import argparse
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT.parent / 'backend/src/main/resources/data/i18n'
FILES = ['axes', 'questions', 'glossary', 'question-help', 'political-values', 'axis-analysis',
         'ideologies', 'countries', 'parties', 'personalities']
DICT_FILES = {'axis-analysis'}  # {chave: texto}; os demais são listas de {id, campos}
SHARED = {'ideologies', 'countries', 'parties'}  # "category" se repete: traduzida uma vez só, em tm/<lang>.json
# Vínculos e valores fechados do overlay em inglês: não são texto, ficam fora do idioma gerado (o inglês já os fornece).
NOT_TEXT = {'ideologies': {'countryId', 'personalityId'}, 'personalities': {'category'}}
CHUNK_CHARS = 14000
ROLE_MAX, ROLE_WORDS = 30, 5
DESC_MAX, DESC_WORDS = 280, 45
TOKEN = re.compile(r'\{[^{}]*\}|<[^<>]+>')


def read(path, default):
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else default


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')


def digest(value):
    return hashlib.sha1(json.dumps(value, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()[:12]


def source_items(name):
    """Itens em inglês normalizados para {id: {campo: valor}}."""
    data = read(DATA / 'en' / f'{name}.json', None)
    if data is None:
        sys.exit(f'Fonte ausente: en/{name}.json')
    if name in DICT_FILES:
        return {key: {'text': value} for key, value in data.items()}
    skip = NOT_TEXT.get(name, set()) | {'id'}
    return {item['id']: {k: v for k, v in item.items() if k not in skip} for item in data}


def target_items(lang, name):
    data = read(DATA / lang / f'{name}.json', {} if name in DICT_FILES else [])
    if name in DICT_FILES:
        return {key: {'text': value} for key, value in data.items()}
    return {item['id']: {k: v for k, v in item.items() if k != 'id'} for item in data}


def save_target(lang, name, items, order):
    ids = [i for i in order if i in items and items[i]]
    if name in DICT_FILES:
        write(DATA / lang / f'{name}.json', {i: items[i]['text'] for i in ids})
    else:
        write(DATA / lang / f'{name}.json', [{'id': i, **items[i]} for i in ids])


def paths(lang):
    return ROOT / 'locks' / f'{lang}.json', ROOT / 'tm' / f'{lang}.json', ROOT / 'work' / lang


def is_shared(name, field):
    return name in SHARED and field == 'category'


def pending(lang):
    """Campos novos ou alterados, por arquivo, e rótulos de categoria ainda sem tradução."""
    lock_path, tm_path, _ = paths(lang)
    lock, tm = read(lock_path, {}), read(tm_path, {})
    out, labels = {}, set()
    for name in FILES:
        locked = lock.get(name, {})
        target = target_items(lang, name)
        for item_id, fields in source_items(name).items():
            for field, value in fields.items():
                if is_shared(name, field):
                    if value not in tm:
                        labels.add(value)
                    continue
                same = locked.get(item_id, {}).get(field) == digest(value)
                if not (same and field in target.get(item_id, {})):
                    out.setdefault(name, {}).setdefault(item_id, {})[field] = value
    return out, sorted(labels)


def needs_cleanup(lang):
    """Perfis e campos que saíram do inglês, ou categoria com rótulo trocado: o apply corrige, sem tradução nova."""
    tm = read(paths(lang)[1], {})
    out = []
    for name in FILES:
        source = source_items(name)
        for item_id, fields in target_items(lang, name).items():
            if item_id not in source:
                out.append(f'{name}/{item_id}')
                continue
            for field, value in fields.items():
                original = source[item_id].get(field)
                if field not in source[item_id]:
                    out.append(f'{name}/{item_id}.{field}')
                elif is_shared(name, field) and original in tm and value != tm[original]:
                    out.append(f'{name}/{item_id}.{field}')
    return out


def size(value):
    return len(value) if isinstance(value, str) else len(json.dumps(value, ensure_ascii=False))


def cmd_status(lang):
    todo, labels = pending(lang)
    total = 0
    for name in FILES:
        chars = sum(size(v) for item in todo.get(name, {}).values() for v in item.values())
        total += chars
        print(f'{name:18} {len(todo.get(name, {})):5} itens  {chars:8} caracteres')
    print(f'{"categorias":18} {len(labels):5} rótulos')
    print(f'{"total":18} {"":5}        {total:8} caracteres')
    cleanup = needs_cleanup(lang)
    if cleanup:
        print(f'{len(cleanup)} itens a limpar (rode apply): {", ".join(cleanup[:10])}')


def cmd_extract(lang, force=False):
    _, _, work = paths(lang)
    todo, labels = pending(lang)
    if not force and list((work / 'out').glob('chunk-*.json')):
        sys.exit(f'Há lotes traduzidos e não aplicados em {work / "out"}: rode apply ou use --force para descartá-los.')
    if work.exists():
        shutil.rmtree(work)
    (work / 'in').mkdir(parents=True)
    (work / 'out').mkdir(parents=True)
    chunks, current, used = [], [], 0
    if labels:
        chunks.append([{'file': '_categories', 'id': label, 'fields': {'text': label}} for label in labels])
    for name in FILES:
        for item_id, fields in todo.get(name, {}).items():
            chars = sum(size(v) for v in fields.values())
            if current and used + chars > CHUNK_CHARS:
                chunks.append(current)
                current, used = [], 0
            current.append({'file': name, 'id': item_id, 'fields': fields})
            used += chars
    if current:
        chunks.append(current)
    for index, items in enumerate(chunks, 1):
        write(work / 'in' / f'chunk-{index:04}.json', {'lang': lang, 'items': items})
    print(f'{len(chunks)} lotes em {work / "in"}')


def check_item(name, item_id, source, translated):
    """Devolve (erros, avisos) de um item traduzido."""
    errors, warnings = [], []
    where = f'{name}/{item_id}'
    if set(source) != set(translated):
        errors.append(f'{where}: campos {sorted(translated)} em vez de {sorted(source)}')
        return errors, warnings
    for field, original in source.items():
        value = translated[field]
        if isinstance(original, list):
            # match pode ser vazio: o termo não aparece nas perguntas desse idioma.
            if not isinstance(value, list) or not all(isinstance(v, str) and v.strip() for v in value):
                errors.append(f'{where}.{field}: lista inválida')
            continue
        if not isinstance(value, str) or not value.strip():
            errors.append(f'{where}.{field}: vazio')
            continue
        if sorted(TOKEN.findall(original)) != sorted(TOKEN.findall(value)):
            errors.append(f'{where}.{field}: placeholders ou tags diferentes do original')
        if re.findall(r'\d{4}', original) != re.findall(r'\d{4}', value):
            warnings.append(f'{where}.{field}: anos diferentes do original')
        if value == original and len(original) > 40:
            warnings.append(f'{where}.{field}: igual ao inglês')
        if name == 'personalities' and field == 'role' and (len(value) > ROLE_MAX or len(value.split()) > ROLE_WORDS):
            errors.append(f'{where}.role: "{value}" passa de {ROLE_MAX} caracteres ou {ROLE_WORDS} palavras')
        if field == 'description' and name in ('personalities', 'parties') and (len(value) > DESC_MAX or len(value.split()) > DESC_WORDS):
            warnings.append(f'{where}.description: {len(value)} caracteres, {len(value.split())} palavras')
    return errors, warnings


def cmd_apply(lang):
    lock_path, tm_path, work = paths(lang)
    lock, tm = read(lock_path, {}), read(tm_path, {})
    sources = {name: source_items(name) for name in FILES}
    targets = {name: target_items(lang, name) for name in FILES}
    errors, warnings, applied = [], [], 0
    for chunk in sorted((work / 'out').glob('chunk-*.json')):
        origin = {(i['file'], i['id']): i['fields'] for i in read(work / 'in' / chunk.name, {'items': []})['items']}
        for item in read(chunk, {'items': []})['items']:
            name, item_id, fields = item['file'], item['id'], item['fields']
            if name == '_categories':
                if isinstance(fields.get('text'), str) and fields['text'].strip():
                    tm[item_id] = fields['text']
                continue
            source = sources.get(name, {}).get(item_id)
            if source is None:
                warnings.append(f'{name}/{item_id}: não existe mais em inglês, ignorado')
                continue
            expected = {k: source[k] for k in fields if k in source}
            # O inglês mudou depois do extract: a tradução é da versão antiga e o campo volta a ficar pendente.
            sent = origin.get((name, item_id), {})
            if any(digest(sent.get(k)) != digest(v) for k, v in expected.items()):
                errors.append(f'{name}/{item_id}: o inglês mudou depois do extract; extraia de novo')
                continue
            problems, notes = check_item(name, item_id, expected, fields)
            warnings += notes
            if problems or not expected:
                errors += problems or [f'{name}/{item_id}: nenhum campo válido']
                continue
            targets[name].setdefault(item_id, {}).update(fields)
            for field in fields:
                lock.setdefault(name, {}).setdefault(item_id, {})[field] = digest(source[field])
            applied += 1
    for name in FILES:
        source = sources[name]
        # Perfil ou campo que saiu do inglês sai do idioma também.
        items = {i: {k: v for k, v in f.items() if k in source[i]} for i, f in targets[name].items() if i in source}
        for item_id, fields in source.items():
            for field, value in fields.items():
                if is_shared(name, field) and value in tm and item_id in items:
                    items[item_id][field] = tm[value]
        save_target(lang, name, items, list(source))
        if name in lock:
            lock[name] = {i: {k: v for k, v in f.items() if k in source[i]} for i, f in lock[name].items() if i in source}
    write(lock_path, lock)
    write(tm_path, tm)
    print(f'{applied} itens aplicados; {len(errors)} recusados; {len(warnings)} avisos')
    for line in errors[:60]:
        print('ERRO ', line)
    for line in warnings[:40]:
        print('aviso', line)
    if errors:
        return 1
    # Tudo aplicado: os lotes não podem voltar a valer num apply futuro.
    if work.exists():
        shutil.rmtree(work)
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('command', choices=['status', 'extract', 'apply'])
    parser.add_argument('lang')
    parser.add_argument('--force', action='store_true', help='extract: descarta lotes traduzidos e não aplicados')
    args = parser.parse_args()
    if args.lang in ('pt', 'en'):
        sys.exit('pt e en são mantidos à mão')
    sys.stdout.reconfigure(encoding='utf-8')
    if args.command == 'extract':
        result = cmd_extract(args.lang, args.force)
    else:
        result = {'status': cmd_status, 'apply': cmd_apply}[args.command](args.lang)
    sys.exit(result or 0)


if __name__ == '__main__':
    main()
