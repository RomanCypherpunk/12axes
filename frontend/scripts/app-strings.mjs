// Parse the literal dictionaries without evaluating browser code. This handles
// French apostrophes, either quote style, and multiline entries.
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function dictionary(file, name) {
  const path = new URL(file, import.meta.url);
  const source = ts.createSourceFile(path.pathname, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  let result;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) result = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!result || !ts.isObjectLiteralExpression(result)) throw new Error(`Missing dictionary ${name}`);
  return result;
}

function property(object, name) {
  const field = object.properties.find((node) => node.name?.getText() === name);
  if (!field) throw new Error(`Missing dictionary field ${name}`);
  return field.initializer;
}

function literal(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(node.properties.map((field) => [field.name.getText().replace(/^['"]|['"]$/g, ''), literal(field.initializer)]));
  }
  throw new Error('Expected a literal translation');
}

const dictionaries = {
  pt: dictionary('../src/i18n/index.ts', 'pt'),
  en: dictionary('../src/i18n/index.ts', 'en'),
  fr: dictionary('../src/i18n/fr.ts', 'fr')
};
export const AXIS_EXPLANATIONS = Object.fromEntries(Object.entries(dictionaries).map(([locale, value]) => [locale, literal(property(value, 'axisExplanations'))]));
export const FRENCH_FAQ = literal(property(dictionaries.fr, 'faqItems'));
