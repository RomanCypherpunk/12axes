"""Leitura e escrita compactas dos lotes de tradução, para traduzir inline (sem subagente) gastando poucos tokens.

Uso (a partir de qualquer pasta), depois de `python i18n-tools/sync.py extract <lang>`:

  python i18n-tools/inline_chunks.py <lang> dump N    imprime o lote N: "@@ arquivo|id" e uma linha "campo: texto"
                                                       (valores que não são texto saem como "JSON:...")
  python i18n-tools/inline_chunks.py <lang> build N   lê work/<lang>/txt/chunk-NNNN.txt (mesmo formato, já traduzido)
                                                       e grava work/<lang>/out/chunk-NNNN.json, no formato do `apply`

Fluxo: dump N -> escrever work/<lang>/txt/chunk-NNNN.txt traduzido -> build N -> (todos os lotes) sync.py apply <lang>.
O `build` falha se faltar algum id ou campo, então um lote incompleto nunca chega ao `apply`.
Atenção: rode o `apply` com a pasta atual fora de work/<lang>/, senão o Windows não consegue apagá-la no fim.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def main() -> None:
    if len(sys.argv) != 4 or sys.argv[2] not in ('dump', 'build'):
        sys.exit(__doc__)
    lang, command, number = sys.argv[1], sys.argv[2], int(sys.argv[3])
    root = os.path.join(HERE, 'work', lang)
    name = f'chunk-{number:04d}'
    with open(os.path.join(root, 'in', f'{name}.json'), encoding='utf-8') as f:
        source = json.load(f)

    if command == 'dump':
        lines = []
        for item in source['items']:
            lines.append(f"@@ {item['file']}|{item['id']}")
            for key, value in item['fields'].items():
                lines.append(f'{key}: {value if isinstance(value, str) else "JSON:" + json.dumps(value, ensure_ascii=False)}')
        sys.stdout.reconfigure(encoding='utf-8')
        print('\n'.join(lines))
        return

    with open(os.path.join(root, 'txt', f'{name}.txt'), encoding='utf-8') as f:
        text = f.read().replace('\r\n', '\n')
    blocks: dict[str, dict[str, str]] = {}
    current = None
    for line in text.split('\n'):
        if line.startswith('@@ '):
            current = line[3:].strip()
            blocks[current] = {}
        elif current is not None and line.strip():
            key, _, value = line.partition(': ')
            blocks[current][key.strip()] = value

    items = []
    for item in source['items']:
        key = f"{item['file']}|{item['id']}"
        got = blocks.get(key)
        assert got is not None, f'falta {key}'
        fields = {}
        for field, original in item['fields'].items():
            assert field in got, f'falta {key}.{field}'
            value = got[field]
            if isinstance(original, str):
                fields[field] = value
            else:
                fields[field] = json.loads(value[5:] if value.startswith('JSON:') else value)
        items.append({**item, 'fields': fields})

    os.makedirs(os.path.join(root, 'out'), exist_ok=True)
    with open(os.path.join(root, 'out', f'{name}.json'), 'w', encoding='utf-8') as f:
        json.dump({**source, 'items': items}, f, ensure_ascii=False, indent=2)
    print('ok', name, len(items))


if __name__ == '__main__':
    main()
