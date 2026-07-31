# Criação de um novo perfil (país, ideologia ou personalidade)

Este arquivo descreve o processo completo para **criar um perfil totalmente novo** no projeto
12axes — diferente de `profile-audit/README.md`, que reaudita perfis já existentes. Use este
processo quando o usuário pedir para **adicionar** um país, ideologia ou personalidade que ainda
não existe no catálogo.

Se você é uma IA retomando este trabalho numa sessão nova, **leia este arquivo inteiro antes de
fazer qualquer coisa**. Ele é autossuficiente, mas reutiliza a metodologia de perguntas e cálculo
de vetor já documentada em `profile-audit/README.md` — leia esse arquivo também antes do passo 5.

## Gatilho

Quando o usuário disser algo como:

> "Quero que crie um novo perfil de ideologia/personalidade/país chamado XXXX, rode
> @NEW_PROFILE.md e faça a criação completa"

Execute os passos abaixo, na ordem, sem pular etapas. Pergunte ao usuário só o que for
estritamente necessário e não puder ser inferido (ver passo 0).

## Passo 0 — Reunir informações mínimas

Antes de escrever qualquer arquivo, você precisa saber:

1. **Catálogo**: `ideology`, `personality` ou `country`.
2. **`id`**: slug em kebab-case, minúsculo, sem acento (ex.: `social-libertarianismo`,
   `xi-jinping`, `mongolia`). Verifique que não colide com nenhum `id` já existente no arquivo de
   metadados do catálogo (`ideologies.json` / `personalities.json` / `countries.json`).
3. **`name`**: nome de exibição em PT-BR.
4. Os demais campos dependem do catálogo — veja a tabela abaixo. Se o usuário não informou algo
   essencial (ex.: `category` de uma ideologia, `role`/`lifespan` de uma personalidade, se um país
   é `historical`), **decida com base em pesquisa/conhecimento factual e prossiga** — só pergunte
   ao usuário se a ambiguidade for genuinamente impossível de resolver sozinho (ex.: dois países
   homônimos, ou uma personalidade com nome muito comum).

### Pesquisa aprofundada obrigatória para personalidades vivas/contemporâneas

Duas sessões de IA independentes auditando a mesma pessoa viva **já produziram vetores
materialmente diferentes** (um caso real: `representacao` saiu 51 numa sessão e 76 noutra para o
mesmo perfil) porque cada uma parou a pesquisa em um nível de profundidade diferente. Rótulos
ideológicos genéricos ("liberal", "linha-dura", "nacionalista") não são suficientes para calibrar
240 respostas — é fácil "confirmar" um rótulo com 2 buscas rasas e deixar de fora exatamente os
fatos que mais moveriam o vetor.

Se o perfil é uma pessoa viva e politicamente ativa (sobretudo candidato ou titular de cargo em
mandato/campanha corrente), **antes de escrever a `description`**:

1. Não se contente com 1-2 buscas genéricas de biografia. Faça uma busca **dedicada por eixo**
   (ou pelo menos pelos eixos onde a pessoa tem posição pública conhecida), buscando fatos
   específicos e citáveis, não rótulos vagos — ex.: não "é liberal na economia", mas "defende
   processamento nacional de terras-raras e tarifas sobre importados chineses, mas se opõe a
   privatizar a Petrobras".
2. Cubra pelo menos: doutrina econômica concreta (privatizações defendidas/recusadas por nome,
   tarifas, protecionismo setorial), segurança pública (métodos citados nominalmente — ex.: cita
   outro líder/modelo como referência), estrutura federativa/administrativa (propostas concretas
   de centralização ou descentralização), política externa, costumes/moral, religião, e qualquer
   controvérsia recente com citação direta.
3. Cruze pelo menos 3 fontes independentes e note a data de cada fato — priorize o que é mais
   recente em relação à data atual da conversa.
4. **Antes de prosseguir para o Passo 1**, releia os 12 eixos do resumo rápido de
   `profile-audit/README.md` e verifique: para cada eixo, você tem pelo menos um fato específico e
   sourced, ou só uma inferência genérica a partir do rótulo ideológico? Se algum eixo só tem
   inferência genérica, faça mais uma busca dedicada a ele antes de escrever a `description`.
5. Inclua na `description` (ou no contexto adicional do prompt de auditoria do Passo 5) os fatos
   concretos mais reveladores — inclusive os que geram tensão ou contradição com o rótulo
   ideológico principal da pessoa. É exatamente essa tensão que o vetor de 12 eixos deveria
   capturar; suavizá-la no texto produz um vetor raso.

Essa mesma checklist vale ao **reauditar** um perfil de pessoa viva já existente
(`profile-audit/README.md`) — antes de gerar o prompt do lote, confirme que a `description` atual
ainda reflete a posição mais recente da pessoa; se não refletir, atualize `personalities.json` /
`ideologies.json` (Passo 1 deste arquivo) antes de prosseguir.

| Catálogo | Campos obrigatórios | Campos condicionais |
|---|---|---|
| `ideology` | `id`, `name`, `category`, `description`, `countryId`, `personalityId` | — |
| `personality` | `id`, `name`, `role`, `lifespan`, `description`, `imagePath`, `imageSourceName`, `imageSourceUrl`, `imageNote` | — |
| `country` | `id`, `name`, `category`, `description`, `flagPath`, `historical`, `period`, `vector` (sempre `null` no arquivo de metadados) | `period` só é preenchido (e `historical: true`) se o perfil representa um país num momento histórico específico (ex.: "Alemanha Nazista — Terceiro Reich") |

**Nota sobre `ideology.countryId` / `ideology.personalityId`**: toda ideologia do catálogo aponta
para um país e uma personalidade **já existentes** que a exemplificam bem (ex.: `tecno-cristianismo`
→ `countryId: "russia"`, `personalityId: "..."`). Escolha o país/personalidade mais representativo
já presente no catálogo. Isso é validado por `IdeologyPersonalityMappingTest` e
`IdeologyCountryMappingTest` — se apontar para um id inexistente, o build quebra.

## Passo 1 — Adicionar aos metadados em português (fonte da verdade)

Adicione um novo objeto ao **final** do array JSON correspondente:

- `ideology` → `backend/src/main/resources/data/ideologies.json`
- `personality` → `backend/src/main/resources/data/personalities.json`
- `country` → `backend/src/main/resources/data/countries.json`

Escreva a `description` em português, no mesmo estilo enxuto e factual dos outros perfis do
catálogo (1 a 3 frases, sem opinião, citando fatos/características concretas verificáveis). Leia
2-3 exemplos vizinhos no mesmo arquivo para calibrar tom antes de escrever o seu.

**Tamanho padrão**: mire cerca de **30 palavras** (a média/mediana observada nos três catálogos),
tolerando a faixa **~20-45 palavras**. Depois de escrever, confira a contagem (`len(description.split())`
em um script rápido, ou conte manualmente) e corte o que for redundante ou secundário até caber
nessa faixa — cite só os 2-3 fatos mais definidores do perfil, não uma lista exaustiva de posições.
A mesma regra vale para a tradução em inglês do Passo 2.

Exemplo de objeto novo em `ideologies.json`:

```json
{
  "id": "exemplo-ideologia",
  "name": "Exemplo de Ideologia",
  "category": "Centro-Esquerda",
  "description": "Descrição factual de 1-3 frases sobre a ideologia, seus princípios centrais e contexto histórico/geográfico relevante.",
  "countryId": "brasil",
  "personalityId": "lula-da-silva"
}
```

Exemplo de objeto novo em `countries.json`:

```json
{
  "id": "exemplo-pais",
  "name": "Exemplo",
  "category": "República parlamentarista",
  "description": "Descrição factual de 1-3 frases sobre o país/período, seu regime político e economia.",
  "flagPath": "/countries/flags/exemplo-pais.gif",
  "historical": false,
  "period": "",
  "vector": null
}
```

Exemplo de objeto novo em `personalities.json` (campos de imagem preenchidos no passo 3):

```json
{
  "id": "exemplo-pessoa",
  "name": "Exemplo Pessoa",
  "role": "Estadista",
  "lifespan": "1900–1980",
  "description": "Descrição factual de 1-3 frases sobre a trajetória e ideias da pessoa.",
  "imagePath": "/personalities/portraits/exemplo-pessoa.jpg",
  "imageSourceName": "Wikimedia Commons / Wikipédia",
  "imageSourceUrl": "https://pt.wikipedia.org/wiki/Exemplo_Pessoa",
  "imageNote": "Retrato de Exemplo Pessoa via Wikipédia/Wikimedia Commons."
}
```

## Passo 2 — Traduzir para inglês

Adicione o mesmo objeto (traduzido) ao **final** do array correspondente em:

- `backend/src/main/resources/data/i18n/en/ideologies.json`
- `backend/src/main/resources/data/i18n/en/personalities.json`
- `backend/src/main/resources/data/i18n/en/countries.json`

Regras de tradução (confirmadas comparando os pares PT/EN já existentes nesses arquivos):

- `id` **nunca muda** — é o mesmo slug em ambos os idiomas.
- `name`, `category`, `description` são traduzidos para inglês natural, mantendo o mesmo nível de
  precisão factual do original em PT.
- Campos técnicos/estruturais (`countryId`, `personalityId`, `flagPath`, `imagePath`,
  `imageSourceUrl`, `historical`, `period`, `vector`) **não aparecem** no arquivo i18n de
  `ideologies.json`/`countries.json`/`personalities.json` — o i18n só tem `id`, `name`,
  `category`/`role`+`lifespan`, `description` (confira o arquivo real antes de assumir, o formato
  pode ter mudado desde a escrita deste documento).
- Referências específicas do Brasil na `description` em PT (ex.: STF, Bolsa Família, um estado
  brasileiro) devem ser generalizadas ou removidas na versão em inglês, não traduzidas
  literalmente — a versão EN é para público internacional. Veja `[[en-content-internationalized]]`
  se essa memória existir; caso não exista mais, aplique o mesmo princípio por bom senso.

## Passo 3 — Baixar a imagem (country: bandeira / personality: retrato)

**Só se aplica a `country` e `personality`** — ideologias não têm imagem própria.

### Country (bandeira)

1. Veja o `flagPath` de 2-3 países vizinhos no `countries.json` para confirmar o padrão de nome de
   arquivo (`/countries/flags/{id}.gif`, mas confira — alguns perfis mais recentes usam `.png`,
   veja `africa-do-sul-do-apartheid.png` como exemplo de exceção histórica).
2. Baixe uma imagem de bandeira de fonte confiável (Wikimedia Commons é o padrão usado no resto do
   catálogo) para `frontend/public/countries/flags/{id}.{ext}`.
3. Ajuste `flagPath` em `countries.json` (e o campo equivalente em `i18n/en/countries.json`, se
   existir) para bater exatamente com o arquivo salvo.
4. Para países históricos (`historical: true`), procure a bandeira do período específico, não a
   atual (ex.: bandeira do Terceiro Reich, não a bandeira alemã atual).
5. **Comprima a imagem imediatamente após o download** — ver "Compressão obrigatória" abaixo.

### Personality (retrato)

1. Baixe uma foto em retrato (rosto visível, formato vertical ou quadrado preferencialmente) da
   Wikipédia/Wikimedia Commons da pessoa, salvando em
   `frontend/public/personalities/portraits/{id}.jpg`.
2. Preencha em `personalities.json`:
   - `imagePath`: `/personalities/portraits/{id}.jpg`
   - `imageSourceName`: normalmente `"Wikimedia Commons / Wikipédia"` (padrão do catálogo)
   - `imageSourceUrl`: URL da página da Wikipédia (ou Wikimedia Commons) de onde a imagem veio
   - `imageNote`: frase curta em PT, ex. `"Retrato de {name} via Wikipédia/Wikimedia Commons."`
3. **Restrição validada por teste** (`IdeologyPersonalityMappingTest.everyPersonalityImagePathPointsToAPublicAsset`):
   o arquivo referenciado em `imagePath` precisa existir de fato em `frontend/public/...` — se o
   download falhar ou o caminho não bater exatamente, o build de testes quebra.
4. **Comprima a imagem imediatamente após o download** — ver "Compressão obrigatória" abaixo.

Se não for possível baixar uma imagem real (ex.: sem acesso à internet neste ambiente), documente
isso claramente para o usuário em vez de inventar/simular um download — não prossiga fingindo que
a imagem foi salva.

### Compressão obrigatória (sempre, para qualquer imagem baixada da internet)

Imagens da Wikimedia Commons frequentemente vêm em resolução/peso muito acima do necessário — já
tivemos um retrato de **52 MB** para uma imagem exibida a ~220px no site, e no total isso consumiu
mais de 100 MB no catálogo, disparando os limites de Fast Data Transfer/Edge Requests do plano
gratuito da Vercel. Nenhum download de imagem (bandeira ou retrato) fica sem esse passo:

```powershell
cd frontend
npm run optimize:images -- public/countries/flags/{id}.{ext}
# ou, para retrato:
npm run optimize:images -- public/personalities/portraits/{id}.jpg
```

O script (`frontend/scripts/optimize-images.mjs`) redimensiona para no máximo 480px de largura
(2x o tamanho real de exibição no site) e recomprime no **mesmo formato** do arquivo original
(preserva transparência em PNG quando existir; nunca renomeia o arquivo), então não quebra nenhuma
referência em `imagePath`/`flagPath`. Rode-o **antes** do Passo 4 (conferência de consistência),
como parte do mesmo passo de download — não deixe para depois nem trate como opcional. Depois de
rodar, confira visualmente a imagem otimizada (abra o arquivo) para garantir que a compressão não
degradou a legibilidade antes de prosseguir.

## Passo 4 — Conferir consistência dos metadados

Antes de seguir para a auditoria, releia os quatro (ou dois, se for ideologia) arquivos JSON
editados e confirme:

- JSON válido (sem vírgula sobrando, aspas balanceadas).
- O novo objeto está no fim do array, sem quebrar a formatação dos objetos vizinhos.
- `id` idêntico em todos os arquivos onde aparece (metadados PT, metadados EN).
- Nenhum campo obrigatório da tabela do passo 0 ficou vazio ou `null` (exceto os campos que são
  legitimamente `null`/`""` por padrão, como `vector: null` e `period: ""` em países não
  históricos).

## Passo 5 — Auditar o novo perfil (gerar o vetor de 12 eixos)

Este passo reusa **integralmente** o protocolo de `profile-audit/README.md`, passos 2 a 5, mas
para um único perfil novo (não um lote de 15):

1. Leia `profile-audit/README.md` inteiro se ainda não leu nesta sessão.
2. Monte o prompt do perfil usando o template da seção "2. Gerar o prompt de cada perfil do lote"
   do README, preenchendo os metadados que você acabou de criar no passo 1 (não os do i18n em
   inglês — o prompt de auditoria sempre usa os metadados em português, como os outros perfis).
   Salve em `profile-audit/prompts/<catalog>/<id>.txt`.
3. Dispare **um único subagente** (não precisa ser em lote de 15 — é só um perfil) com esse prompt,
   usando um modelo de qualidade (Sonnet ou superior — nunca Haiku ou modelo rápido/barato).
4. Valide a saída rodando **`python profile-audit/validate.py <catalog> <id>`**. Ele checa forma,
   taxa de neutros e conteúdo (direção dos eixos, duplicata, coerência com o perfil declarado) e
   bloqueia o merge se algo grave falhar. **Leia os avisos, não só o código de saída** — validação
   de forma sozinha já deixou passar erros graves. Ver "Modos de falha conhecidos" no README.

   Para perfil **novo**, dois pontos merecem atenção especial:
   - **Duplicata**: se o vetor sair ≥95% idêntico a um perfil existente, ele é redundante. Antes de
     gerar o prompt, liste os vizinhos prováveis e diga ao subagente o que diferencia o novo deles.
   - **Coerência**: uma ideologia deve bater alto com o `personalityId` que declara. Abaixo de ~92%,
     um dos dois vetores está errado — compare eixo a eixo e descubra qual antes de mesclar.
5. Calcule o vetor com o script Python de referência da seção "5." do README (adapte
   `ids_neste_lote` para conter só o novo `id`) e mescle no arquivo de perfis correspondente:
   - `ideology` → `backend/src/main/resources/data/ideology-profiles.json`
   - `personality` → `backend/src/main/resources/data/personality-profiles.json`
   - `country` → `backend/src/main/resources/data/countries-profiles.json`

   Como o perfil é novo (não existe ainda no array), o script precisa **acrescentar** um objeto
   novo em vez de só atualizar um existente. Ajuste assim:

   ```python
   # ... (mesmo setup do script de referência do README) ...
   pid = "<id-do-novo-perfil>"
   d = json.load(open(f'profile-audit/subagent-out/{CATALOG}/{pid}.json', encoding='utf-8'))
   vector = compute_vector(d)
   novo_perfil = {KEY_FIELD: pid, "vector": {axis: vector[axis] for axis in AXIS_ORDER}}

   profiles = json.load(open(PROFILES_FILE, encoding='utf-8'))
   if pid not in {p[KEY_FIELD] for p in profiles}:
       profiles.append(novo_perfil)
   else:
       # perfil já existia (reaudit) — atualiza em vez de duplicar
       for p in profiles:
           if p[KEY_FIELD] == pid:
               p['vector'] = novo_perfil['vector']

   with open(PROFILES_FILE, 'w', encoding='utf-8') as f:
       json.dump(profiles, f, ensure_ascii=False, indent=2)
       f.write('\n')
   ```

6. Copie `subagent-out/<catalog>/<id>.json` para `answers/<catalog>/<id>.json` (arquivo permanente,
   nunca apagar). Apague o `prompts/<catalog>/<id>.txt` e o `subagent-out/<catalog>/<id>.json`
   temporário depois de arquivar — **a menos que** `prompts/<catalog>/` e `subagent-out/<catalog>/`
   ainda não tenham nenhum exemplo de referência para aquele catálogo, caso em que você mantém esse
   par como o exemplo (mesma regra do passo 7 do README de auditoria).
7. Atualize `profile-audit/STATE.json`: adicione o novo `id` em `STATE.json.<catalog>.done` (ele
   nunca esteve em `pending`, porque é um perfil novo, não um reaudit) e incremente
   `STATE.json.<catalog>.totalProfiles` em 1. Atualize `lastUpdated`.

## Passo 6 — Rodar e testar tudo

1. Rode a suíte de testes do backend (o comando de referência já documentado em
   `match-explained.md`, adapte para rodar a suíte completa em vez de só os testes de scoring):

   ```powershell
   cd backend
   ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test
   ```

   Se esse caminho do Maven não existir neste ambiente, procure o wrapper/instalação disponível
   (`mvnw`, `mvnw.cmd`, ou um `mvn` já no PATH) antes de desistir. Informe o usuário se não
   conseguir localizar nenhum executor de Maven.

2. Preste atenção especial aos testes que validam exatamente o que este processo acabou de criar:
   - `IdeologyPersonalityMappingTest` (só relevante se você criou/editou uma ideologia ou
     personalidade): confere que toda ideologia aponta para uma personalidade existente, que toda
     personalidade tem perfil explícito, metadados válidos e imagem existente em
     `frontend/public/...`.
   - `IdeologyCountryMappingTest` (relevante para country/ideology): confere que todo país tem
     perfil explícito com os 12 eixos válidos.
   - `ProfileMatchScorerTest` / `ScorerBenchmarkTest`: não deveriam quebrar com a adição de um
     perfil novo, mas rode mesmo assim — um vetor mal calculado (fora de 0-100, eixo faltando) quebra
     essas suítes também.
   - `QuizFlowAutomationTest`, `SharedResultsTest`: contrato geral da API, garantem que nada mais
     quebrou.

3. Se algum teste falhar, **não ignore nem pule** — volte ao passo correspondente (metadados,
   imagem, ou vetor) e corrija a causa raiz antes de prosseguir.

4. Depois que os testes passarem, rode a aplicação localmente e verifique visualmente o novo
   perfil aparecendo corretamente no fluxo de resultado, se você tiver acesso a rodar o
   frontend/backend juntos neste ambiente. Se não tiver, diga isso explicitamente ao usuário em vez
   de alegar que testou visualmente.

## Passo 7 — Calcular os perfis mais compatíveis nos três catálogos

Depois que o vetor do novo perfil estiver mesclado no arquivo de perfis (passo 5), rode o script
utilitário que reproduz exatamente o algoritmo de `ProfileMatchScorer.java` (mesmos pesos e
fórmulas de `axisSimilarity`/`directionSimilarity`/`magnitudeSimilarity`/`outlierSimilarity`):

```powershell
python profile-audit/compatibility.py <catalog> <id>
```

Exemplo: `python profile-audit/compatibility.py personality zohran-mamdani`.

O script imprime o top 2 de personalidades, ideologias e países mais compatíveis com o vetor do
perfil recém-criado (excluindo o próprio perfil da lista, se ele aparecer no catálogo pesquisado).
Guarde essa saída para usar no resumo do passo 8 — **nunca estime esses matches de cabeça**, o
cálculo de compatibilidade não é intuitivo (combina similaridade por eixo, direção do vetor,
magnitude e outliers com pesos diferentes), então só o script dá o resultado real que o app mostra
ao usuário final.

## Passo 8 — Apresentar a nova inclusão ao usuário

Feche o processo com um resumo direto ao usuário contendo:

- Catálogo e `id`/`name` do novo perfil.
- Resumo de 1-2 frases do vetor resultante (ex.: quais eixos ficaram mais extremos e para qual
  lado, comparando com perfis conhecidos do mesmo catálogo se ajudar a dar contexto).
- As duas personalidades, duas ideologias e dois países mais compatíveis, com o percentual exato,
  calculados no passo 7 (nunca estimados).
- Confirmação de que os testes relevantes passaram (ou lista exata do que falhou e não pôde ser
  corrigido, se for o caso).
- Lista dos arquivos tocados nesta execução (metadados PT, metadados EN, perfil com vetor, arquivo
  de imagem se aplicável, `STATE.json`, `answers/<catalog>/<id>.json`).

## Regras que não podem ser quebradas

- **Nunca** invente/estime um vetor sem rodar o processo de auditoria pergunta-a-pergunta do passo
  5 — é a mesma regra do `profile-audit/README.md`: cada perfil precisa das 240 respostas reais
  simuladas por um modelo de qualidade, nunca um atalho.
- **Nunca** use um modelo fraco/rápido (tipo Haiku) para gerar as respostas de auditoria.
- **Nunca** deixe um `id` duplicado entre metadados PT e EN, ou entre um catálogo e outro.
- **Nunca** afirme que uma imagem foi baixada ou que testes passaram sem de fato ter feito isso —
  se algo não pôde ser verificado neste ambiente, diga isso claramente ao usuário.
- **Nunca** apague nem sobrescreva arquivos dentro de `profile-audit/answers/<catalog>/` — mesma
  regra do processo de auditoria.
- Sempre que possível, **rode os testes de verdade** antes de declarar a criação do perfil como
  concluída — ver `superpowers:verification-before-completion` se disponível como skill.
