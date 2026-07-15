# Instruções para Continuação da Auditoria Independente (12 Axes)

Olá! Você está recebendo esta tarefa para dar continuidade à auditoria pergunta-a-pergunta do pool de 240 questões para os perfis de **ideologias**, **países** e **personalidades** do projeto 12 Axes.

Para trabalhar com a máxima eficiência, manter a consistência e não estourar o limite de tokens da sessão, siga rigorosamente as diretrizes abaixo.

---

## 1. Mapeamento do Ambiente (O que você deve ler primeiro)
Antes de escrever qualquer resposta, examine os arquivos locais para entender a estrutura e o progresso atual:
* **Perguntas:** `questions-pool.json` (Contém as 240 perguntas divididas em 12 eixos).
* **Eixos:** `axes.json` e `axes-explained.md` (Explicação dos polos e IDs).
* **Metadados dos Perfis:** `ideologies.json`, `countries.json`, `personalities.json`.
* **Progresso e Respostas Existentes:**
    * `ideology-profiles.json`
    * `countries-profiles.json`
    * `personality-profiles.json`
    * Arquivos específicos de progresso como `.personality-todo.json` ou logs de auditoria anteriores se disponíveis na pasta (`INSTRUCOES-NOVA-AUDITORIA.md`).

---

## 2. A Nova Metodologia: Auditoria Independente de Perfil Completo
**IMPORTANTE:** Em auditorias anteriores, ocorreu um erro sistêmico de "duplicação de sequências" (onde perfis parecidos herdavam as mesmas 20 respostas de um eixo por pura preguiça cognitiva).
Para evitar isso, você deve seguir a **Metodologia de Perfil Completo**:

1.  **Isolamento Absoluto:** Avalie cada perfil de forma 100% isolada. Não tente aproximar as respostas de um perfil às de outro perfil semelhante.
2.  **Abordagem por Perfil Inteiro (Subagente):** Processe todos os 12 eixos (240 perguntas) de um único perfil de uma vez só, em vez de fazer eixo por eixo em chamadas separadas. Isso economiza muito contexto e garante consistência interna para a persona.
3.  **Estrutura da Resposta para cada Eixo:**
    * **Persona Brief:** 1 ou 2 frases curtas conectando o perfil ao tema específico daquele eixo.
    * **Respostas Individuais:** Responda pergunta por pergunta usando estritamente as opções: `DT` (Discordo Totalmente), `D` (Discordo), `N` (Neutro), `C` (Concordo), `CT` (Concordo Totalmente).

---

## 3. Como Continuar o Trabalho
1.  **Verifique o Progresso Atual:** Cruze os IDs presentes nos arquivos de metadados (`personalities.json`, etc.) com os perfis que já possuem respostas estruturadas nos arquivos `-profiles.json` ou logs de progresso (`PROFILE_FULL_AUDIT_RESULTS.json` ou similares, se existirem).
2.  **Identifique a Fila:** Descubra quais perfis ainda estão pendentes (com 0/12 eixos auditados ou ausentes nos profiles).
3.  **Siga o Padrão Técnico:** Mantenha exatamente o mesmo formato de saída JSON e estrutura de dados dos arquivos que você analisou na pasta.
4.  **Estratégia Anti-Bloqueio (Preservação de Tokens):**
    * Trabalhe em lotes pequenos por interação para evitar que a janela de contexto do chat infle e gaste sua cota de mensagens muito rápido.
    * Escreva respostas concisas, focando na precisão técnica dos mapeamentos de decisão de concordância.

Acesse os arquivos agora, identifique qual é o próximo perfil pendente na fila e apresente o plano de ação para continuar a auditoria.
