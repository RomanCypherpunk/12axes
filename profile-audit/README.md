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

## Resumo rápido dos 12 eixos

Use este bloco como trava anti-confusão antes de auditar qualquer perfil. A referência completa está em
`backend/src/main/resources/data/axes-explained.md`; abaixo fica só o resumo operacional de 1 linha por eixo.

- `estrutura` — Federal × Unitário: mede descentralização territorial/institucional vs. comando nacional uniforme. **Não mede democracia vs. autocracia.** Um perfil pode ser autocrático e ainda assim descentralizador/secessionista/federal.
- `representacao` — Democracia × Autocracia: mede confiança em eleições, participação, oposição, conselhos, anarquia/organização voluntária vs. liderança forte, tecnocracia, monarquia ou regimes autoritários. **Não mede centralização territorial.**
- `poder` — Segurança × Liberdade: mede ordem, vigilância, punição e controle estatal vs. privacidade, autonomia civil e liberdades individuais.
- `imigracao` — Assimilação × Multicultura: mede preferência por assimilação cultural/identidade nacional vs. pluralismo cultural e abertura migratória.
- `diplomacia` — Militarista × Pacifista: mede valorização de forças armadas, armamento e uso do poder militar vs. negociação, pacifismo e contenção bélica.
- `intervencao` — Não intervencionista × Nacionalista: mede recusa de projeção externa e prudência geopolítica vs. afirmação agressiva de soberania e interesses nacionais.
- `economia` — Público × Privado: mede propriedade pública/coletiva e serviços estatais vs. propriedade privada, privatização e protagonismo empresarial.
- `controle` — Planejamento × Livre mercado: mede coordenação econômica planejada/regulada vs. mercado, competição e baixa interferência econômica.
- `comercio` — Protecionismo × Globalismo: mede defesa da indústria/soberania produtiva nacional vs. livre comércio e integração econômica internacional.
- `religiao` — Irreligioso × Religioso: mede secularismo/laicidade e crítica ao poder religioso vs. religião forte na vida privada e/ou no Estado.
- `moral` — Progressista × Tradicionalista: mede progressismo cultural/direitos civis vs. tradição, costumes, família e conservadorismo moral.
- `tecnologia` — Tecnologia × Biologia: mede entusiasmo por tecnologia, IA, industrialização e transhumanismo vs. cautela biológica, preservacionista, rural ou naturalista.

## O processo, passo a passo

Escolha um catálogo (`personality`, `ideology` ou `country`) e repita este ciclo até
`STATE.json.<catalog>.pending` ficar vazio.

### 1. Escolher o próximo lote de 15

Pegue os 15 primeiros IDs de `STATE.json.<catalog>.pending`.

**Antes de gerar o prompt de qualquer perfil de pessoa viva e politicamente ativa** (sobretudo
candidato ou titular de cargo em mandato/campanha corrente), confirme que a `description` em
`personalities.json`/`ideologies.json` ainda reflete a posição mais recente da pessoa — posições de
gente viva mudam, e duas sessões de IA independentes já produziram vetores materialmente diferentes
para o mesmo perfil por pesquisarem em profundidades diferentes. Siga a checklist de "Pesquisa
aprofundada obrigatória para personalidades vivas/contemporâneas" em `profile-audit/NEW_PROFILE.md`
(Passo 0) antes de prosseguir; se a description estiver desatualizada, atualize-a primeiro (mesmo
arquivo, Passo 1) e só então gere o prompt de auditoria abaixo.

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
- Atenção de interpretação: `estrutura` mede descentralização/federalismo/secessão vs. unitarismo/centralização; `representacao` mede democracia/participação vs. autocracia/liderança forte. **Nunca use autocracia como atalho para marcar `estrutura` como unitário, nem descentralização como atalho para marcar `representacao` como democrática.**
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

**Rode o validador em cada saída antes de mesclar:**

```powershell
python profile-audit/validate.py <catalog> <id>
```

Ele checa três níveis e sai com erro se algum bloqueante falhar:

| Nível | O que verifica |
|---|---|
| `[FORMA]` | 12 eixos, 20 respostas por eixo, ids corretos, códigos `DT/D/N/C/CT`, `personaBrief` preenchido |
| `[NEUTROS]` | taxa de `N` — bloqueia acima de 18% no total ou 30% em qualquer eixo |
| `[CONTEÚDO]` | direção dos eixos contra perfis-âncora, proximidade excessiva de outro perfil (duplicata) e coerência com o perfil declarado |

**Validação de forma não basta.** Saídas formalmente impecáveis já foram mescladas com erros graves — ver "Modos de falha conhecidos" no fim deste arquivo. Leia os avisos do validador, não só o código de saída.

Se algum arquivo faltar, estiver malformado ou for reprovado, relance só aquele subagente antes de prosseguir, dizendo no prompt **qual** checagem falhou e **quais eixos** estavam errados.

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
- **Nunca** mescle uma saída sem rodar `validate.py` e ler os avisos.

## Direção real dos eixos (medida nos dados)

`backend/src/main/resources/data/axes-explained.md` descreve **`religiao` e `imigracao` invertidos**
em relação à implementação. Use esta tabela, que foi conferida contra perfis reais do catálogo:

| Eixo | 0 | 100 | Âncoras |
|---|---|---|---|
| `estrutura` | centralizado/unitário | descentralizado/federal | Stálin 0 · Rothbard 96 |
| `representacao` | autocracia | democracia | Kim Jong-un 3 · Mujica 86 |
| `poder` | liberdade civil | ordem/vigilância | Rothbard 1 · Stálin 99 |
| `imigracao` | multicultural/aberto | assimilacionista/fechado | Trudeau 23 · Hitler 100 |
| `diplomacia` | pacifista | militarista | Dalai Lama 9 · Hitler 100 |
| `intervencao` | nacionalista assertivo | não intervencionista | Hitler 10 · Dalai Lama 85 |
| `economia` | privado/mercado | público/coletivo | Rothbard 6 · Stálin 94 |
| `controle` | livre mercado | planejamento | Rothbard 5 · Stálin 100 |
| `comercio` | livre comércio/globalista | protecionista | Friedman 10 · Hitler 96 |
| `religiao` | religioso | irreligioso/secular | Khomeini 0 · Stálin 98 |
| `moral` | tradicionalista | progressista | Franco 3 · Foucault 91 |
| `tecnologia` | biologia/naturalista | tecnófilo | Kaczynski 5 · Kurzweil 86 |

Antes de aceitar um valor extremo, pergunte: **quem mais está nessa faixa?** Se o perfil ficou ao lado
de alguém incompatível, o vetor está errado — foi assim que se descobriu Nietzsche marcado como
multiculturalista, na faixa de Obama e Trudeau.

## Modos de falha conhecidos

Todos estes passaram na validação de forma e teriam sido mesclados sem a checagem de conteúdo.

### 1. Excesso de neutros
Cada `N` vale exatamente 0.50 — o ponto morto. Um eixo majoritariamente `N` não mede a posição do
perfil, apenas colapsa para ~50 e parece um centrismo moderado que ninguém defendeu.

> Richard Spencer saiu com 36% de N (economia 75%, controle 60%). Perfis comparáveis do mesmo nicho
> ficam em 12–17% (Dugin 12%, Evola 17%). Refeito: 9,6%.

No prompt do subagente, diga explicitamente que `N` é só para indiferença **genuína** — nunca para
"não falou disso" ou "é anacrônico" — e peça que ele **conte os N antes de gravar**.

### 2. Duplicata de perfil existente
Um perfil novo que sai ~95% idêntico a outro não acrescenta nada ao catálogo.

> "Sindicalismo Revolucionário" saiu 90% igual a `anarcossindicalismo` e `sindicalismo`, ambos já
> existentes — e só 63% compatível com Sorel, que dá nome à corrente.
>
> "Aristocratismo" saiu 96,8% igual a `integralismo-brasileiro`. O erro estava nos próprios briefs,
> que falavam em "identidade **nacional**" e "indústria **nacional**": aristocracia clássica é
> pré-nacional e pré-industrial.

Antes de criar, liste as ideologias vizinhas e diga ao subagente **o que diferencia** a nova delas.

### 3. Falso oposto — o mais sutil
Quando um perfil rejeita um polo, o modelo assume que ele endossa o polo oposto. Mas muitos perfis
rejeitam **os dois**. O sintoma é o brief admitir a tensão enquanto as respostas colapsam para um lado.

> Nietzsche saiu com `economia` 20 e `controle` 22.5 — faixa de Rothbard e Friedman. O brief dizia
> textualmente "**não por amor ao mercado como valor positivo**", mas todas as respostas caíram do lado
> do mercado. Ele ataca o socialismo *e* o "espírito de loja" burguês. Corrigido: 33.8 e 38.8.
>
> Socialismo Lassalliano saiu com `poder` 66.2 (faixa de Bismarck e Lenin) porque confundiu estatismo
> **econômico** com autoritarismo **policial**. Lassalle foi agitador perseguido pelo Estado prussiano.
> Corrigido: 26.2, ao lado de Bernstein (34) e Keynes (31).

Quando o perfil for heterodoxo, diga no prompt **quais dois polos ele rejeita** e que o resultado
esperado é intermediário — deixando claro que é calibração, não alvo a atingir por construção.

### 4. Normalização de figuras heterodoxas
O modelo puxa perfis atípicos para a caixa ideológica mais familiar. Sorel virou anarquista de
esquerda; Nietzsche virou pacifista antinacionalista. São justamente os perfis que ficam órfãos de
ideologia — órfãos porque não cabem nas categorias usuais. Nomeie as heterodoxias no prompt.

### 5. Códigos inválidos
Um subagente já gravou `A`, `B` e `E` em vez de `DT/D/N/C/CT`, confundindo com letras de alternativa.
O validador pega isso, mas vale reforçar no prompt que `C` significa "concordo", não "alternativa C".
