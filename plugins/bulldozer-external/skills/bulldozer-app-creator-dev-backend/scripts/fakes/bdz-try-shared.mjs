/**
 * L'état partagé des doublures, et le peu de moteur d'expressions qu'il faut pour être fidèle.
 *
 * Passe par `globalThis` : chaque doublure est un module distinct, et le harnais doit pouvoir lire
 * ce que l'app a écrit après coup pour le montrer à son auteur.
 */
export const store = (globalThis.__bdzTry ??= {
  items: new Map(), objects: new Map(), queue: [],
});

/** Une clé de Map sans séparateur à inventer, donc sans collision possible à débattre. */
export const key = (pk, sk) => JSON.stringify([pk, sk]);

export class Command {
  constructor(input) {
    this.input = input;
  }
}

// ─────────────────────────────────────────────────────────── les expressions

const BETWEEN = /(\S+)\s+BETWEEN\s+(\S+)\s+AND\s+(\S+)/gi;

/** Un repère qu'aucune expression DynamoDB ne peut contenir. */
const HELD = (i) => `@@${i}@@`;
const HELD_RE = /@@(\d+)@@/;

/**
 * Découpe une expression en conjonctions.
 *
 * `BETWEEN a AND b` contient un `AND` qui n'en sépare pas deux : le mettre de côté d'abord évite de
 * couper la condition en son milieu, ce qui donnerait deux morceaux dont aucun n'a de sens. Le
 * repère ne peut pas être un simple numéro — on le retrouverait dans « #f0 >= :v0 », et le
 * remplacer y détruirait la condition.
 */
function conjuncts(expression) {
  const held = [];
  const masked = expression.replace(BETWEEN, (whole) => {
    held.push(whole);
    return HELD(held.length - 1);
  });
  return masked.split(/\s+AND\s+/i)
    .map((part) => part.trim().replace(HELD_RE, (_, i) => held[Number(i)]))
    .filter(Boolean);
}

function compare(left, operator, right) {
  switch (operator) {
    case '=': return left === right;
    case '<>': return left !== right;
    case '>': return left > right;
    case '>=': return left >= right;
    case '<': return left < right;
    case '<=': return left <= right;
    default: throw new Error(`Opérateur inconnu dans la doublure : ${operator}`);
  }
}

/** Évalue une conjonction contre un document. Ne connaît que ce que l'aide sait produire. */
function holds(conjunct, item, names, values) {
  const name = (alias) => names?.[alias] ?? alias.replace(/^#/, '');
  const value = (placeholder) => values?.[placeholder];

  let match = /^(#?\w+)\s+BETWEEN\s+(:\w+)\s+AND\s+(:\w+)$/i.exec(conjunct);
  if (match) {
    const field = item[name(match[1])];
    return field >= value(match[2]) && field <= value(match[3]);
  }
  match = /^begins_with\((#?\w+),\s*(:\w+)\)$/i.exec(conjunct);
  if (match) {
    return String(item[name(match[1])] ?? '').startsWith(String(value(match[2])));
  }
  match = /^contains\((#?\w+),\s*(:\w+)\)$/i.exec(conjunct);
  if (match) {
    return String(item[name(match[1])] ?? '').includes(String(value(match[2])));
  }
  match = /^(#?\w+)\s+IN\s+\(([^)]*)\)$/i.exec(conjunct);
  if (match) {
    return match[2].split(',').map((p) => value(p.trim())).includes(item[name(match[1])]);
  }
  match = /^(#?\w+)\s*(<>|>=|<=|=|>|<)\s*(:\w+)$/.exec(conjunct);
  if (match) {
    return compare(item[name(match[1])], match[2], value(match[3]));
  }
  throw new Error(`Condition non reconnue par la doublure : « ${conjunct} »`);
}

/**
 * Vrai si toutes les conjonctions tiennent. Une expression absente ne filtre rien.
 *
 * @param options.skip  conjonctions à ignorer — la condition sur la partition, déjà appliquée en
 *                      amont par la sélection des documents.
 */
export function matches(expression, item, names, values, options = {}) {
  if (!expression) {
    return true;
  }
  return conjuncts(expression)
    .filter((conjunct) => !options.skip || !options.skip.test(conjunct))
    .every((conjunct) => holds(conjunct, item, names, values));
}
