import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

const P = 'mcp__plugin_bulldozer_bulldozer__'

test('tool.check: mod reads pass through for others, and does mcp.call raise it?', async ($, on) => {
  const checks: string[] = []
  on('tool.check', async ($: any, e: any) => { checks.push(e.tool); return { decision: 'ask' } })
  on('tool.list', async () => ({ value: [{ name: `${P}bdzListUserProjectMemberships`, description: '', mcp: true }] }))
  onCalls(on, async () => ({ result: {}, text: '{}' }))
  on('fs.exists', async () => ({ value: false }))
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  console.log('CHECKS RAISED BY the mod reads', JSON.stringify(checks))
  const r = await $.tool.check({ tool: `${P}bdzListUserProjectMemberships`, input: {} } as any)
  console.log('TEST CHECK', JSON.stringify(r))
  expect(r.decision).toBe('ask')
})
