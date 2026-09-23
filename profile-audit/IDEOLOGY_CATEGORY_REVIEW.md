# Revisão de categoria de ideologia

Use esta checagem ao criar ou reauditar uma ideologia, **depois** de obter o vetor. Ela avalia a categoria; não recalibra respostas para fazê-las caber em uma categoria nem altera os arquivos sem autorização explícita do usuário.

## Dados e valores válidos

Compare `ideologies.json` (descrição, frase, `personalityId` e `countryId`) com `ideology-profiles.json` e com as entradas equivalentes em inglês. No catálogo em português, as únicas categorias válidas são:

`Esquerda Radical`, `Esquerda`, `Centro`, `Direita`, `Extrema Direita`, `Terceira Posição`, `Libertário` e `Anarquismo`.

Na tradução inglesa, use o equivalente direto da categoria em português. Uma categoria fora dessa lista é um erro de catálogo: proponha a substituição, mas só a escreva se o pedido autorizar a mudança.

Os polos reais da implementação são: valores altos significam federalismo (`estrutura`), democracia (`representacao`), ordem/vigilância (`poder`), assimilação (`imigracao`), militarismo (`diplomacia`), não intervencionismo (`intervencao`), propriedade pública (`economia`), planejamento (`controle`), protecionismo (`comercio`), secularismo (`religiao`), progressismo (`moral`) e tecnofilia (`tecnologia`). Não use a redação desatualizada de `axes-explained.md` para inverter `religiao` ou `imigracao`.

## Regra de decisão

1. **Família antes do espectro.** Use `Anarquismo` para a tradição anti-Estado e anticapitalista; `Libertário` para a tradição de mercado/propriedade, inclusive suas variantes sem Estado; e `Terceira Posição` apenas para sínteses autoritárias, nacionalistas/tradicionalistas e anti-liberais que se colocam fora de esquerda e direita. Filosofias pré-modernas não entram nessas três famílias modernas.
2. **Depois, avalie o espectro.** Economia e controle ajudam a medir igualdade material; moral, religião e imigração ajudam a medir hierarquia e pertencimento. Doutrinas explicitamente transversais podem permanecer no Centro mesmo sem vetores perfeitamente centristas.
3. **Radicalidade exige duas evidências.** Baixa representação com alto poder, sozinha, não basta. Esquerda Radical requer projeto revolucionário/partido de vanguarda/coletivização máxima; Extrema Direita requer identidade exclusiva ou restauração hierárquica. Autoritarismo gerencial ou desenvolvimentista permanece no lado correspondente do espectro.
4. **Use vizinhos como teste de coerência, não como veredito.** Rode `python profile-audit/compatibility.py ideology <id>` e compare os vizinhos doutrinários relevantes. Explique um par muito próximo em categorias diferentes; nunca use centróide, limiar ou distância como razão única para recategorizar.
5. **Confronte texto, referências e vetor.** Sinalize quando descrição/frase, referências históricas e vetor apontarem para leituras diferentes. Diga qual dado parece desatualizado ou inconsistente; não corrija vetor, referências ou categoria por inferência.

## Resultado esperado

Para cada ID, registre categoria atual e proposta (ou `mantém`), confiança, regra decisiva, 3–5 eixos relevantes, vizinhos calculados, o melhor argumento contrário e qualquer contradição. Se a proposta divergir da categoria atual, peça confirmação explícita antes de editar as versões PT e EN.
