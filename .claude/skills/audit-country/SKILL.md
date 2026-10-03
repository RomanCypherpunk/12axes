---
name: audit-country
description: Reaudita perfis do catálogo country (países/nações) do projeto 12axes, um lote de 15 por vez, seguindo o protocolo pergunta-a-pergunta de profile-audit/README.md.
---

# /audit_country

Reaudita perfis já existentes do catálogo **country**.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — autossuficiente, contém a lista dos 12 eixos, o template exato do prompt, a regra de disparo simultâneo, a validação, o script de cálculo/merge do vetor e a atualização de `STATE.json`/`answers/`.

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `country` |
| Metadados (fonte) | `backend/src/main/resources/data/countries.json` |
| Perfis salvos (destino) | `backend/src/main/resources/data/countries-profiles.json` (chave `countryId`) |
| Campos usados no prompt | `id`, `name`, `category`, `description` (ver nota `historical`/`period`) |
| `religions` | não entra no prompt, mas é revisado a cada lote (ver Execução); em país histórico, vale a religião daquele período |
| Tipo de perfil no cabeçalho do prompt | `"país/nação"` |

**Nota `historical`:** perfis com `"historical": true` representam um país em um período específico (ex.: "Alemanha Nazista — Terceiro Reich", `period` preenchido). Inclua isso na descrição passada ao subagente para que ele responda como aquele período específico, não o país atual.

## Execução

1. Leia `STATE.json.country.pending`. Se vazio, informe ao usuário que não há mais nada pendente neste catálogo e pare.
2. Pegue os 15 primeiros IDs de `pending` (ou o restante, se houver menos de 15).
3. Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md`, usando os parâmetros da tabela acima:
   - Gerar `prompts/country/<id>.txt` para cada perfil do lote.
   - Disparar os 15 subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as 15 saídas rodando `python profile-audit/validate.py country <id>` em cada uma.
     Ele checa forma, taxa de neutros e conteúdo (direção dos eixos, duplicata de outro país).
     **Leia os avisos, não só o código de saída** — ver "Modos de falha conhecidos" no README. Se
     reprovar, relance só aquele subagente dizendo qual checagem falhou e quais eixos estavam errados.
   - Calcular vetores e mesclar em `countries-profiles.json`.
   - **Revisar `religions` de cada perfil do lote** com o vetor novo: valores fechados `catholic`, `protestant`, `orthodox` (o cristianismo é dividido por denominação; perfil ambíguo ou sem denominação leva mais de uma, ou as três), `judaism`, `islam`, `buddhism`, `other` (hinduísmo, xintoísmo, religiões antigas) ou `[]`; pode haver mais de um. Primeiro o vetor: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil (doutrina religiosa por definição, liderança ou fundação religiosa, ou, em personalidades, posição política ou religiosa forte ligada à fé, como Milei, Biden e Mamdani; só `["other"]` pode ficar sempre). Depois, regra **por catálogo** (teste: a religião é parte relevante do que o perfil representa?): **país** = só a religião majoritária ou a tradição dominante, quando o vetor pede marcação, e `[]` para regimes marcados pela perseguição religiosa (Coreia do Norte, URSS); **ideologia** = doutrina com base religiosa explícita ou que defende uma religião como parte da identidade política (Democracia Cristã, Islamismo, Distributismo); **personalidade** = fé pública que aparece na atuação, liderança religiosa ou apoio declarado a uma causa religiosa, nunca só origem étnica ou cultural (Einstein e Friedman = `[]`), e apoio político a Israel não é causa judaica. Aliança só diplomática/militar não conta (Trump = `["protestant"]`, o sionismo cristão é causa cristã; Arábia Saudita = `["islam"]`). Lembre que o filtro **esconde** perfis marcados só com outra religião: marcar a mais tira o perfil de quem escolheu outra tradição; `other` só é curinga quando está sozinho. Se o vetor tiver `religiao` ≤ 35 e o texto disser que o perfil é secular, reaudite o vetor em vez de apagar a religião. Com o vetor calculado, `religiao` ≤ 35 (lado religioso) **exige** ao menos um valor — o `validate.py` ([RELIGIAO]) e o `ReligionFilterTest` bloqueiam —, mas o valor vem de pesquisa, **nunca** do vetor. Vive só no JSON PT, como `category`. Ver "O campo `religions`" em `NEW_PROFILE.md`. Se o campo faltar, estiver errado pela regra, ou o vetor novo cair em `religiao` ≤ 35 com lista vazia, corrija no JSON de metadados PT e cite a mudança (antes → depois, com a razão) no resumo final. Vertente cristã: siga a subseção "Vertente cristã" de `profile-audit/NEW_PROFILE.md` (país/região: igreja estatal > participação de 65% ou mais dos cristãos > duas marcas se a segunda tem 25% ou mais ou a divisão molda a política; vale a vertente do período; antes de 1054, `catholic` e `orthodox`; região segue a vertente da região). Máximo de 3 marcas cristãs, na dúvida duas, nunca "católico por padrão"; marque o que não tiver base como provisório no resumo.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/country/<id>.json` (permanente, nunca apagar) e limpar temporários (mantendo só um par de exemplo em `prompts/country/` + `subagent-out/country/`).
4. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py country <id>` e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   - **Perguntas de arquétipo:** a auditoria responde as 240 perguntas **e** as perguntas de arquétipo, como um usuário do quiz. O prompt termina com o bloco de `python profile-audit/profile_vector.py --prompt-block`, a saída traz o bloco `archetype`, o `validate.py` reprova se faltar, e o vetor mesclado (via `profile_vector.compute_vector`) soma as alternativas escolhidas como respostas extras, igual ao `ScoringService`. Liste as escolhas no resumo final. Ver "Perguntas de arquétipo" em `profile-audit/README.md`.
5. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior (percentual exato) e a revisão de `religions`, e informe quantos perfis restam em `pending`. **Pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Todas as regras da seção final de `profile-audit/README.md` se aplicam sem exceção (nunca lote sequencial, nunca modelo fraco, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`).
