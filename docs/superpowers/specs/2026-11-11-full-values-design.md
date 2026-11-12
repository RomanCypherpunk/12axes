# FullValues: valores declarados no quiz de 240 perguntas

Data: 2026-11-11. Estado: rascunho para aprovação.

Convenção: **[decisão]** foi dito pelo Enzo; **[minha escolha]** é uma escolha de quem redigiu, para o Enzo conferir.

## Intenção e por quê

A seção "Valores políticos" da página de resultado é hoje **derivada**: o `PoliticalValuesService` pega, por categoria, o valor cujo perfil de eixos está mais perto do vetor do usuário. Ela nunca mostra o que a pessoa disse, só o que o vetor sugere. Os 12 eixos medem "quanto" (poder, controle), não "quem" nem "como". Tecnocracia, meritocracia, neocameralismo e monarquia absoluta caem no mesmo lugar dos eixos. Um usuário que é tecnocrata, neocameralista e libertário recebe "aceleracionismo de direita" e perde a nuance.

O HyperValues (hyperzen2773/hypervalues) resolve isso deixando o usuário **declarar** valores nomeados por uma árvore de escolhas. O 12axes quer o mesmo ganho de nuance no quiz mais longo, sem trocar o motor de 12 eixos, o catálogo (ideologias, países, personalidades) nem o matching.

Sucesso: um usuário do quiz de 240 perguntas vê, na página de resultado, **os valores que ele próprio escolheu**, as escolhas dele também refinam os eixos, e o resultado completo volta ao recarregar ou ao abrir um link compartilhado.

## Objetivos

1. **[decisão]** Os quizzes de 36 e 60 perguntas não mudam: continuam com os 5 arquétipos simples e os valores derivados dos eixos.
2. **[decisão]** O quiz de 240 perguntas ganha **perguntas de arquétipo complexas**: uma árvore de decisão por categoria, em que cada resposta final fixa um valor.
3. **[decisão]** Oito categorias: Política (quem governa), Tecnologia, Economia, Cultura, Controle Social, Política Externa, Nação e Organização Territorial.
4. **[decisão]** Um valor por categoria, **8 valores fixos por usuário**, único por árvore, **sem intensidade** (não há controle deslizante de oposto a combina). Não se percorre a árvore de novo para somar outros valores.
5. **[decisão]** Cada valor final também **pontua em um ou mais eixos** relacionados, e esse efeito entra no cálculo com **peso 2** (as 240 respostas continuam com peso 1; hoje um efeito de arquétipo vale peso 1).
6. **[decisão]** Os valores completos ("FullValues") ficam em um arquivo de dados próprio, separado do `political-values.json` dos valores padrão (derivados).
7. **[decisão]** A URL do resultado carrega os valores escolhidos em uma **chave curta**, para recarregar e compartilhar o resultado personalizado, sem estourar o número de módulos do QR code.
8. **[decisão]** Sem a chave (resultados antigos, quizzes de 36 e 60), a página mostra os valores antigos, derivados dos eixos.
9. **[decisão]** Cada valor tem um ícone e um botão "Fonte original" (ver "Ícones").

## Não objetivos

- Ranking de ideologias por valores, no estilo bayesiano do HyperValues. Fica para uma fase seguinte.
- Dar a cada ideologia, país ou personalidade um conjunto de posições sobre os valores.
- Intensidade por valor, múltiplos valores por categoria e a categoria "Gestão de Recursos" do HyperValues.
- Mudar o cálculo dos quizzes de 36 e 60, o matching, ou o vetor dos catálogos.

## Anti-objetivos (seria falha mesmo funcionando)

- Copiar do HyperValues (licença CC BY-NC-SA 4.0, derivado do NeoValues) a árvore, a ordem, as perguntas, as descrições ou o `ideology_scores.json`. O 12axes é "todos os direitos reservados" e tem relatório pago, e a licença não comercial com compartilhamento igual é incompatível. **[decisão]** Perguntas, descrições e árvore são reformuladas e originais. Os **nomes** dos valores são conceitos políticos genéricos e podem coincidir.
- O efeito dos valores nos eixos tornar o resultado do quiz de 240 incomparável com o de 36 e 60 por mais do que a precisão extra justifica.
- Quebrar links já espalhados (`/results?…`, `/r?v=…`) ou os testes existentes de calibração (`ScorerBenchmarkTest`).

## Dados

- **[minha escolha]** `backend/src/main/resources/data/full-values.json` (categorias, valores, efeitos nos eixos, árvore) e textos em `data/i18n/en/full-values.json`, com es e de gerados por `i18n-tools/sync.py`, como os outros catálogos. Português é o idioma-fonte, como em `political-values.json`.
- Cada **categoria** tem id e rótulo. Cada **valor final** tem: id estável, nome, descrição, efeitos nos eixos (`eixo → % do polo esquerdo`, mesma escala de `archetype-questions.json`) e ícone.
- **[minha escolha]** Cada valor toca de 1 a 3 eixos, para limitar a influência total. O teto exato de influência por eixo é do builder, com teste.
- Cada categoria tem uma **árvore de 2 a 3 níveis**; cada nó é uma pergunta com 2 a 4 alternativas, cada uma levando a outro nó ou a um valor final. Referência de escala: o HyperValues tem 128 valores e 177 nós; **[minha escolha]** mirar em 70 a 110 valores no total.
- **[minha escolha]** Cada árvore tem uma saída "equilibrado / nenhum deles" para ninguém ser forçado a um rótulo forte, no espírito do valor neutro que `PoliticalValuesService` já usa.
- A validação na subida recusa: valor sem efeito válido, eixo desconhecido, nó que leva a lugar nenhum, id duplicado.

## Cálculo

No `ScoringService`, o efeito de cada valor escolhido entra como `WeightedScore.add(leftPercent / 100.0, 2.0)` em cada eixo que ele toca, depois das 240 respostas e do arquétipo (como `addArchetypeAnswers` faz com peso 1 hoje). A resposta de arquétipo simples continua com peso 1 nos quizzes de 36 e 60. **[minha escolha]** No quiz de 240 as árvores **substituem** os 5 arquétipos simples (cobrem o mesmo terreno); as perguntas de religião e denominação continuam.

O vetor de 12 valores resultante é a fonte de verdade do resultado e da identidade do acesso pago (o token do relatório é por vetor). Assim recarregar um link não conta os valores de novo.

## Link e chave curta

- O link ganha um parâmetro, por exemplo `f=` em `/results` e `/r` (ver `frontend/src/utils/shortLinks.ts`), que **só serve para mostrar os valores**. O `v=` já carrega o efeito deles; forjar `f=` só mudaria rótulos.
- **[minha escolha]** Formato: um índice por categoria (até 64 valores por categoria = 6 bits), 8 categorias = 48 bits = 6 bytes, em base64url, mais 1 caractere de versão e 1 de verificação: cerca de **10 caracteres**. Não é criptografia (os dados não são secretos e precisam ser decodificados no navegador); é codificação curta. A verificação detecta chave corrompida, e chave inválida cai no comportamento sem chave.
- **Os índices dos valores são estáveis e só crescem**: nunca reordenar nem reutilizar, para links antigos não mudarem de sentido.
- Sem `f=`, ou com `f=` inválida, mostra os valores derivados (comportamento de hoje).
- O backend (`/api/results/by-axes`) aceita a chave e devolve os valores já traduzidos, como devolve `politicalValues` hoje.
- O builder mede quantos módulos o QR ganha com os caracteres a mais.

## Página de resultado

- Com chave válida, `PoliticalValuesSection` mostra os **8 valores declarados** (nome, ícone, descrição, botão "Fonte original"). Sem chave, mostra os valores derivados como hoje.
- Os lugares que usam os valores precisam seguir a mesma regra: cartão de compartilhamento, PDF e relatório pago (`PremiumController` reconstrói o resultado com `request.archetype()` e `variant = "short"`; um campo próprio de valores é necessário para reproduzir o peso 2 e o "o que mais pesou em cada eixo").
- O fluxo de salvar e retomar o progresso (`quizProgress.ts`) e a edição de respostas (`EditAnswersSheet`, `editAnswers.ts`) precisam guardar e permitir refazer as escolhas das árvores.

## Ícones

- **[decisão]** Os ícones podem vir da internet, como no HyperValues, com um botão **"Fonte original"**.
- **[minha escolha]** O botão mostra **autor, licença e link** do arquivo (a atribuição precisa aparecer, e o link sozinho não basta). O registro de cada ícone guarda URL, autor, licença e se foi modificado, no mesmo estilo do registro de fonte de retratos e bandeiras.
- **[minha escolha]** Só entram ícones com licença verificável que permita o uso: domínio público, CC0, CC BY, CC BY-SA, de preferência do Wikimedia Commons. Fora: posts de Reddit, arte de fã e qualquer arquivo sem licença clara, que é boa parte das fontes do HyperValues (Commons, wiki do polcompball, Reddit, entre outras). Valor sem ícone livre recebe um emblema desenhado por nós, sem botão de fonte.
- Exemplo já verificado: `VforVoluntary_normal.svg` é do Commons, CC BY 3.0, autor Nielsio, com uma revisão simplificada de 2013 por outro usuário; exige crédito, link da licença e indicação de modificação.
- Imagens rasterizadas passam por `npm run optimize:images` depois do download.

## Fica para o builder

Estrutura exata do JSON, nomes de classes e endpoints, o teto numérico de influência por eixo e os testes que o garantem, o cálculo do tamanho do QR, a ordem das etapas de implementação, o desenho visual das árvores e dos cartões dos valores, os textos de interface em 4 idiomas, como migrar o progresso salvo.

## Escolhas adicionais depois da revisão do documento (todas **[minha escolha]**)

- **Saída "equilibrado".** É um valor como os outros: ocupa um índice da chave e conta como um dos 8 valores. Ele **não tem efeito nos eixos** (é marcado como neutro no JSON e a validação o dispensa de ter efeito). Sem efeito não entra peso nenhum, então a média do eixo é só a das respostas reais; não puxa o vetor para o centro.
- **Meta de comparabilidade.** Em simulação com perfis sintéticos, as escolhas de valores não deslocam nenhum eixo mais do que ~10 pontos em relação ao vetor só com as 240 respostas. O builder ajusta o teto de eixos por valor para cumprir isso, com teste.
- **Ícones.** Aparecem como vêm da fonte, recortados no círculo com o anel de cor da categoria (como no HyperValues), **sem recolorir**, para não virarem obra derivada. O botão "Fonte original" na ficha do valor mostra autor, licença e link. Uma página de créditos listando todos os ícones, linkada na seção de valores, cobre o cartão de compartilhamento e o PDF. Buscar ícones licenciados (Commons) é uma tarefa à parte, feita valor a valor; o que não tiver ícone livre ganha um emblema próprio no mesmo estilo de círculo. O `ValueCoin` atual (glifo monocromático) continua só nos valores derivados.
- **Cobertura das categorias.** As 8 categorias novas substituem "Imigração" e "Sociedade" do modo derivado. Para não perder nuance: **Cultura** cobre moral e religião; **Nação** cobre imigração e identidade nacional.
- **Entrega.** Tudo ou nada: o motor, o esquema, a validação, a chave e a interface são construídos com uma árvore-semente por categoria, atrás de uma flag, e o conteúdo completo entra depois. Na estreia, português e inglês completos; espanhol e alemão vêm do `sync.py` e, enquanto faltar tradução, caem no inglês (o sistema já faz isso).

## Ponto em aberto (do Enzo)

1. Quem escreve o conteúdo (a árvore, os valores, as descrições e os efeitos nos eixos, 70 a 110 valores): **[minha escolha, a confirmar]** o rascunho completo é feito por Claude para o Enzo revisar por categoria, em vez de o Enzo escrever o esqueleto.
2. **[decisão]** O **cartão de compartilhamento** (e os cartões por seção, como o da bússola) **não muda por enquanto**; fica para o final do trabalho. **[minha escolha]** As telas de **comparação** (`/compare/people`, `ComparePeopleValues`, `PairDetail`) também ficam nos valores derivados nesta primeira versão e entram na mesma etapa final, junto com o formato do link de comparação.

## Ordem de trabalho (decisão do Enzo)

Branch `feat/full-values`. O conteúdo é feito por Claude em levas, **uma categoria por vez**, cada leva com perguntas (árvore), valores, efeitos nos eixos e imagens com fonte; o Enzo revisa antes de seguir. A primeira leva é **Política** (quem governa). Este documento fica versionado só nesta branch (liberado no `.gitignore` de forma temporária) e sai, junto com essa exceção, antes de a branch ir para a main.
