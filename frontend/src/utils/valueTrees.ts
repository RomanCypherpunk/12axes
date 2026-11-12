import type { ArchetypeQuestion, ValueTree, ValueTreeNode } from '../types/quiz';

/**
 * Valores completos do quiz de 240 perguntas: uma árvore de escolhas por categoria, cada uma terminando em UM valor.
 * Os passos reaproveitam o formato das perguntas de arquétipo e as escolhas vão no mesmo `archetypeChoices`
 * (progresso salvo, edição de respostas), com o id do nó prefixado por "fv:". O servidor só recebe o valor final de
 * cada categoria (`valuesFromChoices`), não o caminho.
 */
export const FV_STEP_PREFIX = 'fv:';

// Ícone do cabeçalho de cada categoria (chaves de THEME_ICONS no ArchetypeCard); as sem ícone próprio usam o de sociedade.
const THEME_BY_CATEGORY: Record<string, string> = {
  politica: 'poder',
  tecnologia: 'tecnologia',
  economia: 'economia',
  politica_externa: 'mundo'
};

/** A flag de desenvolvimento: sem ela o quiz de 240 fica como sempre foi. */
export function valueChoiceFlagEnabled(): boolean {
  return import.meta.env.VITE_FULL_VALUES_ENABLED === 'true';
}

export function isValueStep(stepId: string): boolean {
  return stepId.startsWith(FV_STEP_PREFIX);
}

interface Walk {
  /** Nós percorridos: os respondidos e, se a árvore não chegou a uma folha, o primeiro sem resposta. */
  path: ValueTreeNode[];
  /** Valor final, quando as escolhas chegam a uma folha. */
  value: string | null;
}

function walk(tree: ValueTree, choices: Record<string, string>): Walk {
  const nodes = new Map(tree.nodes.map((node) => [node.id, node]));
  const path: ValueTreeNode[] = [];
  let current: string | null = tree.root;
  // Teto no número de nós: uma árvore malformada (ciclo) nunca trava o quiz.
  while (current !== null && path.length <= tree.nodes.length) {
    const node = nodes.get(current);
    if (!node) {
      break;
    }
    path.push(node);
    const option = node.options.find((candidate) => candidate.id === choices[FV_STEP_PREFIX + node.id]);
    if (!option) {
      return { path, value: null };
    }
    if (option.value !== null) {
      return { path, value: option.value };
    }
    current = option.next;
  }
  return { path, value: null };
}

/** Os passos do quiz das árvores, na ordem das categorias: o caminho já respondido de cada uma e o próximo nó. */
export function fullValuesSteps(trees: ValueTree[], choices: Record<string, string>): ArchetypeQuestion[] {
  return trees.flatMap((tree) =>
    walk(tree, choices).path.map((node) => ({
      id: FV_STEP_PREFIX + node.id,
      label: tree.label,
      theme: THEME_BY_CATEGORY[tree.categoryId] ?? 'sociedade',
      text: node.text,
      options: node.options.map((option) => ({ id: option.id, text: option.text }))
    }))
  );
}

/**
 * Grava (ou, com `optionId` nulo, tira) a escolha de um nó e descarta as escolhas dos nós da mesma árvore que deixaram de
 * estar no caminho: mudar uma resposta antiga nunca deixa um valor órfão. Nó que não é de nenhuma árvore é ignorado.
 */
export function chooseValueNode(
  trees: ValueTree[],
  choices: Record<string, string>,
  stepId: string,
  optionId: string | null
): Record<string, string> {
  const nodeId = stepId.slice(FV_STEP_PREFIX.length);
  const tree = trees.find((candidate) => candidate.nodes.some((node) => node.id === nodeId));
  if (!tree || !isValueStep(stepId)) {
    return { ...choices };
  }
  const next = { ...choices };
  if (optionId === null) {
    delete next[stepId];
  } else {
    next[stepId] = optionId;
  }
  const onPath = new Set(walk(tree, next).path.map((node) => FV_STEP_PREFIX + node.id));
  for (const node of tree.nodes) {
    const id = FV_STEP_PREFIX + node.id;
    if (!onPath.has(id)) {
      delete next[id];
    }
  }
  return next;
}

/**
 * Tira as escolhas que não pertencem ao jeito de responder em uso: com a árvore ativa, as das perguntas de arquétipo
 * simples (um resultado ou progresso salvo antes dela; senão contariam, com peso 1, sem a pessoa ver); sem a árvore, as
 * dos nós de valores. Religião e vertente não são arquétipo nem árvore e ficam.
 */
export function normalizeArchetypeChoices(
  choices: Record<string, string>,
  simpleArchetypeIds: string[],
  treesActive: boolean
): Record<string, string> {
  const simple = new Set(simpleArchetypeIds);
  return Object.fromEntries(
    Object.entries(choices).filter(([id]) => (treesActive ? !simple.has(id) : !isValueStep(id)))
  );
}

/** Categoria → valor final, só das árvores que chegaram a uma folha. */
export function valuesFromChoices(trees: ValueTree[], choices: Record<string, string>): Record<string, string> {
  const values: Record<string, string> = {};
  for (const tree of trees) {
    const { value } = walk(tree, choices);
    if (value !== null) {
      values[tree.categoryId] = value;
    }
  }
  return values;
}
