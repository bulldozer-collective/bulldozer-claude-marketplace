import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

test('shows the animated splash while ↻ reloads, then the content', async ($, on) => {
  let release: () => void = () => {}
  let isHeld = false
  on('tool.list', async () => ({ value: [{ name: 'mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships', description: '', mcp: true }] }))
  onCalls(on, async ($: any, e: any) => {
    if (isHeld && e.tool.endsWith('__bdzListUserProjectMemberships')) {
      await new Promise<void>(resolve => { release = resolve })
    }
    return { result: {}, text: '{}' }
  })
  on('fs.exists', async () => ({ value: false }))
  on('fs.read', async () => ({ value: '<svg xmlns="http://www.w3.org/2000/svg"/>' }))
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: 0 }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const ui = await $.ui.mount({ plugin: 'bulldozer-mod', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  const texts = async () => (await ui.findAll({ type: 'Svg' } as any)).map((t: any) => t.props.alt)
  isHeld = true
  const pressed = $.ui.press({ plugin: 'bulldozer-mod', key: 'refresh' } as any)
  for (let i = 0; i < 200; i++) await Promise.resolve()
  const during = await texts()
  const splash = (await ui.findAll({ type: 'Svg' } as any)).find((s: any) => s.props.alt === 'Bulldozer OS') as any
  expect(splash?.props.isInteractive).toBe(true)
  expect(splash?.props.source).toContain('BULLDOZER OS')
  expect(splash?.props.source).toContain('@keyframes')
  expect(during.includes('Bulldozer')).toBe(false)
  release()
  await pressed
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  expect((await texts()).includes('Bulldozer')).toBe(true)
})

test('the splash stays up after the sidebar opens until its timer fires, even with data loaded', async ($, on) => {
  let fire: () => void = () => {}
  on('tool.list', async () => ({ value: [{ name: 'mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships', description: '', mcp: true }] }))
  onCalls(on, async () => ({ result: {}, text: '{}' }))
  on('fs.exists', async ($: any, e: any) => ({ value: String(e.path).endsWith('bulldozer.json') }))
  on('fs.read', async ($: any, e: any) => ({ value: String(e.path).endsWith('.svg') ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : '{}' }))
  on('session.surfaces', async () => ({ value: ['desktop'] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.open', async () => ({ value: { isPlaced: true } }))
  on('ui.status', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: 0 }))
  on('clock.after', () => new Promise(resolve => { fire = () => resolve({ value: {} }) }))
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const ui = await $.ui.mount({ plugin: 'bulldozer-mod', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  const hasSplash = async () => (await ui.findAll({ type: 'Svg' } as any)).some((s: any) => s.props.alt === 'Bulldozer OS')
  expect(await hasSplash()).toBe(true)
  fire()
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  expect(await hasSplash()).toBe(false)
})
