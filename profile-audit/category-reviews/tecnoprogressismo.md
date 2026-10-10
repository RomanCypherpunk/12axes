# Revisão de categoria: Tecnoprogressismo

- ID: `tecnoprogressismo`
- Categoria atual: Esquerda / Left.
- Três vizinhos após merge: Neomalthusianismo — 96,9% — Centro; Geossocialismo — 95,4% — Esquerda; Aceleracionismo de Esquerda — 94,8% — Esquerda.
- Proposta: mantém.
- Confiança: alta para a família democrática e igualitária; média para a representação de uma corrente plural por um vetor único.
- Evidências textuais e referências: a Declaração Tecnoprogressista de 2014 e os textos do IEET combinam democracia, melhoramento humano, autodeterminação corporal e cognitiva, acesso universal às tecnologias e proteção social. Ver [fontes e limites](../research/ideology/tecnoprogressismo.json).
- Eixos relevantes: representação 87,0, economia 77,4, controle 67,4, moral 83,6 e tecnologia 82,0. A distribuição de benefícios e o controle democrático sustentam Esquerda; não há exigência de partido de vanguarda ou coletivização integral que justifique Esquerda Radical.
- Sinal dos vizinhos: dois de três pertencem à Esquerda. O Neomalthusianismo (Centro) aparece pela proximidade nos eixos não tecnológicos, não por afinidade doutrinária; ver abaixo.
- Melhor argumento contrário: a corrente inclui versões reformistas e mecanismos de mercado, permitindo leitura de centro-esquerda ou Centro. O catálogo não oferece centro-esquerda; Esquerda preserva melhor a ênfase em acesso universal e redistribuição.

## Reauditoria (2026-10-10)

O mantenedor observou na PR que 73,7 em tecnologia era moderado demais para uma corrente transumanista. O perfil foi reauditado do zero pelo processo padrão de `README.md` (prompt → subagente independente → `validate.py` → merge → arquivo em `answers/`):

- A `description` e a `phrase` (PT/EN) passaram a nomear o núcleo transumanista: melhoramento humano, extensão radical da vida e liberdade morfológica.
- O prompt incluiu um bloco de contexto com as fontes e também os contrapesos reais da corrente (sustentabilidade, governança de riscos, democracia). O subagente não recebeu as respostas antigas, o vetor antigo, vizinhos nem valor-alvo.
- O arquivo anterior foi preservado em `answers/ideology/tecnoprogressismo.pre-reaudit-2026-10-10.json` (tecnologia 73,7), seguindo o padrão `<id>.pre-reaudit-<data>.json` já usado em `answers/country/`.
- Resultado: tecnologia 73,7 → 82,0. 73 das 240 respostas mudaram, inclusive em eixos que o novo contexto não visava explicitamente (imigração 14,0 → 23,6); estrutura mudou 16,7 pontos (56,9 → 40,2). Isso mostra sensibilidade entre essas duas auditorias; com apenas duas execuções, não é possível separar o efeito do contexto alterado da variação entre execuções. A saída foi mesclada como veio, sem nova execução para melhorar números.

## Revisão dos avisos de validação

O validador passou sem erros bloqueantes. Os avisos não foram removidos por ajuste de respostas.

### Proximidade com outras ideologias

As compatibilidades de 94,8–96,9% merecem revisão de escopo pelo mantenedor. Maiores diferenças por eixo:

- Neomalthusianismo (96,9%): tecnologia 20,1; economia 13,5; estrutura 8,3. A proximidade vem dos eixos de democracia, laicidade e moral; em tecnologia as correntes divergem no ponto central (limites ao crescimento vs. melhoramento e abundância tecnológica).
- Geossocialismo (95,4%): tecnologia 28,4; comércio 16,7; estrutura 10,8. O Geossocialismo tem compromissos fundiários não exigidos aqui.
- Aceleracionismo de Esquerda (94,8%): imigração 14,3; diplomacia 14,1; tecnologia 14,0. É o vizinho doutrinariamente mais próximo; diferem na exigência de um projeto pós-capitalista, que o tecnoprogressismo não impõe.

Os vizinhos da auditoria anterior (Socialismo Liberal, Internacionalismo) caíram para 94,2% e 93,3%. A inclusão é proposta pela diferença de conteúdo, com reconhecimento de que o instrumento mede esse conteúdo apenas parcialmente. Nenhuma resposta foi escolhida para reduzir compatibilidade ou alterar um resultado de usuário. O mantenedor pode preferir agrupar correntes próximas; a PR segue como draft para essa discussão.

### Referência a Condorcet

A compatibilidade com `nicolas-de-condorcet` é 94,7%, acima do aviso de 92%. Maiores divergências: controle (42,5 vs. 67,4), economia (53,8 vs. 77,4) e moral (71,3 vs. 83,6). Financiamento público da ciência, proteção social e partilha dos ganhos da automação são compromissos da corrente atual, não uma identidade histórica com Condorcet, que é citado por Hughes como antecedente intelectual, não como adepto. O perfil do precursor não foi alterado.

### Neutros e limites doutrinários

35/240 respostas neutras (14,6%). Estrutura, controle e comércio: 30% cada (6/20), no limite do validador. São temas sem posição única na corrente (desenho territorial, instrumentos monetários e comerciais). O cumprimento dos limites numéricos não estabelece suporte doutrinário para cada resposta.

### Limites das respostas territoriais

As fontes não tratam de secessão nem de autonomia legislativa municipal, e o prompt da reauditoria disse isso explicitamente. Ainda assim, o subagente respondeu `estrutura_09` (direito de secessão) D, `estrutura_13` (leis municipais diferentes das nacionais) D e `estrutura_18` (proibir secessão) N, inferindo que garantias universais pressupõem padrões nacionais comuns. Essa inferência está declarada no persona brief, mas não é doutrina documentada; a auditoria anterior tinha a inferência oposta (C, C, D), também sem suporte direto. Essas três respostas exigem revisão do mantenedor. Não foram alteradas à mão.

### Arquétipos

Sociedade D · Poder C · Economia B · Mundo C · Tecnologia D. A alternativa E de tecnologia ("acelerar sem freios") contradiz a governança de riscos da corrente. São incluídos no cálculo via `profile_vector.compute_vector`, junto das 240 respostas arquivadas.

### Outros matches calculados

- Personalidades: Alan Turing 96,8%; Amartya Sen 96,7%.
- Países/regiões: Massachusetts (Estados Unidos) 93,4%; Uruguai 92,8%. Referência declarada `suecia`: 90,4%.

Esses matches expressam proximidade numérica, não adesão histórica à corrente. Não foram usados para escolher respostas nem substituir automaticamente as referências documentadas.
