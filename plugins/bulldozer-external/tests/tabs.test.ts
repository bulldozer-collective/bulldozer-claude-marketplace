import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

const P = 'mcp__plugin_bulldozer_bulldozer__'
const NOW = Date.parse('2026-10-04T12:00:00Z')
// The current period starts 7 days before today 00:00 UTC.
const CURRENT_FROM = '2026-09-27T00:00:00.000Z'
const MEMBERSHIPS = {
  memberships: [
    { customerId: 'c1', userId: 'u1', project: { id: 'p1', name: 'Interne' }, company: { id: 'co1', name: 'Bulldozer', logoUrl: null } },
    { customerId: 'c2', userId: 'u1', project: { id: 'p2', name: 'Mooncard B2B' }, company: { id: 'co2', name: 'Mooncard', logoUrl: null } },
  ],
}
const REGISTERED = {
  accounts: [
    { id: 'meta1', platform: 'INTEGRATION_PLATFORM_META', name: 'Meta Bulldozer', adAccount: '123' },
    { id: 'meta2', platform: 'INTEGRATION_PLATFORM_META', name: 'Meta Mooncard', adAccount: '456' },
    { id: 'li1', platform: 'INTEGRATION_PLATFORM_LINKED_IN', name: 'LinkedIn Bulldozer', adAccount: 'urn:li:1' },
  ],
}
const GOOGLE = { accounts: [{ id: 'g1', adwordCustomerId: 9808244998, adwordLoginId: 1923201425, name: 'Google Bulldozer' }] }
const money = (value: number) => ({ value, currency: 'EUR' })
// Three campaigns over two pages: one in both periods, one new, one stopped.
const META_PAGES = [
  {
    comparisons: {
      content: [
        { current: { cost: money(100), leads: 2 }, previous: { cost: money(50), leads: 1 } },
        { current: { cost: money(50), leads: 1 }, previous: null },
      ],
      totalElement: 3,
    },
    freshness: [{ dataThrough: '2026-10-03T23:59:59Z', upToDate: true }],
  },
  { comparisons: { content: [{ current: null, previous: { cost: money(25), leads: 1 } }], totalElement: 3 }, freshness: [] },
]

type Options = { answer?: string; holdGsc?: Record<string, Promise<void>> }

function setup(on: any, options: Options = {}) {
  let config: any = { customerId: 'c1', projectId: 'p1' }
  const every: number[] = []
  const bodies: Record<string, (e: any) => unknown> = {
    bdzListUserProjectMemberships: () => MEMBERSHIPS,
    bdzListRegisteredAdAccounts: e => (e.projectId === 'p1' ? REGISTERED : { accounts: [] }),
    bdzListGoogleAdwordAccounts: e => (e.projectId === 'p1' ? GOOGLE : { accounts: [] }),
    bdzCompareAdAnalytics: e => (e.adAccountId === 'meta1' ? META_PAGES[e.page] : { comparisons: { content: [], totalElement: 0 }, freshness: [] }),
    bdzListSeaL1s: () => ({ results: { content: [{ id: 'l1a' }, { id: 'l1b' }], totalElement: 2 } }),
    bdzGetSeaL1Metrics: e => ({
      results: { content: [e.from === CURRENT_FROM ? { cost: 10, conversions: 1, currency: 'EUR' } : { cost: 5, conversions: 0, currency: 'EUR' }] },
    }),
    bdzGetGoogleAdwordAccountRefreshConfig: () => ({ refreshConfig: { refreshEnabled: true } }),
    bdzGetSeoGscDomains: e => ({ gscDomains: [{ id: `gsc-${e.projectId}`, domain: `sc-domain:${e.projectId}.fr` }] }),
    bdzGetGscDomainAnalyticsSummary: () => ({ summary: { daily: [{ date: '2026-10-01' }] } }),
    bdzListAdImports: () => ({ imports: { content: [{ state: 'AD_IMPORT_STATE_SUCCESS', finishTime: '2026-10-04T02:03:58Z' }] } }),
    bdzListStudioJobs: () => ({
      content: [
        { id: 's1', status: 'in_progress', startedAt: '2026-10-04T11:59:00Z', progress: 0.4, createdAt: '2026-10-04T11:59:00Z' },
        {
          id: 's2', status: 'completed', cost: 12, updatedAt: '2026-10-04T11:50:00Z',
          results: [{ assets: [{ url: 'https://bdz-saas.s3.eu-west-3.amazonaws.com/studio/a.png?X-Amz-Expires=3600', largeUrl: null }] }],
        },
        { id: 's3', status: 'completed', cost: 12, updatedAt: '2026-10-02T11:50:00Z' },
      ],
    }),
    bdzListContactEnrichBatches: () => ({ content: [] }),
    bdzListLeadLists: () => ({ content: [] }),
    bdzListHostings: e => {
      hostingCalls.push({ page: e.page, pageSize: e.pageSize, q: e.q })
      const content = e.q
        ? [{ id: 'h9', name: 'Rapport SEO', type: 'HOSTING_TYPE_SINGLE_FILE', createdAt: '2026-10-01T10:00:00Z' }]
        : e.page === 0
          ? [
            { id: 'h1', name: 'Site vitrine', type: 'HOSTING_TYPE_STATIC_SITE', publicUrl: 'https://bulldozer.bulldozer-os.fr/vitrine/', createdAt: '2026-10-03T10:00:00Z' },
            { id: 'h2', name: 'export.csv', type: 'HOSTING_TYPE_SINGLE_FILE', createdAt: '2026-10-02T10:00:00Z' },
            { id: 'h3', name: 'Vieux fichier', type: 'HOSTING_TYPE_SINGLE_FILE', validUntil: '2026-10-01T00:00:00Z', createdAt: '2026-09-01T10:00:00Z' },
          ]
          : [{ id: 'h4', name: 'Page 2', type: 'HOSTING_TYPE_SINGLE_FILE', createdAt: '2026-08-01T10:00:00Z' }]
      return { hostings: { content, totalElement: e.q ? 1 : 23 } }
    },
    bdzExploreHosting: e => ({ signedUrl: { url: `https://bdz-hosting.s3.amazonaws.com/hostings/${e.hostingId}?X-Amz-Expires=3600`, expiresAt: '2026-10-04T13:00:00Z' } }),
  }
  const ran: string[] = []
  const hostingCalls: { page: number; pageSize: number; q?: string }[] = []
  // The panel's reads, as `tool:account`.
  const reads: string[] = []
  on('tool.list', async () => ({ value: [{ name: `${P}bdzListUserProjectMemberships`, description: '', mcp: true }] }))
  onCalls(on, async ($: any, e: any) => {
    if (e.tool === 'AskUserQuestion') {
      const q = e.questions[0].question
      return { result: { questions: e.questions, answers: { [q]: options.answer ?? 'Oui, continuer' } } }
    }
    const name = e.tool.replace(P, '')
    if (name === 'bdzGetSeoGscDomains' && options.holdGsc?.[e.projectId]) {
      await options.holdGsc[e.projectId]
    }
    if (name in bodies) {
      reads.push(`${name}:${e.adAccountId ?? e.accountId ?? e.gscDomainId ?? ''}`)
      const body = bodies[name]!(e)
      return { result: body, text: JSON.stringify(body) }
    }
    ran.push(name)
    return name === 'bdzUpdateAdLayer2'
      ? { result: {}, isError: true, text: 'LinkedIn refused the change' }
      : { result: { ok: true }, text: '{}' }
  })
  on('fs.exists', async ($: any, e: any) => ({ value: !String(e.path).endsWith('settings.json') }))
  on('fs.read', async ($: any, e: any) => ({
    value: String(e.path).endsWith('.svg') ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : JSON.stringify(config),
  }))
  on('fs.write', async ($: any, e: any) => { config = JSON.parse(e.text); return { value: undefined } })
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  on('ui.close', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: NOW }))
  on('clock.every', ($: any, e: any) => { every.push(e.ms); return new Promise(() => {}) })

  return { ran, every, reads, hostingCalls }
}

async function settle() {
  for (let i = 0; i < 3000; i++) await Promise.resolve()
}

async function mount($: any) {
  await $.session.start({ cwd: '/tmp', source: 'startup' })
  await settle()

  const ui = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  // The panel opens on Projet: the selectors and the performance are on Paid.
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-paid' } as any)
  await settle()

  return ui
}

const svgs = async (ui: any) => (await ui.findAll({ type: 'Svg' } as any)).map((s: any) => s.props)
const texts = async (ui: any) => (await ui.findAll({ type: 'Text' } as any)).map((t: any) => t.text)
const labels = async (ui: any) => (await ui.findAll({ type: 'Button' } as any)).map((b: any) => b.props.label)

test('Paid sums each selected account over both periods, Meta across pages and Google across campaigns', async ($, on) => {
  setup(on)
  const ui = await mount($)
  const meta = (await svgs(ui)).find((s: any) => s.alt === 'Perfs 7 jours Meta')?.source ?? ''
  console.log('META', meta.replace(/<style>.*<\/style>/, ''))
  // 150 € and 3 leads against 75 € and 2: CPL 50 € against 37,50 €.
  expect(meta).toContain('150 €')
  expect(meta).toContain('+100 %')
  expect(meta).toContain('+50 %')
  expect(meta).toContain('50,00 €')
  expect(meta).toMatch(/class="red"[^>]*>\+33 %/)
  const google = (await svgs(ui)).find((s: any) => s.alt === 'Perfs 7 jours Google Ads')?.source ?? ''
  // Two campaigns: 20 € and 2 conversions against 10 € and none, so no CPA to compare with.
  expect(google).toContain('20,00 €')
  expect(google).toContain('CONVERSIONS')
  expect(google).toContain('10,00 €')
  expect(await texts(ui)).toContain('Aucune dépense sur les 14 derniers jours.')
})

test('the journal lists the session\'s Ads writes: done, failed and refused', async ($, on) => {
  setup(on)
  const ui = await mount($)
  await $.tool.call({ tool: `${P}bdzUpdateAdLayer1`, customerId: 'c1', projectId: 'p1', adAccountId: 'meta1', id: 'x' } as any)
  await $.tool.call({ tool: `${P}bdzUpdateAdLayer2`, customerId: 'c1', projectId: 'p1', adAccountId: 'li1', id: 'y' } as any)
  expect(await labels(ui)).toContain('Journal 2')
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-journal' } as any)
  const tags = (await svgs(ui)).map((s: any) => s.alt)
  expect(tags).toContain('OK')
  expect(tags).toContain('ERREUR')
  expect((await texts(ui)).some((t: string) => t.includes('LinkedIn refused the change'))).toBe(true)
})

test('a refused target is journaled as refused, and nothing is sent', async ($, on) => {
  const t = setup(on, { answer: 'Non, annuler' })
  const ui = await mount($)
  await $.tool.call({ tool: `${P}bdzUpdateAdLayer1`, customerId: 'c1', projectId: 'p1', adAccountId: 'meta1', id: 'x' } as any)
  expect(t.ran).not.toContain('bdzUpdateAdLayer1')
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-journal' } as any)
  expect((await svgs(ui)).map((s: any) => s.alt)).toContain('REFUSÉ')
})

test('Jobs counts the running ones in its tab and polls while one runs', async ($, on) => {
  const t = setup(on)
  const ui = await mount($)
  expect(await labels(ui)).toContain('Jobs 1')
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-jobs' } as any)
  expect((await svgs(ui)).map((s: any) => s.alt)).toContain('EN COURS 40 %')
  // A job done within 24 hours is listed under the running one; an older one is not.
  expect((await svgs(ui)).filter((s: any) => s.alt === 'SUCCESS').length).toBe(1)
  expect((await texts(ui)).some((x: string) => x.includes('12 jetons'))).toBe(true)
  const links = (await ui.findAll({ type: 'Link' } as any)).map((l: any) => l.props)
  expect(links).toEqual([{ href: 'https://bdz-saas.s3.eu-west-3.amazonaws.com/studio/a.png?X-Amz-Expires=3600', label: 'Voir →' }])
  // One poll at 30 s, not one per load.
  await $.ui.press({ plugin: 'bulldozer', key: 'refresh' } as any)
  await settle()
  expect(t.every.filter(ms => ms === 30_000).length).toBe(1)
})

test('Imports keeps the new project\'s rows when the previous project\'s answer comes last', async ($, on) => {
  let release: () => void = () => {}
  const held = new Promise<void>(resolve => { release = resolve })
  setup(on, { holdGsc: { p1: held } })
  const ui = await mount($)
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-imports' } as any)
  await $.ui.select({ plugin: 'bulldozer', key: 'project', value: 'c2:p2' } as any)
  await settle()
  release()
  await settle()
  const shown = await texts(ui)
  console.log('IMPORTS', JSON.stringify(shown))
  expect(shown).toContain('p2.fr')
  expect(shown).not.toContain('p1.fr')
})

test('another Meta account reloads Meta alone: LinkedIn, Google Ads and Search Console are kept', async ($, on) => {
  const t = setup(on)
  const ui = await mount($)
  const before = t.reads.length
  await $.ui.select({ plugin: 'bulldozer', key: 'ad-META', value: 'meta2' } as any)
  await settle()
  const after = t.reads.slice(before)
  console.log('READS AFTER SWITCH', JSON.stringify(after))
  expect(after).toContain('bdzCompareAdAnalytics:meta2')
  expect(after.some(r => /:(li1|g1|gsc-p1)$/.test(r))).toBe(false)
  expect((await svgs(ui)).some((s: any) => s.alt === 'Perfs 7 jours Google Ads')).toBe(true)
})

test('a Studio job Claude starts shows in Jobs at once, and opening the tab reads the jobs again', async ($, on) => {
  const t = setup(on)
  const ui = await mount($)
  const studioReads = () => t.reads.filter(r => r.startsWith('bdzListStudioJobs')).length
  const before = studioReads()
  await $.tool.call({ tool: `${P}bdzCreateStudioJob`, customerId: 'c1', projectId: 'p1', prompt: 'x' } as any)
  await settle()
  expect(studioReads()).toBe(before + 1)
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-jobs' } as any)
  await settle()
  expect(studioReads()).toBe(before + 2)
  expect((await svgs(ui)).map((s: any) => s.alt)).toContain('EN COURS 40 %')
})

test('the panel opens on Projet, the first tab, without reading the performance', async ($, on) => {
  const t = setup(on)
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  await settle()
  const ui = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  const tabs = (await ui.findAll({ type: 'Button' } as any)).filter((b: any) => String(b.props.key).startsWith('tab-'))
  expect(tabs.map((b: any) => b.props.key)).toEqual(['tab-projet', 'tab-paid', 'tab-imports', 'tab-jobs', 'tab-hostings', 'tab-journal'])
  expect(tabs[0].props.variant).toBe('primary')
  expect(t.reads.some(r => r.startsWith('bdzCompareAdAnalytics'))).toBe(false)
})

test('Hostings lists sites and files by pages of 10, searches by name, and fetches a file\'s link on demand', async ($, on) => {
  const t = setup(on)
  const ui = await mount($)
  expect(t.hostingCalls).toEqual([])
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-hostings' } as any)
  await settle()
  expect(t.hostingCalls).toEqual([{ page: 0, pageSize: 10, q: undefined }])
  const shown = await texts(ui)
  expect(shown).toContain('Site vitrine')
  expect(shown).toContain('export.csv')
  // Expired: its storage is gone, so it is not listed.
  expect(shown).not.toContain('Vieux fichier')
  expect(shown.join(' ')).toContain('Page 1 / 3')
  expect((await svgs(ui)).map((s: any) => s.alt)).toEqual(expect.arrayContaining(['SITE', 'FICHIER']))
  // A site links to its public URL at once; a file only once its presigned URL is asked.
  const linksOf = async () => (await ui.findAll({ type: 'Link' } as any)).map((l: any) => l.props.href)
  expect(await linksOf()).toEqual(['https://bulldozer.bulldozer-os.fr/vitrine/'])
  await $.ui.press({ plugin: 'bulldozer', key: 'hosting-h2-link' } as any)
  await settle()
  expect(await linksOf()).toContain('https://bdz-hosting.s3.amazonaws.com/hostings/h2?X-Amz-Expires=3600')

  await $.ui.press({ plugin: 'bulldozer', key: 'hostings-next' } as any)
  await settle()
  expect(t.hostingCalls.at(-1)).toEqual({ page: 1, pageSize: 10, q: undefined })
  expect(await texts(ui)).toContain('Page 2')

  await $.ui.input({ plugin: 'bulldozer', key: 'hosting-search', text: ' rapport ' } as any)
  await settle()
  expect(t.hostingCalls.at(-1)).toEqual({ page: 0, pageSize: 10, q: 'rapport' })
  expect(await texts(ui)).toContain('Rapport SEO')
  expect(await labels(ui)).not.toContain('Suivant →')
})
