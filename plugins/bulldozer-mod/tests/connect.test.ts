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

test('prefers its own server to one Desktop names by id', async ($, on) => {
  const servers: string[] = []
  on('tool.list', async () => ({ value: [{ name: 'mcp__38277b6f-b0fb-4908-b7b9-305c747db1da__bdzListUserProjectMemberships', description: '', mcp: true }] }))
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
  expect([...new Set(servers)]).toEqual(['plugin_bulldozer_bulldozer'])
})

test('shows the text of a failure the server sends as plain text', async ($, on) => {
  const statuses: string[] = []
  on('tool.list', async () => ({ value: [{ name: 'mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships', description: '', mcp: true }] }))
  onCalls(on, async () => ({ result: null, text: 'Error: session expired, sign in again' }))
  on('fs.exists', async () => ({ value: true }))
  on('fs.read', async () => ({ value: '{"customerId":"c1","projectId":"p1"}' }))
  on('session.surfaces', async () => ({ value: ['desktop'] }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async ($: any, e: any) => { statuses.push(e.text); return { value: undefined } })
  on('clock.now', async () => ({ value: 0 }))
  on('clock.after', async ($: any, e: any) => { e.fn?.(); return { value: {} } })
  on('clock.every', () => new Promise(() => {}))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 4000; i++) await Promise.resolve()
  expect(statuses.at(-1)).toContain('session expired, sign in again')
})
