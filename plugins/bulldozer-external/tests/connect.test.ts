import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

test('connects its own server when the plugin one is not visible, and explains a needed sign-in', async ($, on) => {
  const statuses: string[] = []
  on('tool.list', async () => ({ value: [] }))
  on('mcp.connect', async () => ({ value: { isConnected: false, reason: 'auth', message: 'needs sign-in' } }))
  onCalls(on, async ($: any, e: any) => ({ result: null, text: `no connected MCP tool ${e.tool}`, isError: true }))
  on('fs.exists', async () => ({ value: false }))
  on('session.surfaces', async () => ({ value: ['desktop'] }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async ($: any, e: any) => { statuses.push(e.text); return { value: undefined } })
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  console.log('STATUS', statuses.at(-1))
  expect(statuses.at(-1)).toContain('/mcp')
})

test('uses its own connection once connected', async ($, on) => {
  const servers: string[] = []
  on('tool.list', async () => ({ value: [] }))
  on('mcp.connect', async () => ({ value: { isConnected: true, server: 'plugin:bulldozer:bulldozer' } }))
  onCalls(on, async ($: any, e: any) => {
    servers.push(e.tool.split('__')[1])
    const body = e.tool.endsWith('__bdzListUserProjectMemberships') ? { memberships: [{ customerId: 'c1', userId: 'u1', project: { id: 'p1', name: 'P' }, company: { id: 'co', name: 'C', logoUrl: null } }] } : {}
    return { result: body, text: JSON.stringify(body) }
  })
  on('fs.exists', async () => ({ value: true }))
  on('fs.read', async () => ({ value: '{"customerId":"c1","projectId":"p1"}' }))
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: 0 }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  console.log('SERVERS', [...new Set(servers)].join(','))
  expect(servers[0]).toBe('plugin_bulldozer_bulldozer')
})
