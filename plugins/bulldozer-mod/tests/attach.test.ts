import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

test('opens the sidebar when Desktop attaches after start', async ($, on) => {
  const opened: string[] = []
  onCalls(on, async () => ({ result: {}, text: '{}' }))
  on('tool.list', async () => ({ value: [] }))
  on('fs.exists', async () => ({ value: false }))
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('session.attach', async ($: any, e: any) => ({ clientId: e.clientId }))
  on('command.register', async () => ({ value: {} }))
  on('ui.open', async ($: any, e: any) => { opened.push(e.id); return { value: { isPlaced: true } } })
  on('ui.status', async () => ({ value: undefined }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  expect(opened.length).toBe(0)
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  expect(opened).toEqual(['bdz-project'])
})
