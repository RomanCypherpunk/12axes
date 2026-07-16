# Auditoria pergunta-a-pergunta dos perfis (12axes)

Este diretório contém o processo de auditoria/reauditoria dos perfis de **personalidades**,
**ideologias** e **países** do projeto 12axes nos 12 eixos políticos (240 perguntas no total: 20
por eixo).

Se você é uma IA retomando este trabalho numa sessão nova, **leia este arquivo inteiro antes de
fazer qualquer coisa**. Ele é autossuficiente: não é preciso ler nenhum outro arquivo do repositório
para entender o processo, só os listados abaixo.

## Por que isso existe

Perfis antigos foram auditados com atalhos (respostas copiadas entre perfis parecidos, ou geradas
por um modelo fraco) e ficaram com qualidade ruim. O processo atual reaudita cada perfil do zero,
de forma isolada, respondendo as 240 perguntas uma a uma com um modelo de qualidade (não use modelos
rápidos/baratos tipo Haiku — a qualidade cai visivelmente).

## Os três catálogos

O mesmo processo se aplica a três catálogos independentes. Trabalhe um catálogo de cada vez (não
misture perfis de catálogos diferentes no mesmo lote).

| Catálogo | Metadados (fonte) | Perfis salvos (destino) | Campos usados no prompt |
|---|---|---|---|
| `personality` | `backend/src/main/resources/data/personalities.json` | `backend/src/main/resources/data/personality-profiles.json` (chave `personalityId`) | `id`, `name`, `role`, `lifespan`, `description` |
| `ideology` | `backend/src/main/resources/data/ideologies.json` | `backend/src/main/resources/data/ideology-profiles.json` (chave `ideologyId`) | `id`, `name`, `category`, `description` |
| `country` | `backend/src/main/resources/data/countries.json` | `backend/src/main/resources/data/countries-profiles.json` (chave `countryId`) | `id`, `name`, `category`, `description` (ver nota sobre `historical`/`period` abaixo) |

Nota sobre `country`: perfis com `"historical": true` representam um país em um período específico
(ex.: "Alemanha Nazista — Terceiro Reich", `period` preenchido). Inclua isso na descrição passada ao
subagente para que ele responda como aquele período específico, não o país atual.

As 240 perguntas (`questions-template.txt`) e a fórmula de cálculo do vetor são **as mesmas para os
três catálogos** — só mudam os metadados de entrada e o arquivo de saída.

## Arquivos desta pasta

| Arquivo/pasta | O que é |
|---|---|
| `README.md` | Este arquivo — leia primeiro. |
| `STATE.json` | **Fonte única de verdade** do progresso, um bloco por catálogo (`personality`, `ideology`, `country`), cada um com `pending` e `done`. |
| `questions-template.txt` | As 240 perguntas (12 eixos × 20), prontas para colar em qualquer prompt novo, de qualquer catálogo. Não editar sem necessidade. |
| `prompts/<catalog>/<id>.txt` | Prompt já montado para um perfil específico, pronto para mandar a um subagente. Fora de processamento, deve conter só **um arquivo de exemplo** por catálogo (ver passo 7), para uma IA nova entender o formato sem contexto prévio. |
| `subagent-out/<catalog>/<id>.json` | Saída de um subagente já rodado, aguardando merge/validação. **Temporário**: depois do merge bem-sucedido, o arquivo é apagado daqui (mas uma cópia permanece em `answers/`, ver abaixo) — exceto um exemplo mantido de propósito, ver passo 7. |
| `answers/<catalog>/<id>.json` | **Arquivo permanente** com as 240 respostas (12 eixos × 20, com `personaBrief` de cada eixo) de todo perfil já mesclado. Nunca é apagado — é o arquivo que o usuário usa para auditar/conferir respostas pergunta a pergunta a qualquer momento, mesmo muito depois do merge. |
| `_legacy/` | Pipeline antigo (scripts `.mjs`, logs, JSONs de estado de ~25MB), só de personalidades. **Não usar.** Mantido só para referência histórica. |

Arquivo vivo do resto do repo que todos os catálogos compartilham:
- `backend/src/main/resources/data/questions-pool.json` — as 240 perguntas com `id`, `axisId`, `text`, `agreePole` (LEFT/RIGHT), `weight`. É a fonte da fórmula de cálculo do vetor (seção abaixo).

## O processo, passo a passo

Escolha um catálogo (`personality`, `ideology` ou `country`) e repita este ciclo até
`STATE.json.<catalog>.pending` ficar vazio.

### 1. Escolher o próximo lote de 15

Pegue os 15 primeiros IDs de `STATE.json.<catalog>.pending`.

### 2. Gerar o prompt de cada perfil do lote (se ainda não existir em `prompts/<catalog>/`)

Para cada ID do lote:
1. Busque os metadados no arquivo de metadados do catálogo (tabela acima).
2. Monte o prompt concatenando:
   - O cabeçalho de instruções (metodologia, formato de saída — modelo abaixo).
   - O conteúdo de `questions-template.txt`.
3. Salve em `prompts/<catalog>/<id>.txt`.

**Template do cabeçalho** — adapte `{tipo de perfil}` conforme o catálogo (`"figura histórica/pública"`
para personality, `"ideologia política"` para ideology, `"país/nação"` para country) e os campos
disponíveis (`role`+`lifespan` só existem em personality; use `category` para ideology/country):

```
Você está auditando, pergunta a pergunta e de forma totalmente independente, o perfil "{name}" (catálogo: {tipo de perfil}) nos 12 eixos políticos do projeto 12axes. Avalie ESTE perfil sozinho — você não tem (e não deve imaginar) as respostas dadas a nenhum outro perfil.

Dados curados deste perfil (não invente informação além disto; se precisar de contexto histórico adicional, baseie-se apenas em fatos amplamente documentados e verificáveis sobre esta entidade específica):
id: {id}
name: {name}
{role: {role} / category: {category}}
{lifespan: {lifespan}}  ← só personality
{period: {period}}  ← só country quando historical=true
description: {description}

METODOLOGIA (obrigatória):
- Para CADA um dos 12 eixos: primeiro escreva um persona brief de 1-2 frases conectando especificamente a description acima ao tema daquele eixo (não repita a description inteira - extraia so a parte relevante aquele eixo).
- Depois responda as 20 perguntas do eixo, uma a uma, com um destes codigos: DT (discordo totalmente), D (discordo), N (neutro/indiferente), C (concordo), CT (concordo totalmente).
- Simule genuinamente como o proprio perfil / seus porta-vozes reais responderiam CADA pergunta individualmente. NAO escolha um valor-alvo para o eixo e trabalhe de tras para frente. Aceite o que resultar, mesmo que surpreendente.
- Cada pergunta e independente. As perguntas ja vem em ordem embaralhada. Responda pelo id da pergunta.
- Nuance importante do eixo "controle": as perguntas citam "o governo/Estado/Banco Central" como agente economico. Se este perfil for anti-estatista mas quiser coordenacao economica coletiva/planejada (ex.: anarquistas, comunistas libertarios), julgue pelo ESPIRITO de coordenacao coletiva vs. mercado, nao pela agencia estatal literal. Ja no eixo "representacao", a ausencia de Estado formal (anarquia) conta do lado democratico/anti-autocratico, nao autocratico.

SAIDA (obrigatoria): use a ferramenta Write para gravar UM arquivo JSON estrito (sem markdown, sem comentarios) exatamente neste caminho:
<caminho absoluto para profile-audit/subagent-out/{catalog}/{id}.json>

Formato exato do JSON (as chaves de "answers" devem ser os ids das perguntas; cada eixo com exatamente 20 respostas; todos os 12 eixos presentes):
{
  "estrutura": { "personaBrief": "...", "answers": { "estrutura_01": "C", "estrutura_07": "DT", ... } },
  "representacao": { "personaBrief": "...", "answers": { ... } },
  ... (todos os 12 eixos: estrutura, representacao, poder, imigracao, diplomacia, intervencao, economia, controle, comercio, religiao, moral, tecnologia)
}

Depois de gravar o arquivo, responda apenas com "OK {catalog}:{id}" e um resumo de 1 linha. Não cole o JSON inteiro na resposta.
```

Depois cole o conteúdo de `questions-template.txt` (que já começa com `=== PERGUNTAS POR EIXO ===`).

### 3. Disparar os 15 subagentes SIMULTANEAMENTE

**Regra crítica:** os 15 subagentes do lote devem ser disparados na mesma mensagem/turno (15 chamadas
de ferramenta de agente em paralelo), nunca um de cada vez esperando o anterior terminar. Use um modelo
de qualidade (ex.: Sonnet), não um modelo rápido/barato — perfis feitos com modelo fraco saem ruins
e precisam ser refeitos.

Cada subagente recebe o prompt de `prompts/<catalog>/<id>.txt` e deve gravar sua saída em
`subagent-out/<catalog>/<id>.json`.

### 4. Validar as 15 saídas

Para cada `subagent-out/<catalog>/<id>.json`, confirme:
- Existem exatamente os 12 eixos: `estrutura, representacao, poder, imigracao, diplomacia, intervencao, economia, controle, comercio, religiao, moral, tecnologia`.
- Cada eixo tem `personaBrief` (string) e `answers` com exatamente 20 chaves.
- Todo valor de `answers` é um destes 5 códigos: `DT`, `D`, `N`, `C`, `CT`.

Se algum arquivo faltar ou estiver malformado, relance só aquele subagente antes de prosseguir.

### 5. Calcular o vetor de cada perfil e mesclar (automático, sem esperar confirmação)

Para cada pergunta respondida:
1. Mapeie a resposta para um score: `DT=0, D=0.25, N=0.5, C=0.75, CT=1`.
2. Busque a pergunta em `backend/src/main/resources/data/questions-pool.json` pelo `id` e leia o campo `agreePole`.
3. Se `agreePole == "LEFT"`, o valor da pergunta no eixo é o score direto. Se `agreePole == "RIGHT"`, o valor é `1 - score`.
4. O valor final do eixo (0–100) é a **média dos 20 valores das perguntas daquele eixo × 100**, arredondado a 1 casa decimal.

Script de referência (Python, execute a partir da raiz do repo — troque `CATALOG` e os nomes de
arquivo/chave conforme a tabela da seção "Os três catálogos"):

```python
import json

CATALOG = "personality"  # ou "ideology" / "country"
KEY_FIELD = {"personality": "personalityId", "ideology": "ideologyId", "country": "countryId"}[CATALOG]
PROFILES_FILE = {
    "personality": "backend/src/main/resources/data/personality-profiles.json",
    "ideology": "backend/src/main/resources/data/ideology-profiles.json",
    "country": "backend/src/main/resources/data/countries-profiles.json",
}[CATALOG]

qp = json.load(open('backend/src/main/resources/data/questions-pool.json', encoding='utf-8'))
qmap = {q['id']: q for q in qp}
score_map = {'DT': 0, 'D': 0.25, 'N': 0.5, 'C': 0.75, 'CT': 1}

def compute_vector(answers_by_axis):
    vector = {}
    for axis, obj in answers_by_axis.items():
        total = 0
        for qid, ans in obj['answers'].items():
            q = qmap[qid]
            score = score_map[ans]
            left = score if q['agreePole'] == 'LEFT' else 1 - score
            total += left
        vector[axis] = round(total / len(obj['answers']) * 100, 1)
    return vector

AXIS_ORDER = ['estrutura','representacao','poder','imigracao','diplomacia','intervencao',
              'economia','controle','comercio','religiao','moral','tecnologia']

ids_neste_lote = [...]  # os 15 ids do lote

profiles = json.load(open(PROFILES_FILE, encoding='utf-8'))
by_id = {p[KEY_FIELD]: p for p in profiles}

for pid in ids_neste_lote:
    d = json.load(open(f'profile-audit/subagent-out/{CATALOG}/{pid}.json', encoding='utf-8'))
    vector = compute_vector(d)
    by_id[pid]['vector'] = {axis: vector[axis] for axis in AXIS_ORDER}

with open(PROFILES_FILE, 'w', encoding='utf-8') as f:
    json.dump(profiles, f, ensure_ascii=False, indent=2)
    f.write('\n')
```

Depois de escrever o arquivo de perfis:

### 6. Atualizar `STATE.json`

Para cada ID do lote mesclado com sucesso, dentro do bloco `STATE.json.<catalog>`:
- Remova o ID de `pending`.
- Adicione o ID em `done`.
- Atualize `STATE.json.lastUpdated` (UTC, formato `YYYY-MM-DDTHH:MM:SSZ`).

### 7. Arquivar as respostas e limpar os arquivos temporários do lote

Para cada perfil mesclado com sucesso, NESTA ORDEM:
1. Copie (não mova) `subagent-out/<catalog>/<id>.json` para `answers/<catalog>/<id>.json`. Este
   arquivo é **permanente** — é o que o usuário usa para auditar as 240 respostas de qualquer perfil
   a qualquer momento, mesmo muito tempo depois do merge. **Nunca apague nada dentro de `answers/`.**
2. Apague `prompts/<catalog>/<id>.txt` e `subagent-out/<catalog>/<id>.json` de cada perfil do lote,
   **exceto o primeiro ID do lote**: mantenha o par `prompts/<catalog>/<id>.txt` +
   `subagent-out/<catalog>/<id>.json` desse primeiro perfil como exemplo de referência. Isso serve
   para que uma IA nova, numa sessão futura sem contexto nenhum, possa abrir esses dois arquivos e
   entender exatamente o formato esperado de prompt e de saída sem precisar reconstruir do zero.
   Se `prompts/<catalog>/` e `subagent-out/<catalog>/` já tiverem um exemplo de um lote anterior,
   não é necessário manter mais um — um exemplo por catálogo já basta (pode sobrescrever pelo mais
   recente, ou simplesmente deixar o mais antigo, não é crítico qual).

**Nota histórica:** este processo funcionou originalmente em lotes de 5; a partir de 2026-07-16 os
lotes passaram a ser de 15 por solicitação do usuário (mesmo processo, só o tamanho do lote mudou).
Também a partir de 2026-07-16, as respostas passaram a ser arquivadas permanentemente em `answers/`
em vez de simplesmente apagadas após o merge — o usuário quer poder auditar cada resposta depois.

### 8. Perguntar antes do próximo lote

Depois de mesclar, atualizar o `STATE.json` e limpar os arquivos, informe ao usuário que o lote foi
concluído (quantos pending restam naquele catálogo) e **pergunte se deve continuar para o próximo
lote**. Só dispare o próximo lote de 15 após confirmação explícita — não encadeie lotes sozinho.

## Regras que não podem ser quebradas

- **Nunca** despache os 15 subagentes de um lote um de cada vez — sempre simultâneo, mesma mensagem.
- **Nunca** use um modelo fraco/rápido para gerar as respostas — a qualidade cai visivelmente.
- **Nunca** aproxime as respostas de um perfil às de outro perfil parecido — cada perfil é avaliado
  isoladamente, é essa independência que resolve o problema histórico de duplicação de sequências.
- **Nunca** misture perfis de catálogos diferentes (personality/ideology/country) no mesmo lote.
- **Sempre** faça o merge + atualização do `STATE.json` + limpeza automaticamente ao fim de cada
  lote validado — não é preciso perguntar para isso, só para iniciar o **próximo** lote.
- `STATE.json` é a única fonte de verdade de progresso. Não recrie arquivos `.personality-todo.json`
  ou similares, nem consulte os arquivos em `_legacy/` para saber o que falta.
- **Nunca** apague nem sobrescreva arquivos dentro de `answers/<catalog>/` — é o histórico permanente
  de respostas que o usuário usa para auditoria. Só `prompts/` e `subagent-out/` são temporários.
