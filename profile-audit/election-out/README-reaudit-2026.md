# Reauditoria eleitoral de 2026

`2026-reaudit.json` é uma nova matriz de trabalho e **não substitui silenciosamente** os oito JSONs antigos desta pasta. Ele registra 36 respostas por candidato na mesma ordem de `election-questions.json`, inclusive para Samara Martins.

## Regra de evidência

1. Plano de governo apresentado no TSE e atos/votos públicos verificáveis.
2. Posições declaradas do candidato durante a campanha.
3. Programa e tradição política do partido, quando não há posição individual.
4. Inferência contextual, expressamente identificada no campo `basis`.

`N` não significa "não encontramos fonte". Só é usado para ambivalência substantiva. Lacunas de programa receberam a resposta mais provável à luz do conjunto de propostas, como solicitado, mas não devem ser descritas no produto como promessas ou falas literais.

## Fontes usadas na reauditoria

- [Registro, programas e situação das candidaturas - TSE](https://divulgacandcontas.tse.jus.br/)
- [Conjunto de candidaturas registradas e links aos programas](https://www.projetomandato.com.br/eleicoes-2026/)
- [Programa e perfil de Lula](https://www.projetomandato.com.br/eleicoes-2026/lula/)
- [Programa e perfil de Flávio Bolsonaro](https://www.projetomandato.com.br/eleicoes-2026/flavio-bolsonaro/)
- [Programa e perfil de Caiado](https://www.projetomandato.com.br/eleicoes-2026/ronaldo-caiado/)
- [Programa e perfil de Zema](https://www.projetomandato.com.br/eleicoes-2026/romeu-zema/)
- [Programa e perfil de Renan Santos](https://www.projetomandato.com.br/eleicoes-2026/renan-santos/)
- [Programa e perfil de Samara Martins](https://www.projetomandato.com.br/eleicoes-2026/samara-martins/)

Antes de converter esta matriz em `candidate-profiles.json`, faça uma revisão humana dos itens puramente inferenciais, especialmente os de imigração, religião, costumes, defesa e meio ambiente.
