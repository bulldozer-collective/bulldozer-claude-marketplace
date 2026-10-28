import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement } from 'claude-code'

import type {
  AccountPerf, Active, AdAccount, AdPlatform, AdSelection, HealthRow, HostingQuery, HostingRow, ImportSummary, JobRow,
  Loaded, Membership, PerfFigures, ProjectInfo, Tab, TagTone, WriteEntry,
} from '../types'

// The Bulldozer MCP server as /mcp names it when the plugin comes from the marketplace; discoverServer()
// replaces it with the spelling the session actually uses (a plugin synced from claude.ai is named otherwise).
let server = 'plugin:bulldozer:bulldozer'
const CONFIG = 'bulldozer.json'
const PROJECT_PANE = 'bdz-project'
// The objectives in full, opened from the sidebar as a dialog: focused, Escape closes it.
const OBJECTIVES_PANE = 'bdz-objectives'

const memberships = atom({ plugin: 'bulldozer', key: 'memberships' } as const, [])
const active = atom({ plugin: 'bulldozer', key: 'active' } as const, null)
const error = atom({ plugin: 'bulldozer', key: 'error' } as const, null)
// The active client's logo as a data: URI, drawn by the Desktop sidebar.
const clientLogo = atom({ plugin: 'bulldozer', key: 'clientLogo' } as const, null)
const adAccounts = atom({ plugin: 'bulldozer', key: 'adAccounts' } as const, [])
const NO_SELECTION: AdSelection = { META: null, LINKEDIN: null, GOOGLE_ADS: null }
const adSelection = atom({ plugin: 'bulldozer', key: 'adSelection' } as const, NO_SELECTION)
// Targets the user already confirmed this session, as `${projectId}|${platform}|${account}`.
const confirmedTargets = atom({ plugin: 'bulldozer', key: 'confirmedTargets' } as const, [])
// Subscription, objectives, connectors and last imports of the active project, for the Desktop sidebar.
const projectInfo = atom({ plugin: 'bulldozer', key: 'projectInfo' } as const, null)
const needsPermission = atom({ plugin: 'bulldozer', key: 'needsPermission' } as const, false)
const isConfirmingAllow = atom({ plugin: 'bulldozer', key: 'isConfirmingAllow' } as const, false)
const isLoading = atom({ plugin: 'bulldozer', key: 'isLoading' } as const, false)
const isSplashing = atom({ plugin: 'bulldozer', key: 'isSplashing' } as const, false)
const isSwitching = atom({ plugin: 'bulldozer', key: 'isSwitching' } as const, false)
const isSplashShown = atom({ plugin: 'bulldozer', key: 'isSplashShown' } as const, false)
const activeTab = atom({ plugin: 'bulldozer', key: 'activeTab' } as const, 'projet')
const perf = atom({ plugin: 'bulldozer', key: 'perf' } as const, null)
const health = atom({ plugin: 'bulldozer', key: 'health' } as const, null)
const jobs = atom({ plugin: 'bulldozer', key: 'jobs' } as const, null)
const hostings = atom({ plugin: 'bulldozer', key: 'hostings' } as const, null)
const hostingQuery = atom({ plugin: 'bulldozer', key: 'hostingQuery' } as const, null)
const hostingLinks = atom({ plugin: 'bulldozer', key: 'hostingLinks' } as const, {})
const writeLog = atom({ plugin: 'bulldozer', key: 'writeLog' } as const, [])

const OBJECTIVE_LABELS: Record<string, string> = {
  PROJECT_OBJECTIVE_TYPE_COMPANY_PURPOSE: 'Raison d\'être',
  PROJECT_OBJECTIVE_TYPE_TARGETS: 'Cibles',
  PROJECT_OBJECTIVE_TYPE_STRATEGICAL_DECISIONS: 'Décisions stratégiques',
  PROJECT_OBJECTIVE_TYPE_CONSTRAINTS: 'Contraintes',
  PROJECT_OBJECTIVE_TYPE_BUYING_COMMITTEE: 'Comité d\'achat',
  PROJECT_OBJECTIVE_TYPE_FINANCIALS: 'Finances',
  PROJECT_OBJECTIVE_TYPE_FUNNEL: 'Funnel',
  PROJECT_OBJECTIVE_TYPE_SALES_CALL_OBJECTIONS: 'Objections commerciales',
  PROJECT_OBJECTIVE_TYPE_WIN_LOSS_REASON: 'Raisons de gain / perte',
}
const CONNECTOR_LABELS: Record<string, string> = {
  INTEGRATION_PLATFORM_META: 'Meta',
  INTEGRATION_PLATFORM_LINKED_IN: 'LinkedIn',
  INTEGRATION_PLATFORM_GOOGLE_ADS: 'Google Ads',
  INTEGRATION_PLATFORM_MICROSOFT_ADS: 'Microsoft Ads',
  INTEGRATION_PLATFORM_SLACK: 'Slack',
}
// Connector logos copied in assets/; a platform without one is drawn as its initials.
const CONNECTOR_ICONS: Record<string, string> = {
  INTEGRATION_PLATFORM_META: 'logo_meta.jpeg',
  INTEGRATION_PLATFORM_LINKED_IN: 'linkedin-logo.webp',
  INTEGRATION_PLATFORM_GOOGLE_ADS: 'google-ads.svg',
  INTEGRATION_PLATFORM_SLACK: 'slack-logo.png',
}
const SHORTCUTS = [
  { key: 'healthcheck', label: 'Healthcheck des imports', prompt: 'Lance le healthcheck des imports Bulldozer de la nuit pour le projet actif (skill bulldozer-import-healthcheck).' },
  { key: 'audit-paid', label: 'Audit paid', prompt: 'Fais un audit des campagnes payantes du projet actif (skill bulldozer:audit-paid-ads).' },
  { key: 'weekly', label: 'Revue hebdo', prompt: 'Fais la revue de croissance hebdomadaire du projet actif (skill bulldozer:weekly-growth-review).' },
]

// Bulldozer MCP tools that write on an ad platform: each call asks the user to confirm its target.
const GUARDED = new Set([
  'bdzCreateAdAccount', 'bdzArchiveAdAccount', 'bdzUpdateAdRefreshConfig',
  'bdzCreateAdImport', 'bdzStartAdImport',
  'bdzCreateAdLayer1', 'bdzCreateAdLayer2', 'bdzCreateAdLayer3',
  'bdzUpdateAdLayer1', 'bdzUpdateAdLayer2', 'bdzUpdateAdLayer3',
  'bdzDuplicateAdLayer1', 'bdzDuplicateAdLayer2', 'bdzDuplicateAdLayer3',
  'bdzCreateAdLinkedInAudienceTemplate', 'bdzUpdateAdLinkedInAudienceTemplate',
  'bdzDeleteAdLinkedInAudienceTemplate', 'bdzSendAdLinkedInTestMessage',
  'bdzCreateLeadForm', 'bdzUpdateLeadForm', 'bdzDeleteLeadForm',
  'bdzCreateAudience', 'bdzDeleteAudience', 'bdzAddAudienceMembers', 'bdzAddAudienceMembersFromLeads',
  'bdzCreatePredictiveAudience', 'bdzCreateWebsiteRetargetingAudience',
  'bdzCreateSeaL1', 'bdzCreateSeaL2', 'bdzCreateSeaL3', 'bdzUpdateSeaL1', 'bdzUpdateSeaL2', 'bdzUpdateSeaL3',
  'bdzCreateSeaNegativeKeywords', 'bdzDeleteSeaNegativeKeyword', 'bdzCreateSeaNegativeKeywordList',
  'bdzAttachSeaNegativeKeywordList', 'bdzDetachSeaNegativeKeywordList',
  'bdzCreateSeaBidModifier', 'bdzDeleteSeaBidModifier',
  'bdzCreateSeaAsset', 'bdzCreateSeaAssetLink', 'bdzDeleteSeaAssetLink',
  'bdzCreateSeaAdGroupAudience', 'bdzUpdateSeaAdGroupAudience', 'bdzDeleteSeaAdGroupAudience',
  'bdzCreateSeaConversionAction', 'bdzUploadSeaConversions', 'bdzUpdateSeaAutoTagging',
  'bdzAddGoogleAdwordAccount', 'bdzCreateGoogleAdwordImport', 'bdzStartGoogleAdwordImport',
  'bdzUpdateGoogleAdwordAccountRefreshConfig',
])
// The read-only Bulldozer tools the mod calls itself; tool.check allows them so the auto mode classifier
// does not stand between the sidebar and its data.
const MOD_READS = new Set([
  'bdzListUserProjectMemberships', 'bdzListRegisteredAdAccounts', 'bdzListGoogleAdwordAccounts',
  'bdzGetCustomerSubscription', 'bdzGetStacks', 'bdzGetProjectObjectives', 'bdzListUserConnectors', 'bdzListAdImports',
  'bdzGetAdLayer1', 'bdzGetAdLayer2', 'bdzGetAdLayer3', 'bdzGetAdImport', 'bdzGetLeadForm', 'bdzGetAudience',
  'bdzCompareAdAnalytics', 'bdzListSeaL1s', 'bdzGetSeaL1Metrics', 'bdzGetGoogleAdwordAccountRefreshConfig',
  'bdzGetSeoGscDomains', 'bdzGetGscDomainAnalyticsSummary',
  'bdzListStudioJobs', 'bdzListContactEnrichBatches', 'bdzListLeadLists', 'bdzListHostings', 'bdzExploreHosting',
])
// Tools whose `id` is the ad account itself.
const ACCOUNT_ID_TOOLS = new Set(['bdzArchiveAdAccount', 'bdzUpdateAdRefreshConfig'])
const GOOGLE_ACCOUNT_ID_TOOLS = new Set(['bdzUpdateGoogleAdwordAccountRefreshConfig'])
const PLATFORMS: Record<string, AdPlatform> = {
  INTEGRATION_PLATFORM_META: 'META',
  INTEGRATION_PLATFORM_LINKED_IN: 'LINKEDIN',
  INTEGRATION_PLATFORM_MICROSOFT_ADS: 'MICROSOFT_ADS',
}
const PLATFORM_ICONS: Partial<Record<AdPlatform, string>> = {
  META: 'logo_meta.jpeg', LINKEDIN: 'linkedin-logo.webp', GOOGLE_ADS: 'google-ads.svg',
}
const GSC_ICON = 'gsc_logo.webp'
const PLATFORM_LABELS: Record<AdPlatform, string> = {
  META: 'Meta', LINKEDIN: 'LinkedIn', MICROSOFT_ADS: 'Microsoft Ads', GOOGLE_ADS: 'Google Ads',
}

type $ = EngineInterface
type Json = Record<string, any>

// Finds the server by the tool every Bulldozer server serves, whatever the plugin is called.
// `mcp__<server>__bdz<Tool>`: every Bulldozer tool, whatever the server is called.
const BULLDOZER_TOOL = /^mcp__(.+)__(bdz[A-Z]\w*)$/

// The server key in this mod's own .mcp.json: the same Bulldozer MCP, connected by the mod itself.
const OWN_SERVER_KEY = 'bulldozer'
// Why the mod's own connection failed, for the panel; null when it did not have to try.
let connectProblem: string | null = null

const toolSpelling = (name: string) => name.replace(/[^\w-]/g, '_')

// $.mcp.call only reaches tools in the list the mod sees. A server named after Bulldozer comes first: the user's
// own `bulldozer`, this plugin's, or the claude.ai connector (the session hides the others at the same URL).
// Desktop may name servers by id instead: the plugin's own server is then asked for by its key, and any other
// server serving Bulldozer tools is the last resort (a claude.ai connector there may face the auto mode classifier).
async function discoverServer($: $): Promise<boolean> {
  const servers: string[] = []
  for (const t of await $.tool.list()) {
    const match = t.mcp ? BULLDOZER_TOOL.exec(t.name) : null
    if (match?.[1] && !servers.includes(match[1])) {
      servers.push(match[1])
    }
  }
  const named = servers.find(name => /bulldozer/i.test(name))
  if (named) {
    server = named
    connectProblem = null
    return true
  }
  const connected = await $.mcp.connect(OWN_SERVER_KEY)
  if (connected.isConnected) {
    server = connected.server
    connectProblem = null
    return true
  }
  if (servers[0]) {
    server = servers[0]
    connectProblem = null
    return true
  }
  connectProblem = connected.reason === 'auth'
    ? `Connexion Bulldozer à autoriser : lance /mcp et authentifie « plugin:${$.plugin.name}:${OWN_SERVER_KEY} », puis clique sur ↻.`
    : connected.message

  return false
}

// The mod's reads go straight to the server with $.mcp.call, out of the session's loop: a $.tool.call runs in
// it, so Desktop showed every read as Claude working and notified "ready" when it ended.
async function callOnce($: $, tool: string, args: Json) {
  return $.mcp.call(server, tool, args)
}

async function call($: $, tool: string, args: Json = {}): Promise<Json> {
  // The server may connect after the session starts, under a name discovery has not seen yet: look again once.
  const result = await callOnce($, tool, args).catch(async (err: unknown) => {
    if (!(await discoverServer($))) {
      throw err
    }

    return callOnce($, tool, args)
  })
  const text = result.content.find(block => block.type === 'text')?.text ?? ''
  if (result.isError) {
    throw new Error(`${tool}: ${text.slice(0, 200)}`)
  }

  if (result.structuredContent) {
    return result.structuredContent as Json
  }
  // Some failures come back as plain text ("Error: …") without isError: show that text, not a parse error.
  try {
    return JSON.parse(text || '{}')
  } catch {
    throw new Error(`${tool}: ${text.slice(0, 200)}`)
  }
}

// A list arrives either bare under its key or as a ResponsePage under it.
function pageOf(body: Json, key: string): Json[] {
  return body[key]?.content ?? body[key] ?? body.content ?? []
}

// The text of bulldozer.json as the sidebar last read or wrote it (null: no file; undefined: never read).
// syncConfig reloads only when the file differs from it, so the sidebar's own writes reload nothing.
let lastConfigText: string | null | undefined

async function readConfigText($: $): Promise<string | null> {
  return (await $.fs.exists(CONFIG)) ? $.fs.read(CONFIG) : null
}

async function readConfig($: $): Promise<Json | null> {
  const text = await readConfigText($)
  lastConfigText = text

  // A file saved by a Windows editor may start with a byte order mark, which JSON.parse refuses.
  return text === null ? null : JSON.parse(text.replace(/^\uFEFF/, ''))
}

// How often the file is read for changes made outside Claude: one local read, nothing more when unchanged.
const CONFIG_POLL_MS = 2000

// Follows bulldozer.json whoever changed it: Claude through any tool, an editor, another session, git.
async function syncConfig($: $) {
  const text = await readConfigText($).catch(() => undefined)
  if (text !== undefined && text !== lastConfigText) {
    await loadActive($)
  }
}

function current(list: Membership[], at: Active | null): Membership | undefined {
  return list.find(m => m.customerId === at?.customerId && m.projectId === at?.projectId)
}

function toMembership(raw: Json): Membership {
  return {
    customerId: raw.customerId,
    projectId: raw.project?.id,
    projectName: raw.project?.name ?? '(sans nom)',
    userId: raw.userId,
    companyId: raw.company?.id ?? null,
    companyName: raw.company?.name ?? '(client inconnu)',
    logoUrl: raw.company?.logoUrl ?? null,
  }
}

// The picture formats a logo comes in, by the first bytes of their base64.
const LOGO_TYPES: [string, string][] = [
  ['iVBOR', 'image/png'], ['/9j/', 'image/jpeg'], ['UklGR', 'image/webp'], ['R0lG', 'image/gif'],
  ['PHN2', 'image/svg+xml'], ['PD94', 'image/svg+xml'],
]
// Svg takes 131 072 characters at most: a bigger logo falls back to the initials.
const MAX_LOGO_BASE64 = 120_000

// Downloads the logo once per company with curl (shipped with Windows, macOS and Linux) into the user's
// .claude cache, and returns it as a data: URI as it came, its type read from its first bytes.
async function fetchLogo($: $, m: Membership): Promise<string | null> {
  const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME'))
  if (!m.logoUrl || !home) {
    return null
  }
  const file = `${home}/.claude/cache/bulldozer/${m.companyId ?? m.customerId}.logo`
  if (!(await $.fs.exists(file))) {
    const got = await $.process.run(['curl', '-fsSL', '--max-time', '10', '--create-dirs', '-o', file, m.logoUrl])
    if (got.exitCode !== 0) {
      return null
    }
  }
  const { base64 } = await $.fs.read(file, { as: 'bytes' })
  const type = LOGO_TYPES.find(([prefix]) => base64.startsWith(prefix))?.[1]

  return type && base64.length <= MAX_LOGO_BASE64 ? `data:${type};base64,${base64}` : null
}

function escapeXml(text: string): string {
  return text.replace(/[<>&"']/g, c => `&#${c.charCodeAt(0)};`)
}

// The client's logo on a white rounded tile like the platform logos, or its initials on a dark one when the
// logo cannot be fetched.
function clientLogoSvg(m: Membership, dataUri: string | null): string {
  const body = dataUri
    ? `<rect width="64" height="64" rx="16" fill="#fff"/><image href="${dataUri}" x="8" y="8" width="48" height="48"/>`
    : '<rect x="0.5" y="0.5" width="63" height="63" rx="14" fill="#141414" stroke="#2E2E2E"/>'
      + '<text x="32" y="40" font-family="Chivo Mono,SF Mono,Menlo,monospace" font-size="22" fill="#DDFF56" '
      + `text-anchor="middle">${escapeXml(m.companyName.slice(0, 2).toUpperCase())}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${body}</svg>`
}

function accessOf(check: Json | null | undefined): AdAccount['access'] {
  if (!check) {
    return null
  }
  const isGranted = (status: unknown) => status === 'AD_ACCESS_STATUS_GRANTED'
  if (isGranted(check.writeAccess)) {
    return 'read-write'
  }

  return isGranted(check.readAccess) ? 'read-only' : 'denied'
}

async function loadImports($: $, at: Active, selection: AdSelection): Promise<Record<string, ImportSummary>> {
  const ids = [selection.META, selection.LINKEDIN].filter((id): id is string => id !== null)
  const entries = await Promise.all(ids.map(async adAccountId => {
    const body = await callRetried($, 'bdzListAdImports', { ...at, adAccountId, pageSize: 1 }).catch(() => ({}))
    const last = pageOf(body, 'imports')[0]

    return last ? [[adAccountId, { state: last.state, at: last.finishTime ?? last.createdAt ?? null }]] : []
  }))

  return Object.fromEntries(entries.flat())
}

// A read at session start can fail while the server settles: it is tried once more a moment later.
const RETRY_MS = 1500

async function callRetried($: $, tool: string, args: Json): Promise<Json> {
  try {
    return await call($, tool, args)
  } catch {
    await new Promise<void>(resolve => $.clock.after(RETRY_MS, resolve))

    return call($, tool, args)
  }
}

async function loadProjectInfo($: $, at: Active, m: Membership | undefined, selection: AdSelection): Promise<ProjectInfo> {
  let objectivesError: string | null = null
  const [subscription, stack, objectives, connectors, imports, now] = await Promise.all([
    callRetried($, 'bdzGetCustomerSubscription', at).catch(() => ({})),
    callRetried($, 'bdzGetStacks', { ...at, stackProjectId: at.projectId }).catch(() => ({})),
    callRetried($, 'bdzGetProjectObjectives', { ...at, targetProjectId: at.projectId }).catch((err: unknown) => {
      objectivesError = err instanceof Error ? err.message : String(err)

      return {}
    }),
    m ? callRetried($, 'bdzListUserConnectors', { userId: m.userId }).catch(() => ({})) : Promise.resolve({}),
    loadImports($, at, selection),
    $.clock.now(),
  ])
  const plan = (subscription as Json).subscription

  return {
    subscription: plan ? { name: plan.template?.name ?? '—', state: plan.state ?? '' } : null,
    stack: typeof (stack as Json).stack?.stack === 'number' ? (stack as Json).stack.stack : null,
    // Private insights hold the agents' own JSON state, not text for a person.
    objectives: pageOf(objectives, 'objectives')
      .filter(o => OBJECTIVE_LABELS[o.type] && String(o.answer ?? '').trim() !== '')
      .map(o => ({ type: o.type, answer: String(o.answer) })),
    objectivesError,
    connectors: pageOf(connectors, 'connectors')
      .map(c => ({ platform: c.platform, isValid: !c.expiresAt || Date.parse(c.expiresAt) > now })),
    imports,
  }
}

// 224100 → "224 100": spaces between thousands, without relying on Intl in the module's environment.
function formatJetons(value: number): string {
  const sign = value < 0 ? '-' : ''
  const digits = String(Math.round(Math.abs(value)))

  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function formatDate(iso: string | null): string {
  if (!iso) {
    return '—'
  }
  const date = new Date(iso)
  const two = (n: number) => String(n).padStart(2, '0')

  return `${two(date.getDate())}/${two(date.getMonth() + 1)} ${two(date.getHours())}:${two(date.getMinutes())}`
}

const CURRENCY_SIGNS: Record<string, string> = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' }

// 1234.5 EUR → "1 235 €", 85.9 → "85,90 €": cents only under a hundred.
function formatMoney(value: number, currency: string | null): string {
  const sign = currency ? ` ${CURRENCY_SIGNS[currency] ?? currency}` : ''
  if (Math.abs(value) >= 100) {
    return formatJetons(value) + sign
  }

  return value.toFixed(2).replace('.', ',') + sign
}

function formatCount(value: number): string {
  return Number.isInteger(value) ? formatJetons(value) : value.toFixed(1).replace('.', ',')
}

const DAY_MS = 86_400_000
const iso = (ms: number) => new Date(ms).toISOString()

// The 7 complete days before today (UTC) and the 7 before them.
function perfWindows(now: number) {
  const end = Math.floor(now / DAY_MS) * DAY_MS

  return { currentFrom: end - 7 * DAY_MS, currentTo: end, previousFrom: end - 14 * DAY_MS, previousTo: end - 7 * DAY_MS }
}

// Runs `fn` on `size` items at a time: the SEA reads are cut after 10 s, a burst of them would run long.
async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += size) {
    results.push(...(await Promise.all(items.slice(i, i + size).map(fn))))
  }

  return results
}

// Every row of a paged list, 200 at a time.
async function allPages($: $, tool: string, args: Json, key: string): Promise<{ rows: Json[]; first: Json }> {
  const rows: Json[] = []
  let first: Json = {}
  for (let page = 0; ; page++) {
    const body = await callRetried($, tool, { ...args, page, pageSize: 200 })
    if (page === 0) {
      first = body
    }
    const content = pageOf(body, key)
    rows.push(...content)
    const total = Number((body[key] ?? body).totalElement ?? 0)
    if (content.length === 0 || rows.length >= total) {
      return { rows, first }
    }
  }
}

const noFigures = (currency: string | null = null): PerfFigures => ({ currency, cost: 0, leads: null, conversions: null })

function addAdsRow(sum: PerfFigures | null, row: Json | null | undefined): PerfFigures | null {
  if (!row) {
    return sum
  }
  const base = sum ?? noFigures(row.cost?.currency ?? null)

  return {
    ...base,
    cost: base.cost + Number(row.cost?.value ?? 0),
    leads: row.leads == null ? base.leads : (base.leads ?? 0) + Number(row.leads),
  }
}

// Meta and LinkedIn: the campaigns' rows of both periods, summed. There is no account-level target.
async function adsPerf($: $, at: Active, account: AdAccount, now: number): Promise<AccountPerf> {
  const w = perfWindows(now)
  const { rows, first } = await allPages($, 'bdzCompareAdAnalytics', {
    ...at,
    target: 'AD_ANALYTICS_TARGET_LAYER_1_ALL',
    adAccountId: account.id,
    currentFrom: iso(w.currentFrom),
    currentTo: iso(w.currentTo),
    previousFrom: iso(w.previousFrom),
    previousTo: iso(w.previousTo),
  }, 'comparisons')
  let current: PerfFigures | null = null
  let previous: PerfFigures | null = null
  for (const row of rows) {
    current = addAdsRow(current, row.current)
    previous = addAdsRow(previous, row.previous)
  }
  // Figures come from past imports: past their end, the period is missing data, not lower.
  const freshness: Json | undefined = (first.freshness ?? [])[0]
  const through = freshness?.dataThrough ? Date.parse(freshness.dataThrough) : null
  const isStale = freshness !== undefined && (through === null || through < w.currentTo - 1000)

  return {
    platform: account.platform,
    accountId: account.id,
    current,
    previous,
    staleThrough: isStale ? (freshness?.dataThrough ?? null) : null,
    error: null,
  }
}

// Google Ads: one metrics read per campaign and period, summed. The SEA has no account-level route.
async function seaPerf($: $, at: Active, account: AdAccount, now: number): Promise<AccountPerf> {
  const w = perfWindows(now)
  // Both days included on the SEA side: a period ends a millisecond before the next one starts.
  const { rows: campaigns } = await allPages($, 'bdzListSeaL1s', {
    ...at, accountId: account.id, from: iso(w.previousFrom), to: iso(w.currentTo - 1),
  }, 'results')
  const readMetrics = async (l1Id: string, from: number, to: number) => {
    const body = await callRetried($, 'bdzGetSeaL1Metrics', { ...at, accountId: account.id, l1Id, from: iso(from), to: iso(to - 1) })

    return pageOf(body, 'results')[0] as Json | undefined
  }
  const pairs = await inBatches(campaigns, 5, c => Promise.all([
    readMetrics(String(c.id), w.currentFrom, w.currentTo),
    readMetrics(String(c.id), w.previousFrom, w.previousTo),
  ]))
  const sum = (metrics: (Json | undefined)[]): PerfFigures | null => metrics.reduce<PerfFigures | null>((acc, m) => {
    if (!m) {
      return acc
    }
    const base = acc ?? noFigures(m.currency ?? null)

    return {
      ...base,
      cost: base.cost + Number(m.cost ?? 0),
      conversions: (base.conversions ?? 0) + Number(m.conversions ?? 0),
    }
  }, null)

  return {
    platform: 'GOOGLE_ADS',
    accountId: account.id,
    current: sum(pairs.map(p => p[0])),
    previous: sum(pairs.map(p => p[1])),
    staleThrough: null,
    error: null,
  }
}

// The selected account of each platform, as the Paid tab lists them.
async function chosenAccounts($: $): Promise<AdAccount[]> {
  const accounts = await read($, adAccounts)
  const selection = await read($, adSelection)

  return (['META', 'LINKEDIN', 'GOOGLE_ADS'] as const)
    .map(platform => accounts.find(a => a.platform === platform
      && (platform === 'GOOGLE_ADS' ? a.adwordCustomerId : a.id) === selection[platform]))
    .filter((a): a is AdAccount => a !== undefined)
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err)).slice(0, 200)

// `kept`: rows of the same project and day, reused for the accounts still selected.
async function loadPerfRows($: $, at: Active, now: number, kept: AccountPerf[]): Promise<AccountPerf[]> {
  return Promise.all((await chosenAccounts($)).map(account =>
    kept.find(row => row.accountId === account.id && row.error === null)
    ?? (account.platform === 'GOOGLE_ADS' ? seaPerf($, at, account, now) : adsPerf($, at, account, now))
      .catch((err: unknown): AccountPerf => ({
        platform: account.platform, accountId: account.id, current: null, previous: null, staleThrough: null,
        error: errorText(err),
      }))))
}

const IMPORT_ERROR_TAGS: Record<string, string> = {
  AD_IMPORT_ERROR_KIND_TOKEN_MISSING: 'RECONNECTER',
  AD_IMPORT_ERROR_KIND_TOKEN_EXPIRED: 'RECONNECTER',
}
// The daily refresh imports the previous day at 02:00 UTC: a healthy account is 24 to 48 hours behind.
const ADS_FRESH_MS = 48 * 3_600_000

async function adsHealth($: $, at: Active, account: AdAccount, now: number): Promise<HealthRow> {
  const [last, success] = await Promise.all([
    callRetried($, 'bdzListAdImports', { ...at, adAccountId: account.id, pageSize: 1 }),
    callRetried($, 'bdzListAdImports', { ...at, adAccountId: account.id, pageSize: 1, state: 'AD_IMPORT_STATE_SUCCESS' }),
  ])
  const attempt = pageOf(last, 'imports')[0]
  const succeeded = pageOf(success, 'imports')[0]
  const successAt: string | null = succeeded ? (succeeded.finishTime ?? succeeded.updatedAt ?? null) : null
  const row = (tag: string, tone: TagTone, detail: string | null): HealthRow => ({
    key: `${account.platform}-${account.id}`, source: account.platform, label: account.name, tag, tone, detail,
  })
  const since = successAt ? `Dernier import réussi : ${formatDate(successAt)}` : 'Aucun import réussi'
  if (!attempt) {
    return row('JAMAIS IMPORTÉ', 'dim', null)
  }
  if (attempt.state === 'AD_IMPORT_STATE_ERROR') {
    const reason = String(attempt.errorMessage ?? '').slice(0, 160)

    return row(IMPORT_ERROR_TAGS[attempt.errorKind] ?? 'IMPORT KO', 'red', reason ? `${since} · ${reason}` : since)
  }
  if (attempt.state === 'AD_IMPORT_STATE_RUNNING' || attempt.state === 'AD_IMPORT_STATE_PENDING') {
    return row('EN COURS', 'dim', since)
  }
  if (attempt.state === 'AD_IMPORT_STATE_PARTIAL_SUCCESS') {
    return row('PARTIEL', 'amber', since)
  }

  return successAt && now - Date.parse(successAt) <= ADS_FRESH_MS
    ? row('OK', 'lime', since)
    : row('EN RETARD', 'amber', since)
}

// The SEA keeps no import history: a campaign with metrics yesterday says last night's import ran.
async function seaHealth($: $, at: Active, account: AdAccount, now: number): Promise<HealthRow> {
  const row = (tag: string, tone: TagTone, detail: string | null): HealthRow => ({
    key: `GOOGLE_ADS-${account.id}`, source: 'GOOGLE_ADS', label: account.name, tag, tone, detail,
  })
  const config = await callRetried($, 'bdzGetGoogleAdwordAccountRefreshConfig', { ...at, accountId: account.id })
  if (config.refreshConfig?.refreshEnabled === false) {
    return row('HORS REFRESH', 'dim', 'Le compte n\'est pas dans l\'import quotidien.')
  }
  const today = Math.floor(now / DAY_MS) * DAY_MS
  const body = await callRetried($, 'bdzListSeaL1s', {
    ...at, accountId: account.id, from: iso(today - DAY_MS), to: iso(today - 1), pageSize: 1,
  })
  const count = Number(body.results?.totalElement ?? pageOf(body, 'results').length)

  return count > 0
    ? row('OK', 'lime', `${count} campagne${count > 1 ? 's' : ''} avec des données hier`)
    : row('PAS DE DONNÉES J-1', 'amber', 'Aucune campagne n\'a de métriques hier.')
}

// Search Console lags two to three days: data through J-3 is on time.
const GSC_LAG_DAYS = 3

async function gscHealth($: $, at: Active, now: number): Promise<HealthRow[]> {
  const domains = pageOf(await callRetried($, 'bdzGetSeoGscDomains', at), 'gscDomains')
  const today = Math.floor(now / DAY_MS) * DAY_MS
  const day = (ms: number) => iso(ms).slice(0, 10)

  return Promise.all(domains.map(async (d): Promise<HealthRow> => {
    const label = String(d.domain ?? '').replace(/^sc-domain:/, '')
    const row = (tag: string, tone: TagTone, detail: string | null): HealthRow => ({
      key: `GSC-${d.id}`, source: 'GSC', label, tag, tone, detail,
    })
    try {
      const body = await callRetried($, 'bdzGetGscDomainAnalyticsSummary', {
        ...at, gscDomainId: d.id, from: day(today - 7 * DAY_MS), to: day(today), topSize: 1,
      })
      const dates: string[] = (body.summary?.daily ?? []).map((r: Json) => String(r.date)).sort()
      const last = dates[dates.length - 1]
      if (!last) {
        return row('AUCUNE DONNÉE', 'amber', 'Rien sur les 7 derniers jours.')
      }
      const detail = `Données jusqu'au ${last.slice(8, 10)}/${last.slice(5, 7)}`

      return last >= day(today - GSC_LAG_DAYS * DAY_MS) ? row('OK', 'lime', detail) : row('EN RETARD', 'red', detail)
    } catch (err) {
      return row('ILLISIBLE', 'red', errorText(err))
    }
  }))
}

// `kept`: rows of the same project and day, reused for the accounts still selected and the Search Console.
async function loadHealthRows($: $, at: Active, now: number, kept: HealthRow[]): Promise<HealthRow[]> {
  const accounts = await chosenAccounts($)
  const reusable = kept.filter(row => row.tag !== 'ILLISIBLE')
  const keptGsc = reusable.filter(row => row.source === 'GSC')
  const unreadable = (account: AdAccount) => (err: unknown): HealthRow => ({
    key: `${account.platform}-${account.id}`, source: account.platform, label: account.name, tag: 'ILLISIBLE', tone: 'red',
    detail: errorText(err),
  })
  const [ads, gsc] = await Promise.all([
    Promise.all(accounts.map(account => reusable.find(row => row.key === `${account.platform}-${account.id}`)
      ?? (account.platform === 'GOOGLE_ADS'
        ? seaHealth($, at, account, now)
        : adsHealth($, at, account, now)).catch(unreadable(account)))),
    keptGsc.length > 0 ? keptGsc : gscHealth($, at, now).catch((err: unknown): HealthRow[] => [{
      key: 'GSC', source: 'GSC', label: 'Search Console', tag: 'ILLISIBLE', tone: 'red', detail: errorText(err),
    }]),
  ])

  return [...ads, ...gsc]
}

// An ended job, done or failed, stays listed this long.
const JOB_RECENT_MS = DAY_MS
// Ended jobs listed at most, the newest first, under the running and failed ones.
const JOB_DONE_MAX = 10

async function loadJobRows($: $, at: Active, now: number): Promise<JobRow[]> {
  const isRecent = (time: unknown) => typeof time === 'string' && now - Date.parse(time) <= JOB_RECENT_MS
  const [studio, batches, lists] = await Promise.all([
    callRetried($, 'bdzListStudioJobs', { ...at, pageSize: 20 }),
    callRetried($, 'bdzListContactEnrichBatches', { ...at, pageSize: 20 }),
    callRetried($, 'bdzListLeadLists', { ...at, pageSize: 50, orderBy: 'LEAD_LIST_SORT_FIELD_UPDATED_AT' }),
  ])
  const rows: JobRow[] = []
  // Done jobs by end time, to keep the newest across the three lists.
  const done: { row: JobRow; at: string }[] = []
  const ended = (row: Omit<JobRow, 'state' | 'progress' | 'links'>, at: string, links: string[] = []) =>
    done.push({ row: { ...row, state: 'done', progress: null, links }, at })
  for (const job of pageOf(studio, 'jobs')) {
    const label = `Studio · ${job.mediaType === 'STUDIO_MEDIA_TYPE_VIDEO' ? 'vidéo' : 'image'}`
    if (job.status === 'in_progress') {
      rows.push({
        key: `studio-${job.id}`, label, state: job.startedAt ? 'running' : 'queued',
        progress: typeof job.progress === 'number' ? job.progress : null, detail: `Lancé ${formatDate(job.createdAt)}`, links: [],
      })
    } else if (job.status === 'failed' && isRecent(job.updatedAt)) {
      rows.push({ key: `studio-${job.id}`, label, state: 'failed', progress: null, detail: String(job.error ?? '').slice(0, 160) || null, links: [] })
    } else if (job.status === 'completed' && isRecent(job.updatedAt)) {
      const cost = typeof job.cost === 'number' ? ` · ${formatJetons(job.cost)} jetons` : ''
      ended({ key: `studio-${job.id}`, label, detail: `Terminé ${formatDate(job.updatedAt)}${cost}` }, job.updatedAt,
        studioLinks(job))
    }
  }
  for (const batch of pageOf(batches, 'batches')) {
    const label = 'Enrichissement de contacts'
    if (batch.state === 'CONTACT_ENRICH_BATCH_STATE_IDLE' || batch.state === 'CONTACT_ENRICH_BATCH_STATE_RUNNING') {
      rows.push({
        key: `batch-${batch.id}`, label, state: batch.state.endsWith('RUNNING') ? 'running' : 'queued', progress: null,
        detail: `Lancé ${formatDate(batch.createdAt)}`, links: [],
      })
    } else if (batch.targetedCount > 0 && batch.errorCount === batch.targetedCount && isRecent(batch.endDate)) {
      // There is no failed state: a batch whose every contact failed is still DONE.
      rows.push({ key: `batch-${batch.id}`, label, state: 'failed', progress: null, detail: `${batch.errorCount} contacts en échec`, links: [] })
    } else if (batch.state === 'CONTACT_ENRICH_BATCH_STATE_DONE' && isRecent(batch.endDate)) {
      const failed = batch.errorCount > 0 ? `, ${batch.errorCount} en échec` : ''
      ended({
        key: `batch-${batch.id}`, label, detail: `Terminé ${formatDate(batch.endDate)} · ${batch.targetedCount} contacts${failed}`,
      }, batch.endDate)
    }
  }
  for (const list of pageOf(lists, 'leadLists')) {
    const label = `Sourcing · ${list.name}`
    if (list.sourcingState === 'LEAD_LIST_SOURCING_STATE_SOURCING') {
      rows.push({ key: `list-${list.id}`, label, state: 'running', progress: null, detail: null, links: [] })
    } else if (list.sourcingState === 'LEAD_LIST_SOURCING_STATE_ERROR' && isRecent(list.updatedAt)) {
      rows.push({ key: `list-${list.id}`, label, state: 'failed', progress: null, detail: list.sourcingError ?? null, links: [] })
    } else if (list.sourcingState === 'LEAD_LIST_SOURCING_STATE_SUCCESS' && isRecent(list.updatedAt)) {
      ended({ key: `list-${list.id}`, label, detail: `Terminé ${formatDate(list.updatedAt)}` }, list.updatedAt)
    }
  }
  done.sort((a, b) => b.at.localeCompare(a.at))

  return [...rows, ...done.slice(0, JOB_DONE_MAX).map(d => d.row)]
}

const isUnderway = (row: JobRow) => row.state === 'queued' || row.state === 'running'

// A tab block's own atom, read and written by the caller: the state scan needs each atom named where it is read.
type BlockStore<T> = { get: () => Promise<Loaded<T> | null>; set: (block: Loaded<T>) => Promise<unknown> }

// Loads one tab block. A result whose key is no longer the block's (another project, another account, a
// newer load) is dropped. An up-to-date block is kept unless forced. `shownRows` stay drawn while it loads.
async function loadBlock<T>(
  store: BlockStore<T>, key: string, isForced: boolean, load: () => Promise<T[]>, shownRows: T[] = [],
) {
  const shown = await store.get()
  if (!isForced && shown?.key === key && (shown.isLoading || shown.error === null)) {
    return
  }
  await store.set({ key, isLoading: true, error: null, rows: shown?.key === key ? shown.rows : shownRows })
  let rows: T[] = []
  let failure: string | null = null
  try {
    rows = await load()
  } catch (err) {
    failure = errorText(err)
  }
  if ((await store.get())?.key !== key) {
    return
  }
  await store.set({ key, isLoading: false, error: failure, rows })
}

// The files a done Studio job generated, largest version first. Desktop opens only https links.
function studioLinks(job: Json): string[] {
  return ((job.results ?? []) as Json[])
    .flatMap(result => (result.assets ?? []) as Json[])
    .map(asset => String(asset.largeUrl ?? asset.url ?? ''))
    .filter(url => url.startsWith('https://') && url.length <= 2048)
    .slice(0, STUDIO_LINKS_MAX)
}

const STUDIO_LINKS_MAX = 4

// The Bulldozer tools that start a job the Jobs tab lists.
const JOB_STARTERS = new Set(['bdzCreateStudioJob', 'bdzCreateContactEnrichBatch', 'bdzSourceLeadList'])

// Read again every JOBS_POLL_MS while a job runs; stopped once none does.
const JOBS_POLL_MS = 30_000
let jobsTimer: { cancel: () => void } | null = null

async function loadJobs($: $, isForced = false) {
  const at = await read($, active)
  if (!at) {
    return
  }
  const now = await $.clock.now()
  await loadBlock({ get: () => read($, jobs), set: block => update($, jobs, () => block) }, at.projectId, isForced,
    () => loadJobRows($, at, now))
  const isRunning = ((await read($, jobs))?.rows ?? []).some(isUnderway)
  if (isRunning && !jobsTimer) {
    jobsTimer = $.clock.every(JOBS_POLL_MS, () => void loadJobs($, true).catch(() => undefined))
  } else if (!isRunning && jobsTimer) {
    jobsTimer.cancel()
    jobsTimer = null
  }
}

// Hostings shown per page of the tab; the search narrows them on the server.
const HOSTINGS_PAGE_SIZE = 10

async function currentHostingQuery($: $, at: Active): Promise<HostingQuery> {
  const query = await read($, hostingQuery)

  return query?.projectId === at.projectId ? query : { projectId: at.projectId, q: '', page: 0 }
}

// Expired hostings are left out after the page is cut (the API cannot filter them): a page may show fewer.
async function loadHostings($: $, isForced = false) {
  const at = await read($, active)
  if (!at) {
    return
  }
  const { q, page } = await currentHostingQuery($, at)
  const now = await $.clock.now()
  let total = (await read($, hostings))?.total ?? 0
  await loadBlock<HostingRow>(
    { get: () => read($, hostings), set: block => update($, hostings, () => ({ ...block, total })) },
    `${at.projectId}|${page}|${q}`,
    isForced,
    async () => {
      const body = await callRetried($, 'bdzListHostings', { ...at, page, pageSize: HOSTINGS_PAGE_SIZE, ...(q ? { q } : {}) })
      total = Number(body.hostings?.totalElement ?? 0)

      return pageOf(body, 'hostings')
        .filter(hosting => !hosting.validUntil || Date.parse(hosting.validUntil) > now)
        .map(hosting => ({
          id: String(hosting.id), name: String(hosting.name ?? ''), isSite: hosting.type === 'HOSTING_TYPE_STATIC_SITE',
          publicUrl: typeof hosting.publicUrl === 'string' ? hosting.publicUrl : null, createdAt: String(hosting.createdAt ?? ''),
        }))
    },
  )
}

async function queryHostings($: $, change: { q?: string; page?: number }) {
  const at = await read($, active)
  if (!at) {
    return
  }
  const query = await currentHostingQuery($, at)
  await update($, hostingQuery, () => ({ ...query, ...change }))
  await loadHostings($)
}

// A single file is private: its link is a presigned URL, asked on demand since it lasts an hour.
async function fetchHostingLink($: $, id: string) {
  const at = await read($, active)
  if (!at) {
    return
  }
  try {
    const body = await callRetried($, 'bdzExploreHosting', { ...at, hostingId: id })
    const url = String(body.signedUrl?.url ?? '')
    if (!url.startsWith('https://')) {
      throw new Error('le lien reçu n\'est pas en https')
    }
    await update($, hostingLinks, links => ({ ...links, [id]: { url, expiresAt: body.signedUrl?.expiresAt ?? null } }))
  } catch (err) {
    $.ui.toast(`Lien indisponible : ${errorText(err)}`)
  }
}

// A block's key, and its scope: the project and the day. Within one scope, another account selection
// reloads only the accounts that changed; ↻ reloads them all.
function selectionKey(at: Active, selection: AdSelection, now: number): { key: string; scope: string } {
  const scope = `${at.projectId}|${Math.floor(now / DAY_MS)}|`

  return { key: scope + [selection.META, selection.LINKEDIN, selection.GOOGLE_ADS].join('|'), scope }
}

async function loadPerf($: $, isForced = false) {
  const at = await read($, active)
  if (!at) {
    return
  }
  const now = await $.clock.now()
  const { key, scope } = selectionKey(at, await read($, adSelection), now)
  const shown = await read($, perf)
  const kept = !isForced && shown?.key.startsWith(scope) ? shown.rows : []
  await loadBlock({ get: () => read($, perf), set: block => update($, perf, () => block) }, key, isForced,
    () => loadPerfRows($, at, now, kept), kept)
}

async function loadHealth($: $, isForced = false) {
  const at = await read($, active)
  if (!at) {
    return
  }
  const now = await $.clock.now()
  const { key, scope } = selectionKey(at, await read($, adSelection), now)
  const shown = await read($, health)
  const kept = !isForced && shown?.key.startsWith(scope) ? shown.rows : []
  // While it loads, the tab lists no account that is no longer selected.
  const chosen = new Set((await chosenAccounts($)).map(account => `${account.platform}-${account.id}`))
  await loadBlock({ get: () => read($, health), set: block => update($, health, () => block) }, key, isForced,
    () => loadHealthRows($, at, now, kept), kept.filter(row => row.source === 'GSC' || chosen.has(row.key)))
}

// Imports and jobs always, for the tabs' marks; the performance only while the Paid tab shows.
async function loadTabs($: $, isForced = false) {
  await Promise.all([
    loadHealth($, isForced),
    loadJobs($, isForced),
    (await read($, activeTab)) === 'paid' ? loadPerf($, isForced) : Promise.resolve(),
    (await read($, activeTab)) === 'hostings' ? loadHostings($, isForced) : Promise.resolve(),
  ])
}

async function selectTab($: $, tab: Tab) {
  await update($, activeTab, () => tab)
  if (tab === 'paid') {
    await loadPerf($)
  }
  // Jobs change by the minute: the tab reads them again each time it opens.
  if (tab === 'jobs') {
    await loadJobs($, true)
  }
  if (tab === 'hostings') {
    await loadHostings($)
  }
}

// The tag beside an ad account: its worst news first, then its last sync, else ready.
function accountTag(chosen: AdAccount | undefined, summary: ImportSummary | undefined, now: number): [string, Tone] {
  if (!chosen) {
    return ['À CHOISIR', 'dim']
  }
  if (chosen.access === 'denied') {
    return ['AUCUN DROIT', 'red']
  }
  if (summary?.state === 'AD_IMPORT_STATE_ERROR') {
    return ['IMPORT KO', 'red']
  }
  if (chosen.access === 'read-only') {
    return ['LECTURE SEULE', 'amber']
  }
  if (summary?.state === 'AD_IMPORT_STATE_PARTIAL_SUCCESS') {
    return ['IMPORT PARTIEL', 'amber']
  }
  if (summary?.state === 'AD_IMPORT_STATE_RUNNING' || summary?.state === 'AD_IMPORT_STATE_PENDING') {
    return ['IMPORT…', 'dim']
  }
  if (summary?.state === 'AD_IMPORT_STATE_SUCCESS' && summary.at) {
    const [day, time] = formatDate(summary.at).split(' ')
    const isToday = new Date(summary.at).toDateString() === new Date(now).toDateString()

    return [`SYNC ${isToday ? time : day}`, 'lime']
  }

  return ['PRÊT', 'lime']
}

// The Bulldozer OS look (bulldozeros-frontend, styles.css): warm-neutral text, Bulldozer lime for what is fine,
// drawn in Svg where Text cannot (size, letter spacing, monospace). Each color has a light-scheme variant.
// `.line` strokes the pill around a tag, `.track` fills the stack bar's background.
type Tone = 'fg' | 'dim' | 'lab' | 'lime' | 'red' | 'amber'
const SIGNAL_CSS = '<style>.fg{fill:#F2F2F0}.dim{fill:#B8B8B4}.lab{fill:#85857F}.lime{fill:#DDFF56}.red{fill:#FF8A80}'
  + '.amber{fill:#E9A23B}.track{fill:#2E2E2E}.line{fill:none;stroke:#2E2E2E}'
  + '.line.lime{stroke:#DDFF56;stroke-opacity:.6}.line.red{stroke:#FF8A80;stroke-opacity:.6}'
  + '.line.amber{stroke:#E9A23B;stroke-opacity:.6}'
  + '@media (prefers-color-scheme: light){.fg{fill:#141414}.dim{fill:#5F5F5A}.lab{fill:#85857F}.lime{fill:#5C7A00}'
  + '.red{fill:#D4183D}.amber{fill:#A86F00}.track{fill:#ECECF0}.line{stroke:#E2E2E2}.line.lime{stroke:#5C7A00}'
  + '.line.red{stroke:#D4183D}.line.amber{stroke:#A86F00}}</style>'
const SANS = 'font-family="Chivo,Helvetica Neue,Helvetica,Arial,sans-serif"'
const MONO = 'font-family="Chivo Mono,SF Mono,Menlo,Consolas,monospace"'

function signalSvg(width: number, height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`
    + `${SIGNAL_CSS}${body}</svg>`
}

// An uppercase, letter-spaced label in monospace: the OS's .eyebrow.
function labelSvg(text: string, width = 200): string {
  return signalSvg(width, 14, `<text class="lab" x="0" y="11" ${MONO} font-size="11" `
    + `letter-spacing="0.9">${escapeXml(text.toUpperCase())}</text>`)
}

// Desktop draws a select as wide as its longest option, and cuts with "..." an option wider than the panel.
// Every ad account label is therefore cut at AD_LABEL_CHARS and padded up to it with no-break spaces, two for
// a letter: the three selects come out about the same width, and no option overflows.
const AD_LABEL_CHARS = 26

function padLabel(label: string): string {
  const cut = label.length > AD_LABEL_CHARS ? `${label.slice(0, AD_LABEL_CHARS - 1)}…` : label

  return cut + '\u00A0'.repeat(2 * (AD_LABEL_CHARS - cut.length))
}

// The header's name, as the OS writes it beside its logo: monospace capitals, brighter than the labels.
function brandSvg(): string {
  return signalSvg(150, 18, `<text class="fg" x="0" y="13" ${MONO} font-size="12.5" `
    + 'letter-spacing="1.5">BULLDOZER OS</text>')
}

// A status tag: monospace capitals in an outlined pill, right-aligned, like the OS's step badges.
const TAG_WIDTH = 110
const TAG_HEIGHT = 20

// The pill's width for `text`: a monospace letter at 10px advances about 6px, plus the letter spacing.
const pillWidth = (text: string) => text.length * 7 + 16

// The drawing's width: TAG_WIDTH at least, so the tags of a column line up, more for a longer text.
const tagWidth = (text: string) => Math.max(TAG_WIDTH, Math.ceil(pillWidth(text)) + 1)

function tagSvg(text: string, tone: Tone): string {
  const width = tagWidth(text)
  const pill = pillWidth(text)
  const x = width - 0.5 - pill

  return signalSvg(width, TAG_HEIGHT, `<rect class="line ${tone}" x="${x}" y="0.5" width="${pill}" `
    + `height="${TAG_HEIGHT - 1}" rx="${(TAG_HEIGHT - 1) / 2}"/><text class="${tone}" x="${x + pill / 2}" y="13.5" `
    + `text-anchor="middle" ${MONO} font-size="10" letter-spacing="0.8">${escapeXml(text)}</text>`)
}

// Splits a name into lines of at most `max` characters, cut at spaces, three lines at most.
function wrapWords(text: string, max: number): string[] {
  const lines: string[] = []
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines[lines.length - 1]
    if (last !== undefined && `${last} ${word}`.length <= max) {
      lines[lines.length - 1] = `${last} ${word}`
    } else {
      lines.push(word.length > max ? `${word.slice(0, max - 1)}…` : word)
    }
  }
  if (lines.length > 3) {
    lines.length = 3
    lines[2] = `${lines[2]!.slice(0, max - 1)}…`
  }

  return lines.length > 0 ? lines : ['—']
}

// The active project in large type: label, name over up to three lines, then the client and the plan.
function heroSvg(m: Membership, plan: string | null): { source: string; height: number } {
  const lines = wrapWords(m.projectName, 17)
  const sub = [m.companyName, plan].filter(Boolean).join(' · ')
  const subLine = sub.length > 40 ? `${sub.slice(0, 39)}…` : sub
  // Light and tight, like the OS's .h1-hero.
  const names = lines.map((line, i) => `<text class="fg" x="0" y="${44 + i * 29}" ${SANS} font-size="26" `
    + `font-weight="400" letter-spacing="-0.7">${escapeXml(line)}</text>`).join('')
  const subY = 44 + (lines.length - 1) * 29 + 24

  return {
    source: signalSvg(260, subY + 6, `<text class="lab" x="0" y="11" ${MONO} font-size="11" `
      + `letter-spacing="0.9">PROJET</text>${names}`
      + `<text class="dim" x="0" y="${subY}" ${SANS} font-size="13">${escapeXml(subLine)}</text>`),
    height: subY + 6,
  }
}

// The stack left: label, the jetons in monospace, a thin bar red once spent.
// No viewBox: a 100 % wide drawing fills the panel's width without scaling its text.
function stackSvg(stack: number): string {
  const tone: Tone = stack <= 0 ? 'red' : 'lime'

  return '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="24">'
    + `${SIGNAL_CSS}<text class="lab" x="0" y="11" ${MONO} font-size="11" `
    + `letter-spacing="0.9">STACK</text><text class="${tone}" x="100%" y="11" text-anchor="end" ${MONO} `
    + `font-size="12">${escapeXml(formatJetons(stack))} jetons</text>`
    + '<rect class="track" x="0" y="19" width="100%" height="3" rx="1.5"/>'
    + `<rect class="${tone}" x="0" y="19" width="100%" height="3" rx="1.5"/></svg>`
}

async function loadAdAccounts($: $, at: Active): Promise<AdAccount[]> {
  const [registered, google] = await Promise.all([
    callRetried($, 'bdzListRegisteredAdAccounts', at).catch(() => ({})),
    callRetried($, 'bdzListGoogleAdwordAccounts', at).catch(() => ({})),
  ])
  const platformOf = (raw: Json) => PLATFORMS[raw.platform as string]

  return [
    // Registered Google Ads rows are not the ids the SEA tools take: those come from the SEA list below.
    ...pageOf(registered, 'accounts').filter(platformOf).map(raw => ({
      id: raw.id,
      platform: platformOf(raw) as AdPlatform,
      name: raw.name || raw.adAccount,
      // LinkedIn spells it urn:li:sponsoredAccount:<number>, Meta gives the number alone.
      number: String(raw.adAccount ?? '').split(':').pop() ?? '',
      adwordCustomerId: null,
      adwordLoginId: null,
      access: accessOf(raw.lastAccessCheck),
    })),
    ...pageOf(google, 'accounts').map(raw => {
      const number = String(raw.adwordCustomerId).replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3')

      return {
        id: raw.id,
        platform: 'GOOGLE_ADS' as const,
        // Bulldozer learns the name at the account's next import: until then, its number as Google writes it.
        name: raw.name ?? `Compte ${number}`,
        number,
        adwordCustomerId: String(raw.adwordCustomerId),
        adwordLoginId: raw.adwordLoginId == null ? null : String(raw.adwordLoginId),
        access: null,
      }
    }),
  ]
}

// ads.adAccount.<PLATFORM> is { id, name }; an older file holds the id alone as a string.
function accountIdOf(entry: unknown): string | null {
  if (typeof entry === 'string') {
    return entry
  }
  const id = (entry as Json | null | undefined)?.id

  return typeof id === 'string' ? id : null
}

// The keys the ads-management and sea skills read: ads.adAccount.<PLATFORM> and sea.adAccount.
function selectionOf(config: Json | null): AdSelection {
  const google = config?.sea?.adAccount?.adwordCustomerId

  return {
    META: accountIdOf(config?.ads?.adAccount?.META),
    LINKEDIN: accountIdOf(config?.ads?.adAccount?.LINKEDIN),
    GOOGLE_ADS: google == null ? null : String(google),
  }
}

// Keeps only the accounts the active project has: an id left by another project selects nothing.
function validSelection(selection: AdSelection, accounts: AdAccount[]): AdSelection {
  const has = (platform: AdPlatform, ref: string | null) => ref !== null && accounts.some(a =>
    a.platform === platform && (platform === 'GOOGLE_ADS' ? a.adwordCustomerId : a.id) === ref)

  return {
    META: has('META', selection.META) ? selection.META : null,
    LINKEDIN: has('LINKEDIN', selection.LINKEDIN) ? selection.LINKEDIN : null,
    GOOGLE_ADS: has('GOOGLE_ADS', selection.GOOGLE_ADS) ? selection.GOOGLE_ADS : null,
  }
}

// Removes the ad accounts from bulldozer.json, keeping every other key of `ads` and `sea`; an emptied
// section goes too.
function withoutAdAccounts(config: Json): Json {
  const { adAccount: _ads, ...ads } = (config.ads ?? {}) as Json
  const { adAccount: _sea, ...sea } = (config.sea ?? {}) as Json
  const { ads: _a, sea: _s, ...rest } = config

  return {
    ...rest,
    ...(Object.keys(ads).length > 0 ? { ads } : {}),
    ...(Object.keys(sea).length > 0 ? { sea } : {}),
  }
}

// Reads bulldozer.json, applies `patch` and writes it back with every other key kept.
async function writeConfig($: $, patch: (config: Json) => Json): Promise<boolean> {
  let config: Json | null
  try {
    config = await readConfig($)
  } catch {
    $.ui.toast(`${CONFIG} n'est pas du JSON valide : corrige-le d'abord`)

    return false
  }
  const text = `${JSON.stringify(patch(config ?? {}), null, 2)}\n`
  await $.fs.write(CONFIG, text)
  lastConfigText = text

  return true
}

// bulldozer.json with `account` as its platform's choice: { id, name } for Meta / LinkedIn, the sea skill's
// { adwordLoginId, adwordCustomerId } for Google Ads.
function withAdAccount(config: Json, account: AdAccount): Json {
  return account.platform === 'GOOGLE_ADS'
    ? {
      ...config,
      sea: {
        ...config.sea,
        adAccount: { adwordLoginId: account.adwordLoginId ?? '', adwordCustomerId: account.adwordCustomerId },
      },
    }
    : {
      ...config,
      ads: {
        ...config.ads,
        adAccount: { ...config.ads?.adAccount, [account.platform]: { id: account.id, name: account.name } },
      },
    }
}

const selectionRef = (account: AdAccount) => (account.platform === 'GOOGLE_ADS' ? account.adwordCustomerId : account.id)

async function chooseAdAccount($: $, platform: AdPlatform, id: string) {
  const account = (await read($, adAccounts)).find(a => a.id === id)
  if (!account) {
    return
  }
  const isWritten = await writeConfig($, config => withAdAccount(config, account))
  if (isWritten) {
    await update($, adSelection, selection => ({ ...NO_SELECTION, ...selection, [platform]: selectionRef(account) }))
    const at = await read($, active)
    if (at && (platform === 'META' || platform === 'LINKEDIN')) {
      // The other platform's last import has not changed: only this one is read.
      const selected = (await read($, adSelection))[platform]
      const imports = await loadImports($, at, { ...NO_SELECTION, [platform]: selected })
      await update($, projectInfo, info => (info ? { ...info, imports: { ...info.imports, ...imports } } : info))
    }
    // Another account: its performance and imports replace the previous one's.
    void loadTabs($).catch(() => undefined)
  }
}

// A hairline across the panel, between the tab bar and the tab's content.
function ruleSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="2">${SIGNAL_CSS}`
    + '<rect class="track" x="0" y="0.5" width="100%" height="1"/></svg>'
}

// A thin progress bar, amber (a job underway) up to `ratio` (0 to 1) of the width.
function progressSvg(ratio: number): string {
  const width = `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`

  return '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="6">'
    + `${SIGNAL_CSS}<rect class="track" x="0" y="1.5" width="100%" height="3" rx="1.5"/>`
    + `<rect class="amber" x="0" y="1.5" width="${width}" height="3" rx="1.5"/></svg>`
}

// How a delta reads: a rise is good (results), bad (a cost per result) or neither (spend).
type Trend = 'up-good' | 'up-bad' | 'neutral'

function deltaOf(current: number | null, previous: number | null): number | null {
  return current === null || previous === null || previous === 0 ? null : ((current - previous) / previous) * 100
}

function perfLineSvg(label: string, value: string, delta: number | null, trend: Trend, y: number): string {
  const isFlat = delta === null || trend === 'neutral' || Math.abs(delta) < 0.5
  const tone: Tone = isFlat ? 'dim' : (delta > 0) === (trend === 'up-good') ? 'lime' : 'red'
  const text = delta === null ? '—' : `${delta > 0 ? '+' : ''}${Math.round(delta)} %`

  return `<text class="lab" x="0" y="${y}" ${MONO} font-size="10" letter-spacing="0.8">${label}</text>`
    + `<text class="fg" x="72%" y="${y}" text-anchor="end" ${MONO} font-size="12">${escapeXml(value)}</text>`
    + `<text class="${tone}" x="100%" y="${y}" text-anchor="end" ${MONO} font-size="11">${escapeXml(text)}</text>`
}

// An account's 7 days: spend, results and cost per result, each against the previous 7 days. Null when the
// account spent nothing in either period. No viewBox: the drawing fills the panel's width.
function perfSvg(row: AccountPerf): { source: string; height: number } | null {
  const { current: c, previous: p } = row
  if ((!c || c.cost === 0) && (!p || p.cost === 0)) {
    return null
  }
  const currency = c?.currency ?? p?.currency ?? null
  const isSea = row.platform === 'GOOGLE_ADS'
  const results = (f: PerfFigures | null) => (f ? (isSea ? f.conversions : f.leads) ?? 0 : 0)
  const unitCost = (f: PerfFigures | null) => (f && results(f) > 0 ? f.cost / results(f) : null)
  const cost = c?.cost ?? 0
  const unit = unitCost(c)
  let body = perfLineSvg('DÉPENSE', formatMoney(cost, currency), deltaOf(cost, p?.cost ?? 0), 'neutral', 12)
    + perfLineSvg(isSea ? 'CONVERSIONS' : 'LEADS', formatCount(results(c)), deltaOf(results(c), results(p)), 'up-good', 30)
    + perfLineSvg(isSea ? 'CPA' : 'CPL', unit === null ? '—' : formatMoney(unit, currency), deltaOf(unit, unitCost(p)), 'up-bad', 48)
  let height = 54
  if (row.staleThrough) {
    body += `<text class="amber" x="0" y="68" ${SANS} font-size="11">Données jusqu'au `
      + `${escapeXml(formatDate(row.staleThrough).slice(0, 5))} : période incomplète</text>`
    height = 74
  }

  return {
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}">${SIGNAL_CSS}${body}</svg>`,
    height,
  }
}

// A platform logo as an SVG tile: the asset fitted on a white rounded square, the only picture element
// Desktop draws being Svg.
// A tile like readIcon's, with the platform's initials where no logo was copied.
function initialsIcon(label: string): string {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">'
    + '<rect width="32" height="32" rx="8" fill="#fff"/>'
    + '<text x="16" y="21" font-family="sans-serif" font-size="13" font-weight="700" fill="#1a1a19" '
    + `text-anchor="middle">${escapeXml(label.slice(0, 2).toUpperCase())}</text></svg>`
}

// Icons read once per process: the sidebar is drawn again on every state change.
const iconCache = new Map<string, string>()

async function readIcon($: $, file: string): Promise<string> {
  const cached = iconCache.get(file)
  if (cached) {
    return cached
  }
  const path = `${$.plugin.root}/assets/${file}`
  const ext = /\.(\w+)$/.exec(file)?.[1] ?? 'svg'
  const mime = ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext
  const { base64 } = await $.fs.read(path, { as: 'bytes' })

  const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">'
    + '<rect width="32" height="32" rx="8" fill="#fff"/>'
    + `<image href="data:image/${mime};base64,${base64}" x="5" y="5" width="22" height="22"/></svg>`
  iconCache.set(file, icon)

  return icon
}

function statusText(m: Membership | undefined, err: string | null): string {
  if (err) {
    return err
  }
  if (!m) {
    return 'aucun projet — /bdz-project'
  }
  // The engine prefixes the line with the plugin's name: "bulldozer: Projet … du client …".
  return `Projet ${m.projectName} du client ${m.companyName}`
}

// Desktop only: a terminal session keeps its status line free of the mod.
async function refreshStatus($: $) {
  if (!(await $.session.surfaces()).includes('desktop')) {
    return
  }
  const list = await read($, memberships)
  $.ui.status(statusText(current(list, await read($, active)), await read($, error)))
}

// `isForced` reloads the project's accounts, details and logo even when the project did not change.
// One load at a time: a change that lands during a load runs one more after it, so an older result never
// overwrites a newer one and a load never sees the half-cleared state of another.
let activeLoad: Promise<void> | null = null
let queuedLoad: { isForced: boolean } | null = null

function loadActive($: $, isForced = false): Promise<void> {
  if (activeLoad) {
    queuedLoad = { isForced: (queuedLoad?.isForced ?? false) || isForced }

    return activeLoad
  }
  activeLoad = (async () => {
    try {
      let pending: { isForced: boolean } | null = { isForced }
      while (pending) {
        queuedLoad = null
        await loadActiveOnce($, pending.isForced)
        pending = queuedLoad
      }
    } finally {
      activeLoad = null
    }
  })()

  return activeLoad
}

async function loadActiveOnce($: $, isForced: boolean) {
  const config = await readConfig($).catch(() => undefined)
  if (config === undefined) {
    await update($, error, () => `${CONFIG} illisible`)
    await refreshStatus($)

    return
  }
  const at = config?.customerId && config?.projectId
    ? { customerId: config.customerId, projectId: config.projectId }
    : null
  const previous = await read($, active)
  // Another project: the panel's sections arrive one read after another, each beside the previous project's
  // others. The splash covers the panel until the last one is in.
  const isSwitch = previous !== null && at !== null && previous.projectId !== at.projectId
  if (isSwitch) {
    await update($, isSwitching, () => true)
    await syncSplash($)
  }
  try {
    await loadProject($, config, at, previous, isForced)
  } finally {
    if (isSwitch) {
      await update($, isSwitching, () => false)
      await syncSplash($)
    }
  }
}

async function loadProject($: $, config: Json | null, at: Active | null, previous: Active | null, isForced: boolean) {
  await update($, active, () => at)
  await update($, error, () => null)
  if (isForced || previous?.projectId !== at?.projectId) {
    await update($, adAccounts, () => [])
    if (at) {
      const accounts = await loadAdAccounts($, at)
      await update($, adAccounts, () => accounts)
    }
  }
  const accounts = await read($, adAccounts)
  let selection = validSelection(selectionOf(config), accounts)
  // A selector with no valid choice shows its first account: write that account, so the file says what the
  // sidebar shows.
  const defaults = (['META', 'LINKEDIN', 'GOOGLE_ADS'] as const)
    .filter(platform => selection[platform] === null)
    .map(platform => accounts.find(a => a.platform === platform))
    .filter((account): account is AdAccount => account !== undefined)
  if (defaults.length > 0 && (await writeConfig($, cfg => defaults.reduce(withAdAccount, cfg)))) {
    selection = defaults.reduce((sel, account) => ({ ...sel, [account.platform]: selectionRef(account) }), selection)
  }
  await update($, adSelection, () => selection)
  const m = current(await read($, memberships), at)
  if (at) {
    const info = await loadProjectInfo($, at, m, selection)
    await update($, projectInfo, () => info)
  } else {
    await update($, projectInfo, () => null)
  }
  await update($, clientLogo, () => null)
  if (m) {
    const logo = await fetchLogo($, m).catch(() => null)
    await update($, clientLogo, () => logo)
  }
  await refreshStatus($)
  // The tabs' blocks load after the header, under no splash.
  void loadTabs($, isForced).catch(() => undefined)
}

async function choose($: $, value: string, isSidebar: boolean) {
  const [customerId, projectId] = value.split(':')
  // The ad accounts belong to the project they were chosen in: another project starts without any.
  const isWritten = await writeConfig($, config => ({
    ...(config.projectId === projectId ? config : withoutAdAccounts(config)),
    customerId,
    projectId,
  }))
  if (!isWritten) {
    return
  }
  await loadActive($)
  // On Desktop the pane is the sidebar: it stays open.
  if (!isSidebar) {
    await $.ui.close({ id: PROJECT_PANE })
  }
}

type Target = {
  platform: AdPlatform | null
  account: AdAccount | null
  // The account's id as the call names it, even when it is not in the lists.
  accountRef: string | null
  // The ad object the call acts on, when the call names it by id.
  objectName: string | null
}

// The read tool that tells which account and platform an object named by `id` belongs to.
function lookupTool(tool: string): string | null {
  const layer = /AdLayer([123])$/.exec(tool)
  if (layer) {
    return `bdzGetAdLayer${layer[1]}`
  }
  if (tool === 'bdzStartAdImport') {
    return 'bdzGetAdImport'
  }
  if (tool === 'bdzUpdateLeadForm' || tool === 'bdzDeleteLeadForm') {
    return 'bdzGetLeadForm'
  }
  if (tool === 'bdzDeleteAudience' || tool.startsWith('bdzAddAudienceMembers')) {
    return 'bdzGetAudience'
  }

  return null
}

async function resolveTarget($: $, tool: string, e: Json): Promise<Target> {
  const at: Active = { customerId: String(e.customerId), projectId: String(e.projectId) }
  const isActiveProject = (await read($, active))?.projectId === at.projectId
  const accounts = isActiveProject ? await read($, adAccounts) : await loadAdAccounts($, at)
  let accountId: string | null = e.adAccountId ?? (ACCOUNT_ID_TOOLS.has(tool) ? e.id : null) ?? null
  const googleId: string | null = e.accountId ?? (GOOGLE_ACCOUNT_ID_TOOLS.has(tool) ? e.id : null) ?? null
  let platform: AdPlatform | null = PLATFORMS[e.platform as string] ?? null
  let objectName: string | null = null
  const lookup = lookupTool(tool)
  const objectId = e.id ?? e.audienceId
  if (!accountId && !googleId && lookup && objectId) {
    const body = await call($, lookup, { ...at, id: objectId }).catch(() => null)
    // The object comes either bare or wrapped in one key.
    const object: Json | undefined = body?.name || body?.platform
      ? body
      : Object.values(body ?? {}).find(v => v && typeof v === 'object') as Json | undefined
    objectName = object?.name ?? null
    platform ??= PLATFORMS[object?.platform as string] ?? null
    accountId = object?.adAccountId ?? object?.accountId ?? null
  }
  if (googleId || /Sea|GoogleAdword/.test(tool)) {
    platform = 'GOOGLE_ADS'
  }
  if (/LinkedIn/.test(tool)) {
    platform ??= 'LINKEDIN'
  }
  const accountRef = googleId ?? accountId
  const account = accounts.find(a => a.id === accountRef) ?? null

  return { platform: platform ?? account?.platform ?? null, account, accountRef, objectName }
}

async function confirmQuestion($: $, tool: string, e: Json, target: Target): Promise<string> {
  const m = current(await read($, memberships), { customerId: String(e.customerId), projectId: String(e.projectId) })
  const platform = target.platform ? PLATFORM_LABELS[target.platform] : 'Ads'
  const account = target.account
    ? `l'ad account « ${target.account.name} »`
    : target.accountRef ? `l'ad account ${target.accountRef}` : 'un ad account non identifiable depuis l\'appel'
  const object = target.objectName ? ` (« ${target.objectName} »)` : ''
  const project = m ? `projet « ${m.projectName} » du client ${m.companyName}` : `projet ${e.projectId}`
  const warnings: string[] = []
  if ((await read($, active))?.projectId !== e.projectId) {
    warnings.push('bulldozer.json désigne un autre projet')
  }
  const selected = target.platform && target.platform !== 'MICROSOFT_ADS'
    ? (await read($, adSelection))[target.platform]
    : null
  const selectedRef = target.platform === 'GOOGLE_ADS' ? target.account?.adwordCustomerId : target.accountRef
  if (selected && selectedRef && selected !== selectedRef) {
    warnings.push(`bulldozer.json désigne un autre ad account ${platform}`)
  }

  return `${tool} : écriture ${platform} sur ${account}${object}, ${project}.`
    + (warnings.length > 0 ? ` Attention : ${warnings.join(' ; ')}.` : '')
    + ' C\'est bien la bonne cible ?'
}

// One dialog per target even when the model calls several tools on it at once.
const pendingConfirmations = new Map<string, Promise<boolean>>()

// The call's target, and why it is denied when the user did not confirm it (null: it goes through).
async function confirmTarget($: $, tool: string, e: Json): Promise<{ target: Target; deny: string | null }> {
  const target = await resolveTarget($, tool, e)
  const key = `${e.projectId}|${target.platform ?? '?'}|${target.accountRef ?? 'inconnu'}`
  if ((await read($, confirmedTargets)).includes(key)) {
    return { target, deny: null }
  }
  let pending = pendingConfirmations.get(key)
  if (!pending) {
    pending = (async () => {
      const question = await confirmQuestion($, tool, e, target)
      const answer = await $.ui.ask(question, { header: 'Cible Ads', options: ['Oui, continuer', 'Non, annuler'] })
        .catch(() => null)
      const isConfirmed = answer === 'Oui, continuer'
      if (isConfirmed) {
        await update($, confirmedTargets, list => [...list, key])
      }

      return isConfirmed
    })().finally(() => pendingConfirmations.delete(key))
    pendingConfirmations.set(key, pending)
  }

  return {
    target,
    deny: (await pending)
      ? null
      : `L'utilisateur n'a pas confirmé la cible de ${tool} (projet ${e.projectId}, ad account `
        + `${target.account?.name ?? target.accountRef ?? 'inconnu'}). Rien n'a été envoyé : demande-lui le bon `
        + 'client et le bon ad account avant de réessayer.',
  }
}

const WRITE_LOG_MAX = 50

// Adds a guarded write to the session's journal, newest first.
async function logWrite($: $, tool: string, e: Json, target: Target, outcome: WriteEntry['outcome'], detail: string | null) {
  const entry: WriteEntry = {
    at: new Date(await $.clock.now()).toISOString(),
    projectId: String(e.projectId),
    tool,
    platform: target.platform,
    account: target.account?.name ?? target.accountRef,
    object: target.objectName,
    outcome,
    detail,
  }
  await update($, writeLog, list => [entry, ...list].slice(0, WRITE_LOG_MAX))
}

let isRefreshingAll = false

// The allow rules the mod's reads still lack in the settings in force. A rule naming the whole server
// (`mcp__<server>` or `mcp__<server>__*`) covers them all. Run on every load, so a version of the mod that
// adds a read offers to allow it.
async function missingReadRules($: $): Promise<string[]> {
  const prefix = `mcp__${toolSpelling(server)}`
  const permissions = (await $.settings.read().catch(() => ({})) as Json).permissions as Json | undefined
  const allow: string[] = Array.isArray(permissions?.allow) ? permissions.allow : []
  if (allow.includes(prefix) || allow.includes(`${prefix}__*`)) {
    return []
  }

  return [...MOD_READS].map(name => `${prefix}__${name}`).filter(rule => !allow.includes(rule))
}

// Settings files are reloaded a moment after they change: reloading the sidebar sooner reads the old rules.
const SETTINGS_RELOAD_MS = 1500

// Adds the missing allow rules of the mod's reads to the user's settings. Called from the panel's own
// « Oui, autoriser » button: the user's click is the consent, with no AskUserQuestion call for the auto mode
// classifier to refuse.
async function allowModReads($: $) {
  await update($, isConfirmingAllow, () => false)
  const rules = await missingReadRules($)
  if (rules.length === 0) {
    await update($, needsPermission, () => false)
    return
  }
  const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME'))
  if (!home) {
    $.ui.toast('Dossier utilisateur introuvable : règles non ajoutées')
    return
  }
  const path = `${home}/.claude/settings.json`
  let settings: Json = {}
  try {
    if (await $.fs.exists(path)) {
      settings = JSON.parse((await $.fs.read(path)).replace(/^﻿/, ''))
    }
  } catch {
    $.ui.toast(`${path} n'est pas du JSON valide : règles non ajoutées`)
    return
  }
  const allow: string[] = settings.permissions?.allow ?? []
  const merged = [...allow, ...rules.filter(rule => !allow.includes(rule))]
  await $.fs.write(path, `${JSON.stringify({ ...settings, permissions: { ...settings.permissions, allow: merged } }, null, 2)}\n`)
  await update($, needsPermission, () => false)
  $.ui.toast(`Lectures du panneau autorisées (${rules.length} règles ajoutées)`)
  $.clock.after(SETTINGS_RELOAD_MS, () => void refreshAll($))
}

// Everything the sidebar shows, read again from Bulldozer: the server, the projects, then the active one.
// The opening splash stays up at least this long, so its animation is seen whole even when data is ready.
const SPLASH_MS = 3000

// Opens the Desktop sidebar with its splash: the splash shows until SPLASH_MS has passed and data is loaded.
// The splash drawing, built before the sidebar opens: until its first render answers, Desktop shows
// "Nothing to show yet".
let splash: string | null = null

async function splashSource($: $): Promise<string> {
  splash ??= splashSvg(await $.fs.read(`${$.plugin.root}/assets/bulldozer-logo.svg`))

  return splash
}

// The splash shows while either flag is up. The render reads this one atom, written only when it flips: the
// loading ending under a playing splash must not redraw it, a redraw restarts its animation.
async function syncSplash($: $) {
  const isShown = (await read($, isLoading)) || (await read($, isSplashing)) || (await read($, isSwitching))
  if ((await read($, isSplashShown)) !== isShown) {
    await update($, isSplashShown, () => isShown)
  }
}

// Desktop raises both session.start and session.attach: a second call while the splash plays would restart it.
async function openSidebar($: $) {
  if (await read($, isSplashing)) {
    return
  }
  await update($, isSplashing, () => true)
  await syncSplash($)
  // An unreadable logo must not keep the sidebar shut: the render will try again.
  await splashSource($).catch(() => null)
  $.clock.after(SPLASH_MS, () => void update($, isSplashing, () => false).then(() => syncSplash($)))
  void $.ui.open({ id: PROJECT_PANE, title: 'Bulldozer' })
}

// The Desktop splash: the Bulldozer OS logo fades and scales in, the name follows under it, then the logo
// breathes while the data loads. Drawn by an interactive Svg, the one kind that plays CSS animations.
function splashSvg(logo: string): string {
  // Placed by a transform: not every renderer honours x and y on a nested svg.
  const mark = logo.replace(/<svg[^>]*>/, '<svg width="64" height="64" viewBox="0 0 40 40" fill="none">')

  return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120">'
    + '<style>'
    + '@keyframes appear{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}'
    + '@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}'
    + '@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'
    + '.mark{transform-origin:32px 32px;animation:appear .7s ease-out both,breathe 1.6s ease-in-out .8s infinite}'
    + '.bg{fill:#1A1A18}.name{opacity:0;fill:#FFFFFF;animation:rise .5s ease-out .45s both}'
    + '@media (prefers-color-scheme: light){.bg{fill:#FAF9F5}.name{fill:#1a1a19}}'
    + '</style>'
    // The interactive frame paints white behind the drawing: this rect paints the sidebar's own color.
    + '<rect class="bg" width="200" height="120"/>'
    + `<g transform="translate(68 8)"><g class="mark">${mark}</g></g>`
    + '<text class="name" x="100" y="96" text-anchor="middle" '
    + 'font-family="Chivo Mono,SF Mono,Menlo,Consolas,monospace" font-size="15" letter-spacing="1.5">BULLDOZER OS</text>'
    + '</svg>'
}

async function refreshAll($: $) {
  if (isRefreshingAll) {
    return
  }
  isRefreshingAll = true
  await update($, isLoading, () => true)
  await syncSplash($)
  try {
    let failure: string | null = null
    try {
      await discoverServer($)
      const body = await call($, 'bdzListUserProjectMemberships')
      await update($, memberships, () => pageOf(body, 'memberships').map(toMembership))
    } catch (err) {
      // $.mcp.call only reaches tools in the list the mod sees: name the servers in it, to tell a hidden
      // server from a wrong name.
      const visible = [...new Set((await $.tool.list().catch(() => []))
        .filter(t => t.mcp)
        .map(t => t.name.split('__')[1] ?? ''))].join(', ') || 'aucun'
      failure = connectProblem
        ?? `MCP Bulldozer injoignable (${server}) : ${err instanceof Error ? err.message : String(err)}`
          + ` — serveurs MCP visibles par le mod : ${visible}`
    }
    await loadActive($, true)
    const missing = await missingReadRules($)
    await update($, needsPermission, () => missing.length > 0)
    // loadActive clears the error it owns; a failed membership load outranks it.
    if (failure) {
      await update($, error, () => failure)
      await refreshStatus($)
    }
  } finally {
    isRefreshingAll = false
    await update($, isLoading, () => false)
    await syncSplash($)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'bdz-project', description: 'Choisir le projet Bulldozer actif' })
    void refreshAll($).catch(() => undefined)
    // Changes from outside Claude (an editor, another session, git). Not a watchPaths file watch: the built-in
    // security module skips a mod's classic.SessionStart, so the engine never watches the file for it.
    $.clock.every(CONFIG_POLL_MS, () => void syncConfig($).catch(() => undefined))
    if ((await $.session.surfaces()).includes('desktop')) {
      await openSidebar($)
    }

    return next(e)
  })

  // Only the mod's own calls: the model's calls to the same tools keep the session's permission rules.
  on('tool.check', async ($, e, next) => {
    const name = BULLDOZER_TOOL.exec(e.tool)?.[2] ?? ''
    const isModRead = next.origin.plugin === $.plugin.name && MOD_READS.has(name)

    return isModRead ? { decision: 'allow', reason: `${$.plugin.name} : lecture Bulldozer du panneau` } : next(e)
  })

  // Desktop usually attaches after session.start: open the sidebar when it does.
  on('session.attach', async ($, e, next) => {
    const attached = await next(e)
    if (e.surface === 'desktop') {
      await refreshStatus($)
      await openSidebar($)
    }

    return attached
  })

  on('tool.call', async ($, e, next) => {
    // The mod's own reads come through here too: they are neither guarded nor a sign the server came up.
    if (next.origin.plugin === $.plugin.name) {
      return next(e)
    }
    const ran = await (async () => {
      const match = BULLDOZER_TOOL.exec(e.tool)
      if (!match?.[1] || !match[2]) {
        return next(e)
      }
      // A Bulldozer call by the model means its server is up: retry a sidebar that found none.
      if ((await read($, memberships)).length === 0) {
        void refreshAll($).catch(() => undefined)
      }
      const tool = match[2]
      if (!GUARDED.has(tool)) {
        return next(e)
      }
      const { target, deny } = await confirmTarget($, tool, e as Json)
      if (deny) {
        await logWrite($, tool, e as Json, target, 'refused', null)

        return { deny }
      }
      const result = await next(e)
      await logWrite($, tool, e as Json, target, result.isError ? 'error' : 'ok',
        result.isError ? (result.text ?? '').slice(0, 200) : null)

      return result
    })()
    // Claude may change bulldozer.json with any tool (Write, Edit, Bash, PowerShell…): look at it after each one.
    void syncConfig($).catch(() => undefined)
    // A job Claude just started shows in the Jobs tab, and the tab polls it until it ends.
    if (JOB_STARTERS.has(BULLDOZER_TOOL.exec(e.tool)?.[2] ?? '')) {
      void loadJobs($, true).catch(() => undefined)
    }

    return ran
  })

  on('command.run', { command: 'bdz-project' }, async $ => {
    const placed = await $.ui.open({ id: PROJECT_PANE, title: 'Projet Bulldozer', focus: true, closeOnEscape: true })

    return { text: placed.isPlaced ? 'Sélecteur de projet ouvert.' : `Panneau non affiché : ${placed.reason}` }
  })

  on('ui.render', { component: 'Pane', requestId: OBJECTIVES_PANE }, async ($, e) => {
    const info = await read($, projectInfo)
    const m = current(await read($, memberships), await read($, active))
    const { Box, Text, Button, Markdown } = $.ui.resolve(e)
    const text = (info?.objectives ?? [])
      .map(o => `## ${OBJECTIVE_LABELS[o.type] ?? o.type}\n\n${o.answer}`)
      .join('\n\n---\n\n')

    return (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text bold>{m ? `Objectifs — ${m.projectName}` : 'Objectifs'}</Text>
          <Button key="objectives-close" label="Fermer" role="dismiss" onPress={() => void $.ui.close({ id: OBJECTIVES_PANE })} />
        </Box>
        {text ? <Markdown text={text} /> : <Text dimColor>Aucun objectif renseigné.</Text>}
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PROJECT_PANE }, async ($, e) => {
    // The splash reads nothing else: a state it read would redraw it as data arrives, and each redraw
    // restarts its animation.
    if (e.surface !== 'terminal' && e.surface !== 'mobile'
      && (await read($, isSplashShown))) {
      const { Box, Svg } = $.ui.resolve(e)

      return (
        <Box flexDirection="column" alignItems="center" justifyContent="center" height="100%" minHeight={20}>
          <Svg source={await splashSource($)} alt="Bulldozer OS" width={200} height={120} isInteractive />
        </Box>
      )
    }
    const list = [...(await read($, memberships))].sort((a, b) =>
      a.companyName.localeCompare(b.companyName) || a.projectName.localeCompare(b.projectName))
    const at = await read($, active)
    if (e.surface === 'mobile') {
      const { Text } = $.ui.resolve(e)

      return <Text dimColor>Le sélecteur n'existe pas sur mobile.</Text>
    }
    const isSidebar = e.surface !== 'terminal'
    const { Box, Text, Select } = $.ui.resolve(e)
    const picker = list.length === 0
      ? <Text dimColor>Aucun projet Bulldozer accessible.</Text>
      : (
        <Select
          key="project"
          autoFocus
          options={list.map(m => ({
            value: `${m.customerId}:${m.projectId}`,
            label: `${m.companyName} — ${m.projectName}`,
          }))}
          value={at ? `${at.customerId}:${at.projectId}` : undefined}
          onSelect={value => void choose($, value, isSidebar)}
        />
      )
    if (e.surface === 'terminal') {
      return <Box flexDirection="column">{picker}</Box>
    }
    const { Svg, Button, Link, Input } = $.ui.resolve(e)
    const logo = await $.fs.read(`${$.plugin.root}/assets/bulldozer-logo.svg`)
    const header = (
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap={1}>
          <Svg source={logo} alt="Logo Bulldozer" width={24} height={24} />
          <Svg source={brandSvg()} alt="Bulldozer" width={150} height={18} />
        </Box>
        <Button key="refresh" label="↻" plain dimColor onPress={() => void refreshAll($)} />
      </Box>
    )
    const info = await read($, projectInfo)
    const failure = await read($, error)
    const m = current(list, at)
    const accounts = await read($, adAccounts)
    const selection = await read($, adSelection)
    const now = await $.clock.now()
    const tab = await read($, activeTab)
    // A block loaded for another project is not shown: its project's rows would pass for this one's.
    const ofProject = <B extends { key: string },>(block: B | null) =>
      (at && block?.key.startsWith(at.projectId) ? block : null)
    const perfBlock = ofProject(await read($, perf))
    const healthBlock = ofProject(await read($, health))
    const jobsBlock = ofProject(await read($, jobs))
    const hostingsBlock = ofProject(await read($, hostings))
    const query = at ? await currentHostingQuery($, at) : null
    const links = await read($, hostingLinks)
    const writes = (await read($, writeLog)).filter(w => w.projectId === at?.projectId)
    const sections = (['META', 'LINKEDIN', 'GOOGLE_ADS'] as const)
      .map(platform => ({ platform, list: accounts.filter(a => a.platform === platform) }))
      .filter(section => section.list.length > 0)
    const icons = Object.fromEntries(await Promise.all(sections.map(async ({ platform }) =>
      [platform, await readIcon($, PLATFORM_ICONS[platform] ?? '')] as const)))
    const gscIcon = await readIcon($, GSC_ICON)
    const title = (id: string, text: string) => <Svg key={`title-${id}`} source={labelSvg(text)} alt={text} width={200} height={14} />
    const tag = (text: string, tone: Tone) => (
      // Never squeezed out by a long label beside it.
      <Box flexShrink={0}>
        <Svg source={tagSvg(text, tone)} alt={text} width={tagWidth(text)} height={TAG_HEIGHT} />
      </Box>
    )
    const blockState = (block: { isLoading: boolean; error: string | null; rows: unknown[] } | null, empty: string) => {
      if (!block || (block.isLoading && block.rows.length === 0)) {
        return <Text dimColor>Chargement…</Text>
      }
      if (block.error) {
        return <Text color="red" wrap="truncate-end">{block.error}</Text>
      }

      return block.rows.length === 0 ? <Text dimColor>{empty}</Text> : null
    }

    const issues = (healthBlock?.rows ?? []).filter(r => r.tone === 'red' || r.tone === 'amber').length
    const underway = (jobsBlock?.rows ?? []).filter(isUnderway).length
    const TABS: { id: Tab; label: string }[] = [
      { id: 'projet', label: 'Projet' },
      { id: 'paid', label: 'Paid' },
      { id: 'imports', label: issues > 0 ? `Imports ⚠ ${issues}` : 'Imports' },
      { id: 'jobs', label: underway > 0 ? `Jobs ${underway}` : 'Jobs' },
      { id: 'hostings', label: 'Hostings' },
      { id: 'journal', label: writes.length > 0 ? `Journal ${writes.length}` : 'Journal' },
    ]
    // Every tab drawn as a button, the active one in lime, then a rule over the tab's content: the bar reads
    // as a set of views, not as plain words.
    const tabBar = (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          {TABS.map(t => (
            <Button
              key={`tab-${t.id}`}
              label={t.label}
              variant={t.id === tab ? 'primary' : 'secondary'}
              onPress={() => void selectTab($, t.id)}
            />
          ))}
        </Box>
        <Svg source={ruleSvg()} alt="" height={2} />
      </Box>
    )

    // The number only tells apart accounts of one platform that share a name.
    const adLabel = (a: AdAccount) => (a.number && accounts.filter(b => b.platform === a.platform && b.name === a.name).length > 1
      ? `${a.name} (${a.number})`
      : a.name)
    // A tab's content: a list of items, each drawn in its own Box.
    type Item = { key: string; node: RenderElement }
    const item = (key: string, node: RenderElement): Item => ({ key, node })
    const when = (isShown: unknown, key: string, node: () => RenderElement): Item[] => (isShown ? [item(key, node())] : [])
    const stateItems = (block: { isLoading: boolean; error: string | null; rows: unknown[] } | null, empty: string) => {
      const state = blockState(block, empty)

      return state ? [item('state', state)] : []
    }

    const paidTab = (): Item[] => [
      ...when(sections.length === 0, 'ads-none', () => <Text dimColor>Aucun ad account sur ce projet.</Text>),
      ...sections.map(({ platform, list }) => {
        const chosen = list.find(a => (platform === 'GOOGLE_ADS' ? a.adwordCustomerId : a.id) === selection[platform])
        const [label, tone] = accountTag(chosen, chosen ? info?.imports[chosen.id] : undefined, now)
        const row = perfBlock?.rows.find(r => r.accountId === chosen?.id)
        const figures = row && !row.error ? perfSvg(row) : null

        return item(`ads-${platform}`, (
          <Box flexDirection="column" gap={1}>
            <Box flexDirection="row" alignItems="center" gap={1}>
              <Svg source={icons[platform] ?? ''} alt={PLATFORM_LABELS[platform]} width={20} height={20} />
              <Box flexGrow={1} flexShrink={1} minWidth={0} overflow="hidden">
                <Select
                  key={`ad-${platform}`}
                  options={list.map(a => ({
                    value: a.id,
                    label: padLabel(adLabel(a)),
                  }))}
                  value={chosen?.id}
                  onSelect={value => void chooseAdAccount($, platform, value)}
                />
              </Box>
              {tag(label, tone)}
            </Box>
            {chosen && !row && perfBlock?.isLoading && <Text dimColor>Chargement des 7 derniers jours…</Text>}
            {row?.error && <Text color="red" wrap="truncate-end">Perfs illisibles : {row.error}</Text>}
            {row && !row.error && !figures && <Text dimColor>Aucune dépense sur les 14 derniers jours.</Text>}
            {figures && (
              <Svg
                source={figures.source}
                alt={`Perfs 7 jours ${PLATFORM_LABELS[platform]}`}
                height={figures.height}
              />
            )}
          </Box>
        ))
      }),
      ...when(perfBlock?.error, 'perf-error', () => <Text color="red" wrap="truncate-end">{perfBlock?.error}</Text>),
      ...when(sections.length > 0, 'perf-note', () => <Text dimColor>7 derniers jours complets, comparés aux 7 précédents.</Text>),
    ]

    const importsTab = (): Item[] => [
      ...stateItems(healthBlock, 'Aucun import à surveiller : ni ad account choisi, ni domaine Search Console.'),
      ...(healthBlock?.rows ?? []).map(r => item(`health-${r.key}`, (
        <Box flexDirection="column">
          <Box flexDirection="row" alignItems="center" gap={1}>
            <Svg
              source={r.source === 'GSC' ? gscIcon : (icons[r.source] ?? initialsIcon(PLATFORM_LABELS[r.source]))}
              alt={r.source === 'GSC' ? 'Search Console' : PLATFORM_LABELS[r.source]}
              width={20}
              height={20}
            />
            <Box flexGrow={1} flexShrink={1} minWidth={0}>
              <Text wrap="truncate-end">{r.label}</Text>
            </Box>
            {tag(r.tag, r.tone)}
          </Box>
          {r.detail && <Text dimColor wrap="truncate-end">{r.detail}</Text>}
        </Box>
      ))),
      item('imports-healthcheck', (
        <Button
          key="imports-healthcheck"
          label="Lancer le healthcheck complet  →"
          onPress={() => void $.prompt.submit({ text: SHORTCUTS[0]!.prompt, asUser: true })
            .catch(() => $.ui.toast('Impossible de lancer le healthcheck'))}
        />
      )),
    ]

    const jobsTab = (): Item[] => [
      ...stateItems(jobsBlock, 'Aucun job en cours ni terminé depuis 24 h.'),
      ...(jobsBlock?.rows ?? []).map(j => {
        const [label, tone]: [string, Tone] = j.state === 'failed'
          ? ['ERROR', 'red']
          : j.state === 'done'
            ? ['SUCCESS', 'lime']
            : j.state === 'queued'
              ? ['EN FILE', 'dim']
              : [j.progress === null ? 'EN COURS' : `EN COURS ${Math.round(j.progress * 100)} %`, 'amber']

        return item(`job-${j.key}`, (
          <Box flexDirection="column">
            <Box flexDirection="row" alignItems="center" gap={1}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{j.label}</Text>
              </Box>
              {tag(label, tone)}
            </Box>
            {j.state === 'running' && j.progress !== null && (
              <Svg source={progressSvg(j.progress)} alt={`${Math.round(j.progress * 100)} %`} height={6} />
            )}
            {j.detail && <Text dimColor wrap="truncate-end">{j.detail}</Text>}
            {j.links.length > 0 && (
              <Box flexDirection="row" flexWrap="wrap" gap={2}>
                {j.links.map((href, index) => (
                  <Link key={`job-${j.key}-link-${index}`} href={href} label={j.links.length > 1 ? `Voir ${index + 1} →` : 'Voir →'} />
                ))}
              </Box>
            )}
          </Box>
        ))
      }),
      item('jobs-note', (
        <Text dimColor>
          Studio, enrichissements de contacts et sourcing de listes. Les jobs LinkedIn, SEO et les imports Google Ads ne
          se listent pas par projet.
        </Text>
      )),
    ]

    const hostingsTab = (): Item[] => {
      const page = query?.page ?? 0
      const pages = Math.max(1, Math.ceil((hostingsBlock?.total ?? 0) / HOSTINGS_PAGE_SIZE))
      // A link kept a minute short of its expiry, so it does not die under the click.
      const freshLink = (id: string) => {
        const link = links[id]

        return link && (!link.expiresAt || Date.parse(link.expiresAt) - 60_000 > now) ? link.url : null
      }

      return [
        item('hostings-search', (
          <Input
            key="hosting-search"
            placeholder="Rechercher par nom"
            submitLabel="chercher"
            value={query?.q ?? ''}
            onSubmit={value => void queryHostings($, { q: value.trim(), page: 0 })}
          />
        )),
        ...stateItems(hostingsBlock, query?.q ? `Aucun hosting ne contient « ${query.q} ».` : 'Aucun hosting sur ce projet.'),
        ...(hostingsBlock?.rows ?? []).map(hosting => {
          const href = hosting.isSite ? hosting.publicUrl : freshLink(hosting.id)

          return item(`hosting-${hosting.id}`, (
            <Box flexDirection="column">
              <Box flexDirection="row" alignItems="center" gap={1}>
                <Box flexGrow={1} flexShrink={1} minWidth={0}>
                  <Text wrap="truncate-end">{hosting.name}</Text>
                </Box>
                {tag(hosting.isSite ? 'SITE' : 'FICHIER', hosting.isSite ? 'lime' : 'dim')}
              </Box>
              <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
                <Text dimColor>Créé {formatDate(hosting.createdAt)}</Text>
                {href
                  ? <Link key={`hosting-${hosting.id}-open`} href={href} label="Ouvrir →" />
                  : !hosting.isSite && (
                    <Button
                      key={`hosting-${hosting.id}-link`}
                      label="Obtenir le lien"
                      plain
                      dimColor
                      onPress={() => void fetchHostingLink($, hosting.id)}
                    />
                  )}
              </Box>
            </Box>
          ))
        }),
        ...when(hostingsBlock && !hostingsBlock.error && pages > 1, 'hostings-pages', () => (
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
            {page > 0
              ? <Button key="hostings-prev" label="← Précédent" plain onPress={() => void queryHostings($, { page: page - 1 })} />
              : <Text> </Text>}
            <Text dimColor>Page {page + 1} / {pages}</Text>
            {page + 1 < pages
              ? <Button key="hostings-next" label="Suivant →" plain onPress={() => void queryHostings($, { page: page + 1 })} />
              : <Text> </Text>}
          </Box>
        )),
      ]
    }

    const journalTab = (): Item[] => [
      ...when(writes.length === 0, 'journal-none', () => <Text dimColor>Aucune écriture Ads sur ce projet dans cette session.</Text>),
      ...writes.map((w, index) => {
        const [label, tone]: [string, Tone] = w.outcome === 'ok'
          ? ['OK', 'lime']
          : w.outcome === 'error' ? ['ERREUR', 'red'] : ['REFUSÉ', 'amber']
        const where = [w.platform ? PLATFORM_LABELS[w.platform] : null, w.account, w.object].filter(Boolean).join(' · ')

        return item(`write-${index}-${w.at}`, (
          <Box flexDirection="column">
            <Box flexDirection="row" alignItems="center" gap={1}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{formatDate(w.at).slice(6)} · {w.tool.replace(/^bdz/, '')}</Text>
              </Box>
              {tag(label, tone)}
            </Box>
            {where && <Text dimColor wrap="truncate-end">{where}</Text>}
            {w.detail && <Text color="red" wrap="truncate-end">{w.detail}</Text>}
          </Box>
        ))
      }),
    ]

    const projetTab = async (): Promise<Item[]> => {
      const connectorRows = await Promise.all((info?.connectors ?? []).map(async (c, index) => {
        const label = CONNECTOR_LABELS[c.platform] ?? c.platform.replace('INTEGRATION_PLATFORM_', '')
        const file = CONNECTOR_ICONS[c.platform]

        return {
          key: `connector-${c.platform}-${index}`,
          label,
          icon: file ? await readIcon($, file) : initialsIcon(label),
          isValid: c.isValid,
        }
      }))
      const objectives = info?.objectives ?? []

      return [
        ...when(info?.objectivesError, 'objectives-error', () => (
          <Text dimColor wrap="truncate-end">Objectifs indisponibles : {info?.objectivesError}</Text>
        )),
        ...when(objectives.length > 0, 'objectives-title', () => (
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            {title('objectives', 'Objectifs')}
            <Button
              key="objectives-more"
              label="Voir plus →"
              plain
              dimColor
              onPress={() => void $.ui.open({
                id: OBJECTIVES_PANE, title: 'Objectifs du projet', focus: true, closeOnEscape: true, holdToasts: true,
              })}
            />
          </Box>
        )),
        ...objectives.map(o => item(`objective-${o.type}`, (
          <Box flexDirection="column">
            <Text dimColor>{OBJECTIVE_LABELS[o.type]}</Text>
            <Text wrap="truncate-end">{o.answer.length > 160 ? `${o.answer.slice(0, 159)}…` : o.answer}</Text>
          </Box>
        ))),
        ...when(connectorRows.length > 0, 'connectors', () => (
          <Box flexDirection="column" gap={1}>
            {title('connectors', 'Mes connecteurs')}
            <Box flexDirection="row" flexWrap="wrap" gap={2}>
              {connectorRows.map(({ key, label, icon, isValid }) => (
                <Box key={key} flexDirection="row" alignItems="center" gap={1}>
                  <Svg source={icon} alt={label} width={20} height={20} />
                  <Text color={isValid ? 'green' : 'red'}>●</Text>
                </Box>
              ))}
            </Box>
          </Box>
        )),
        item('shortcuts', (
          <Box flexDirection="column" gap={1}>
            {title('shortcuts', 'Actions')}
            {SHORTCUTS.map(shortcut => (
              <Button
                key={shortcut.key}
                label={`${shortcut.label}  →`}
                onPress={() => void $.prompt.submit({ text: shortcut.prompt, asUser: true })
                  .catch(() => $.ui.toast(`Impossible d'envoyer « ${shortcut.label} »`))}
              />
            ))}
          </Box>
        )),
      ]
    }

    const items = tab === 'imports'
      ? importsTab()
      : tab === 'jobs'
        ? jobsTab()
        : tab === 'hostings'
          ? hostingsTab()
          : tab === 'journal'
          ? journalTab()
          : tab === 'projet' ? await projetTab() : paidTab()
    const content = (
      <Box flexDirection="column" gap={2}>
        {items.map(({ key, node }) => (
          <Box key={`item-${key}`} flexDirection="column">{node}</Box>
        ))}
      </Box>
    )

    return (
      <Box flexDirection="column" gap={2}>
        <Box flexDirection="column" gap={2}>
          {header}
          {failure && <Text color="red">{failure}</Text>}
          {(await read($, needsPermission)) && !(await read($, isConfirmingAllow)) && (
            <Button
              key="allow-reads"
              label="Autoriser les lectures du panneau"
              variant="primary"
              onPress={() => void update($, isConfirmingAllow, () => true)}
            />
          )}
          {(await read($, needsPermission)) && (await read($, isConfirmingAllow)) && (
            <Box flexDirection="column" gap={1}>
              <Text>
                Ajouter à ton settings.json utilisateur les règles qui laissent le panneau lire tes projets, ad accounts
                et imports Bulldozer sans passer par le classifieur ?
              </Text>
              <Box flexDirection="row" gap={1}>
                <Button key="allow-reads-yes" label="Oui, autoriser" variant="primary" onPress={() => void allowModReads($)} />
                <Button key="allow-reads-no" label="Annuler" onPress={() => void update($, isConfirmingAllow, () => false)} />
              </Box>
            </Box>
          )}
          {m
            ? (
              <Box flexDirection="row" alignItems="flex-start" gap={1}>
                <Box flexGrow={1}>
                  {(() => {
                    const hero = heroSvg(m, info?.subscription?.name ?? null)

                    return <Svg source={hero.source} alt={`Projet ${m.projectName}`} width={260} height={hero.height} />
                  })()}
                </Box>
                <Svg source={clientLogoSvg(m, await read($, clientLogo))} alt={m.companyName} width={36} height={36} />
              </Box>
            )
            : <Text dimColor>Aucun projet actif.</Text>}
          {info && info.stack !== null && (
            <Svg source={stackSvg(info.stack)} alt={`Stack : ${formatJetons(info.stack)} jetons`} height={24} />
          )}
          {picker}
          {at && tabBar}
        </Box>
        {at && content}
      </Box>
    )
  })
}
