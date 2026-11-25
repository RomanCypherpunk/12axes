const CONNECTORS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'of', 'and', 'the']);

// Palavras longas demais para o cartão do valor, já com o ponto de quebra: assim todos os nomes ficam do mesmo tamanho.
const LONG_WORDS: Record<string, string> = {
  Tecnocapitalismo: 'Tecno-\nCapitalismo',
  Nacionalliberalismo: 'Nacional-\nliberalismo',
  Nationalliberalismus: 'National-\nliberalismus',
  Paleoconservadorismo: 'Paleo-\nConservadorismo',
  Neorreacionarismo: 'Neo-\nReacionarismo',
  Neocameralismo: 'Neo-\nCameralismo',
  Cybercomunismo: 'Cyber-\nComunismo',
  Multiculturalismo: 'Multi-\nCulturalismo',
  Hipercentralismo: 'Hiper-\nCentralismo',
  Transhumanismo: 'Trans-\nHumanismo',
  Ordoliberalismo: 'Ordo-\nLiberalismo',
  Desenvolvimentismo: 'Desenvolvi-\nmentismo',
  desenvolvimentismo: 'desenvolvi-\nmentismo',
  Paleoconservadurismo: 'Paleo-\nconservadurismo',
  Paleoconservatorismo: 'Paleo-\nconservatorismo',
  Anarcomonarquismo: 'Anarco-\nmonarquismo',
  Anarcomonarchismo: 'Anarco-\nmonarchismo',
  Socialdistributismo: 'Social-\ndistributismo',
  Nietzscheanesimo: 'Nietzschea-\nnesimo',
  Communitarianism: 'Communi-\ntarianism',
  Paleoconservatism: 'Paleo-\nconservatism',
  Developmentalism: 'Develop-\nmentalism',
  Environnementalisme: 'Environne-\nmentalisme',
  Développementisme: 'Développe-\nmentisme',
  Paléoconservatisme: 'Paléo-\nconservatisme',
  Cybercommunisme: 'Cyber-\ncommunisme',
  Communautarisme: 'Communau-\ntarisme',
  Technocapitalisme: 'Techno-\ncapitalisme',
  Accélérationnisme: 'Accéléra-\ntionnisme',
  Interventionnisme: 'Interven-\ntionnisme',
  Umweltschutzbewegung: 'Umweltschutz-\nbewegung',
  Nichtinterventionismus: 'Nichtinterven-\ntionismus',
  Anarchomonarchismus: 'Anarcho-\nmonarchismus',
  Regionalnationalismus: 'Regional-\nnationalismus',
  Liberalkonservatismus: 'Liberal-\nkonservatismus',
  Internationalistischer: 'Internationa-\nlistischer',
  Paläokonservatismus: 'Paläo-\nkonservatismus',
  Developmentalismus: 'Develop-\nmentalismus',
  Cyberkommunismus: 'Cyber-\nkommunismus',
  Sozialdistributismus: 'Sozial-\ndistributismus',
  Marktdistributismus: 'Markt-\ndistributismus',
  Kulturnationalismus: 'Kultur-\nnationalismus',
  Technokapitalismus: 'Techno-\nkapitalismus',
  Rätekommunismus: 'Räte-\nkommunismus',
  Traditionalistischer: 'Traditiona-\nlistischer',
  Internationalismus: 'Internationa-\nlismus',
  Parteienherrschaft: 'Parteien-\nherrschaft',
  Hyperzentralismus: 'Hyper-\nzentralismus',
  Staatsbürgerlicher: 'Staatsbürger-\nlicher',
  Multikulturalismus: 'Multi-\nkulturalismus',
  Akzelerationismus: 'Akzelera-\ntionismus',
  Kommunitarismus: 'Kommuni-\ntarismus',
  Nietzscheanismus: 'Nietzschea-\nnismus',
  Мультикультурализм: 'Мульти-\nкультурализм',
  Традиционалистский: 'Традициона-\nлистский',
  Интернациональный: 'Интернацио-\nнальный',
};

/** O nome do valor para os cartões: quebra a linha no hífen das palavras longas (pede white-space: pre-line). */
export function valueCardName(name: string): string {
  return name.replace(/\p{L}+/gu, (word) => LONG_WORDS[word] ?? word);
}

/** Até 2 iniciais maiúsculas do nome do valor, usadas na moeda quando ela não tem ícone próprio. */
export function valueCoinMonogram(name: string): string {
  const words = name
    .split(/[\s-]+/)
    .filter((word) => word.length > 0 && !CONNECTORS.has(word.toLowerCase()));
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
