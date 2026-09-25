# Casamento personalidade x ideologia -- catalogo completo

Gerado em 2026-09-25. Calcula a 1a e 2a ideologia mais compativel de cada uma das 333 personalidades do catalogo, usando o algoritmo real de `ProfileMatchScorer.java` (replicado em `profile-audit/compatibility.py`), e sinaliza os pares que fogem do padrao esperado.

## Como ler este relatorio

Tres sinais de alerta, cada um com causa e correcao diferentes:

1. **[COPIA]** -- a ideologia do match no1 tem vetor **identico ou quase identico** (>=11 de 12 eixos) a personalidade que ela declara como representante (`personalityId` em `ideologies.json`). Quando isso acontece, a ideologia nao foi auditada como doutrina -- foi copiada da pessoa. Ela vira um ima que atrai qualquer perfil parecido com aquele individuo especifico, distorcendo o ranking de todo mundo que se aproxima dele. **Correcao: reauditar a ideologia**, nao a personalidade.
2. **[ANACRONISMO]** -- uma personalidade nascida antes de 1800 tem como match no1 uma ideologia formulada depois de 1850. E o padrao ja corrigido em 14 perfis nesta sessao (monarcas virando "fascistas", populistas antigos virando "socialistas"). **Correcao: reauditar a personalidade**, atacando os eixos `imigracao`/`comercio`/`controle`/`diplomacia` (categorias modernas projetadas no passado) ou `economia`/`controle` (clientelismo antigo lido como coletivismo).
3. **[LEGADO]** -- a personalidade nunca passou pela auditoria pergunta-a-pergunta (sem arquivo em `answers/`) e tem um match de alta confianca (>=95%) ou e pre-1800. Vetores legados tendem a ser genericos e colar em mais gente. **Correcao: reauditar a personalidade do zero.**

Uma linha pode ter mais de um sinal.

## Resumo

- **333** personalidades no catalogo, **195** ideologias.
- **18** ideologias sao copia literal de uma personalidade (listadas abaixo) -- a causa mais provavel de qualquer [COPIA].
- **40** personalidades tem uma ideologia-copia como match no1.
- **3** personalidades pre-1800 ainda com ideologia pos-1850 no topo (as 14 ja corrigidas nesta sessao saíram desta lista).
- **89** personalidades sem auditoria pergunta-a-pergunta, com match de alta confianca ou pre-1800.

## Ideologias-copia (causa raiz de boa parte dos [COPIA])

Vetor identico ou quase identico (>=11/12 eixos) a personalidade que a ideologia declara representar. Enquanto essas 18 existirem, vao funcionar como ima de qualquer perfil parecido com o individuo.

| Ideologia | = Personalidade |
|---|---|
| Aceleracionismo de Direita (`aceleracionismo-de-direita`) | Nick Land (`nick-land`) |
| Aristocratismo Nietzschiano (`aristocratismo-nietzschiano`) | Friedrich Nietzsche (`nietzsche`) |
| Comunismo Maoísta (`comunismo-maoista`) | Mao Tsé-Tung (`mao-zedong`) |
| Comunismo Trotskista (`comunismo-trotskista`) | Leon Trótski (`trotsky`) |
| Conservadorismo Paternalista (`conservadorismo-paternalista`) | Benjamin Disraeli (`benjamin-disraeli`) |
| Integralismo Brasileiro (`integralismo-brasileiro`) | Plínio Salgado (`plinio-salgado`) |
| Monarquismo Moderador (`monarquismo-moderador`) | Dom Pedro II (`dom-pedro-ii`) |
| Mutualismo Proudhoniano (`mutualismo-proudhoniano`) | Pierre-Joseph Proudhon (`proudhon`) |
| Nacional-Socialismo (`nacional-socialismo`) | Adolf Hitler (`hitler`) |
| Platonismo (`platonismo`) | Platão (`platao`) |
| Positivismo (`positivismo`) | Auguste Comte (`comte`) |
| Quarta Teoria Política (`quarta-teoria-politica`) | Aleksandr Dugin (`aleksandr-dugin`) |
| Republicanismo Kantiano (`republicanismo-kantiano`) | Immanuel Kant (`immanuel-kant`) |
| Socialismo Denguista (`socialismo-denguista`) | Deng Xiaoping (`deng-xiaoping`) |
| Socialismo Stalinista (`socialismo-stalinista`) | Josef Stálin (`stalin`) |
| Socialismo Titoísta (`socialismo-titoista`) | Josip Broz Tito (`tito`) |
| Socialismo Utópico (`socialismo-utopico`) | Henri de Saint-Simon (`henri-de-saint-simon`) |
| Socratismo (`socratismo`) | Sócrates (`socrates`) |

## Sugestao de reauditoria -- prioridade alta

Personalidades cujo match no1 e uma ideologia-copia **E** a proximidade e muito alta (>=95%) -- sinal mais forte de distorcao. **Exclui a tautologia** de a propria personalidade copiada bater 100% com sua copia (ex.: Kant x Republicanismo Kantiano) -- isso nao e erro, e a definicao da ideologia. O interessante aqui e sempre uma OUTRA pessoa colando na ideologia-copia de alguem.

| Personalidade | Match no1 | % | E copia de |
|---|---|---|---|
| José Antonio Primo de Rivera | Integralismo Brasileiro | 98.9% | Plínio Salgado |
| Carl Schmitt | Integralismo Brasileiro | 98.8% | Plínio Salgado |
| Ruhollah Khomeini | Quarta Teoria Política | 98.5% | Aleksandr Dugin |
| Kim Il-sung | Socialismo Stalinista | 98.5% | Josef Stálin |
| Fidel Castro | Comunismo Maoísta | 97.6% | Mao Tsé-Tung |
| Nicolau II | Integralismo Brasileiro | 97.4% | Plínio Salgado |
| Julius Evola | Integralismo Brasileiro | 97.0% | Plínio Salgado |
| Kim Jong Un | Socialismo Stalinista | 96.7% | Josef Stálin |
| Howard Scott | Positivismo | 95.3% | Auguste Comte |

## Sugestao de reauditoria -- ideologia-copia com proximidade moderada (85-95%)

Ainda um sinal real, mas menos extremo que o bloco acima. Tambem exclui a tautologia da propria personalidade copiada.

| Personalidade | Match no1 | % | E copia de |
|---|---|---|---|
| Luís Carlos Prestes | Comunismo Maoísta | 94.8% | Mao Tsé-Tung |
| Rong Yiren | Positivismo | 94.7% | Auguste Comte |
| Confúcio | Socratismo | 94.5% | Sócrates |
| Peter Thiel | Aceleracionismo de Direita | 94.2% | Nick Land |
| Benjamin Constant | Republicanismo Kantiano | 94.0% | Immanuel Kant |
| János Kádár | Comunismo Maoísta | 93.7% | Mao Tsé-Tung |
| Carlos Magno | Integralismo Brasileiro | 93.4% | Plínio Salgado |
| Jiang Zemin | Socialismo Denguista | 92.5% | Deng Xiaoping |
| Enéas Carneiro | Comunismo Maoísta | 91.9% | Mao Tsé-Tung |
| José Bonifácio | Monarquismo Moderador | 90.5% | Dom Pedro II |
| Theodor Herzl | Monarquismo Moderador | 88.5% | Dom Pedro II |
| Arthur Schopenhauer | Republicanismo Kantiano | 88.0% | Immanuel Kant |

### Auto-match das personalidades copiadas (informativo, nao e erro)

As 18 personalidades cuja propria ideologia-copia bate 100% com elas mesmas -- confirma que a copia e literal, nao indica problema nessas linhas especificamente.

| Personalidade | Ideologia-copia | % |
|---|---|---|
| Adolf Hitler | Nacional-Socialismo | 100.0% |
| Aleksandr Dugin | Quarta Teoria Política | 100.0% |
| Auguste Comte | Positivismo | 99.7% |
| Benjamin Disraeli | Conservadorismo Paternalista | 100.0% |
| Deng Xiaoping | Socialismo Denguista | 100.0% |
| Dom Pedro II | Monarquismo Moderador | 99.2% |
| Friedrich Nietzsche | Aristocratismo Nietzschiano | 100.0% |
| Henri de Saint-Simon | Socialismo Utópico | 100.0% |
| Immanuel Kant | Republicanismo Kantiano | 100.0% |
| Josef Stálin | Socialismo Stalinista | 100.0% |
| Josip Broz Tito | Socialismo Titoísta | 100.0% |
| Leon Trótski | Comunismo Trotskista | 100.0% |
| Mao Tsé-Tung | Comunismo Maoísta | 100.0% |
| Nick Land | Aceleracionismo de Direita | 100.0% |
| Pierre-Joseph Proudhon | Mutualismo Proudhoniano | 100.0% |
| Platão | Platonismo | 100.0% |
| Plínio Salgado | Integralismo Brasileiro | 100.0% |
| Sócrates | Socratismo | 100.0% |

## Sugestao de reauditoria -- anacronismo pre-1800 remanescente

Personalidades nascidas ate 1800 cujo match no1 e uma ideologia formulada depois de 1850. As 14 ja corrigidas nesta sessao nao aparecem aqui.

| Personalidade | Nasc. | Match no1 | % |
|---|---|---|---|
| Carlos Magno | 747 | Integralismo Brasileiro | 93.4% |
| Thomas Hobbes | 1588 | Tecno-Fascismo | 93.4% |
| Maximilien Robespierre | 1758 | Democracia Securitária | 89.2% |

## Sugestao de reauditoria -- vetores legados de maior impacto

Sem `answers/` (nunca passaram pela auditoria de 240 perguntas) e com match de alta confianca (>=95%) -- o caso mais claro de vetor raso que precisa ser refeito do zero.

| Personalidade | Match no1 | % |
|---|---|---|
| Benjamin Disraeli | Conservadorismo Paternalista | 100.0% |
| Adolf Hitler | Nacional-Socialismo | 100.0% |
| Mao Tsé-Tung | Comunismo Maoísta | 100.0% |
| Josip Broz Tito | Socialismo Titoísta | 100.0% |
| Gregor Strasser | Socialismo Strasserista | 99.8% |
| Auguste Comte | Positivismo | 99.7% |
| Noam Chomsky | Sindicalismo | 99.1% |
| Ezra Heywood | Libertarianismo Progressista | 99.1% |
| Robert Nozick | Liberalismo Clássico | 99.1% |
| Daniel Guérin | Socialismo Libertário | 99.0% |
| André Gorz | Sindicalismo | 98.9% |
| José Antonio Primo de Rivera | Integralismo Brasileiro | 98.9% |
| John Rawls | Liberalismo Social | 98.7% |
| Leonard Peikoff | Objetivismo | 98.7% |
| Lysander Spooner | Libertarianismo | 98.7% |
| António de Oliveira Salazar | Falangismo | 98.7% |
| Otto Neurath | Socialismo | 98.6% |
| Benjamin Tucker | Geolibertarianismo | 98.5% |
| Ruhollah Khomeini | Quarta Teoria Política | 98.5% |
| Kim Il-sung | Socialismo Stalinista | 98.5% |
| Ernst Niekisch | Comunismo Nacional | 98.4% |
| Abdullah Öcalan | Zapatismo | 98.2% |
| Nick Srnicek | Socialismo Democrático | 98.2% |
| Bernie Sanders | Socialismo Democrático | 98.0% |
| Getúlio Vargas | Corporativismo | 97.9% |
| Piotr Kropotkin | Socialismo Libertário | 97.9% |
| Arne Næss | Ecologia Profunda | 97.8% |
| Engelbert Dollfuss | Monarquismo Absoluto | 97.8% |
| Samuel Edward Konkin III | Libertarianismo Progressista | 97.8% |
| Roman Dmowski | Nacionalismo Étnico | 97.8% |
| Ferdinand Lassalle | Socialismo Lassalliano | 97.7% |
| Hendrik Verwoerd | Fundamentalismo Religioso | 97.7% |
| Lula da Silva | Progressismo Cristão | 97.7% |
| Otto von Bismarck | Corporativismo | 97.6% |
| Paul Romer | Liberalismo | 97.6% |
| Ron Paul | Paleolibertarianismo | 97.6% |
| Salvador Allende | Socialismo Democrático | 97.5% |
| Gustave de Molinari | Libertarianismo | 97.5% |
| Murray Bookchin | Socialismo Luxemburguista | 97.4% |
| Charles Fourier | Socialismo Luxemburguista | 97.4% |
| Antonio Gramsci | Socialismo Democrático | 97.3% |
| Max More | Libertarianismo | 97.3% |
| Milton Friedman | Neoliberalismo | 97.3% |
| Phil Zimmermann | Liberalismo Verde | 97.3% |
| Émile Armand | Anarquismo | 97.2% |
| Michael Sandel | Comunitarismo | 97.2% |
| Olof Palme | Progressismo | 97.2% |
| Steve Bannon | Conservadorismo Nacional | 97.2% |
| Pol Pot | Socialismo Pol-Potista | 97.1% |
| Anton Pannekoek | Anarco-Progressismo | 97.0% |
| Friedrich List | Nacionalismo | 97.0% |
| G. K. Chesterton | Distributismo | 97.0% |
| Hans-Hermann Hoppe | Libertarianismo Hoppeano | 97.0% |
| Oskar Lange | Socialismo Anticolonial | 97.0% |
| Carlo Rosselli | Socialismo Liberal | 97.0% |
| Ludwig von Mises | Liberalismo Clássico | 96.9% |
| Adrian Wooldridge | Ordoliberalismo | 96.8% |
| Martin Luther King Jr. | Progressismo Cristão | 96.8% |
| Tomáš Garrigue Masaryk | Centrismo Social | 96.8% |
| Keir Hardie | Socialismo Cristão | 96.7% |
| Donald Trump | Direita alternativa | 96.5% |
| John Stuart Mill | Liberalismo Verde | 96.5% |
| Evo Morales | Populismo de Esquerda | 96.4% |
| Emmanuel Macron | Terceira Via | 96.4% |
| Filippo Tommaso Marinetti | Tecno-Fascismo | 96.3% |
| Viktor Orbán | Corporativismo | 96.3% |
| Jacques Maritain | Democracia Cristã | 96.2% |
| Liev Tolstói | Anarquismo Agrário | 96.1% |
| Mohammed bin Salman | Capitalismo Autoritário | 96.0% |
| John Zerzan | Anarco-Naturalismo | 95.9% |
| Thomas Paine | Liberalismo Verde | 95.9% |
| Leonardo Boff | Zapatismo | 95.8% |
| Nicolas de Condorcet | Liberalismo Progressista | 95.8% |
| Irving Kristol | Nacional-Liberalismo | 95.7% |
| Park Chung-hee | Militarismo | 95.5% |
| Theodore Roosevelt | Nacionalismo | 95.5% |
| Ray Kurzweil | Neoliberalismo | 95.4% |
| Buenaventura Durruti | Anarquismo | 95.2% |
| Henry George | Reformismo Georgista | 95.2% |
| Emiliano Zapata | Distributismo | 95.2% |
| William Beveridge | Pragmatismo de Esquerda | 95.1% |
| Mahatma Gandhi | Anarcodistributismo | 95.1% |
| Friedrich Hayek | Liberalismo | 95.0% |
| Konrad Adenauer | Monarquismo Federalista | 95.0% |
| Ludwig Erhard | Liberalismo Conservador | 95.0% |
| Randolph Bourne | Socialismo Individualista | 95.0% |
| Xi Jinping | Tecno-Fascismo | 95.0% |

## Tabela completa -- 1a e 2a ideologia mais compativel de todas as 333 personalidades

Ordenada alfabeticamente por id. `sim` = ja auditada pergunta-a-pergunta; `legado` = vetor nunca auditado no processo atual.

| Personalidade | Nasc. | Auditada | 1a ideologia | % | 2a ideologia | % | Alertas |
|---|---|---|---|---|---|---|---|
| Abraham Lincoln | 1809–1865 | sim | Nacionalismo | 91.0 | Democracia Nacional | 90.6 |  |
| Adam Smith | 1723–1790 | sim | Capitalismo | 93.9 | Federalismo | 91.7 |  |
| Adrian Wooldridge | 1959– | legado | Ordoliberalismo | 96.8 | Meritocracia | 96.4 | legado |
| Agostinho de Hipona | 354–430 | sim | Catolicismo | 92.4 | Monarquismo Moderador | 86.5 |  |
| Ahad Haam | 1856–1927 | legado | Distributismo | 89.2 | Ecoconservadorismo | 88.6 | legado |
| Al Gore | 1948– | legado | Centrismo Ambientalista | 94.3 | Liberalismo de Estado | 93.5 | legado |
| Alberto Fujimori | 1938–2024 | sim | Tecnocracia Liberal | 94.8 | Liberalismo Autoritário | 93.9 |  |
| Aldo Leopold | 1887-1948 | legado | Ambientalismo | 93.3 | Social-Democracia | 92.7 | legado |
| Aleksandr Dugin | 1962– | sim | Quarta Teoria Política | 100.0 | Falangismo | 98.0 | COPIA |
| Alex Karp | 1967– | sim | Tecnocracia de Direita | 93.7 | Mercantilismo | 90.7 |  |
| Alexander Hamilton | 1755–1804 | sim | Nacionalismo | 98.3 | Mercantilismo | 96.1 |  |
| Alexandre de Moraes | 1968– | sim | Terceira Via | 92.7 | Social-Democracia Nórdica | 92.5 |  |
| Alexandre, o Grande | 356–323 a.C. | sim | Imperialismo Pluralista | 90.2 | Militarismo | 87.7 |  |
| Salvador Allende | 1908–1973 | legado | Socialismo Democrático | 97.5 | Socialismo | 96.8 | legado |
| Anders Fogh Rasmussen | 1953– | sim | Terceira Via | 94.9 | Centrismo Liberal | 93.5 |  |
| André Gorz | 1923–2007 | legado | Sindicalismo | 98.9 | Indigenismo | 98.9 | legado |
| Anton Pannekoek | 1873-1960 | legado | Anarco-Progressismo | 97.0 | Socialismo Luxemburguista | 96.7 | legado |
| Aristóteles | 384–322 a.C. | sim | Aristotelismo | 97.2 | Imperialismo Federalista | 91.4 |  |
| Arne Næss | 1912–2009 | legado | Ecologia Profunda | 97.8 | Indigenismo | 97.7 | legado |
| Arthur Schopenhauer | 1788–1860 | sim | Republicanismo Kantiano | 88.0 | Monarquismo Financeiro | 81.5 | COPIA |
| Mustafa Kemal Atatürk | 1881–1938 | legado | Desenvolvimentismo de Estado | 93.3 | Positivismo | 91.7 | legado |
| Augusto Pinochet | 1915–2006 | sim | Capitalismo Autoritário | 91.9 | Tecno-Monarquismo | 88.2 |  |
| Mikhail Bakunin | 1814–1876 | sim | Anarquismo | 97.7 | Anarco-Progressismo | 97.3 |  |
| Barack Obama | 1961– | sim | Liberalismo de Estado | 95.1 | Centrismo Social | 94.6 |  |
| Barão de Mauá | 1813–1889 | sim | Liberal-Desenvolvimentismo | 91.5 | Liberalismo Conservador | 91.3 |  |
| Barão do Rio Branco | 1845–1912 | sim | Tecnocracia Liberal | 96.2 | Pragmatismo de Direita | 94.9 |  |
| Bashar al-Assad | 1965– | sim | Militarismo | 94.8 | Corporativismo | 93.9 |  |
| Frédéric Bastiat | 1801–1850 | legado | Neoliberalismo | 94.0 | Populismo Libertário | 93.4 | legado |
| Benjamin Constant | 1767–1830 | sim | Republicanismo Kantiano | 94.0 | Meritocracia | 94.0 | COPIA |
| Benjamin Disraeli | 1804–1881 | legado | Conservadorismo Paternalista | 100.0 | Nacionalismo Cultural | 96.0 | COPIA, legado |
| Benjamin Franklin | 1706–1790 | sim | Federalismo | 93.6 | Centrismo Liberal | 93.1 |  |
| Benjamin Netanyahu | 1949– | sim | Nacional-Liberalismo | 95.3 | Neoconservadorismo | 94.3 |  |
| Benjamin Tucker | 1854–1939 | legado | Geolibertarianismo | 98.5 | Libertarianismo Progressista | 97.8 | legado |
| Bernie Sanders | 1941– | legado | Socialismo Democrático | 98.0 | Ambientalismo | 97.2 | legado |
| William Beveridge | 1879–1963 | legado | Pragmatismo de Esquerda | 95.1 | Liberalismo Jacobino | 93.7 | legado |
| Bill Clinton | 1946– | sim | Centrismo Liberal | 93.9 | Pragmatismo | 93.4 |  |
| Bill Gates | 1955– | sim | Ordoliberalismo | 97.0 | Liberalismo Progressista | 94.6 |  |
| Otto von Bismarck | 1815–1898 | legado | Corporativismo | 97.6 | Nacionalismo | 94.5 | legado |
| Murray Bookchin | 1921–2006 | legado | Socialismo Luxemburguista | 97.4 | Sindicalismo | 96.2 | legado |
| B. R. Ambedkar | 1891–1956 | sim | Socialismo de Mercado | 97.5 | Social-Democracia | 95.9 |  |
| Luiz Carlos Bresser-Pereira | 1934– | sim | Liberalismo de Estado | 97.5 | Pragmatismo de Esquerda | 97.1 |  |
| Martin Buber | 1878–1965 | legado | Anarcodistributismo | 93.7 | Anarquismo Cristão | 93.4 | legado |
| Carl Menger | 1840–1921 | sim | Liberal-Desenvolvimentismo | 90.6 | Liberalismo Conservador | 90.0 |  |
| Carl Schmitt | 1888–1985 | sim | Integralismo Brasileiro | 98.8 | Teocratismo Cristão | 97.8 | COPIA |
| Carlos Lacerda | 1914–1977 | sim | Neoconservadorismo | 94.9 | Conservadorismo | 94.3 |  |
| Carlos Magno | 747–814 | sim | Integralismo Brasileiro | 93.4 | Eurasianismo | 93.2 | COPIA, ANACRONISMO |
| Humberto Castelo Branco | 1897–1967 | sim | Capitalismo Autoritário | 95.0 | Aceleracionismo Cristão | 91.7 |  |
| Celso Furtado | 1920–2004 | sim | Socialismo de Mercado | 97.2 | Populismo de Esquerda | 96.9 |  |
| César Augusto | 63 a.C.–14 d.C. | sim | Militarismo | 94.0 | Corporativismo | 93.6 |  |
| Charles Darwin | 1809–1882 | sim | Centrismo Ambientalista | 93.6 | Centrismo Liberal | 92.4 |  |
| Charles de Gaulle | 1890–1970 | sim | Nacionalismo | 97.7 | Trabalhismo de Direita | 97.5 |  |
| Charles Fourier | 1772-1837 | legado | Socialismo Luxemburguista | 97.4 | Libertarianismo Social | 96.2 | legado |
| Charles III | 1948–presente | sim | Ecoconservadorismo | 90.5 | Democracia Cristã | 89.6 |  |
| Charlie Kirk | 1993–2025 | sim | Conservadorismo Americano | 94.9 | Libertarianismo Nacional | 91.3 |  |
| Che Guevara | 1928–1967 | sim | Marxismo-Leninismo | 98.0 | Comunismo Maoísta | 94.2 |  |
| Chiang Kai-shek | 1887–1975 | sim | Militarismo | 98.0 | Imperialismo | 97.6 |  |
| Noam Chomsky | 1928– | legado | Sindicalismo | 99.1 | Socialismo Luxemburguista | 98.0 | legado |
| Cícero | 106–43 a.C. | sim | Conservadorismo | 96.5 | Neoconservadorismo | 94.2 |  |
| Ciro Gomes | 1957– | sim | Nacional-Desenvolvimentismo | 95.0 | Trabalhismo | 94.2 |  |
| Auguste Comte | 1798–1857 | legado | Positivismo | 99.7 | Desenvolvimentismo de Estado | 96.1 | COPIA, legado |
| Confúcio | 551–479 a.C. | sim | Socratismo | 94.5 | Confucionismo | 94.1 | COPIA |
| Curtis Yarvin | 1973– | sim | Neorreacionarismo | 98.0 | Aceleracionismo de Direita | 93.7 |  |
| Dalai Lama (Tenzin Gyatso) | 1935– | sim | Anarquismo Cristão | 94.6 | Socialismo Cristão | 91.4 |  |
| Daniel Guérin | 1904-1988 | legado | Socialismo Libertário | 99.0 | Anarcocomunismo | 99.0 | legado |
| David Ricardo | 1772–1823 | sim | Reformismo Georgista | 93.6 | Liberalismo Verde | 91.4 |  |
| Deng Xiaoping | 1904–1997 | sim | Socialismo Denguista | 100.0 | Tecnocracia de Direita | 92.1 | COPIA |
| Marechal Deodoro da Fonseca | 1827–1892 | sim | Militarismo | 94.7 | Nacionalismo | 93.7 |  |
| Dom Manuel I | 1469–1521 | sim | Monarquismo Absoluto | 97.5 | Conservadorismo Autoritário | 96.7 |  |
| Dom Pedro I | 1798–1834 | sim | Estoicismo | 89.2 | Capitalismo Autoritário | 88.2 |  |
| Dom Pedro II | 1825–1891 | sim | Monarquismo Moderador | 99.2 | Conservadorismo Paternalista | 93.6 | COPIA |
| Domenico Losurdo | 1941–2018 | sim | Socialismo de Estado | 92.8 | Socialismo Anticolonial | 92.8 |  |
| Dominik Tarczyński | 1979– | sim | Conservadorismo Nacional | 95.4 | Populismo de Direita | 95.1 |  |
| Donald Trump | 1946– | legado | Direita alternativa | 96.5 | Populismo de Direita | 96.2 | legado |
| Buenaventura Durruti | 1896–1936 | legado | Anarquismo | 95.2 | Anarco-Progressismo | 94.6 | legado |
| Dwight D. Eisenhower | 1890–1969 | sim | Centrismo Conservador | 96.2 | Pragmatismo de Direita | 95.1 |  |
| Edmund Burke | 1729–1797 | sim | Conservadorismo | 93.6 | Conservadorismo Americano | 93.0 |  |
| Eduard Bernstein | 1850–1932 | sim | Progressismo | 95.2 | Socialismo de Mercado | 94.9 |  |
| Eduardo Leite | 1985– | sim | Liberalismo | 96.7 | Ordoliberalismo | 96.5 |  |
| Elon Musk | 1971– | legado | Capitalismo | 92.0 | Liberalismo Aristocrático | 91.3 | legado |
| Émile Armand | 1872-1962 | legado | Anarquismo | 97.2 | Socialismo Individualista | 96.6 | legado |
| Emílio Garrastazu Médici | 1905–1985 | sim | Conservadorismo Autoritário | 97.5 | Nacionalismo Étnico | 97.3 |  |
| Enéas Carneiro | 1938–2007 | sim | Comunismo Maoísta | 91.9 | Comunismo Nacional | 91.6 | COPIA |
| Engelbert Dollfuss | 1892–1934 | legado | Monarquismo Absoluto | 97.8 | Fascismo | 97.7 | legado |
| Ernest Renan | 1823–1892 | legado | Centrismo Ambientalista | 91.7 | Ordoliberalismo | 91.3 | legado |
| Ernesto Geisel | 1907–1996 | sim | Corporativismo | 95.9 | Autoritarismo Modernizador | 94.4 |  |
| Ernst Niekisch | 1889–1967 | legado | Comunismo Nacional | 98.4 | Fascismo Vermelho | 96.8 | legado |
| Errico Malatesta | 1853–1932 | sim | Anarquismo | 99.2 | Anarco-Progressismo | 96.8 |  |
| Baruch Espinosa | 1632–1677 | sim | Liberalismo Verde | 97.2 | Liberalismo | 97.2 |  |
| Evo Morales | 1959– | legado | Populismo de Esquerda | 96.4 | Progressismo Cristão | 93.8 | legado |
| Ezra Heywood | 1829-1893 | legado | Libertarianismo Progressista | 99.1 | Criptoanarquismo | 97.9 | legado |
| Ferdinand Lassalle | 1825–1864 | legado | Socialismo Lassalliano | 97.7 | Nacional-Desenvolvimentismo | 88.8 | legado |
| Fernando Haddad | 1963– | sim | Socialismo de Mercado | 96.5 | Progressismo | 96.4 |  |
| Fernando Henrique Cardoso | 1931– | sim | Meritocracia | 97.8 | Ordoliberalismo | 96.5 |  |
| Fidel Castro | 1926–2016 | sim | Comunismo Maoísta | 97.6 | Comunismo Nacional | 94.9 | COPIA |
| Filipe II da Espanha | 1527–1598 | sim | Teocratismo Cristão | 97.3 | Integralismo Brasileiro | 97.3 |  |
| Flávio Bolsonaro | 1981– | sim | Populismo de Direita | 95.7 | Conservadorismo Americano | 94.9 |  |
| Michel Foucault | 1926–1984 | sim | Socialismo Libertário | 97.9 | Anarquismo | 97.9 |  |
| Francisco Franco | 1892–1975 | sim | Falangismo | 98.1 | Reacionarismo | 97.9 |  |
| Franklin D. Roosevelt | 1882–1945 | sim | Nacional-Desenvolvimentismo | 93.6 | Democracia Nacional | 93.4 |  |
| Frantz Fanon | 1925–1961 | sim | Socialismo de Mercado | 95.7 | Populismo de Esquerda | 92.4 |  |
| Franz Ferdinand | 1863–1914 | sim | Imperialismo Federalista | 95.1 | Aristotelismo | 91.8 |  |
| Frederico, o Grande | 1712–1786 | legado | Militarismo | 93.6 | Imperialismo | 91.3 | legado |
| Friedrich Engels | 1820–1895 | sim | Socialismo Marxista | 95.0 | Aceleracionismo de Esquerda | 94.9 |  |
| Friedrich List | 1789–1846 | legado | Nacionalismo | 97.0 | Mercantilismo | 94.8 | legado |
| Garrett Hardin | 1915–2003 | legado | Socratismo | 81.6 | Liberalismo Jacobino | 79.9 | COPIA, legado |
| Genghis Khan | c. 1162–1227 | sim | Imperialismo Pluralista | 94.6 | Tecno-Monarquismo | 90.9 |  |
| George Soros | 1930– | sim | Liberalismo Verde | 96.3 | Liberalismo Progressista | 95.4 |  |
| George W. Bush | 1946– | sim | Nacional-Liberalismo | 92.3 | Neoconservadorismo | 92.2 |  |
| George Washington | 1732–1799 | sim | Centrismo Conservador | 92.0 | Pacifismo Militar | 91.9 |  |
| Geraldo Alckmin | 1952– | sim | Democracia Cristã | 92.6 | Centrismo | 91.8 |  |
| Getúlio Vargas | 1882–1954 | legado | Corporativismo | 97.9 | Nacional-Sindicalismo | 94.4 | legado |
| G. K. Chesterton | 1874–1936 | legado | Distributismo | 97.0 | Paleoconservadorismo | 93.4 | legado |
| Barry Goldwater | 1909–1998 | sim | Militarismo Libertário | 97.0 | Objetivismo | 91.2 |  |
| Antonio Gramsci | 1891–1937 | legado | Socialismo Democrático | 97.3 | Socialismo | 96.8 | legado |
| Gregor Strasser | 1892–1934 | legado | Socialismo Strasserista | 99.8 | Nacional-Bolchevismo (NazBol) | 96.1 | legado |
| Guilherme Boulos | 1982– | sim | Progressismo | 97.8 | Socialismo Democrático | 96.5 |  |
| Guillaume Faye | 1949–2019 | sim | Arqueofuturismo | 98.6 | Capitalismo Nacional | 96.3 |  |
| Gustave de Molinari | 1819–1912 | legado | Libertarianismo | 97.5 | Populismo Libertário | 97.4 | legado |
| H. L. Mencken | 1880–1956 | sim | Tecno-Comercialismo | 93.5 | Liberalismo Clássico | 90.1 |  |
| Hal Finney | 1956–2014 | sim | Liberalismo Clássico | 99.0 | Minarquismo | 96.9 |  |
| Harry S. Truman | 1884–1972 | sim | Atlantismo | 87.4 | Democracia Securitária | 87.3 |  |
| Friedrich Hayek | 1899–1992 | legado | Liberalismo | 95.0 | Capitalismo | 94.6 | legado |
| Georg Wilhelm Friedrich Hegel | 1770–1831 | sim | Nacionalismo | 97.3 | Mercantilismo | 94.9 |  |
| Hendrik Verwoerd | 1901–1966 | legado | Fundamentalismo Religioso | 97.7 | Nacionalismo Étnico | 97.3 | legado |
| Henri de Saint-Simon | 1760–1825 | sim | Socialismo Utópico | 100.0 | Socialismo Marxista | 93.4 | COPIA |
| Henry Ford | 1863–1947 | sim | Conservadorismo Cristão | 89.9 | Conservadorismo Nacional | 87.0 |  |
| Henry George | 1839–1897 | legado | Reformismo Georgista | 95.2 | Federalismo | 92.6 | legado |
| Hirohito | 1901–1989 | sim | Monarquismo Absoluto | 98.8 | Conservadorismo Autoritário | 98.6 |  |
| Adolf Hitler | 1889–1945 | legado | Nacional-Socialismo | 100.0 | Fascismo | 98.5 | COPIA, legado |
| Ho Chi Minh | 1890–1969 | sim | Socialismo de Estado | 94.8 | Comunismo Maoísta | 94.7 |  |
| Thomas Hobbes | 1588–1679 | sim | Tecno-Fascismo | 93.4 | Tecno-Monarquismo | 93.3 | ANACRONISMO |
| Hans-Hermann Hoppe | 1949– | legado | Libertarianismo Hoppeano | 97.0 | Monarquismo Libertário | 93.8 | legado |
| Howard Scott | 1890–1970 | sim | Positivismo | 95.3 | Tecnocracia de Esquerda | 94.9 | COPIA |
| Hu Jintao | 1942– | sim | Autoritarismo Modernizador | 93.7 | Socialismo Denguista | 93.0 |  |
| Hugo Chávez | 1954–2013 | sim | Socialismo Bolivariano | 98.0 | Conservadorismo Socialista | 91.7 |  |
| Immanuel Kant | 1724–1804 | sim | Republicanismo Kantiano | 100.0 | Ecocapitalismo | 88.7 | COPIA |
| Irving Kristol | 1920–2009 | legado | Nacional-Liberalismo | 95.7 | Neoconservadorismo | 94.6 | legado |
| Isaiah Berlin | 1909–1997 | sim | Republicanismo | 95.0 | Liberalismo Verde | 95.0 |  |
| Zeev Jabotinsky | 1880–1940 | legado | Socialismo Lassalliano | 91.4 | Nacionalismo | 86.1 | legado |
| Jack Ma | 1964– | sim | Tecnocracia Liberal | 96.5 | Pragmatismo de Direita | 90.5 |  |
| Jair Bolsonaro | 1955– | sim | Direita alternativa | 94.3 | Populismo de Direita | 94.1 |  |
| James Lovelock | 1919–2022 | sim | Tecnocracia | 96.6 | Pragmatismo | 93.0 |  |
| James Madison | 1751–1836 | sim | Federalismo | 92.3 | Centrismo Liberal | 91.4 |  |
| János Kádár | 1912–1989 | sim | Comunismo Maoísta | 93.7 | Socialismo de Estado | 92.7 | COPIA |
| Javier Milei | 1970– | legado | Monarquismo Libertário | 94.4 | Conservadorismo Libertário | 93.7 | legado |
| JD Vance | 1984– | sim | Direita alternativa | 97.1 | Populismo de Direita | 95.9 |  |
| Jean-Paul Sartre | 1905–1980 | sim | Socialismo Luxemburguista | 98.3 | Sindicalismo | 97.6 |  |
| Jeff Bezos | 1964– | sim | Ordoliberalismo | 92.2 | Progressismo de Direita | 92.1 |  |
| Jensen Huang | 1963– | sim | Ordoliberalismo | 96.1 | Meritocracia | 95.8 |  |
| Jeremy Corbyn | 1949– | sim | Sindicalismo | 98.8 | Ecossocialismo | 98.6 |  |
| Jiang Zemin | 1926–2022 | sim | Socialismo Denguista | 92.5 | Autoritarismo Modernizador | 90.7 | COPIA |
| João Calvino | 1509–1564 | sim | Monarquismo Federalista | 93.8 | Aristotelismo | 90.2 |  |
| João Doria | 1957– | sim | Meritocracia | 93.8 | Ordoliberalismo | 93.3 |  |
| João Goulart | 1919–1976 | sim | Trabalhismo Cristão | 95.3 | Trabalhismo | 94.4 |  |
| Joe Biden | 1942– | sim | Centrismo Social | 91.8 | Centrismo | 89.9 |  |
| John F. Kennedy | 1917–1963 | sim | Terceira Via | 91.3 | Atlantismo | 90.2 |  |
| John Locke | 1632–1704 | sim | Centrismo Liberal | 95.0 | Federalismo | 93.2 |  |
| John McAfee | 1945–2021 | sim | Libertarianismo | 98.6 | Geolibertarianismo | 97.5 |  |
| John Rawls | 1921–2002 | legado | Liberalismo Social | 98.7 | Social-Democracia | 98.4 | legado |
| John Stuart Mill | 1806–1873 | legado | Liberalismo Verde | 96.5 | Liberalismo | 93.6 | legado |
| John Zerzan | 1943– | legado | Anarco-Naturalismo | 95.9 | Zapatismo | 94.6 | legado |
| Jordan Peterson | 1962– | sim | Conservadorismo | 95.5 | Conservadorismo Cristão | 94.6 |  |
| José Antonio Primo de Rivera | 1903–1936 | legado | Integralismo Brasileiro | 98.9 | Teocratismo Cristão | 98.8 | COPIA, legado |
| José Bonifácio | 1763–1838 | sim | Monarquismo Moderador | 90.5 | Socialismo Denguista | 90.0 | COPIA |
| José Bové | 1953– | sim | Ecologia Profunda | 98.4 | Indigenismo | 97.8 |  |
| José Dirceu | 1946– | sim | Socialismo | 96.1 | Socialismo de Mercado | 94.9 |  |
| José Mujica | 1935–2025 | sim | Ambientalismo | 97.3 | Progressismo | 96.9 |  |
| Joseph de Maistre | 1753–1821 | sim | Neotomismo | 92.7 | Eurasianismo | 92.6 |  |
| Joseph Goebbels | 1897–1945 | sim | Fascismo Vermelho | 95.6 | Tecno-Fascismo | 95.4 |  |
| Joseph Schumpeter | 1883–1950 | sim | Liberalismo Aristocrático | 94.8 | Pragmatismo de Direita | 90.8 |  |
| J. R. R. Tolkien | 1892–1973 | sim | Distributismo | 92.2 | Anarcodistributismo | 89.8 |  |
| Júlio César | 100 a.C.–44 a.C. | sim | Militarismo | 98.1 | Imperialismo | 97.8 |  |
| Julius Evola | 1898–1974 | sim | Integralismo Brasileiro | 97.0 | Teocratismo Cristão | 96.0 | COPIA |
| Julius Nyerere | 1922–1999 | sim | Conservadorismo Socialista | 95.4 | Socialismo Bolivariano | 93.5 |  |
| Juscelino Kubitschek | 1902–1976 | sim | Monarquismo Constitucional | 94.2 | Trabalhismo | 92.8 |  |
| Justin Trudeau | 1971– | sim | Socialismo Liberal | 97.4 | Liberalismo Social | 96.8 |  |
| Justiniano I | 482–565 | sim | Teocratismo Cristão | 95.6 | Integralismo Brasileiro | 94.7 |  |
| Karl Liebknecht | 1871–1919 | sim | Comunismo | 98.7 | Aceleracionismo de Esquerda | 96.8 |  |
| Karl Marx | 1818–1883 | sim | Socialismo Marxista | 97.4 | Socialismo Utópico | 95.5 |  |
| Karl Polanyi | 1886–1964 | sim | Ambientalismo | 97.7 | Progressismo Cristão | 95.9 |  |
| Keir Hardie | 1856–1915 | legado | Socialismo Cristão | 96.7 | Trabalhismo Cristão | 96.6 | legado |
| John Maynard Keynes | 1883–1946 | sim | Social-Democracia | 96.0 | Nacionalismo Cívico | 96.0 |  |
| Ruhollah Khomeini | 1900–1989 | legado | Quarta Teoria Política | 98.5 | Fundamentalismo Religioso | 98.5 | COPIA, legado |
| Kim Il-sung | 1912–1994 | legado | Socialismo Stalinista | 98.5 | Fascismo Vermelho | 95.2 | COPIA, legado |
| Kim Jong Un | 1984– | sim | Socialismo Stalinista | 96.7 | Fascismo Vermelho | 96.3 | COPIA |
| Henry Kissinger | 1923–2023 | legado | Conservadorismo Secular | 94.4 | Neoconservadorismo | 93.1 | legado |
| Samuel Edward Konkin III | 1947–2004 | legado | Libertarianismo Progressista | 97.8 | Libertarianismo | 97.3 | legado |
| Konrad Adenauer | 1876–1967 | legado | Monarquismo Federalista | 95.0 | Conservadorismo | 92.1 | legado |
| Piotr Kropotkin | 1842–1921 | legado | Socialismo Libertário | 97.9 | Anarcocomunismo | 97.5 | legado |
| Lázaro Cárdenas | 1895–1970 | sim | Socialismo Anticolonial | 97.4 | Populismo de Esquerda | 92.2 |  |
| Lee Kuan Yew | 1923–2015 | sim | Liberalismo Autoritário | 93.5 | Tecnocracia Liberal | 93.3 |  |
| Lee Teng-hui | 1923–2020 | sim | Liberal-Desenvolvimentismo | 94.6 | Atlantismo | 91.9 |  |
| Vladimir Lênin | 1870–1924 | sim | Marxismo-Leninismo | 99.0 | Socialismo de Estado | 97.3 |  |
| Leon Kass | 1939– | legado | Monarquismo Federalista | 94.4 | Ecoconservadorismo | 91.6 | legado |
| Leonard Peikoff | 1933- | legado | Objetivismo | 98.7 | Neoliberalismo | 92.6 | legado |
| Leonardo Boff | 1938– | legado | Zapatismo | 95.8 | Socialismo Cristão | 95.2 | legado |
| Leonel Brizola | 1922–2004 | sim | Socialismo de Mercado | 94.6 | Populismo de Esquerda | 93.9 |  |
| Luís XIV | 1638–1715 | sim | Monarquismo Absoluto | 96.2 | Integralismo Brasileiro | 95.5 |  |
| Ludwig Erhard | 1897–1977 | legado | Liberalismo Conservador | 95.0 | Liberal-Desenvolvimentismo | 92.7 | legado |
| Luís Carlos Prestes | 1898–1990 | sim | Comunismo Maoísta | 94.8 | Socialismo de Estado | 94.7 | COPIA |
| Lula da Silva | 1945– | legado | Progressismo Cristão | 97.7 | Populismo de Esquerda | 97.7 | legado |
| Lysander Spooner | 1808–1887 | legado | Libertarianismo | 98.7 | Geolibertarianismo | 97.7 | legado |
| Emmanuel Macron | 1977– | legado | Terceira Via | 96.4 | Democracia Securitária | 94.7 | legado |
| Mahatma Gandhi | 1869–1948 | legado | Anarcodistributismo | 95.1 | Distributismo | 93.3 | legado |
| Malcolm X | 1925–1965 | sim | Distributismo | 92.6 | Trabalhismo | 91.5 |  |
| Carl Gustaf Emil Mannerheim | 1867–1951 | sim | Conservadorismo | 94.2 | Nacionalismo | 93.9 |  |
| Mao Tsé-Tung | 1893–1976 | legado | Comunismo Maoísta | 100.0 | Socialismo de Estado | 96.8 | COPIA, legado |
| Nicolau Maquiavel | 1469–1527 | sim | Mercantilismo | 95.1 | Nacionalismo | 94.0 |  |
| Marco Aurélio | 121–180 | sim | Estoicismo | 93.0 | Imperialismo Pluralista | 88.2 |  |
| Marco Rubio | 1971– | sim | Conservadorismo Americano | 95.3 | Direita alternativa | 92.3 |  |
| Marcus Garvey | 1887–1940 | sim | Conservadorismo Nacional | 95.7 | Democracia Nacional | 94.0 |  |
| Filippo Tommaso Marinetti | 1876–1944 | legado | Tecno-Fascismo | 96.3 | Tecno-Monarquismo | 94.0 | legado |
| Mário Covas | 1930–2001 | sim | Centrismo | 94.7 | Centrismo Social | 94.4 |  |
| Jacques Maritain | 1882–1973 | legado | Democracia Cristã | 96.2 | Distributismo | 92.6 | legado |
| Mark Zuckerberg | 1984– | sim | Progressismo de Direita | 92.6 | Autoritarismo Libertário | 91.8 |  |
| Martin Heidegger | 1889–1976 | sim | Ecofascismo | 97.6 | Integralismo Brasileiro | 91.6 |  |
| Martin Luther King Jr. | 1929–1968 | legado | Progressismo Cristão | 96.8 | Trabalhismo Cristão | 96.7 | legado |
| Martinho Lutero | 1483–1546 | sim | Neotomismo | 94.3 | Aristotelismo | 92.1 |  |
| Tomáš Garrigue Masaryk | 1850–1937 | legado | Centrismo Social | 96.8 | Centrismo | 95.9 | legado |
| Matteo Salvini | 1973– | sim | Conservadorismo Cristão | 96.0 | Conservadorismo | 95.7 |  |
| Max More | 1964– | legado | Libertarianismo | 97.3 | Liberalismo Clássico | 97.3 | legado |
| Max Stirner | 1806–1856 | sim | Neoliberalismo | 93.5 | Libertarianismo Bleeding-Heart | 92.3 |  |
| Max Weber | 1864–1920 | sim | Mercantilismo | 93.3 | Tecnocracia de Direita | 91.0 |  |
| Maximilien Robespierre | 1758–1794 | sim | Democracia Securitária | 89.2 | Terceira Via | 86.6 | ANACRONISMO |
| Michael Sandel | 1953– | legado | Comunitarismo | 97.2 | Progressismo Cristão | 93.4 | legado |
| Michel Temer | 1940– | sim | Pragmatismo de Direita | 96.4 | Centrismo Conservador | 93.7 |  |
| Mikhail Gorbachev | 1931–2022 | sim | Pragmatismo de Esquerda | 90.9 | Trabalhismo Cristão | 90.8 |  |
| Milton Friedman | 1912–2006 | legado | Neoliberalismo | 97.3 | Minarquismo | 96.7 | legado |
| Ludwig von Mises | 1881–1973 | legado | Liberalismo Clássico | 96.9 | Minarquismo | 96.4 | legado |
| Mohammed bin Salman | 1985– | legado | Capitalismo Autoritário | 96.0 | Imperialismo | 95.8 | legado |
| Montesquieu | 1689–1755 | legado | Centrismo Conservador | 93.5 | Centrismo Liberal | 93.1 | legado |
| Muammar Gaddafi | 1942–2011 | sim | Eurasianismo | 94.9 | Corporativismo | 94.2 |  |
| Benito Mussolini | 1883–1945 | sim | Fascismo | 98.8 | Nacional-Socialismo | 97.5 |  |
| Napoleão Bonaparte | 1769–1821 | sim | Militarismo | 93.3 | Imperialismo | 92.8 |  |
| Napoleão III | 1808–1873 | sim | Capitalismo Autoritário | 94.6 | Tecno-Monarquismo | 91.5 |  |
| Nathaniel Branden | 1930–2014 | sim | Neoliberalismo | 97.1 | Objetivismo | 96.5 |  |
| Nayib Bukele | 1981– | legado | Tecnocracia Liberal | 94.4 | Capitalismo Autoritário | 93.4 | legado |
| Nelson Mandela | 1918–2013 | sim | Pragmatismo de Esquerda | 96.6 | Progressismo Cristão | 96.5 |  |
| Nick Fuentes | 1998– | sim | Teocratismo Cristão | 92.9 | Platonismo | 91.4 |  |
| Nick Land | 1962– | sim | Aceleracionismo de Direita | 100.0 | Neorreacionarismo | 90.2 | COPIA |
| Nicolas de Condorcet | 1743-1794 | legado | Liberalismo Progressista | 95.8 | Ordoliberalismo | 95.2 | legado |
| Nicolás Maduro | 1962– | sim | Socialismo Bolivariano | 93.8 | Conservadorismo Socialista | 90.7 |  |
| Nicolau II | 1868–1918 | sim | Integralismo Brasileiro | 97.4 | Fundamentalismo Religioso | 97.4 | COPIA |
| Friedrich Nietzsche | 1844–1900 | sim | Aristocratismo Nietzschiano | 100.0 | Tecno-Comercialismo | 84.9 | COPIA |
| Nikolas Ferreira | 1996– | sim | Liberalismo Conservador | 92.7 | Centrismo Conservador | 90.9 |  |
| Abdullah Öcalan | 1949– | legado | Zapatismo | 98.2 | Indigenismo | 97.9 | legado |
| Olavo de Carvalho | 1947–2022 | sim | Nacional-Liberalismo | 95.4 | Conservadorismo | 93.7 |  |
| Olof Palme | 1927–1986 | legado | Progressismo | 97.2 | Socialismo Liberal | 96.1 | legado |
| George Orwell | 1903–1950 | legado | Ambientalismo | 93.5 | Republicanismo | 92.5 | legado |
| Oskar Lange | 1904–1965 | legado | Socialismo Anticolonial | 97.0 | Tecnocracia de Esquerda | 96.3 | legado |
| Otto Neurath | 1882–1945 | legado | Socialismo | 98.6 | Tecnocracia de Esquerda | 97.2 | legado |
| Otto von Habsburg | 1912–2011 | legado | Monarquismo Federalista | 92.9 | Federalismo | 91.8 | legado |
| Papa Francisco | 1936–2025 | sim | Trabalhismo Cristão | 96.2 | Democracia Cristã | 95.0 |  |
| Papa Leão XIII | 1810–1903 | sim | Catolicismo | 95.8 | Neotomismo | 92.8 |  |
| Papa Leão XIV | 1955– | sim | Democracia Cristã | 96.6 | Ecoconservadorismo | 93.5 |  |
| Papa Pio IX | 1792–1878 | sim | Teocratismo Cristão | 93.6 | Platonismo | 93.0 |  |
| Park Chung-hee | 1917–1979 | legado | Militarismo | 95.5 | Tecno-Monarquismo | 95.4 | legado |
| Paul Romer | 1955– | legado | Liberalismo | 97.6 | Liberalismo Verde | 96.6 | legado |
| São Paulo (Paulo de Tarso) | c. 5–c. 67 | sim | Catolicismo | 85.8 | Monarquismo Moderador | 84.0 |  |
| Paulo Guedes | 1949– | sim | Capitalismo | 97.2 | Liberalismo | 97.0 |  |
| Pedro, o Grande | 1672–1725 | sim | Imperialismo Pluralista | 92.2 | Tecno-Monarquismo | 89.0 |  |
| Pedro Sánchez | 1972– | sim | Social-Democracia | 98.0 | Socialismo Liberal | 97.9 |  |
| Pentti Linkola | 1932–2020 | sim | Confucionismo | 93.5 | Comunismo Agrário | 91.2 |  |
| Péricles | 495–429 a.C. | sim | Democracia Ateniense | 89.8 | Democracia Nacional | 89.1 |  |
| Juan Domingo Perón | 1895–1974 | sim | Conservadorismo Socialista | 97.5 | Trabalhismo de Direita | 95.6 |  |
| Peter Maurin | 1877-1949 | legado | Distributismo | 92.8 | Anarcodistributismo | 92.0 | legado |
| Peter Thiel | 1967– | sim | Aceleracionismo de Direita | 94.2 | Tecno-Comercialismo | 91.5 | COPIA |
| Phil Zimmermann | 1954– | legado | Liberalismo Verde | 97.3 | Liberalismo | 95.8 | legado |
| Platão | 428/427–348/347 a.C. | sim | Platonismo | 100.0 | Aristocratismo | 96.4 | COPIA |
| Plínio Salgado | 1895–1975 | sim | Integralismo Brasileiro | 100.0 | Teocratismo Cristão | 99.3 | COPIA |
| Pol Pot | 1925–1998 | legado | Socialismo Pol-Potista | 97.1 | Socialismo Stalinista | 90.5 | legado |
| Pierre-Joseph Proudhon | 1809–1865 | sim | Mutualismo Proudhoniano | 100.0 | Agrarianismo | 87.3 | COPIA |
| Vladimir Putin | 1952– | sim | Nacional-Sindicalismo | 98.9 | Nacionalismo Étnico | 98.6 |  |
| Randolph Bourne | 1886–1918 | legado | Socialismo Individualista | 95.0 | Liberalismo Verde | 94.5 | legado |
| Ray Kurzweil | 1948– | legado | Neoliberalismo | 95.4 | Liberalismo | 95.4 | legado |
| Recep Tayyip Erdoğan | 1954– | sim | Capitalismo Nacional | 98.3 | Conservadorismo Autoritário | 97.8 |  |
| Renan Santos | 1984– | sim | Conservadorismo Secular | 91.9 | Pragmatismo de Direita | 90.9 |  |
| Richard Nixon | 1913–1994 | sim | Nacionalismo | 96.0 | Mercantilismo | 94.9 |  |
| Richard Spencer | 1978– | sim | Arqueofuturismo | 87.2 | Socialismo Denguista | 86.3 |  |
| Robert Nozick | 1938–2002 | legado | Liberalismo Clássico | 99.1 | Minarquismo | 98.7 | legado |
| Roberto Campos | 1917–2001 | sim | Tecnocracia Liberal | 96.4 | Pragmatismo de Direita | 92.3 |  |
| Roman Dmowski | 1864–1939 | legado | Nacionalismo Étnico | 97.8 | Integralismo Brasileiro | 97.0 | legado |
| Ron Paul | 1935– | legado | Paleolibertarianismo | 97.6 | Anarcoconservadorismo | 94.2 | legado |
| Ronald Reagan | 1911–2004 | sim | Liberalismo Conservador | 90.4 | Libertarianismo Nacional | 88.8 |  |
| Rong Yiren | 1916–2005 | sim | Positivismo | 94.7 | Socialismo Denguista | 94.1 | COPIA |
| Carlo Rosselli | 1899–1937 | legado | Socialismo Liberal | 97.0 | Republicanismo | 96.0 | legado |
| Murray Rothbard | 1926–1995 | sim | Anarcocapitalismo | 98.5 | Libertarianismo | 98.3 |  |
| Jean-Jacques Rousseau | 1712–1778 | sim | Socialismo Religioso | 93.0 | Trabalhismo Cristão | 92.2 |  |
| Rudolf Rocker | 1873–1958 | sim | Anarquismo | 97.4 | Anarco-Progressismo | 97.2 |  |
| Rui Barbosa | 1849–1923 | sim | Federalismo | 93.0 | Reformismo Georgista | 88.2 |  |
| Rui Costa Pimenta | 1957– | sim | Socialismo Democrático | 95.8 | Socialismo | 95.4 |  |
| Saddam Hussein | 1937–2006 | sim | Nacional-Sindicalismo | 97.6 | Nacional-Bolchevismo (NazBol) | 95.7 |  |
| António de Oliveira Salazar | 1889–1970 | legado | Falangismo | 98.7 | Reacionarismo | 98.5 | legado |
| Sam Altman | 1985– | sim | Ordoliberalismo | 96.1 | Meritocracia | 94.9 |  |
| Samora Machel | 1933–1986 | sim | Socialismo de Estado | 99.0 | Marxismo-Leninismo | 97.0 |  |
| Satoshi Nakamoto | s.d.– | sim | Criptoanarquismo | 98.4 | Libertarianismo Progressista | 98.3 |  |
| Sayyid Qutb | 1906–1966 | sim | Teocratismo Cristão | 98.6 | Integralismo Brasileiro | 98.6 |  |
| Roger Scruton | 1944–2020 | sim | Conservadorismo | 94.8 | Conservadorismo Americano | 92.4 |  |
| Sidney Webb | 1859–1947 | sim | Populismo de Esquerda | 95.5 | Tecnocracia de Esquerda | 95.2 |  |
| Simón Bolívar | 1783–1830 | sim | Nacionalismo | 91.9 | Mercantilismo | 91.3 |  |
| Slavoj Žižek | 1949– | sim | Socialismo de Mercado | 97.6 | Progressismo | 96.6 |  |
| Sócrates | 470–399 a.C. | sim | Socratismo | 100.0 | Confucionismo | 92.6 | COPIA |
| Georges Sorel | 1847–1922 | legado | Sindicalismo Revolucionário | 94.1 | Imperialismo Federalista | 86.1 | legado |
| Nick Srnicek | 1982– | legado | Socialismo Democrático | 98.2 | Aceleracionismo de Esquerda | 97.8 | legado |
| Josef Stálin | 1878–1953 | sim | Socialismo Stalinista | 100.0 | Fascismo Vermelho | 95.3 | COPIA |
| Steve Bannon | 1953– | legado | Conservadorismo Nacional | 97.2 | Direita alternativa | 95.9 | legado |
| Sun Yat-sen | 1866–1925 | sim | Nacionalismo Cultural | 93.8 | Nacional-Desenvolvimentismo | 93.3 |  |
| Tarcísio de Freitas | 1975– | sim | Liberalismo Conservador | 93.5 | Neoconservadorismo | 93.0 |  |
| Ted Kaczynski | 1942–2023 | sim | Anarcodistributismo | 91.0 | Agrarianismo | 90.2 |  |
| Theodor Herzl | 1860–1904 | sim | Monarquismo Moderador | 88.5 | Monarquismo Constitucional | 87.3 | COPIA |
| Theodore Roosevelt | 1858–1919 | legado | Nacionalismo | 95.5 | Trabalhismo de Direita | 93.1 | legado |
| Thomas Jefferson | 1743–1826 | sim | Agrarianismo | 97.1 | Federalismo | 89.7 |  |
| Thomas Paine | 1737–1809 | legado | Liberalismo Verde | 95.9 | Socialismo Liberal | 95.3 | legado |
| Thomas Sankara | 1949–1987 | sim | Socialismo Anticolonial | 93.4 | Populismo de Esquerda | 92.6 |  |
| Henry David Thoreau | 1817–1862 | legado | Anarco-Naturalismo | 93.5 | Anarquismo | 93.4 | legado |
| Josip Broz Tito | 1892–1980 | legado | Socialismo Titoísta | 100.0 | Socialismo Anticolonial | 83.9 | COPIA, legado |
| Alexis de Tocqueville | 1805–1859 | sim | Federalismo | 95.0 | Reformismo Georgista | 93.2 |  |
| Liev Tolstói | 1828–1910 | legado | Anarquismo Agrário | 96.1 | Anarcodistributismo | 95.7 | legado |
| Tomás de Aquino | 1225–1274 | sim | Catolicismo | 95.3 | Conservadorismo Paternalista | 92.3 |  |
| Tony Blair | 1953– | sim | Terceira Via | 95.5 | Atlantismo | 95.5 |  |
| Leon Trótski | 1879–1940 | sim | Comunismo Trotskista | 100.0 | Marxismo-Leninismo | 95.0 | COPIA |
| Viktor Orbán | 1963– | legado | Corporativismo | 96.3 | Populismo de Direita | 94.6 | legado |
| Vitalik Buterin | 1994–presente | sim | Libertarianismo Bleeding-Heart | 97.3 | Liberalismo Verde | 95.9 |  |
| Volodymyr Zelensky | 1978– | legado | Atlantismo | 94.7 | Democracia Securitária | 93.5 | legado |
| Walter Ulbricht | 1893–1973 | sim | Comunismo Nacional | 97.8 | Comunismo Maoísta | 97.3 |  |
| Warren Buffett | 1930– | sim | Centrismo Ambientalista | 96.7 | Ordoliberalismo | 95.4 |  |
| William F. Buckley Jr. | 1925–2008 | sim | Liberalismo Conservador | 92.5 | Nacional-Liberalismo | 91.6 |  |
| Winston Churchill | 1874–1965 | sim | Neoconservadorismo | 96.2 | Nacional-Liberalismo | 95.4 |  |
| Woodrow Wilson | 1856–1924 | sim | Centrismo Conservador | 90.8 | Pragmatismo de Direita | 90.0 |  |
| Xi Jinping | 1953– | legado | Tecno-Fascismo | 95.0 | Fascismo Vermelho | 94.9 | legado |
| Emiliano Zapata | 1879–1919 | legado | Distributismo | 95.2 | Comunitarismo | 92.0 | legado |
| Zohran Mamdani | 1991– | sim | Socialismo Liberal | 97.6 | Progressismo | 97.0 |  |
| Zumbi dos Palmares | 1655–1695 | sim | Sindicalismo Revolucionário | 86.1 | Distributismo | 81.9 |  |
