# Tradução automática do catálogo (espanhol e próximos idiomas)

O inglês (`backend/src/main/resources/data/i18n/en/`) é mantido à mão. Os demais idiomas ficam em `i18n/<lang>/`,
são **gerados** por `sync.py` e nunca editados à mão: uma mudança no inglês sobrescreve o campo. Hoje: `es`.
Sem tradução, o item aparece em inglês (nunca em português), então nada quebra enquanto isso não roda.

Reauditar um perfil muda só o vetor e **não** gera tradução. Só texto novo ou alterado em inglês entra na fila.

## Procedimento (use em toda criação de perfil, depois que o inglês estiver mesclado)

Rode para cada idioma gerado (hoje só `es`).

1. **Ver o que falta**
   ```
   python i18n-tools/sync.py status es
   ```
   - Esperado depois de criar perfis: só os itens que você acabou de criar (um perfil = nome, papel e descrição;
     ideologia = nome, categoria, descrição e frase; país e partido = nome, categoria e descrição).
   - Tudo zerado: nada a fazer, siga para o resumo.
   - Aparecem itens que você não criou: diga ao usuário em uma linha e traduza mesmo assim (a ferramenta trata tudo igual).
   - "N itens a limpar": o `apply` resolve sozinho (perfil ou campo que saiu do inglês).

2. **Extrair os lotes**
   ```
   python i18n-tools/sync.py extract es
   ```
   Cria `i18n-tools/work/es/in/chunk-NNNN.json`. Se recusar por haver lotes traduzidos e não aplicados, aplique-os
   primeiro (passo 4) ou, se forem lixo de uma tentativa anterior, use `--force`.

3. **Traduzir** com `Agent` (`subagent_type: general-purpose`, `model: sonnet`). Um agente por até 5 lotes; para um ou dois
   perfis é um agente só. Prompt (troque `NNNN` e o idioma):

   > Leia i18n-tools/translate-guide.es.md e siga-o à risca. Para cada lote abaixo, leia
   > i18n-tools/work/es/in/chunk-NNNN.json e grave i18n-tools/work/es/out/chunk-NNNN.json com a mesma estrutura, `file` e
   > `id` intactos, trocando apenas os valores dentro de `fields` pela tradução para espanhol. Grave cada lote assim
   > que terminá-lo, com a ferramenta Write. UTF-8 sem escapar acentos, JSON válido. Não leia nem altere outros
   > arquivos e não escreva scripts: traduza você mesmo. Respeite os limites de `role` (30 caracteres e 5 palavras)
   > e `description` (280 caracteres e 45 palavras). Lotes: NNNN. Responda só "OK" e o que ficou em dúvida.

   Perguntas do quiz e textos jurídicos (`questions`, `question-help`) pedem modelo `opus` e revisão: a tradução muda a
   direção da pergunta. Perfis e categorias podem ir com `sonnet`.

4. **Aplicar** (valida, grava em `i18n/es/` e atualiza `locks/` e `tm/`)
   ```
   python i18n-tools/sync.py apply es
   ```
   - `ERRO ...`: o item foi **recusado** e continua pendente. Corrija o lote em `work/es/out/` (ou peça ao agente) e
     rode `apply` de novo. Erros comuns: `role` acima de 30 caracteres ou 5 palavras, placeholders diferentes,
     "o inglês mudou depois do extract" (rode `extract` de novo).
   - `aviso ...`: não bloqueia; leia. "anos diferentes" e "igual ao inglês" costumam ser legítimos (nomes, datas
     convertidas a.C./d.C.); "N caracteres, M palavras" acima do limite de descrição pede encurtar.
   - Sucesso apaga `work/`.

5. **Conferir se ficou bom** (obrigatório, o `apply` só checa a forma)
   - `python i18n-tools/sync.py status es` termina em `total 0 caracteres`.
   - Leia as traduções novas em `i18n/es/<arquivo>.json` (nome, papel, descrição): sentido igual ao inglês, nada em
     português nem em inglês fora de nomes próprios, nome de pessoa e partido conforme o guia.
   - Condenações e processos judiciais devem manter exatamente o grau do inglês (condenado, em primeira instância,
     absolvido...). Datas e números iguais.
   - Se algo estiver errado, corrija à mão **só** isso, direto em `i18n/es/<arquivo>.json`. O ajuste vale enquanto o
     texto em inglês daquele campo não mudar; se mudar, a ferramenta retraduz e sobrescreve. Para um erro que se
     repete (um termo, um tom), ajuste `translate-guide.es.md`, e os próximos lotes já saem certos.

6. **Testes**: `python scripts/check_i18n.py` e, se mexeu em dados, `cd backend && ./mvnw test`.

## Idioma novo

Copie `translate-guide.es.md` para `translate-guide.<lang>.md` e adapte (tom, termos fixos, nomes). Depois siga o
procedimento acima com `<lang>`. O backend cai no inglês sozinho para o que faltar; o idioma ainda precisa ser
registrado no código (resolução de idioma, rota e dicionário de interface), o que está fora desta ferramenta.
Também precisa de três arquivos de texto do relatório pago, que não passam pelo `sync.py`: o dicionário de interface
(`frontend/src/i18n/<lang>.ts`, que inclui os textos de "o que te aproxima"), os papéis do governo ideal (4 eixos possíveis por cargo, 3 textos cada)
(`frontend/src/components/results/premium/governmentRoles.<lang>.json`) e a tradução de `books.json` (`title.<lang>`).
