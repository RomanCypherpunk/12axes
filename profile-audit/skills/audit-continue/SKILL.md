---
name: audit-continue
description: Continua a auditoria pergunta-a-pergunta a partir de STATE.json.pending, escolhendo automaticamente o catálogo com pendências e disparando o próximo lote de 15, sem o usuário precisar especificar personality/ideology/country.
---

# /audit_continue

Retoma a auditoria de onde parou, sem o usuário precisar dizer qual catálogo.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — contém o protocolo completo (eixos, template de prompt, disparo simultâneo, validação, cálculo de vetor, merge, `STATE.json`, arquivamento).

## Execução

1. Leia `profile-audit/STATE.json`.
2. Determine qual catálogo tem trabalho pendente, na ordem de prioridade `personality → ideology → country` (mesma ordem em que os catálogos são normalmente fechados um de cada vez no histórico do projeto — ver `README.md`, seção "Os três catálogos": trabalhe um catálogo por vez, não misture):
   - Se `STATE.json.personality.pending` não estiver vazio, `CATALOG = personality`.
   - Senão, se `STATE.json.ideology.pending` não estiver vazio, `CATALOG = ideology`.
   - Senão, se `STATE.json.country.pending` não estiver vazio, `CATALOG = country`.
   - Se os três estiverem vazios, informe ao usuário que a auditoria dos três catálogos está 100% concluída e pare — não há nada a fazer.
3. Informe ao usuário qual catálogo foi escolhido e quantos perfis restam pendentes nele.
4. Pegue os 15 primeiros IDs de `STATE.json.<CATALOG>.pending` (ou o restante, se houver menos de 15).
5. Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md` para esse catálogo, usando a tabela de parâmetros da seção "Os três catálogos" do README (metadados fonte, arquivo de destino, chave, campos do prompt, tipo de perfil):

   | Catálogo | Metadados (fonte) | Perfis salvos (destino) | Campos do prompt |
   |---|---|---|---|
   | `personality` | `backend/src/main/resources/data/personalities.json` | `backend/src/main/resources/data/personality-profiles.json` (`personalityId`) | `id`, `name`, `role`, `lifespan`, `description` |
   | `ideology` | `backend/src/main/resources/data/ideologies.json` | `backend/src/main/resources/data/ideology-profiles.json` (`ideologyId`) | `id`, `name`, `category`, `description` |
   | `country` | `backend/src/main/resources/data/countries.json` | `backend/src/main/resources/data/countries-profiles.json` (`countryId`) | `id`, `name`, `category`, `description` (+ `period` se `historical`) |

   - Gerar `prompts/<CATALOG>/<id>.txt` para cada perfil do lote.
   - Disparar os subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as saídas em `subagent-out/<CATALOG>/<id>.json`.
   - Calcular vetores e mesclar no arquivo de perfis correspondente.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/<CATALOG>/<id>.json` (permanente) e limpar temporários (mantendo só um par de exemplo por catálogo).
6. Ao final, informe quantos perfis restam em `pending` naquele catálogo (e, se ele zerou, mencione que o próximo `/audit_continue` passará automaticamente ao próximo catálogo pendente) e **pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Mesmas regras da seção final de `profile-audit/README.md`: nunca lote sequencial, nunca modelo fraco, nunca misturar catálogos no mesmo lote, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`.
