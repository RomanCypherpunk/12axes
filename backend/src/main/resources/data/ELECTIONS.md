# elections.json: eleições na seção "Eleições" do resultado

Cada entrada é uma eleição que aparece no resultado do quiz, com o candidato mais próximo do usuário.

```json
{
  "id": "espanha-2026-gerais",
  "countryId": "espanha",
  "date": "2026-11-29",
  "languages": ["es", "pt"],
  "homeLanguages": ["es"],
  "name": { "pt": "...", "en": "...", "es": "...", "de": "...", "it": "...", "ru": "...", "fr": "..." },
  "candidates": [{ "personalityId": "pedro-sanchez", "partyId": "psoe" }]
}
```

- `languages`: idiomas do quiz em que a eleição aparece (hoje `es` e `pt`: quem usa o quiz em outro idioma não vê a seção). Ausente ou vazio = todos.
- `homeLanguages`: idiomas do país da eleição; neles ela vem **primeiro** (es → Espanha, pt → Brasil). As demais seguem a ordem do arquivo.
- Com mais de uma eleição visível, um botão com a bandeira da próxima aparece ao lado do compartilhar e alterna entre elas.
- `name`: por idioma; falta cai para `en`, depois `pt`.
- `date`: só exibição. **Não há lógica de data**: a eleição aparece enquanto estiver no arquivo.
- `personalityId` e `partyId` precisam existir no catálogo (`personalities.json`, `parties.json`). Um id errado derruba a
  subida do backend com a mensagem `elections.json invalido: ...`. Pessoa que falta: `/new_personality`.
- O ranking usa o mesmo matching das personalidades e dos partidos, sem filtro de religião.

## Adicionar ou remover

1. Edite este arquivo (adicione ou apague a entrada).
2. `cd backend && ./mvnw -o resources:resources` e **reinicie o backend**: os resultados ficam em cache por (vetor, idioma, religião).
3. Remover a eleição = apagar a entrada. Nada mais.
