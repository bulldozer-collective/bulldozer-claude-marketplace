#!/usr/bin/env node
/**
 * Runs an app's service on this machine, before it is ever published.
 *
 * Without this, the only way to learn that a service works is to package it, upload it, wait for
 * the review, and let it deploy — several minutes to discover a typo, and the app's logs cannot be
 * read afterwards, so a failure in production says almost nothing.
 *
 * ┌─ The one design decision that matters ─────────────────────────────────────────────────────┐
 * │ The **real** `bulldozer.mjs` runs here, untouched. Only the five modules it imports are      │
 * │ replaced, by in-memory stand-ins dropped into a `node_modules/` next to the copied code.     │
 * │ Rewriting the helper for a local mode would have meant testing against a different router,   │
 * │ different key building and a different job state machine than production — a harness that    │
 * │ passes while the app is broken is worse than no harness.                                     │
 * └─────────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Nothing is installed and nothing is written outside a temporary folder, which is removed on exit.
 *
 * Usage:
 *   node try_service.mjs --app ./my-app \
 *       --request 'POST /notes {"text":"hello"}' \
 *       --request 'GET /notes'
 *
 *   node try_service.mjs --app ./my-app --request 'GET /leads?' --verbose
 *
 * Who is calling, for a route that depends on it:
 *   --project-role MANAGER          the caller's role in the project — MEMBER by default
 *   --roles bulldozer-core-admin    their Bulldozer platform roles, comma-separated — none by default
 *
 * These are the two facets `ctx.project.role` and `ctx.user.roles`, sealed separately by the
 * platform. A route reserved to managers or to staff is only testable here with them.
 *
 * Long tasks queued by a request are run straight away, exactly as the platform would, so a single
 * command exercises the whole round trip. `--no-tasks` leaves them queued.
 *
 * Calls to the Bulldozer API are only possible with `--token`, and are then **real**: a POST writes
 * real data in the project you name. Without a token, a route that calls `ctx.bulldozer` fails
 * loudly rather than silently doing nothing.
 *
 * Exit codes:
 *   0  nothing broke — a 4xx is the app answering, not a failure
 *   1  a request answered 5xx, a task failed, or the service could not even load
 *   2  bad usage
 */

import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);

// ─────────────────────────────────────────────────────────── les doublures

// Voisines de ce script plutôt qu'écrites dans des chaînes : embarquées, elles devenaient
// illisibles à force d'échappements, et rien ne les vérifiait — pas même `node --check`.
const FAKES_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fakes');

const FAKES = [
  'bdz-try-shared', 'client-dynamodb', 'lib-dynamodb',
  'client-s3', 's3-request-presigner', 'client-sqs',
];

// ─────────────────────────────────────────────────────────── arguments

/**
 * The two values a project membership can carry. Validated rather than passed through, because the
 * harness used to seal a made-up `PROJECT_MEMBER`: an app testing against the real constant failed
 * locally for a reason no one could see, and a harness that lies about the event is worse than no
 * harness.
 */
const PROJECT_ROLES = ['PROJECT_MEMBERSHIP_ROLE_MEMBER', 'PROJECT_MEMBERSHIP_ROLE_MANAGER'];

function projectRoleOf(value) {
  const full = value.startsWith('PROJECT_MEMBERSHIP_ROLE_')
    ? value
    : `PROJECT_MEMBERSHIP_ROLE_${value.toUpperCase()}`;
  if (!PROJECT_ROLES.includes(full)) {
    throw new Error(`--project-role must be one of ${PROJECT_ROLES.join(', ')} (or MEMBER / MANAGER)`);
  }
  return full;
}

function parseArguments(argv) {
  const options = { app: null, requests: [], tasks: true, token: null, verbose: false };
  let customerId = '00000000-0000-0000-0000-0000000000c0';
  let projectId = '00000000-0000-0000-0000-0000000000b0';
  let userId = '00000000-0000-0000-0000-0000000000a0';
  let projectRole = 'PROJECT_MEMBERSHIP_ROLE_MEMBER';
  let roles = [];

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case '--app': options.app = value; i += 1; break;
      case '--request': options.requests.push(value); i += 1; break;
      case '--token': options.token = value; i += 1; break;
      case '--customer-id': customerId = value; i += 1; break;
      case '--project-id': projectId = value; i += 1; break;
      case '--user-id': userId = value; i += 1; break;
      // Les deux facettes que la plateforme scelle séparément. Sans elles, un chemin réservé aux
      // managers ou au staff ne serait pas essayable en local — et l'auteur le découvrirait en
      // production.
      case '--project-role': projectRole = projectRoleOf(value); i += 1; break;
      case '--roles': roles = value.split(',').map((r) => r.trim()).filter(Boolean); i += 1; break;
      case '--no-tasks': options.tasks = false; break;
      case '--verbose': options.verbose = true; break;
      default:
        throw new Error(`unknown option ${flag}`);
    }
  }
  return { ...options, customerId, projectId, userId, projectRole, roles };
}

/**
 * `POST /notes {"text":"hi"}` → method, path, query, body. The body is everything after the path.
 *
 * The query string is split off the path, because the platform delivers the two separately. Leaving
 * `?limit=5` inside the path made route matching fail here while it worked in production — a harness
 * that diverges on the shape of the event cannot be trusted about what the event carries.
 */
function parseRequest(raw) {
  const match = /^\s*([A-Z]+)\s+(\/\S*)\s*([\s\S]*)$/.exec(raw ?? '');
  if (!match || !HTTP_METHODS.has(match[1])) {
    throw new Error(`could not read the request "${raw}" — expected e.g. 'POST /notes {"a":1}'`);
  }
  const [path, query = ''] = match[2].split('?');
  return { method: match[1], path, query, body: match[3].trim() || undefined };
}

// ─────────────────────────────────────────────────────────── running

/** Les index que le manifeste déclare. Le harnais s'y tient, comme la plateforme s'y tiendra. */
async function declaredIndexes(appDir) {
  const manifestPath = join(appDir, 'bulldozer.app.json');
  if (!existsSync(manifestPath)) {
    return [];
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  return (manifest.indexes ?? []).map((index) => index.field).filter(Boolean);
}

async function prepare(appDir) {
  const service = join(appDir, 'backend');
  if (!existsSync(join(service, 'index.mjs'))) {
    throw new Error(`no backend/index.mjs under ${appDir}`);
  }
  if (!existsSync(join(service, 'bulldozer.mjs'))) {
    throw new Error(`no backend/bulldozer.mjs under ${appDir} — copy the shipped helper first`);
  }

  const work = await mkdtemp(join(tmpdir(), 'bdz-try-'));
  await cp(service, work, { recursive: true });

  for (const name of FAKES) {
    const dir = join(work, 'node_modules', '@aws-sdk', name);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'package.json'),
      JSON.stringify({ name: `@aws-sdk/${name}`, type: 'module', main: 'index.mjs' }));
    await cp(join(FAKES_DIR, `${name}.mjs`), join(dir, 'index.mjs'));
  }
  return work;
}

function httpEvent({ method, path, query, body }, context) {
  return {
    // The platform prefixes the public path; `relativePath` strips exactly these two segments.
    rawPath: `/local/app/api${path}`,
    rawQueryString: query ?? '',
    requestContext: {
      http: { method },
      authorizer: {
        lambda: {
          userId: context.userId,
          customerId: context.customerId,
          projectId: context.projectId,
          // La forme exacte de ce que scelle l'authorizer : le rôle DANS le projet d'un côté, les
          // rôles de plateforme de l'autre, JOINTS en une chaîne — le contexte d'API Gateway ne
          // porte que des chaînes, et un harnais qui livrerait un tableau ferait passer en local du
          // code qui casse en production.
          projectRole: context.projectRole,
          roles: context.roles.join(','),
        },
      },
    },
    headers: {
      'content-type': 'application/json',
      ...(context.token ? { authorization: `Bearer ${context.token}` } : {}),
    },
    ...(body === undefined ? {} : { body }),
    isBase64Encoded: false,
  };
}

/**
 * Prints one answer and says whether it counts as a failure.
 *
 * A 4xx does **not** fail the run: it is the app answering, and trying a refusal path on purpose is
 * a legitimate thing to do. Only a 5xx is the app breaking. A route key with a typo would slip
 * through as a 404 — which is why `package_app.py` compares the manifest against the routes the
 * code declares; the two tools cover each other rather than both crying wolf.
 */
function show(label, answer) {
  const status = answer?.statusCode ?? 500;
  const mark = status >= 500 ? '✗' : status >= 400 ? '‣' : '✓';
  let body = answer?.body ?? '';
  try {
    body = JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    /* not JSON: print it as it came */
  }
  console.log(`\n${mark} ${label} → ${status}`);
  if (body) {
    console.log(body.split('\n').map((line) => '  ' + line).join('\n'));
  }
  return status < 500;
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`error: ${error.message}`);
    return 2;
  }
  if (!options.app) {
    console.error("error: --app is required, pointing at the app's working folder");
    return 2;
  }
  if (options.requests.length === 0) {
    console.error("error: pass at least one --request, e.g. --request 'GET /notes'");
    return 2;
  }
  if (options.token) {
    console.error('warning: --token given — calls to the Bulldozer API will be REAL, and a write '
      + 'will write real data.');
  }

  const appDir = resolve(options.app);
  let work;
  try {
    work = await prepare(appDir);
  } catch (error) {
    console.error(`error: ${error.message}`);
    return 2;
  }

  // Semé AVANT que l'app — donc les doublures — ne soit importée : le module partagé fait un `??=`
  // et conserve ce qu'il trouve.
  globalThis.__bdzTry = {
    items: new Map(), objects: new Map(), queue: [],
    indexes: new Set(await declaredIndexes(appDir)),
  };

  Object.assign(process.env, {
    BDZ_REGION: 'local',
    BDZ_TABLE: 'local-table',
    BDZ_BUCKET: 'local-bucket',
    BDZ_STORAGE_PREFIX: 'inst-local/',
    BDZ_QUEUE_URL: 'local-queue',
    BDZ_TIMEOUT_SEC: '30',
    BDZ_CUSTOMER_ID: options.customerId,
  });

  let ok = true;
  try {
    const module = await import(pathToFileURL(join(work, 'index.mjs')).href);
    const handler = module.handler;
    if (typeof handler !== 'function') {
      console.error('error: backend/index.mjs must export `handler` — the result of defineApp(…)');
      return 2;
    }

    const store = globalThis.__bdzTry;

    for (const raw of options.requests) {
      const request = parseRequest(raw);
      const answer = await handler(httpEvent(request, options));
      ok = show(`${request.method} ${request.path}`, answer) && ok;

      // Without a token the helper refuses the Bulldozer API with a message written for production,
      // where it means "nobody is signed in". Here it only means the harness has no token, and an
      // author reading that message would look for a bug that is not there.
      if (!options.token && /API Bulldozer/.test(answer?.body ?? '')) {
        console.log('  ↳ this route calls the Bulldozer API. Re-run with --token <jwt> '
          + '--customer-id … --project-id … to try it for real.');
      }

      // The platform delivers queued work immediately; doing the same here means one command
      // exercises the whole round trip, which is where the interesting failures are.
      while (options.tasks && store.queue.length > 0) {
        const message = store.queue.shift();
        const { jobId, type } = JSON.parse(message.body);
        await handler({ Records: [{ body: message.body }] });
        const job = [...store.items.values()].find((item) => item.id === jobId);
        const failed = job?.state !== 'SUCCESS';
        ok = ok && !failed;
        console.log(`\n${failed ? '✗' : '✓'} task ${type} → ${job?.state ?? 'lost'}`);
        const detail = failed ? job?.error : JSON.stringify(job?.result);
        if (detail) {
          console.log('  ' + detail);
        }
      }
    }

    const documents = [...store.items.values()].filter((item) => !item.pk.endsWith('#__jobs'));
    console.log(`\n— ${documents.length} document(s), ${store.objects.size} file(s), `
      + `${store.queue.length} task(s) still queued`
      + (store.indexes.size ? `, index sur ${[...store.indexes].join(', ')}` : ', aucun index'));
    if (options.verbose) {
      console.log(JSON.stringify({
        documents,
        files: [...store.objects.keys()],
        jobs: [...store.items.values()].filter((item) => item.pk.endsWith('#__jobs')),
      }, null, 2));
    }
  } catch (error) {
    // A throw here is the app failing to even load — a bad import, a syntax error at module level.
    console.error(`\n✗ the service could not run: ${error?.message ?? error}`);
    if (options.verbose) {
      console.error(error);
    }
    ok = false;
  } finally {
    await rm(work, { recursive: true, force: true });
  }

  return ok ? 0 : 1;
}

process.exit(await main());
