import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

const P = 'mcp__plugin_bulldozer_bulldozer__'
const MEMBERSHIPS = {
  memberships: [{ customerId: 'c1', userId: 'u1', project: { id: 'p1', name: 'Bulldozer Interne' }, company: { id: 'co1', name: 'Bulldozer', logoUrl: null } }],
}
const REGISTERED = {
  accounts: [
    { id: 'meta1', platform: 'INTEGRATION_PLATFORM_META', name: 'Meta Bulldozer', adAccount: '123', lastAccessCheck: { readAccess: 'AD_ACCESS_STATUS_GRANTED', writeAccess: 'AD_ACCESS_STATUS_GRANTED' } },
    { id: 'li1', platform: 'INTEGRATION_PLATFORM_LINKED_IN', name: 'LinkedIn Bulldozer', adAccount: 'urn:li:1', lastAccessCheck: { readAccess: 'AD_ACCESS_STATUS_DENIED', writeAccess: 'AD_ACCESS_STATUS_DENIED' } },
  ],
}
const GOOGLE = {
  accounts: [
    { id: 'g1', adwordCustomerId: 9808244998, adwordLoginId: 1923201425, name: 'Google Bulldozer' },
    { id: 'g2', adwordCustomerId: 3003241264, adwordLoginId: 1923201425, name: 'Eden' },
  ],
}

function setup(on: any, answer: { value: string }) {
  const asked: string[] = []
  const ran: string[] = []
  const writes: string[] = []
  let config: any = { customerId: 'c1', projectId: 'p1', other: 'keep', sea: { adAccount: { adwordLoginId: '1923201425', adwordCustomerId: '9808244998' } } }
  const bodies: Record<string, unknown> = {
    bdzListUserProjectMemberships: MEMBERSHIPS,
    bdzListRegisteredAdAccounts: REGISTERED,
    bdzListGoogleAdwordAccounts: GOOGLE,
    bdzGetCustomerSubscription: { subscription: { state: 'SUBSCRIPTION_ACTIVE', template: { name: 'All access' } } },
    bdzGetStacks: { stack: { buyIn: 1000, stack: 224100 } },
    bdzGetProjectObjectives: { objectives: [{ type: 'PROJECT_OBJECTIVE_TYPE_TARGETS', answer: 'Scale-ups SaaS B2B' }, { type: 'PROJECT_OBJECTIVE_TYPE_CONSTRAINTS', answer: 'Budget serré' }, { type: 'PROJECT_OBJECTIVE_TYPE_PRIVATE_INSIGHTS', answer: '{}' }, { type: 'PROJECT_OBJECTIVE_TYPE_FUNNEL', answer: '' }] },
    bdzListUserConnectors: { connectors: [{ platform: 'INTEGRATION_PLATFORM_META', expiresAt: '2026-09-06T09:56:21Z' }, { platform: 'INTEGRATION_PLATFORM_SLACK', expiresAt: '2126-08-29T13:34:50Z' }] },
    bdzListAdImports: { imports: { content: [{ state: 'AD_IMPORT_STATE_SUCCESS', finishTime: '2026-10-04T02:03:58Z' }] } },
    bdzGetAdLayer1: { id: 'l1', name: 'Campagne Q4', platform: 'INTEGRATION_PLATFORM_LINKED_IN' },
    // The tabs' own reads.
    bdzCompareAdAnalytics: { comparisons: { content: [], totalElement: 0 }, freshness: [] },
    bdzListSeaL1s: { results: { content: [], totalElement: 0 } },
    bdzGetGoogleAdwordAccountRefreshConfig: { refreshConfig: { refreshEnabled: true } },
    bdzGetSeoGscDomains: { gscDomains: [] },
    bdzListStudioJobs: { content: [] },
    bdzListContactEnrichBatches: { content: [] },
    bdzListLeadLists: { content: [] },
  }
  on('tool.list', async () => ({ value: [{ name: `${P}bdzListUserProjectMemberships`, description: '', mcp: true }] }))
  on('fs.exists', async () => ({ value: true }))
  on('fs.read', async ($: any, e: any) => ({ value: String(e.path).endsWith('.svg') ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : JSON.stringify(config) }))
  on('fs.write', async ($: any, e: any) => { writes.push(e.text); config = JSON.parse(e.text); return { value: undefined } })
  on('session.surfaces', async () => ({ value: ['desktop'] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('ui.status', async () => ({ value: undefined }))
  on('clock.every', () => new Promise(() => {}))
  // The splash timer: fire at once, so the sidebar shows its content.
  on('clock.after', async () => ({ value: {} }))
  on('clock.now', async () => ({ value: Date.parse('2026-10-04T12:00:00Z') }))
  const prompts: string[] = []
  on('prompt.submit', async ($: any, e: any) => { prompts.push(e.text); return { text: e.text } })
  onCalls(on, async ($: any, e: any) => {
    if (e.tool === 'AskUserQuestion') {
      const q = e.questions[0].question
      asked.push(q)
      return { result: { questions: e.questions, answers: { [q]: answer.value } } }
    }
    const name = e.tool.replace(P, '')
    if (name in bodies) {
      return { result: bodies[name], text: JSON.stringify(bodies[name]) }
    }
    ran.push(name)
    return { result: { ok: true } }
  })

  return { asked, ran, writes, prompts, config: () => config }
}

async function start($: any) {
  await $.session.start({ cwd: '/tmp', source: 'startup' })
  for (let i = 0; i < 300; i++) await Promise.resolve()
}

test('guard asks once per target, again on another account, and denies on no', async ($, on) => {
  const answer = { value: 'Oui, continuer' }
  const t = setup(on, answer)
  await start($)

  await $.tool.call({ tool: `${P}bdzListAdLayer1`, customerId: 'c1', projectId: 'p1' } as any)
  expect(t.asked.length).toBe(0)

  await $.tool.call({ tool: `${P}bdzUpdateSeaL1`, customerId: 'c1', projectId: 'p1', accountId: 'g1', l1Id: 'x' } as any)
  await $.tool.call({ tool: `${P}bdzUpdateSeaL1`, customerId: 'c1', projectId: 'p1', accountId: 'g1', l1Id: 'y' } as any)
  expect(t.asked.length).toBe(1)
  console.log('Q1', t.asked[0])

  answer.value = 'Non, annuler'
  const denied: any = await $.tool.call({ tool: `${P}bdzUpdateSeaL1`, customerId: 'c1', projectId: 'p1', accountId: 'g2', l1Id: 'z' } as any)
  expect(t.asked.length).toBe(2)
  console.log('Q2', t.asked[1])
  console.log('DENY', JSON.stringify(denied).slice(0, 300))

  answer.value = 'Oui, continuer'
  await $.tool.call({ tool: `${P}bdzUpdateAdLayer1`, customerId: 'c1', projectId: 'p1', id: 'l1' } as any)
  console.log('Q3', t.asked[2])
  console.log('RAN', t.ran.join(','))
  expect(t.ran).toEqual(['bdzListAdLayer1', 'bdzUpdateSeaL1', 'bdzUpdateSeaL1', 'bdzUpdateAdLayer1'])
})

test('desktop selectors write bulldozer.json', async ($, on) => {
  const t = setup(on, { value: 'Oui, continuer' })
  await start($)
  const ui = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  // The Paid tab holds the ad account selectors.
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-paid' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const selects = (await ui.findAll({ type: 'Select' } as any)).map((s: any) => `${s.props.key ?? ''}=${s.props.value ?? '-'}[${s.props.options.length}]`)
  console.log('LABELS', JSON.stringify((await ui.findAll({ type: 'Select' } as any)).map((s: any) => s.props.options.map((o: any) => o.label))))
  console.log('SELECTS', selects.join(' '))
  await $.ui.select({ plugin: 'bulldozer', key: 'ad-META', value: 'meta1' } as any)
  await $.ui.select({ plugin: 'bulldozer', key: 'ad-LINKEDIN', value: 'li1' } as any)
  console.log('TEXTS', (await ui.findAll({ type: 'Text' } as any)).map((t: any) => t.text).join(' | '))
  console.log('BUTTONS', (await ui.findAll({ type: 'Button' } as any)).map((b: any) => b.props.label).join(' | '))
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-projet' } as any)
  await $.ui.press({ plugin: 'bulldozer', key: 'healthcheck' } as any)
  console.log('PROMPT', t.prompts.join(' / '))
  await $.ui.press({ plugin: 'bulldozer', key: 'objectives-more' } as any)
  const modal = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-objectives', props: {} as any })
  console.log('CONNECTORS', JSON.stringify((await ui.findAll({ type: 'Text' } as any)).map((x: any) => x.text).filter((x: string) => /Mes connecteurs|Meta|Slack|✓|✗/.test(x))))
  expect((await ui.findAll({ type: 'Svg' } as any)).map((x: any) => x.props.alt).includes('Slack')).toBe(true)
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-paid' } as any)
  expect((await ui.findAll({ type: 'Svg' } as any)).map((x: any) => x.props.alt).includes('Slack')).toBe(false)
  console.log('MODAL', JSON.stringify((await modal.findAll({ type: 'Markdown' } as any)).map((m: any) => m.props.text)))
  const before = t.writes.length
  const calls0 = (globalThis as any).__calls ?? 0
  await $.ui.press({ plugin: 'bulldozer', key: 'refresh' } as any)
  for (let i = 0; i < 300; i++) await Promise.resolve()
  console.log('REFRESH ok, writes unchanged', t.writes.length === before)
  await $.ui.select({ plugin: 'bulldozer', key: 'ad-GOOGLE_ADS', value: 'g2' } as any)
  console.log('CONFIG', JSON.stringify(t.config()))
  expect(t.config().ads.adAccount.LINKEDIN).toEqual({ id: 'li1', name: 'LinkedIn Bulldozer' })
  expect(t.config().sea.adAccount.adwordCustomerId).toBe('3003241264')
  expect(t.config().other).toBe('keep')
})
