/**
 * L'aide livrée avec chaque app backend Bulldozer.
 *
 * Un fichier, aucune dépendance à installer : tout ce qu'il importe est fourni par le runtime.
 * Il est déposé à côté du code de l'app et ne doit jamais être modifié — c'est lui qui garantit
 * les propriétés que l'app ne peut pas garantir elle-même.
 *
 * ┌─ Ce qu'il fait, et pourquoi il le fait à la place de l'app ────────────────────────────────┐
 * │ • Il construit les clés de la base à partir du projet actif. Le code d'une app ne les voit  │
 * │   jamais, donc ne peut pas se tromper de projet — c'est la règle de sécurité n°1 de la      │
 * │   plateforme, et elle serait sinon confiée à du code généré.                                │
 * │ • Il préfixe les fichiers de la même façon.                                                 │
 * │ • Il fournit l'endpoint d'état des traitements longs, identique dans toutes les apps.        │
 * │ • Il relaie le jeton de l'utilisateur vers l'API Bulldozer, sans jamais l'exposer.           │
 * └────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Fichier canonique : bulldozer-app-backend-parent/sdk/bulldozer.mjs
 * Copie livrée par la skill : skills/bulldozer-app-creator-dev-backend/assets/bulldozer.mjs
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, DeleteCommand, UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { randomUUID } from 'node:crypto';

const REGION = process.env.BDZ_REGION;
const TABLE = process.env.BDZ_TABLE;
const BUCKET = process.env.BDZ_BUCKET;
const STORAGE_PREFIX = process.env.BDZ_STORAGE_PREFIX;
const QUEUE_URL = process.env.BDZ_QUEUE_URL;
const API_BASE_URL = process.env.BDZ_API_BASE_URL ?? 'https://api.bulldozer-collective.fr/v2';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });
const sqs = new SQSClient({ region: REGION });

/** États d'un traitement long. Les mêmes que ceux de la plateforme, pour ne rien réapprendre. */
export const JOB_STATES = ['PENDING', 'RUNNING', 'SUCCESS', 'FAILURE'];

/**
 * Marge après le temps imparti à la fonction, au-delà de laquelle un travail encore RUNNING est
 * considéré perdu. Une fonction tuée par un dépassement de temps ou de mémoire meurt SANS pouvoir
 * écrire son échec : sans cette échéance, son travail resterait RUNNING pour toujours et personne
 * ne le saurait. L'état est donc DÉRIVÉ à la lecture, ce qui évite tout ramasseur.
 */
const JOB_GRACE_MS = 60_000;

// ─────────────────────────────────────────────────────────── la base

/**
 * Une collection de documents, cloisonnée par projet.
 *
 * La clé de partition vaut `{projet}#{collection}` et n'est jamais exposée : une app ne peut pas
 * exprimer une lecture hors de son projet actif, même par erreur.
 */
function collection(projectId, name) {
  const pk = `${projectId}#${name}`;

  // Nommée avant l'objet plutôt que définie dedans : `all` s'appuie dessus, et passer par `this` la
  // casserait dès qu'une app écrit `const { all } = notes`.
  const list = async (options = {}) => {
    const limit = options.limit ?? 100;
    const items = [];
    let scanned = 0;
    let startKey = decodeCursor(options.after);
    let lastRaw = null;

    // Avec un filtre, la limite de DynamoDB borne les documents LUS et non les documents rendus :
    // une page peut donc n'en rapporter aucun alors qu'il en reste. Sans cette boucle, `list`
    // rendrait une liste vide sur une collection qui contient ce qu'on cherche.
    while (items.length < limit) {
      // Le RESTE, pas la limite totale : demander la limite entière à chaque tour ferait rendre par
      // une page plus de documents qu'il n'en manque, et les surnuméraires seraient jetés sans
      // qu'aucun curseur ne permette de les retrouver.
      const result = await db.send(new QueryCommand(
        buildQuery(pk, TABLE, { ...options, limit: limit - items.length, startKey })));
      scanned += result.ScannedCount ?? 0;
      for (const raw of result.Items ?? []) {
        items.push(strip(raw));
        lastRaw = raw;
      }
      startKey = result.LastEvaluatedKey;
      if (!startKey) {
        break;
      }
    }

    return {
      items,
      // Le curseur se déduit du dernier document RETENU, jamais de LastEvaluatedKey : avec un
      // filtre, celui-ci marque où la lecture s'est arrêtée, ce qui est au-delà de ce qu'on rend.
      // Reprendre là sauterait silencieusement les documents intermédiaires.
      nextCursor: startKey && lastRaw ? encodeCursor(lastRaw, options.by) : undefined,
      scanned,
    };
  };

  return {
    /** Crée ou remplace un document. Sans `id`, il en est attribué un. */
    async put(document) {
      const id = document.id ?? randomUUID();
      const item = { ...document, pk, sk: id, id, updatedAt: new Date().toISOString() };
      await db.send(new PutCommand({ TableName: TABLE, Item: item }));
      return strip(item);
    },

    async get(id) {
      const got = await db.send(new GetCommand({ TableName: TABLE, Key: { pk, sk: id } }));
      return got.Item ? strip(got.Item) : null;
    },

    /**
     * Les documents de la collection : tri, filtre et limite.
     *
     * L'axe de tri est l'identifiant par défaut — et un identifiant attribué par {@link put} étant
     * tiré au hasard, l'ordre est alors stable mais **arbitraire**, et surtout pas chronologique.
     * `by` choisit un autre axe, parmi les champs déclarés au manifeste sous `indexes`.
     *
     * ┌─ Ce que coûte une lecture, et pourquoi le résultat le dit ────────────────────────────────┐
     * │ Un tri ou un filtre porté par l'axe est **borné** : demander 10 documents en lit 10.        │
     * │ Un filtre sur tout autre champ oblige à lire pour trier ensuite — le résultat est juste,    │
     * │ mais peut avoir coûté toute la collection. `scanned` dit lequel des deux vient de se        │
     * │ produire, parce que rien d'autre ne le distingue : même appel, même réponse, mille fois     │
     * │ le prix.                                                                                    │
     * └────────────────────────────────────────────────────────────────────────────────────────────┘
     *
     * @param options.by       champ servant d'axe de tri, déclaré au manifeste. Défaut : l'id.
     * @param options.reverse  parcourt l'axe à l'envers — le plus grand d'abord.
     * @param options.where    `{ statut: 'ouvert' }`, ou `{ createdAt: { gte: '2026-08-01' } }`.
     * @param options.limit    nombre maximum rendu, 100 par défaut.
     * @param options.after    `nextCursor` d'un appel précédent. Opaque : ne pas le construire.
     * @returns `{ items, nextCursor, scanned }` — `nextCursor` absent quand il n'y a plus rien,
     *          donc une boucle « tant que nextCursor » s'arrête d'elle-même.
     */
    list,

    /**
     * Tous les documents, page après page, sans écrire la boucle.
     *
     * ```js
     * for await (const lead of leads.all({ where: { statut: 'ouvert' } })) { … }
     * ```
     *
     * C'est la façon honnête de compter, de sommer ou de regrouper : la plateforme ne sait rien
     * faire de tout cela, et un `count()` qui lirait la collection derrière un nom court laisserait
     * croire le contraire. Ici, `all` dit ce qu'il fait.
     */
    async *all(options = {}) {
      let after = options.after;
      for (;;) {
        const page = await list({ ...options, limit: options.pageSize ?? 500, after });
        yield* page.items;
        if (!page.nextCursor) {
          return;
        }
        after = page.nextCursor;
      }
    },

    async delete(id) {
      await db.send(new DeleteCommand({ TableName: TABLE, Key: { pk, sk: id } }));
    },
  };
}

// ─────────────────────────────────────────────────────────── la traduction d'une requête

/** L'attribut qui porte l'ordre : la clé de tri de la table, ou le champ indexé choisi. */
const AXIS_ON_TABLE = 'sk';

/** Ce qu'une condition de clé sait exprimer. Le reste ne peut être qu'un filtre. */
const KEY_OPERATORS = { gt: '>', gte: '>=', lt: '<', lte: '<=' };

/**
 * Traduit une demande de l'app en requête DynamoDB. Pure, donc éprouvable sans aucune ressource.
 *
 * La règle qui décide de tout : une condition **portée par l'axe** devient une condition de clé,
 * donc une lecture bornée ; toute autre devient un filtre, appliqué après lecture. Le résultat est
 * le même, le prix ne l'est pas.
 */
export function buildQuery(pk, table, options = {}) {
  const { by, reverse = false, where = {}, limit = 100, startKey } = options;
  const axis = by ?? AXIS_ON_TABLE;

  const names = { '#pk': 'pk' };
  const values = { ':pk': pk };
  const keyConditions = ['#pk = :pk'];
  const filters = [];
  let n = 0;

  for (const [field, condition] of Object.entries(where)) {
    const alias = `#f${n}`;
    // `id` et la clé de tri sont le même attribut : une app qui filtre sur `id` doit obtenir une
    // condition de clé, pas un filtre — sinon elle paie la collection entière pour un identifiant.
    const attribute = !by && (field === 'id' || field === AXIS_ON_TABLE) ? AXIS_ON_TABLE : field;
    names[alias] = attribute;
    const expression = translate(alias, `:v${n}`, condition, values);
    (attribute === axis && expression.keyable ? keyConditions : filters).push(expression.text);
    n += 1;
  }

  return {
    TableName: table,
    ...(by ? { IndexName: `by-${by}` } : {}),
    KeyConditionExpression: keyConditions.join(' AND '),
    ...(filters.length ? { FilterExpression: filters.join(' AND ') } : {}),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    Limit: limit,
    ...(reverse ? { ScanIndexForward: false } : {}),
    ...(startKey ? { ExclusiveStartKey: startKey } : {}),
  };
}

/**
 * Une condition, en expression DynamoDB.
 *
 * `keyable` dit si elle peut servir de condition de clé : `<>`, `in` et `contains` ne le peuvent
 * pas, et les proposer sur l'axe donnerait une requête refusée par le moteur plutôt qu'une lecture
 * chère — un échec franc, mais au mauvais endroit.
 */
function translate(alias, value, condition, values) {
  if (condition === null || typeof condition !== 'object' || Array.isArray(condition)) {
    values[value] = condition;
    return { text: `${alias} = ${value}`, keyable: true };
  }

  const [operator] = Object.keys(condition);
  const operand = condition[operator];

  if (operator === 'between') {
    values[`${value}a`] = operand[0];
    values[`${value}b`] = operand[1];
    return { text: `${alias} BETWEEN ${value}a AND ${value}b`, keyable: true };
  }
  if (operator === 'beginsWith') {
    values[value] = operand;
    return { text: `begins_with(${alias}, ${value})`, keyable: true };
  }
  if (KEY_OPERATORS[operator]) {
    values[value] = operand;
    return { text: `${alias} ${KEY_OPERATORS[operator]} ${value}`, keyable: true };
  }
  if (operator === 'not') {
    values[value] = operand;
    return { text: `${alias} <> ${value}`, keyable: false };
  }
  if (operator === 'contains') {
    values[value] = operand;
    return { text: `contains(${alias}, ${value})`, keyable: false };
  }
  if (operator === 'in') {
    const placeholders = operand.map((item, i) => {
      values[`${value}_${i}`] = item;
      return `${value}_${i}`;
    });
    return { text: `${alias} IN (${placeholders.join(', ')})`, keyable: false };
  }
  throw new Error(`Condition inconnue « ${operator} ». Attendu : une valeur, ou l'un de `
    + `gt, gte, lt, lte, between, beginsWith, not, contains, in.`);
}

/**
 * Le curseur porte la clé complète du dernier document rendu — celle de la table et, s'il y a un
 * axe, celle de l'index. Opaque volontairement : une app qui le fabriquerait se lierait à la forme
 * interne des clés, ce que tout le reste de cette aide s'emploie à lui épargner.
 */
function encodeCursor(raw, by) {
  const key = { pk: raw.pk, sk: raw.sk };
  if (by && raw[by] !== undefined) {
    key[by] = raw[by];
  }
  return Buffer.from(JSON.stringify(key), 'utf8').toString('base64url');
}

function decodeCursor(cursor) {
  if (!cursor) {
    return undefined;
  }
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Curseur illisible : passez le `nextCursor` rendu tel quel.');
  }
}

/** Les clés techniques ne sortent jamais : une app ne doit pas apprendre à les manipuler. */
function strip(item) {
  const { pk, sk, ...rest } = item;
  return rest;
}

// ─────────────────────────────────────────────────────────── les fichiers

function files(projectId) {
  const prefix = `${STORAGE_PREFIX}proj-${projectId}/`;
  const keyOf = (name) => {
    // Un nom qui remonte l'arborescence sortirait du préfixe du projet, donc de son cloisonnement.
    if (name.includes('..') || name.startsWith('/')) {
      throw new Error(`Nom de fichier invalide : ${name}`);
    }
    return prefix + name;
  };

  return {
    async put(name, content, contentType = 'application/octet-stream') {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET, Key: keyOf(name), Body: content, ContentType: contentType,
      }));
      return { name };
    },

    async get(name) {
      const got = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: keyOf(name) }));
      return Buffer.from(await got.Body.transformToByteArray());
    },

    async list() {
      const listed = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
      return (listed.Contents ?? []).map((object) => ({
        name: object.Key.slice(prefix.length),
        size: object.Size,
        updatedAt: object.LastModified,
      }));
    },

    /**
     * Une URL de téléchargement à durée limitée, à donner au navigateur.
     *
     * C'est la seule façon correcte de servir un fichier : le faire transiter par l'app le
     * ferait passer par la mémoire de la fonction, avec une limite de taille et un coût inutiles.
     */
    async url(name, expiresInSeconds = 300) {
      return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: keyOf(name) }),
        { expiresIn: expiresInSeconds });
    },

    async delete(name) {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: keyOf(name) }));
    },
  };
}

// ─────────────────────────────────────────────────────────── les traitements longs

const JOBS_COLLECTION = '__jobs';

function jobs(projectId, timeoutSec) {
  const store = collection(projectId, JOBS_COLLECTION);

  return {
    /** Démarre un traitement. Rend immédiatement la main : le travail se fait à côté. */
    async start(type, payload = {}) {
      const job = await store.put({
        type,
        state: 'PENDING',
        payload,
        startedAt: new Date().toISOString(),
        // Le travail dispose du temps imparti à la fonction, plus une marge.
        expiresAt: new Date(Date.now() + timeoutSec * 1000 + JOB_GRACE_MS).toISOString(),
      });
      await sqs.send(new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify({ jobId: job.id, type, payload, projectId }),
      }));
      return { id: job.id, type, state: 'PENDING' };
    },

    /** L'état d'un traitement, tel que l'endpoint automatique le rend. */
    async status(id) {
      const job = await store.get(id);
      if (!job) {
        return null;
      }
      // L'échéance dépassée sur un travail encore en cours signifie que la fonction est morte
      // sans pouvoir écrire son échec. On le dit, plutôt que de laisser croire qu'il progresse.
      if (job.state === 'RUNNING' && job.expiresAt && Date.parse(job.expiresAt) < Date.now()) {
        return { ...job, state: 'FAILURE', error: 'Le traitement a été interrompu.' };
      }
      return job;
    },
  };
}

// ─────────────────────────────────────────────────────────── l'API Bulldozer

/**
 * Appelle l'API Bulldozer avec le jeton de l'utilisateur connecté.
 *
 * Le jeton est celui de l'appelant, relayé tel quel : l'app n'a donc jamais plus de droits que la
 * personne qui l'utilise. Les en-têtes de client et de projet sont posés d'office.
 */
function bulldozerApi(token, customerId, projectId) {
  const call = async (method, path, body, params) => {
    if (!token) {
      throw new Error("L'API Bulldozer n'est joignable que depuis une requête d'un utilisateur.");
    }
    const url = new URL(API_BASE_URL + path);
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Bdz-Customer-Id': customerId,
        'X-Bdz-Project-Id': projectId,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      // Les trois codes que l'app doit savoir distinguer, dits en clair plutôt qu'en numéro.
      if (response.status === 402) throw new Error(`Plus de jetons disponibles. ${detail}`);
      if (response.status === 403) throw new Error(`Accès refusé par la plateforme. ${detail}`);
      if (response.status === 429) throw new Error(`Trop de requêtes, réessayez. ${detail}`);
      throw new Error(`Appel ${method} ${path} en échec (${response.status}). ${detail}`);
    }
    return response.status === 204 ? null : response.json();
  };

  return {
    get: (path, params) => call('GET', path, undefined, params),
    post: (path, body) => call('POST', path, body),
    put: (path, body) => call('PUT', path, body),
    patch: (path, body) => call('PATCH', path, body),
    delete: (path, params) => call('DELETE', path, undefined, params),
  };
}

// ─────────────────────────────────────────────────────────── le contexte

const SENSITIVE = /token|secret|password|authorization|apikey/i;

function logger(projectId) {
  const emit = (level, message, data) => {
    const safe = data && typeof data === 'object'
      ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, SENSITIVE.test(k) ? '***' : v]))
      : data;
    console.log(JSON.stringify({ level, projectId, message, data: safe }));
  };
  return {
    info: (m, d) => emit('INFO', m, d),
    warn: (m, d) => emit('WARN', m, d),
    error: (m, d) => emit('ERROR', m, d),
  };
}

function buildContext({ userId, customerId, projectId, role, token, timeoutSec }) {
  return {
    /** Qui appelle. Vient de la plateforme, pas de la requête : infalsifiable par l'app. */
    user: userId ? { id: userId, role } : null,
    project: { id: projectId, customerId },
    db: { collection: (name) => collection(projectId, name) },
    files: files(projectId),
    jobs: jobs(projectId, timeoutSec),
    bulldozer: bulldozerApi(token, customerId, projectId),
    log: logger(projectId),
    /** Réponse JSON, pour n'avoir jamais à construire un objet de réponse à la main. */
    json: (body, status = 200) => ({ __json: true, status, body }),
  };
}

// ─────────────────────────────────────────────────────────── le point d'entrée

/**
 * Déclare une app. C'est la seule chose qu'une app exporte.
 *
 * @param definition.routes  `{ 'GET /notes': async (request, ctx) => … }`. Les chemins sont
 *                           relatifs : la plateforme ajoute le préfixe public.
 * @param definition.jobs    `{ 'mon-traitement': async (payload, ctx) => … }`. Ce que le handler
 *                           rend devient le résultat du traitement.
 */
export function defineApp(definition) {
  return async (event) => {
    if (Array.isArray(event?.Records)) {
      return runJobs(definition, event.Records);
    }
    return runHttp(definition, event);
  };
}

/** Extrait le chemin relatif : la plateforme sert l'app sous /{client}/{app}/api. */
export function relativePath(rawPath) {
  return (rawPath ?? '').replace(/^\/[^/]+\/[^/]+\/api/, '') || '/';
}

/** Trouve la route déclarée qui correspond, en acceptant un paramètre final `{id}`. */
export function matchRoute(routes, method, path) {
  const exact = routes[`${method} ${path}`] ?? routes[path];
  if (exact) return { handler: exact, params: {} };

  for (const [declaration, handler] of Object.entries(routes)) {
    const [declaredMethod, declaredPath] = declaration.includes(' ')
      ? declaration.split(' ')
      : ['', declaration];
    if (declaredMethod && declaredMethod !== method) continue;
    const names = [];
    const pattern = declaredPath.replace(/\{(\w+)\}/g, (_, name) => {
      names.push(name);
      return '([^/]+)';
    });
    if (pattern === declaredPath) continue;
    const found = new RegExp(`^${pattern}$`).exec(path);
    if (found) {
      return { handler, params: Object.fromEntries(names.map((n, i) => [n, found[i + 1]])) };
    }
  }
  return null;
}

async function runHttp(definition, event) {
  const sealed = event?.requestContext?.authorizer?.lambda ?? {};
  if (!sealed.projectId) {
    return reply(401, { error: "Cette application n'est accessible qu'après connexion." });
  }

  const ctx = buildContext({
    userId: sealed.userId,
    customerId: sealed.customerId,
    projectId: sealed.projectId,
    role: sealed.role,
    token: bearerToken(event),
    timeoutSec: Number(process.env.BDZ_TIMEOUT_SEC ?? 30),
  });

  const method = event.requestContext?.http?.method ?? 'GET';
  const path = relativePath(event.rawPath);

  // Fourni d'office : toutes les apps ont le même endpoint d'état, et le front n'a qu'un seul
  // motif à connaître quel que soit ce que l'app fait.
  const jobStatus = /^\/jobs\/([^/]+)$/.exec(path);
  if (method === 'GET' && jobStatus) {
    const job = await ctx.jobs.status(jobStatus[1]);
    return job ? reply(200, job) : reply(404, { error: 'Traitement inconnu.' });
  }

  const route = matchRoute(definition.routes ?? {}, method, path);
  if (!route) {
    return reply(404, { error: `Aucune route ${method} ${path}.` });
  }

  try {
    const request = new Request(`https://app.internal${path}`, {
      method,
      headers: event.headers ?? {},
      ...(event.body ? { body: event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body } : {}),
    });
    request.params = route.params;
    const result = await route.handler(request, ctx);
    return normalise(result);
  } catch (error) {
    // Le message est rendu à l'appelant : une app dont l'erreur est muette est indébuggable par
    // son auteur, qui n'a pas accès aux journaux de la plateforme.
    ctx.log.error('Erreur non rattrapée', { message: String(error?.message ?? error) });
    return reply(500, { error: String(error?.message ?? error) });
  }
}

async function runJobs(definition, records) {
  for (const record of records) {
    const message = JSON.parse(record.body);
    const store = collection(message.projectId, JOBS_COLLECTION);
    const job = await store.get(message.jobId);

    // La file livre AU MOINS une fois : un travail déjà terminé ne doit pas être refait. Sans
    // cette garde, un message redélivré dupliquerait des écritures ou des envois.
    if (!job || job.state === 'SUCCESS' || job.state === 'FAILURE') {
      continue;
    }

    const handler = definition.jobs?.[message.type];
    if (!handler) {
      await store.put({ ...job, state: 'FAILURE', error: `Traitement "${message.type}" inconnu.` });
      continue;
    }

    await store.put({ ...job, state: 'RUNNING' });
    const ctx = buildContext({
      userId: null,
      customerId: process.env.BDZ_CUSTOMER_ID,
      projectId: message.projectId,
      role: null,
      token: null,
      timeoutSec: Number(process.env.BDZ_TIMEOUT_SEC ?? 30),
    });

    try {
      const result = await handler(message.payload, ctx);
      await store.put({
        ...job, state: 'SUCCESS', result: result ?? null, finishedAt: new Date().toISOString(),
      });
    } catch (error) {
      await store.put({
        ...job, state: 'FAILURE', error: String(error?.message ?? error),
        finishedAt: new Date().toISOString(),
      });
    }
  }
  // Les échecs sont écrits dans le document du travail, pas remontés à la file : une redélivrance
  // ne referait qu'échouer, et le message finirait dans la file d'attente morte sans que personne
  // ne le voie. L'auteur, lui, lit l'état par l'endpoint.
  return { batchItemFailures: [] };
}

function bearerToken(event) {
  const raw = Object.entries(event?.headers ?? {})
    .find(([key]) => key.toLowerCase() === 'authorization')?.[1];
  const [scheme, value] = String(raw ?? '').split(' ');
  return scheme?.toLowerCase() === 'bearer' && value ? value : null;
}

function reply(status, body) {
  return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

/** Accepte ce que ctx.json produit, un objet nu, ou une Response. */
function normalise(result) {
  if (result && result.__json) return reply(result.status, result.body);
  if (result instanceof Response) {
    return result.text().then((body) => ({
      statusCode: result.status,
      headers: Object.fromEntries(result.headers.entries()),
      body,
    }));
  }
  return reply(200, result ?? {});
}
