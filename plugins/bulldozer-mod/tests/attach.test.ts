import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

const settle = async () => { for (let i = 0; i < 2000; i++) await Promise.resolve() }

// A session whose folder holds a bulldozer.json while `hasConfig()` says so; the 2 s poll runs on `tick()`.
function session(on: any, surfaces: string[], hasConfig: () => boolean) {
  const opened: string[] = []
  let tick = () => {}
  onCalls(on, async () => ({ result: {}, text: '{}' }))
  on('tool.list', async () => ({ value: [] }))
  on('fs.exists', async ($: any, e: any) => ({ value: String(e.path).endsWith('bulldozer.json') && hasConfig() }))
  on('fs.read', async ($: any, e: any) => ({ value: String(e.path).endsWith('.svg') ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : '{}' }))
  on('session.surfaces', async () => ({ value: surfaces }))
  on('session.start', async ($: any, e: any) => e)
  on('session.attach', async ($: any, e: any) => ({ clientId: e.clientId }))
  on('command.register', async () => ({ value: {} }))
  on('ui.open', async ($: any, e: any) => { opened.push(e.id); return { value: { isPlaced: true } } })
  on('ui.status', async () => ({ value: undefined }))
  on('clock.every', () => new Promise(resolve => { tick = () => resolve({ value: {} }) }))

  return { opened, tick: () => tick() }
}

test('opens the sidebar when Desktop attaches after start', async ($, on) => {
  const { opened } = session(on, [], () => true)
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  expect(opened.length).toBe(0)
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' } as any)
  await settle()
  expect(opened).toEqual(['bdz-project'])
})

test('keeps the sidebar shut in a folder without bulldozer.json', async ($, on) => {
  const { opened } = session(on, ['desktop'], () => false)
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' } as any)
  await settle()
  expect(opened.length).toBe(0)
})

test('opens the sidebar when bulldozer.json appears during the session', async ($, on) => {
  let hasConfig = false
  const { opened, tick } = session(on, ['desktop'], () => hasConfig)
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  await settle()
  expect(opened.length).toBe(0)
  hasConfig = true
  tick()
  await settle()
  expect(opened).toEqual(['bdz-project'])
})
