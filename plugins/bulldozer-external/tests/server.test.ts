import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

test('finds the Bulldozer server under another name and guards its tools', async ($, on) => {
  const servers: string[] = []
  const asked: string[] = []
  on('tool.list', async () => ({ value: [{ name: 'mcp__claude_ai_Bulldozer__bdzListUserProjectMemberships', description: '', mcp: true }] }))
  on('fs.exists', async () => ({ value: true }))
  on('fs.read', async () => ({ value: '﻿{"customerId":"c1","projectId":"p1"}' }))
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async ($: any, e: any) => { console.log('STATUS', e.text); return { value: undefined } })
  on('clock.now', async () => ({ value: 0 }))
  onCalls(on, async ($: any, e: any) => {
    if (e.tool === 'AskUserQuestion') {
      asked.push(e.questions[0].question)
      return { result: { questions: e.questions, answers: { [e.questions[0].question]: 'Non, annuler' } } }
    }
    if (e.consent) {
      servers.push(e.tool.split('__')[1])
      const body = e.tool.endsWith('__bdzListUserProjectMemberships') ? { memberships: [{ customerId: 'c1', userId: 'u1', project: { id: 'p1', name: 'P' }, company: { id: 'co', name: 'C', logoUrl: null } }] } : {}
      return { result: body, text: JSON.stringify(body) }
    }
    return { result: { ok: true } }
  })
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  console.log('SERVERS', [...new Set(servers)].join(','))
  const r: any = await $.tool.call({ tool: 'mcp__claude_ai_Bulldozer__bdzUpdateSeaL1', customerId: 'c1', projectId: 'p1', accountId: 'g', l1Id: 'x' } as any)
  expect(asked.length).toBe(1)
  expect(r.deny).toBeTruthy()
})
