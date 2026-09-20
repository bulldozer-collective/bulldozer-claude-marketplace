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
 * Copie livrée par la skill : skills/bulldozer-app-creator-backend/assets/bulldozer.mjs
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
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import {
  RDSDataClient, BeginTransactionCommand, CommitTransactionCommand,
  RollbackTransactionCommand, ExecuteStatementCommand,
} from '@aws-sdk/client-rds-data';
import { randomUUID } from 'node:crypto';

const REGION = process.env.BDZ_REGION;
const TABLE = process.env.BDZ_TABLE;
const BUCKET = process.env.BDZ_BUCKET;
const STORAGE_PREFIX = process.env.BDZ_STORAGE_PREFIX;
const QUEUE_URL = process.env.BDZ_QUEUE_URL;
const API_KEY_SECRET_ARN = process.env.BDZ_API_KEY_SECRET_ARN;
const SQL_CLUSTER_ARN = process.env.BDZ_SQL_CLUSTER_ARN;
const SQL_SECRET_ARN = process.env.BDZ_SQL_SECRET_ARN;
const DATABASE = process.env.BDZ_SQL_DATABASE;
const API_BASE_URL = process.env.BDZ_API_BASE_URL ?? 'https://api.bulldozer-collective.fr/v2';

/** Taille maximale du corps d'une requête reçue par une app. Voir `runHttp` pour le pourquoi. */
const MAX_BODY_BYTES = Number(process.env.BDZ_MAX_BODY_BYTES ?? 1_048_576);

const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });
const sqs = new SQSClient({ region: REGION });
const rds = SQL_CLUSTER_ARN ? new RDSDataClient({ region: REGION }) : null;

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

    /**
     * Une URL d'envoi à durée limitée, à donner au navigateur. Symétrique de `url()`, et pour la
     * même raison — mais celle-ci a une histoire, donc elle a des consignes.
     *
     * Envoyer un fichier dans le corps d'une requête vers l'app le fait traverser CloudFront, son
     * WAF, puis la mémoire de la fonction, et butter sur le plafond de 1 Mo posé plus haut. Le
     * pare-feu coupait même à 8 Ko : aucune app ne pouvait recevoir de fichier, et l'erreur
     * arrivait sous la forme d'un 403 de CloudFront que rien ne rattachait à l'app. Un envoi
     * direct vers le stockage ne rencontre aucune de ces limites.
     *
     * Le navigateur doit faire un `PUT` sur cette URL, en posant exactement le même
     * `Content-Type` que celui donné ici : la signature le couvre, donc un type différent est
     * refusé par le stockage.
     */
    async uploadUrl(name, contentType = 'application/octet-stream', expiresInSeconds = 300) {
      return getSignedUrl(s3, new PutObjectCommand({
        Bucket: BUCKET, Key: keyOf(name), ContentType: contentType,
      }), { expiresIn: expiresInSeconds });
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
      // Sans tâche déclarée au manifeste, l'app n'a pas de file : rien ne consommerait ce message,
      // et le traitement resterait PENDING pour toujours. La file n'est pas créée dans ce cas, parce
      // qu'un consommateur la sonde ~21 600 fois par jour qu'elle serve ou non.
      if (!QUEUE_URL) {
        throw new Error("Cette app n'a pas de traitements longs. Déclarez-les dans « jobs » de son "
          + 'manifeste, en reprenant les noms passés à ctx.jobs.start().');
      }
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
/**
 * La clé d'API de l'installation, lue une fois par conteneur.
 *
 * <p>Elle vit dans Secrets Manager et non dans l'environnement : le code de l'auteur lit
 * `process.env` librement, alors qu'il ne peut pas importer le client AWS — l'empaquetage le
 * refuse. Ce n'est pas une frontière pour autant, du code dans le même processus peut intercepter
 * l'en-tête au moment de l'appel ; c'est un ralentisseur, et il vaut mieux le dire.
 */
let apiKeyPromise = null;

function apiKey() {
  if (!API_KEY_SECRET_ARN) {
    return Promise.resolve(null);
  }
  // Mémorisée sur la PROMESSE, pas sur sa valeur : deux appels concurrents au démarrage d'un
  // conteneur partagent alors la même lecture au lieu d'en faire deux.
  apiKeyPromise ??= new SecretsManagerClient({ region: REGION })
    .send(new GetSecretValueCommand({ SecretId: API_KEY_SECRET_ARN }))
    .then((out) => out.SecretString ?? null);
  return apiKeyPromise;
}

function bulldozerApi(token, customerId, projectId) {
  const call = async (method, path, body, params) => {
    // Sans appelant — une tâche planifiée — l'app s'authentifie comme son propre compte de service.
    // Ce que ça autorise se réduit alors à ses memberships : les projets inscrits à ses tâches.
    const key = token ? null : await apiKey();
    if (!token && !key) {
      throw new Error("L'API Bulldozer n'est joignable que depuis une requête d'un utilisateur, ou "
        + "depuis une tâche planifiée d'une app dont la clé a été déposée.");
    }
    if (key && !projectId) {
      // L'en-tête manquant est un refus côté serveur, pas un laissez-passer : le dire ici plutôt
      // que d'aller chercher un 403 dont la cause ne serait pas évidente.
      throw new Error('Aucun projet actif : un appel à l\'API depuis une tâche planifiée doit '
        + 'nommer son projet. Passez par ctx.forProject(id).');
    }
    const url = new URL(API_BASE_URL + path);
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
    const response = await fetch(url, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : { 'X-Bdz-Api-Key': key }),
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

/**
 * Interroge la base SQL de l'app.
 *
 * ```js
 * const rows = await ctx.sql('SELECT * FROM notes WHERE statut = :statut', { statut: 'ouvert' });
 * ```
 *
 * <strong>Le cloisonnement par projet n'est pas à écrire.</strong> Chaque requête part dans une
 * transaction où le projet actif est posé, et une politique de sécurité au niveau des lignes filtre
 * ce que la base rend. Un `WHERE project_id` oublié ne fait donc rien fuiter — c'est le moteur qui
 * décide, pas la requête.
 *
 * `project_id` n'est pas non plus à renseigner à l'insertion : la plateforme pose un DEFAULT sur la
 * colonne, donc la base estampille le projet actif. L'écrire à la main ne sert à rien et échoue si
 * c'est celui d'un autre projet.
 *
 * Les valeurs passent TOUJOURS par `params`, jamais concaténées : c'est ce qui rend une injection
 * SQL impossible plutôt qu'improbable.
 */
/**
 * L'instruction qui pose le projet du appelant pour la durée de la transaction.
 *
 * <p>`set_config(..., true)` et non `SET LOCAL`, pour une raison mécanique et non par goût :
 * PostgreSQL ne planifie pas SET comme une requête, sa valeur doit être un littéral, et un
 * paramètre lié y produit « syntax error at or near "$1" » — ce qui rendait TOUTE requête d'app
 * impossible, puisque cette instruction précède les autres. set_config est une fonction, appelée
 * dans un SELECT ordinaire : le projet y reste une valeur liée, jamais concaténée.
 *
 * Le troisième argument à `true` donne exactement la portée de SET LOCAL — la valeur meurt avec la
 * transaction. Le Data API recycle les connexions, et une valeur qui survivrait ferait lire le
 * projet du précédent appelant.
 *
 * Exportée pour être éprouvée : c'est une chaîne que rien d'autre ne relit.
 */
export function projectScope(projectId) {
  return {
    sql: 'SELECT set_config(:bdz_key, :bdz_project, true)',
    parameters: [
      { name: 'bdz_key', value: { stringValue: 'bdz.project_id' } },
      { name: 'bdz_project', value: { stringValue: projectId } },
    ],
  };
}

function sqlRunner(projectId) {
  return async (query, params = {}) => {
    if (!rds) {
      throw new Error("Cette app n'a pas de base SQL. Déclarez \"storage\": \"sql\" dans son manifeste.");
    }

    const base = { resourceArn: SQL_CLUSTER_ARN, secretArn: SQL_SECRET_ARN, database: DATABASE };
    const { transactionId } = await rds.send(new BeginTransactionCommand(base));

    try {
      await rds.send(new ExecuteStatementCommand({
        ...base, transactionId, ...projectScope(projectId),
      }));

      const result = await rds.send(new ExecuteStatementCommand({
        ...base,
        transactionId,
        sql: query,
        parameters: Object.entries(params).map(([name, value]) => ({ name, value: sqlValue(value) })),
        includeResultMetadata: true,
      }));

      await rds.send(new CommitTransactionCommand({ ...base, transactionId }));
      return rowsOf(result);
    } catch (error) {
      await rds.send(new RollbackTransactionCommand({ ...base, transactionId })).catch(() => {});
      throw error;
    }
  };
}

/** Une valeur JavaScript vers la forme attendue par le Data API. */
function sqlValue(value) {
  if (value === null || value === undefined) return { isNull: true };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { longValue: value } : { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (value instanceof Date) return { stringValue: value.toISOString() };
  // Un objet devient du JSON : c'est ce qu'un auteur attend en écrivant dans une colonne jsonb.
  return { stringValue: typeof value === 'object' ? JSON.stringify(value) : String(value) };
}

/**
 * Les lignes, en objets ordinaires.
 *
 * Le Data API rend des valeurs typées (`{stringValue: …}`) et les noms de colonnes à part : sans
 * cette remise en forme, une app manipulerait des tableaux indexés par position, et un ORDER BY
 * changé plus tard casserait son code sans erreur.
 */
function rowsOf(result) {
  const columns = (result.columnMetadata ?? []).map((c) => c.label ?? c.name);
  return (result.records ?? []).map((record) => Object.fromEntries(
    record.map((cell, i) => [columns[i], cell.isNull ? null : Object.values(cell)[0]]),
  ));
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

/**
 * Les rôles, redécoupés depuis la chaîne scellée.
 *
 * Le contexte d'API Gateway est une table de CHAÎNES : l'autorisateur les a joints par des virgules
 * parce qu'un tableau n'y survivrait pas. Le filtre écarte la chaîne vide, qui rendrait sinon un
 * tableau d'un seul élément vide — donc un `roles.length` de 1 là où il n'y a aucun rôle.
 */
function rolesFrom(sealed) {
  return typeof sealed !== 'string' ? [] : sealed.split(',').map((r) => r.trim()).filter(Boolean);
}

/**
 * Refuse une ressource partitionnée quand aucun projet n'est actif.
 *
 * <p>C'est l'état d'une tâche planifiée : personne n'appelle, donc aucun projet n'est scellé. Le
 * refus est délibérément bruyant plutôt que silencieux — une lecture qui rendrait « rien » laisserait
 * croire que la base est vide, et l'auteur chercherait le défaut dans ses données.
 */
function requireProject(projectId, what) {
  if (!projectId) {
    throw new Error(`Aucun projet actif : ${what} est partitionné par projet, et une tâche `
      + "planifiée n'a pas d'appelant. Passez par ctx.forProject(id) pour choisir sur quel projet "
      + 'travailler, ou ctx.projects() pour parcourir ceux que la plateforme autorise.');
  }
  return projectId;
}

function buildContext({ userId, customerId, projectId, projectRole, roles, token, timeoutSec,
                        mode = 'user' }) {
  const scoped = (id) => buildContext({
    userId, customerId, projectId: id, projectRole, roles, token, timeoutSec, mode,
  });

  return {
    /**
     * D'où vient cette exécution : `'user'` pour une requête, `'job'` pour un traitement long,
     * `'schedule'` pour une tâche planifiée. Les deux derniers n'ont pas d'appelant, donc
     * `ctx.user` y vaut `null`.
     */
    mode,
    /** Le client de l'installation. Toujours présent, y compris sans projet actif. */
    customerId,
    /**
     * Le contexte d'un projet précis. Les données, les fichiers et les traitements y sont
     * partitionnés exactement comme pour une requête entrante.
     *
     * <p>Le magasin de l'app ne contient que ses propres données : nommer un projet ici ne donne
     * donc accès à rien d'autre qu'à sa propre installation. Ce qui est réellement autorisé côté
     * plateforme se joue dans `ctx.bulldozer`, que le serveur contrôle de son côté.
     */
    forProject: (id) => {
      if (!id) {
        throw new Error('ctx.forProject(id) demande un identifiant de projet.');
      }
      return scoped(id);
    },
    /** Les projets sur lesquels cette installation est autorisée à travailler sans appelant. */
    projects: async () => {
      throw new Error("La liste des projets autorisés n'est pas encore disponible : elle vient de "
        + "l'API Bulldozer, que le mode service ne sait pas encore joindre. En attendant, une tâche "
        + 'planifiée travaille sur un projet nommé explicitement via ctx.forProject(id).');
    },
    /**
     * Qui appelle. Vient de la plateforme, pas de la requête : infalsifiable par l'app.
     *
     * `roles` sont les rôles de la personne sur la plateforme, au pluriel. À ne pas confondre avec
     * `project.role`, qui est son rôle dans CE projet — deux questions différentes, longtemps
     * confondues dans un seul champ.
     */
    user: userId ? { id: userId, roles: rolesFrom(roles) } : null,
    project: projectId ? { id: projectId, customerId, role: projectRole ?? '' } : null,
    db: {
      collection: (name) => {
        // Symétrique du refus de ctx.sql : les deux magasins s'excluent, et une app doit
        // l'apprendre par un message plutôt que par un ResourceNotFound au premier appel.
        if (!TABLE) {
          throw new Error("Cette app n'a pas de magasin de documents. Déclarez \"storage\": "
            + '"documents" dans son manifeste, ou utilisez ctx.sql si elle est en "sql".');
        }
        return collection(requireProject(projectId, 'ctx.db'), name);
      },
    },
    sql: (query, params) => sqlRunner(requireProject(projectId, 'ctx.sql'))(query, params),
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
 * @param definition.openapi  Facultatif. Un fragment OpenAPI fusionné par-dessus la documentation
 *                           que l'aide génère à partir des routes, et servie d'office à
 *                           `…/api/openapi.yaml`. Sert à ce que l'aide ne peut pas deviner : le
 *                           contenu des corps de requête et de réponse.
 *                           `{ info: { title: 'Mon app' }, paths: { '/notes': { post: { … } } } }`
 */
export function defineApp(definition) {
  return async (event) => {
    if (event?.trigger === 'schedule') {
      return runSchedule(definition, event);
    }
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

/**
 * La chaîne de requête, prête à être recollée au chemin.
 *
 * La plateforme la livre à part du chemin : ce qui est reconstruit ici, c'est l'URL que le code de
 * l'app croit recevoir. Deux sources sont acceptées, parce que selon la façon dont l'app est
 * appelée l'une ou l'autre est fournie.
 */
export function queryOf(event) {
  if (event?.rawQueryString) {
    return `?${event.rawQueryString}`;
  }
  const parameters = event?.queryStringParameters;
  if (!parameters || Object.keys(parameters).length === 0) {
    return '';
  }
  return `?${new URLSearchParams(parameters).toString()}`;
}

/**
 * Trouve la route déclarée qui correspond, en acceptant un paramètre final `{id}`.
 *
 * Rend aussi la `declaration` qui a correspondu — le motif, pas le chemin appelé. C'est lui que la
 * mesure d'usage enregistre : agréger sur `/notes/42` ne dirait rien, agréger sur `/notes/{id}` dit
 * quel endpoint sert.
 */
export function matchRoute(routes, method, path) {
  const exactDeclaration = routes[`${method} ${path}`] !== undefined ? `${method} ${path}` : path;
  const exact = routes[`${method} ${path}`] ?? routes[path];
  if (exact) return { handler: exact, params: {}, declaration: exactDeclaration };

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
      return {
        handler, params: Object.fromEntries(names.map((n, i) => [n, found[i + 1]])), declaration,
      };
    }
  }
  return null;
}

// ────────────────────────────────────────────── la documentation de l'API

/**
 * Les deux adresses où l'aide sert la documentation. Écrites comme constantes, et jamais sous la
 * forme d'une clé de route : le script d'empaquetage relit tous les fichiers de l'archive à la
 * recherche de clés « MÉTHODE /chemin », et il lirait une telle clé comme une route de l'app —
 * puis refuserait l'archive parce que le manifeste ne la déclare pas.
 */
const OPENAPI_YAML = '/openapi.yaml';
const OPENAPI_JSON = '/openapi.json';

/** Ce qu'OpenAPI sait nommer. Sert à développer une route déclarée sans méthode. */
const OPENAPI_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

/** Les méthodes qui portent un corps, donc les seules que le plafond de taille concerne. */
const METHODS_WITH_BODY = new Set(['post', 'put', 'patch']);

/**
 * Les réponses que l'aide produit elle-même, définies une fois et référencées ensuite.
 *
 * Une seule chose est documentée par opération, et c'est la limite du procédé : l'aide ne sait pas
 * quel code de succès une route rend. Elle annonce donc la famille « 2XX » plutôt que 200 —
 * affirmer 200 serait faux sur toute route qui rend 201, ce qu'un POST fait normalement.
 *
 * Pas de 404 non plus : « aucune route ne correspond » n'est pas une réponse de cette opération-ci,
 * c'est ce qu'on obtient quand aucune opération n'est atteinte. Seul /jobs/{id} en déclare un, parce
 * que là il désigne vraiment un traitement inconnu.
 */
const SHARED_RESPONSES = {
  BdzUnauthorized: { description: "Personne n'est connecté : la requête n'a pas de projet scellé." },
  BdzForbidden: { description: 'Refusé en amont : jeton absent, invalide, ou projet non autorisé.' },
  BdzPayloadTooLarge: {
    description: `Le corps de la requête dépasse ${MAX_BODY_BYTES / 1024 / 1024} Mo. Pour un `
      + "fichier, demander une URL d'envoi et envoyer directement au stockage.",
  },
  BdzError: { description: "Erreur non rattrapée dans l'app ; le message est celui de l'exception." },
};

const shared = (name) => ({ $ref: `#/components/responses/${name}` });

function standardResponses(method) {
  return {
    '2XX': { description: 'Succès. Le code exact et le corps dépendent de la route.' },
    401: shared('BdzUnauthorized'),
    403: shared('BdzForbidden'),
    ...(METHODS_WITH_BODY.has(method) ? { 413: shared('BdzPayloadTooLarge') } : {}),
    500: shared('BdzError'),
  };
}

/** Le préfixe public de l'app, tel qu'il apparaît dans la requête. */
export function apiPrefix(rawPath) {
  return (/^\/[^/]+\/[^/]+\/api/.exec(rawPath ?? '') ?? [''])[0];
}

function pathParameters(path) {
  return [...path.matchAll(/\{(\w+)\}/g)].map(([, name]) => ({
    name, in: 'path', required: true, schema: { type: 'string' },
  }));
}

/**
 * Le document OpenAPI de l'app, dérivé de sa table de routes.
 *
 * Dérivé, et non écrit : c'est ce qui le rend structurellement impossible à laisser périmer. Une
 * documentation tenue à la main dérive de son API dès la deuxième modification, et une
 * documentation fausse est pire qu'absente — elle est crue.
 *
 * Ce que l'aide ne peut pas deviner, c'est ce que les corps de requête et de réponse contiennent.
 * L'auteur le fournit par la clé `openapi` de `defineApp`, fusionnée par-dessus ce squelette.
 */
export function openApiDocument(definition, prefix) {
  const paths = {};

  const put = (path, methods, summary) => {
    const parameters = pathParameters(path);
    paths[path] ??= {};
    for (const method of methods) {
      paths[path][method] = {
        ...(summary ? { summary } : {}),
        ...(parameters.length > 0 ? { parameters } : {}),
        responses: standardResponses(method),
      };
    }
  };

  for (const declaration of Object.keys(definition?.routes ?? {})) {
    const [declaredMethod, declaredPath] = declaration.includes(' ')
      ? declaration.split(' ')
      : ['', declaration];
    // Une clé sans méthode répond à TOUTES les méthodes — voir matchRoute. OpenAPI n'a pas de
    // joker, donc les cinq opérations sont écrites : c'est ce que l'app fait réellement, et
    // n'en documenter qu'une serait faux plutôt que synthétique.
    put(declaredPath, declaredMethod ? [declaredMethod.toLowerCase()] : OPENAPI_METHODS);
  }

  // Les routes fournies par l'aide. Les omettre rendrait le document incomplet sur des endpoints
  // que toute app possède, et sur lesquels aucun auteur ne peut renseigner quoi que ce soit.
  put('/jobs/{id}', ['get'], "L'état d'un traitement long.");
  paths['/jobs/{id}'].get.responses[404] = { description: 'Traitement inconnu.' };
  put(OPENAPI_YAML, ['get'], 'Ce document.');
  put(OPENAPI_JSON, ['get'], 'Ce document, en JSON.');

  return deepMerge({
    openapi: '3.1.0',
    info: { title: titleFrom(prefix), version: '1.0.0' },
    // Relatif à dessein : un serveur absolu demanderait l'hôte, que la fonction ne reçoit que si
    // le CDN le transmet. OpenAPI résout une URL relative contre l'adresse du document.
    servers: [{ url: prefix || '/' }],
    paths,
    components: { responses: SHARED_RESPONSES },
  }, definition?.openapi ?? {});
}

/**
 * Le sous-domaine, faute de mieux : le manifeste n'est pas embarqué avec la fonction — seul
 * `backend/` entre dans le bundle — donc le nom déclaré de l'app n'existe pas à l'exécution.
 * L'auteur peut le remplacer par `openapi.info.title`.
 */
function titleFrom(prefix) {
  const segments = (prefix ?? '').split('/').filter(Boolean);
  return segments.length >= 2 ? segments[1] : 'app';
}

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Fusion en profondeur. Un tableau est remplacé, pas concaténé : `servers` doit pouvoir être imposé. */
function deepMerge(base, overlay) {
  if (!isPlainObject(base) || !isPlainObject(overlay)) {
    return overlay === undefined ? base : overlay;
  }
  const merged = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    merged[key] = key in merged ? deepMerge(merged[key], value) : value;
  }
  return merged;
}

/**
 * Sérialise en YAML. Une trentaine de lignes plutôt qu'une dépendance : l'aide ne doit rien avoir
 * à installer, et le document à écrire n'a que des maps, des tableaux et des scalaires.
 */
export function toYaml(value) {
  return `${yamlBlock(value, 0).replace(/^\n/, '')}\n`;
}

/** Rend un fragment commençant soit par une espace (scalaire en ligne), soit par un saut de ligne. */
function yamlBlock(value, depth) {
  const pad = '  '.repeat(depth);

  if (Array.isArray(value)) {
    return value.length === 0
      ? ' []'
      : value.map((item) => `\n${pad}-${yamlBlock(item, depth + 1)}`).join('');
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);
    return entries.length === 0
      ? ' {}'
      : entries.map(([key, item]) => `\n${pad}${yamlScalar(key)}:${yamlBlock(item, depth + 1)}`)
        .join('');
  }

  return ` ${yamlScalar(value)}`;
}

/**
 * Toute chaîne part entre guillemets doubles, échappée par `JSON.stringify`.
 *
 * Ce n'est pas une facilité : les échappements de JSON sont un sous-ensemble de ceux du YAML
 * double-quoté, donc le résultat est valide **par construction**, pour n'importe quelle entrée.
 * Un émetteur qui décide au cas par cas s'il faut des guillemets se casse sur les descriptions
 * d'auteur — celles qui contiennent « : », un guillemet, ou un retour à la ligne.
 */
function yamlScalar(value) {
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(String(value));
}

async function runHttp(definition, event) {
  const sealed = event?.requestContext?.authorizer?.lambda ?? {};
  const token = bearerToken(event);
  if (!sealed.projectId) {
    return reply(401, { error: "Cette application n'est accessible qu'après connexion." });
  }

  // Le client de l'installation est fixe et connu de la fonction ; celui du projet vient du contexte
  // scellé. Qu'ils diffèrent signifie que l'appelant apporte un projet d'un AUTRE client : il en est
  // membre, donc l'autorisateur l'a laissé passer — mais écrire ces données ici les déposerait dans
  // l'installation d'un client qui n'y a aucun droit. C'est le pire cas de la plateforme, et il est
  // atteignable sans rien forger dès qu'une personne appartient à deux clients.
  //
  // Deux absences sont volontairement tolérées : le laissez-passer administrateur ne scelle aucun
  // client, il n'y a donc rien à comparer ; et une installation provisionnée avant que la variable
  // n'existe ne doit pas cesser de répondre.
  const ownCustomerId = process.env.BDZ_CUSTOMER_ID;
  if (sealed.customerId && ownCustomerId && sealed.customerId !== ownCustomerId) {
    return reply(403, {
      error: "Ce projet n'appartient pas au client de cette application.",
    });
  }

  // Le plafond est posé ICI et pas dans le pare-feu, parce que le pare-feu ne sait pas le poser :
  // il ne voit au plus que les 64 premiers kilo-octets d'un corps de requête, donc au-delà il ne
  // distingue pas 100 Ko de 10 Mo. La taille exacte n'est connue qu'à cet endroit.
  if (bodyBytes(event) > MAX_BODY_BYTES) {
    return reply(413, {
      error: `Le contenu envoyé dépasse ${MAX_BODY_BYTES / 1024 / 1024} Mo. `
        + "Pour un fichier, demandez une URL d'envoi avec ctx.files.uploadUrl() et envoyez-le "
        + 'directement, sans passer par cette application.',
    });
  }

  const ctx = buildContext({
    userId: sealed.userId,
    // Le contexte scellé ne nomme pas de client quand l'appelant entre par le laissez-passer
    // administrateur : il n'a pas d'appartenance au projet, donc rien à en tirer. Le client de
    // l'installation, lui, est fixe et connu de la fonction — c'est déjà ce que fait le chemin
    // des traitements longs, plus bas.
    customerId: sealed.customerId || process.env.BDZ_CUSTOMER_ID,
    projectId: sealed.projectId,
    projectRole: sealed.projectRole,
    roles: sealed.roles,
    token,
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

  // Fournie d'office elle aussi, et placée AVANT le routage : une route d'auteur portant le même
  // nom masquerait sinon la documentation, sans que rien ne le signale nulle part.
  if (method === 'GET' && (path === OPENAPI_YAML || path === OPENAPI_JSON)) {
    const document = openApiDocument(definition, apiPrefix(event.rawPath));
    return path === OPENAPI_YAML
      ? replyText(200, 'application/yaml; charset=utf-8', toYaml(document))
      : replyText(200, 'application/json; charset=utf-8', JSON.stringify(document, null, 2));
  }

  const route = matchRoute(definition.routes ?? {}, method, path);
  if (!route) {
    return reply(404, { error: `Aucune route ${method} ${path}.` });
  }

  let response;
  try {
    // La chaîne de requête est recollée ici. Construire l'URL à partir du seul chemin la perdait :
    // `new URL(request.url).searchParams` rendait toujours vide, donc `?limit=5` était ignoré et
    // l'app repartait sur sa valeur par défaut — une réponse plausible, jamais une erreur. C'est le
    // pire genre de défaut, et il a fallu un test de bout en bout comparant 5 demandés à 3 rendus
    // pour le voir.
    const request = new Request(`https://app.internal${path}${queryOf(event)}`, {
      method,
      headers: event.headers ?? {},
      ...(event.body ? { body: event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body } : {}),
    });
    request.params = route.params;
    // `normalise` rend une PROMESSE quand le handler a rendu un objet Response : le `return` direct
    // l'attendait implicitement, une affectation non. Sans ce `await`, la mesure enregistrerait
    // `code: undefined` sur toute app qui rend des Response — sans que la réponse, elle, change.
    response = await normalise(await route.handler(request, ctx));
  } catch (error) {
    // Le message est rendu à l'appelant : une app dont l'erreur est muette est indébuggable par
    // son auteur, qui n'a pas accès aux journaux de la plateforme.
    ctx.log.error('Erreur non rattrapée', { message: String(error?.message ?? error) });
    response = reply(500, { error: String(error?.message ?? error) });
  }

  // Après le rattrapage, pas dedans : un 500 est un usage de l'app comme un autre, et c'est même
  // celui qu'on a le plus envie de voir dans les mesures.
  await recordAppCall(ctx, token, route.declaration, path, response.statusCode);
  return response;
}

/**
 * Enregistre l'appel comme usage de l'app.
 *
 * Ce qui est mesuré, ce sont les routes de l'AUTEUR — l'appelant est déjà passé par le routage
 * quand on arrive ici. L'état des traitements est sondé toutes les deux secondes par l'écran et la
 * documentation est lue par des outils : les compter noierait la seule question à laquelle ces
 * lignes servent à répondre, qui se sert de cette app et pour quoi.
 *
 * Tout le reste se remplit côté plateforme, sans que l'app ait à le dire : l'utilisateur vient du
 * jeton relayé, le client et le projet des en-têtes que `bulldozerApi` pose déjà, et l'origine du
 * claim `azp` du jeton — pour un appel venu de l'écran, le clientId du hosting.
 */
async function recordAppCall(ctx, token, declaration, path, statusCode) {
  // Sans jeton, il n'y a personne à qui attribuer l'appel — c'est le cas du harnais local, et il
  // n'a rien d'anormal. Le signaler ferait apparaître un avertissement à chaque essai de l'auteur,
  // pour une panne qui n'existe pas ; en production l'autorisateur garantit le jeton.
  if (!token) {
    return;
  }

  try {
    await ctx.bulldozer.post('/metrics', {
      type: 'METRIC_TYPE_APP_CALL',
      // Le motif de route, pas le chemin appelé : agréger sur `/notes/42` ne dirait rien.
      reference: declaration,
      path,
      code: statusCode,
      successful: statusCode < 400,
    });
  } catch (error) {
    // Jamais fatal. Une mesure perdue est un trou dans une statistique ; une réponse perdue est une
    // panne pour l'utilisateur, et aucune statistique ne vaut ça.
    ctx.log.warn("Mesure d'usage non enregistrée", { message: String(error?.message ?? error) });
  }
}

/**
 * Une tâche planifiée : EventBridge Scheduler invoque la fonction à l'heure dite.
 *
 * <p>Ce n'est pas une seconde sorte de code. Le gestionnaire exécuté est une entrée de `jobs` —
 * le même que celui qu'un `ctx.jobs.start()` déclencherait — parce qu'une tâche de fond reste une
 * tâche de fond, qu'on la lance ou qu'elle parte seule.
 *
 * <p>Le projet vient de la planification elle-même, où la plateforme l'a écrit quand quelqu'un l'y
 * a inscrit — un appel où son appartenance au projet a été vérifiée. L'app ne le choisit pas, ne le
 * devine pas et ne peut pas en changer : c'est la même garantie que sur une requête HTTP, obtenue
 * autrement. Un couple (tâche, projet) a sa propre planification, donc un tick porte toujours un
 * projet et un seul.
 *
 * <p>Aucune trace n'est écrite dans `__jobs` : rien n'attend le résultat d'un tick, et un
 * enregistrement par nuit et par projet s'accumulerait sans que personne ne le lise. Le journal
 * porte le début, la fin et l'échec.
 */
async function runSchedule(definition, event) {
  const name = event?.name;
  const ctx = buildContext({
    userId: null,
    customerId: process.env.BDZ_CUSTOMER_ID,
    projectId: event?.projectId ?? null,
    projectRole: null,
    roles: null,
    token: null,
    timeoutSec: Number(process.env.BDZ_TIMEOUT_SEC ?? 30),
    mode: 'schedule',
  });

  const handler = definition.jobs?.[name];
  if (!handler) {
    // Le manifeste est censé l'avoir empêché. Si on arrive ici, la planification a survécu au
    // gestionnaire : le dire fort, sinon le tick échouerait chaque nuit sans rien expliquer.
    ctx.log.error('Tâche planifiée inconnue', { name, connues: Object.keys(definition.jobs ?? {}) });
    throw new Error(`Aucun traitement « ${name} » : la planification vise un gestionnaire absent.`);
  }

  ctx.log.info('Tâche planifiée démarrée', { name, projectId: event?.projectId ?? null });
  try {
    const result = await handler({}, ctx);
    ctx.log.info('Tâche planifiée terminée', { name });
    return { ok: true, name, result: result ?? null };
  } catch (error) {
    // Relancé volontairement : c'est ce qui fait échouer l'invocation côté Scheduler, donc ce qui
    // déclenche ses réessais et, à terme, sa file de rebut. Avaler l'erreur rendrait le tick vert.
    ctx.log.error('Tâche planifiée en échec', { name, erreur: String(error?.message ?? error) });
    throw error;
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
      // Un traitement n'a pas d'appelant : ni rôle projet, ni rôles de plateforme.
      projectRole: null,
      roles: null,
      token: null,
      mode: 'job',
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

/**
 * Taille réelle du corps, en octets.
 *
 * API Gateway livre un corps binaire encodé en base64 : mesurer la chaîne telle quelle
 * surestimerait d'un tiers, et un envoi de 800 Ko serait refusé comme s'il dépassait le mégaoctet.
 */
export function bodyBytes(event) {
  if (!event?.body) return 0;
  return Buffer.byteLength(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
}

/** Une réponse qui n'est pas du JSON — la documentation de l'API, seule dans ce cas à ce jour. */
function replyText(status, contentType, body) {
  return { statusCode: status, headers: { 'Content-Type': contentType }, body };
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
