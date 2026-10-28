import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

const P = 'mcp__plugin_bulldozer_bulldozer__'
const MEMBERSHIPS = {
  memberships: [
    { customerId: 'c1', userId: 'u1', project: { id: 'p1', name: 'Interne' }, company: { id: 'co1', name: 'Bulldozer', logoUrl: null } },
    { customerId: 'c2', userId: 'u1', project: { id: 'p2', name: 'Mooncard B2B' }, company: { id: 'co2', name: 'Mooncard', logoUrl: null } },
  ],
}
const ACCOUNTS: Record<string, unknown> = {
  p1: { accounts: [{ id: 'meta-p1', platform: 'INTEGRATION_PLATFORM_META', name: 'Bulldozer', adAccount: '1' }] },
  p2: { accounts: [{ id: 'meta-p2', platform: 'INTEGRATION_PLATFORM_META', name: 'Mooncard', adAccount: '2' }] },
}

test('a project switch replaces the previous ad accounts with the new project\'s first ones, foreign ids too', async ($, on) => {
  let config: any = {
    customerId: 'c1', projectId: 'p1', keep: 1,
    ads: { adAccount: { META: { id: 'meta-p1', name: 'Bulldozer' } }, other: true },
    sea: { adAccount: { adwordLoginId: '1', adwordCustomerId: '2' } },
  }
  on('tool.list', async () => ({ value: [{ name: `${P}bdzListUserProjectMemberships`, description: '', mcp: true }] }))
  onCalls(on, async ($: any, e: any) => {
    const name = e.tool.replace(P, '')
    const body = name === 'bdzListUserProjectMemberships' ? MEMBERSHIPS
      : name === 'bdzListRegisteredAdAccounts' ? ACCOUNTS[e.projectId] ?? {}
        : {}
    return { result: body, text: JSON.stringify(body) }
  })
  on('fs.exists', async ($: any, e: any) => ({ value: String(e.path).endsWith('bulldozer.json') }))
  on('fs.read', async ($: any, e: any) => ({ value: String(e.path).endsWith('.svg') ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : JSON.stringify(config) }))
  on('fs.write', async ($: any, e: any) => { config = JSON.parse(e.text); return { value: undefined } })
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  on('ui.close', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: 0 }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const ui = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  // The Paid tab holds the ad account selectors.
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-paid' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const metaValue = async () => ((await ui.findAll({ type: 'Select' } as any)).find((s: any) => s.props.key === 'ad-META') as any)?.props.value
  expect(await metaValue()).toBe('meta-p1')

  await $.ui.select({ plugin: 'bulldozer', key: 'project', value: 'c2:p2' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  console.log('CONFIG', JSON.stringify(config))
  expect(config.projectId).toBe('p2')
  expect(config.ads).toEqual({ other: true, adAccount: { META: { id: 'meta-p2', name: 'Mooncard' } } })
  expect(config.sea).toBeUndefined()
  expect(config.keep).toBe(1)
  expect(await metaValue()).toBe('meta-p2')

  // An id another project left behind is replaced by the account the selector shows.
  config = { ...config, ads: { adAccount: { META: { id: 'meta-p1', name: 'Bulldozer' } } } }
  await $.ui.press({ plugin: 'bulldozer', key: 'refresh' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  expect(await metaValue()).toBe('meta-p2')
  expect(config.ads.adAccount.META).toEqual({ id: 'meta-p2', name: 'Mooncard' })
})

test('a project switch shows the splash until the new project is loaded', async ($, on) => {
  let config: any = { customerId: 'c1', projectId: 'p1' }
  let release: () => void = () => {}
  on('tool.list', async () => ({ value: [{ name: `${P}bdzListUserProjectMemberships`, description: '', mcp: true }] }))
  onCalls(on, async ($: any, e: any) => {
    const name = e.tool.replace(P, '')
    if (name === 'bdzListRegisteredAdAccounts' && e.projectId === 'p2') {
      await new Promise<void>(resolve => { release = resolve })
    }
    const body = name === 'bdzListUserProjectMemberships' ? MEMBERSHIPS
      : name === 'bdzListRegisteredAdAccounts' ? ACCOUNTS[e.projectId] ?? {}
        : {}
    return { result: body, text: JSON.stringify(body) }
  })
  on('fs.exists', async ($: any, e: any) => ({ value: String(e.path).endsWith('bulldozer.json') }))
  on('fs.read', async ($: any, e: any) => ({ value: String(e.path).endsWith('.svg') ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : JSON.stringify(config) }))
  on('fs.write', async ($: any, e: any) => { config = JSON.parse(e.text); return { value: undefined } })
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  on('ui.close', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: 0 }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const ui = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  // The Paid tab holds the ad account selectors.
  await $.ui.press({ plugin: 'bulldozer', key: 'tab-paid' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const hasSplash = async () => (await ui.findAll({ type: 'Svg' } as any)).some((s: any) => s.props.alt === 'Bulldozer OS')
  expect(await hasSplash()).toBe(false)

  const selected = $.ui.select({ plugin: 'bulldozer', key: 'project', value: 'c2:p2' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  expect(await hasSplash()).toBe(true)
  release()
  await selected
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  expect(await hasSplash()).toBe(false)
  expect(((await ui.findAll({ type: 'Select' } as any)).find((s: any) => s.props.key === 'ad-META') as any)?.props.value).toBe('meta-p2')
})
