---
name: audit-profile
description: Audita individualmente uma candidatura presidencial de 2026 nas 36 perguntas eleitorais, produzindo respostas justificadas e vetor de 12 eixos. Use para reauditar ou incluir candidaturas no quiz eleitoral; não use para os catálogos gerais de personalidade, ideologia ou país.
---

# /audit_profile

Audite **uma candidatura por execução**. O resultado é uma matriz rastreável de 36 respostas e o vetor que alimenta o match eleitoral.

## Entrada e escopo

- Receba um `candidateId` presente em `backend/src/main/resources/data/candidates.json`. Se nenhum ID for dado, liste somente as candidaturas ativas e peça a escolha.
- Leia integralmente [o protocolo eleitoral](references/election-2026.md) antes de pesquisar ou editar dados.
- Use `backend/src/main/resources/data/election-questions.json` como fonte única das perguntas e dos polos. Não use `questions-pool.json`: ele é o quiz geral de 240 itens.
- Audite exclusivamente o candidato pedido. Não compare respostas, não copie matrizes e não force distância de outros candidatos.

## Pesquisa e classificação

1. Confirme nome, partido, situação e descrição em `candidates.json`.
2. Pesquise fontes atuais antes de responder: programa registrado no TSE, site/campanha oficial, votos, projetos, entrevistas e atos públicos. Para cada tema relevante, prefira fonte primária e registre URL e data de acesso.
3. Para cada eixo, escreva um `personaBrief` de uma ou duas frases específico daquele eixo. Não repita a biografia geral.
4. Responda cada uma das três afirmações com `DT`, `D`, `N`, `C` ou `CT` como a resposta mais provável da candidatura.
   - Prioridade de evidência: proposta ou voto verificável; declaração pública; programa/tradição partidária; inferência coerente com o conjunto de posições.
   - `N` só cabe para ambivalência real. Ausência de fala não é neutralidade.
   - Quando houver inferência, declare-a na justificativa; nunca a apresente como citação ou promessa literal.
   - Avalie a afirmação, não o rótulo ideológico. Respeite `agreePole` ao calcular, não ao decidir a resposta.
5. Para cada resposta, guarde justificativa curta, nível de evidência (`direta`, `partidária` ou `inferida`) e ao menos uma fonte quando a evidência for direta ou partidária.

## Cálculo e publicação

1. Valide que há 12 eixos, três IDs corretos por eixo e apenas os cinco códigos permitidos.
2. Calcule cada eixo conforme a referência: `DT=0`, `D=0,25`, `N=0,5`, `C=0,75`, `CT=1`; inverta o valor quando `agreePole` for `RIGHT`; faça a média das três perguntas e multiplique por 100, com uma casa decimal.
3. Sobrescreva somente `profile-audit/election-out/<candidateId>.json` com a auditoria completa no formato descrito na referência. O arquivo deve registrar data, versão do questionário e fontes, além das respostas.
4. Em execução isolada, atualize a entrada correspondente de `backend/src/main/resources/data/candidate-profiles.json` e `profile-audit/election-out/2026-reaudit.json` com o vetor calculado — nunca com valor estimado manualmente.
5. Em um lote paralelo, o agente trabalhador **não** edita esses dois arquivos compartilhados: o coordenador faz o merge depois que todos os arquivos individuais forem validados. O trabalhador calcula e grava o vetor somente no seu arquivo individual.
6. Rode a verificação indicada na referência e informe: candidato, contagem de evidência direta/partidária/inferida, vetor final e quaisquer eixos de baixa confiança.

## Limites

- Não trate pessoas sem candidatura ativa como presidenciáveis; preserve-as no arquivo, mas sinalize `inactive`.
- Não faça uma auditoria eleitoral inteira em lote: a unidade de trabalho é uma candidatura, para permitir revisão editorial.
- Não invente fontes, falas, votos ou programas. Se uma inferência for inevitável, marque-a explicitamente.
- Não altere perguntas, polos ou pesos enquanto audita. Se encontrar problema metodológico, pare e reporte-o antes de recalcular perfis.
