# Guia de tradução: francês (fr)

A fonte é sempre o **inglês** (já internacionalizado). Traduza para francês padrão, natural na França e neutro (sem québécismes nem belgicismes).

## Tom
- Trate o leitor por **vous** (nunca «tu»). Verbos e pronomes em minúscula ("Découvrez votre idéologie", "votre résultat").
- Direto e natural, como uma pessoa escreveria. Sem floreio, sem tradução literal nem anglicismos desnecessários ("réaliser" no sentido de "perceber", "supporter" no sentido de "apoiar", "éventuellement" por "eventually"…).
- **Apóstrofo tipográfico** (`’`, U+2019) em todo o texto: "l’État", "d’accord", "aujourd’hui". Nunca use o apóstrofo reto `'` (quebra strings no código). Aspas francesas «&nbsp;assim&nbsp;» com espaço inseparável (U+00A0) por dentro.
- **Espaço inseparável (U+00A0) antes de `:` `;` `?` `!` e `»`, e depois de `«`.** Não coloque antes de vírgula ou ponto. Não coloque dentro de URLs, horas (9:30), números ou nos placeholders.
- Maiúsculas à francesa: só a primeira palavra do título e nomes próprios; dias, meses, línguas e gentílicos em minúscula ("un parti français", "le 3 mars", "en anglais"). "État" com maiúscula quando é a instituição, com acento ("État").
- Gênero do leitor: use formas neutras ou a forma epicena; nas alternativas de resposta use o masculino genérico curto ("Tout à fait d’accord").

## Nomes
- Pessoas: mantenha o nome original, exceto quando houver forma francesa consagrada: Charlemagne, Jules César, Alexandre le Grand, Martin Luther, Thomas d’Aquin, Confucius, Élisabeth II, Catherine la Grande, Napoléon Bonaparte, Frédéric le Grand, Charles Quint, Pierre le Grand, Jean Calvin, Nicolas II, Ivan le Terrible, Saladin, Gengis Khan.
- Papas e reis: forma francesa (Jean-Paul II, François (pape), Léon XIV, Louis XIV, Henri VIII, Philippe II d’Espagne).
- Países, regiões e regimes: nome em francês (Brésil, Allemagne, États-Unis, Pays-Bas, Royaume-Uni, Espagne, Italie, Russie, Chine, Japon, Corée du Sud/du Nord, Suède, Suisse, Union européenne). Estados e regiões: "Californie", "Bavière", "Catalogne", "Flandre".
- Partidos e organizações: formato `Nom (Sigle)`, nunca com o país no nome. Traduza o que tem nome francês consagrado (Parti communiste chinois, Parti nazi (NSDAP), Parti social-démocrate d’Allemagne (SPD), Rassemblement national (RN), La France insoumise (LFI)); caso contrário mantenha o nome próprio e a sigla original.
- Títulos de livros e de leis: use o título da edição francesa quando existir ("L’Esprit des lois", "Du contrat social", "Le Capital", "La Route de la servitude"); senão, tradução literal natural entre «&nbsp;&nbsp;» só se o original estiver em outra língua e não houver edição; obras em inglês sem edição francesa conhecida ficam no original.
- A marca é sempre **12 Axes**, sem tradução.

## Termos fixos (use sempre estes)
| Inglês | Francês |
|---|---|
| axis / axes | axe / axes |
| quiz, political test | test (test politique) |
| compatibility | compatibilité |
| personality / figure (catálogo) | personnalité |
| Left / Right | gauche / droite |
| Far Right / Radical Left | extrême droite / gauche radicale |
| Center | centre |
| Third Position | troisième position |
| libertarian / libertarianism | libertarien / libertarianisme |
| anarchist / anarchism | anarchiste / anarchisme |
| liberal / liberalism | libéral / libéralisme |
| progressive / progressivism | progressiste / progressisme |
| traditionalist | traditionaliste |
| authoritarian | autoritaire |
| Federal / Unitary | fédéral (fédéralisme) / unitaire (unitarisme) |
| report (Full Report) | rapport (Rapport complet) |
| compass | boussole |
| web view | vue en réseau |
| Structure | Structure |
| Representation | Représentation |
| Power | Pouvoir |
| Immigration | Immigration |
| Diplomacy | Diplomatie |
| Intervention | Intervention |
| Economy | Économie |
| Control | Contrôle |
| Trade | Commerce |
| Religion | Religion |
| Morality | Morale |
| Technology | Technologie |
| Security / Liberty | Sécurité / Liberté |
| Militarist / Pacifist | Militariste / Pacifiste |
| Planning / Free market | Planification / Libre marché |
| Protectionism / Globalism | Protectionnisme / Mondialisme |
| Irreligious / Religious | Irréligieux / Religieux |
| Progressive / Traditionalist | Progressiste / Traditionaliste |

## Regras técnicas
- Nunca altere ids, chaves, placeholders (`{name}`, `${n}`), tags HTML, URLs, números e anos.
- Em francês o singular vale para 0 e 1 ("0 profil", "1 profil", "2 profils"). Em strings montadas no código, use a forma plural apenas a partir de 2.
- `role` (papel da personalidade): no máximo **30 caracteres e 5 palavras** ("Fondateur de Singapour", "Père de la psychanalyse", "Dirigeant de l’URSS"). Conte antes de gravar.
- `description`: no máximo **280 caracteres e 45 palavras**. Condense em vez de cortar no meio.
- Mesmo sentido, mesma força. Não suavize nem acentue juízos. Não acrescente fatos.
- Condenações e processos judiciais: mantenha exatamente o grau afirmado no inglês ("condamné en première instance", "relaxé", "acquitté").
- Perguntas do quiz: mesma direção e mesma força do original. "should" vira «&nbsp;doit/doivent/devrait&nbsp;» conforme o inglês; concordar com a versão francesa precisa significar o mesmo que concordar com a versão inglesa.
- Datas: "1er mars 1990", séculos em romanos com "e" sobrescrito simples ("XIXe siècle", "XXIe siècle"); "av. J.-C." / "apr. J.-C." para antes/depois de Cristo; "vers" para "c."; períodos "1929-1968" com hífen ou meia-risca "1929–1968" (mantenha o formato do original).
