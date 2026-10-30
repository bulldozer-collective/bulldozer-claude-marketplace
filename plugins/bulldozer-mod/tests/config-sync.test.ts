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
  p1: { accounts: [
    { id: 'meta-a', platform: 'INTEGRATION_PLATFORM_META', name: 'Bulldozer', adAccount: '1' },
    { id: 'meta-b', platform: 'INTEGRATION_PLATFORM_META', name: 'Hosman', adAccount: '2' },
  ] },
  p2: { accounts: [{ id: 'meta-p2', platform: 'INTEGRATION_PLATFORM_META', name: 'Mooncard', adAccount: '3' }] },
}

const settle = async () => {
  for (let i = 0; i < 2000; i++) await Promise.resolve()
}

test('the sidebar follows bulldozer.json changed by any tool or outside Claude, not its own writes', async ($, on) => {
  let config: any = { customerId: 'c1', projectId: 'p1', ads: { adAccount: { META: { id: 'meta-a', name: 'Bulldozer' } } } }
  let accountLists = 0
  // Each call runs one period of the mod's poll of the file.
  let tick: () => void = () => {}
  on('tool.list', async () => ({ value: [{ name: `${P}bdzListUserProjectMemberships`, description: '', mcp: true }] }))
  onCalls(on, async ($: any, e: any) => {
    const name = e.tool.replace(P, '')
    if (name === 'bdzListRegisteredAdAccounts') {
      accountLists++
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
  on('clock.now', async () => ({ value: 0 }))
  on('clock.every', () => new Promise(resolve => { tick = () => resolve({ value: {} }) }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  await settle()
  const ui = await $.ui.mount({ plugin: 'bulldozer-mod', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  // The Paid tab holds the ad account selectors.
  await $.ui.press({ plugin: 'bulldozer-mod', key: 'tab-paid' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const selectValue = async (key: string) => ((await ui.findAll({ type: 'Select' } as any)).find((s: any) => s.props.key === key) as any)?.props.value
  expect(await selectValue('ad-META')).toBe('meta-a')

  // Claude switches the Meta account with Bash: the sidebar follows after the tool.
  config = { ...config, ads: { adAccount: { META: { id: 'meta-b', name: 'Hosman' } } } }
  await $.tool.call({ tool: 'Bash', command: 'true' } as any)
  await settle()
  expect(await selectValue('ad-META')).toBe('meta-b')

  // An editor switches the project: the next poll reloads the project and its ad accounts.
  config = { customerId: 'c2', projectId: 'p2' }
  tick()
  await settle()
  expect(await selectValue('project')).toBe('c2:p2')
  expect(await selectValue('ad-META')).toBe('meta-p2')

  // A poll with nothing changed reloads nothing, nor does the sidebar's own write (choosing an account).
  const before = accountLists
  tick()
  await settle()
  await $.ui.select({ plugin: 'bulldozer-mod', key: 'ad-META', value: 'meta-p2' } as any)
  tick()
  await settle()
  expect(accountLists).toBe(before)
})
