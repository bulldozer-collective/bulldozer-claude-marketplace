/**
 * La base, en mémoire.
 *
 * Fidèle sur les trois points dont dépend la justesse d'une app, et sur rien d'autre :
 *
 *  1. **`Limit` borne ce qui est LU, pas ce qui est rendu.** Une page filtrée peut donc ne rien
 *     rapporter alors qu'il reste des documents. Une doublure qui bornerait le résultat cacherait
 *     exactement le défaut qu'on veut voir ici, et laisserait passer une pagination fausse.
 *  2. **Un index est creux** : un document sans le champ indexé n'y figure pas.
 *  3. **L'ordre est celui de l'axe**, à l'endroit ou à l'envers.
 */
import { store, key, Command, matches } from '@aws-sdk/bdz-try-shared';

export class PutCommand extends Command {}
export class GetCommand extends Command {}
export class QueryCommand extends Command {}
export class DeleteCommand extends Command {}
export class UpdateCommand extends Command {}

/** L'index `by-createdAt` trie sur `createdAt` ; sans index, on trie sur la clé de tri. */
const axisOf = (indexName) => (indexName ? indexName.replace(/^by-/, '') : 'sk');

/** La condition sur la partition est déjà appliquée en sélectionnant les documents. */
const PARTITION = /^#?\w*pk\w*\s*=/i;

function query(input) {
  const {
    IndexName, KeyConditionExpression, FilterExpression,
    ExpressionAttributeNames: names, ExpressionAttributeValues: values,
    Limit, ExclusiveStartKey, ScanIndexForward,
  } = input;

  const axis = axisOf(IndexName);
  const partition = values?.[':pk'];

  // Un index non déclaré n'existe pas en production. Le servir ici ferait passer localement une app
  // qui échouerait une fois publiée — le seul défaut qu'un harnais n'a pas le droit d'avoir.
  if (IndexName && store.indexes && !store.indexes.has(axis)) {
    const error = new Error(`Aucun index sur « ${axis} ». Déclare-le dans "indexes" du `
      + `bulldozer.app.json, ou trie sur l'identifiant.`);
    error.name = 'ValidationException';
    throw error;
  }

  let candidates = [...store.items.values()].filter((item) => item.pk === partition);
  if (IndexName) {
    candidates = candidates.filter((item) => item[axis] !== undefined);
  }
  candidates.sort((a, b) => (a[axis] < b[axis] ? -1 : a[axis] > b[axis] ? 1 : 0));
  if (ScanIndexForward === false) {
    candidates.reverse();
  }

  // La condition d'axe restreint la tranche lue — c'est ce qui rend la lecture bornée.
  candidates = candidates.filter(
    (item) => matches(KeyConditionExpression, item, names, values, { skip: PARTITION }));

  if (ExclusiveStartKey) {
    const from = candidates.findIndex((item) => item.pk === ExclusiveStartKey.pk
      && item.sk === ExclusiveStartKey.sk);
    candidates = from < 0 ? candidates : candidates.slice(from + 1);
  }

  const read = candidates.slice(0, Limit ?? candidates.length);
  const kept = read.filter((item) => matches(FilterExpression, item, names, values));
  const last = read.at(-1);

  return {
    Items: structuredClone(kept),
    Count: kept.length,
    // Ce que la lecture a coûté, filtre compris. C'est le chiffre que l'aide remonte à l'app.
    ScannedCount: read.length,
    LastEvaluatedKey: last && read.length < candidates.length
      ? { pk: last.pk, sk: last.sk, ...(IndexName ? { [axis]: last[axis] } : {}) }
      : undefined,
  };
}

export const DynamoDBDocumentClient = {
  from() {
    return {
      async send(command) {
        const { Item, Key } = command.input;
        switch (command.constructor.name) {
          case 'PutCommand':
            store.items.set(key(Item.pk, Item.sk), structuredClone(Item));
            return {};
          case 'GetCommand':
            return { Item: structuredClone(store.items.get(key(Key.pk, Key.sk))) };
          case 'DeleteCommand':
            store.items.delete(key(Key.pk, Key.sk));
            return {};
          case 'QueryCommand':
            return query(command.input);
          default:
            throw new Error(`${command.constructor.name} n'est pas gérée par le harnais local.`);
        }
      },
    };
  },
};
