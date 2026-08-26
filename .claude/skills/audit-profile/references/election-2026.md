# Protocolo da auditoria eleitoral de 2026

## Eixos e direção do vetor

O vetor armazena a posição no polo esquerdo de cada eixo. `agreePole: LEFT` soma o grau de concordância; `RIGHT` soma o complemento.

| Eixo | Polo esquerdo | Polo direito |
|---|---|---|
| estrutura | Federal | Unitário |
| representacao | Democracia | Autocracia |
| poder | Segurança | Liberdade |
| imigracao | Assimilação | Multicultura |
| diplomacia | Militarista | Pacifista |
| intervencao | Não intervencionista | Nacionalista |
| economia | Público | Privado |
| controle | Planejamento | Livre mercado |
| comercio | Protecionismo | Globalismo |
| religiao | Irreligioso | Religioso |
| moral | Progressista | Tradicionalista |
| tecnologia | Tecnologia | Biologia |

Leia sempre o `agreePole` de cada pergunta: a orientação visual dos eixos não deve ser inferida pelo texto.

## Arquivos e formato

- Perguntas: `backend/src/main/resources/data/election-questions.json`.
- Metadados: `backend/src/main/resources/data/candidates.json`.
- Vetores publicados: `backend/src/main/resources/data/candidate-profiles.json` (`candidateId`, `vector`).
- Auditoria por candidato: `profile-audit/election-out/<candidateId>.json`.
- Matriz consolidada: `profile-audit/election-out/2026-reaudit.json`.

O arquivo individual deve ser JSON estrito com este formato. Mantenha `answers` para compatibilidade com a matriz atual e acrescente a rastreabilidade em `evidence`.

```json
{
  "candidateId": "exemplo",
  "auditedAt": "2026-08-26",
  "questionSet": "election-questions.json",
  "vector": { "estrutura": 50.0 },
  "estrutura": {
    "personaBrief": "...",
    "answers": { "eleicao_estrutura_01": "C" },
    "evidence": {
      "eleicao_estrutura_01": {
        "rationale": "...",
        "level": "direta",
        "sources": [{ "url": "https://...", "accessedAt": "2026-08-26" }]
      }
    }
  }
}
```

Não apague campos legados existentes sem migrá-los. Para cada resposta, `sources` pode estar vazio somente quando `level` for `inferida` e a justificativa explicar a base contextual.

## Verificação local

Após editar, rode a partir da raiz:

```powershell
node -e "const fs=require('fs');const q=JSON.parse(fs.readFileSync('backend/src/main/resources/data/election-questions.json','utf8'));const a=JSON.parse(fs.readFileSync('profile-audit/election-out/CANDIDATE.json','utf8'));const codes=new Set(['DT','D','N','C','CT']);for(const x of q){if(!codes.has(a[x.axisId]?.answers?.[x.id]))throw Error('Resposta ausente: '+x.id)}console.log('36 respostas válidas')"
mvn -q test
```

Substitua `CANDIDATE` pelo ID auditado. A validação confirma forma; a revisão editorial deve conferir as inferências e fontes.
