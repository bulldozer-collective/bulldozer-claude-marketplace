import { test, expect } from 'claude-code/testing'

import { onCalls } from './calls'

const REFUSAL = 'The server-side auto mode classifier gave no verdict for this action'

test('offers to allow the reads while a rule is missing and merges the missing ones into the user settings', async ($, on) => {
  const writes: { path: string; text: string }[] = []
  let refused = true
  let asked = 0
  let reloads = 0
  let allowed: string[] = ['Read', 'mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships']
  on('settings.read', async () => ({ value: { permissions: { allow: allowed } } }))
  on('tool.list', async () => ({ value: [{ name: 'mcp__plugin_bulldozer_bulldozer__bdzListUserProjectMemberships', description: '', mcp: true }] }))
  onCalls(on, async ($: any, e: any) => {
    if (e.tool === 'AskUserQuestion') {
      asked += 1
    }
    return refused ? { deny: REFUSAL } : { result: {}, text: '{}' }
  })
  on('env.get', async ($: any, e: any) => ({ value: e.name === 'HOME' ? '/home/x' : undefined }))
  on('fs.exists', async ($: any, e: any) => ({ value: String(e.path).endsWith('settings.json') }))
  on('fs.read', async ($: any, e: any) => ({
    value: String(e.path).endsWith('.svg')
      ? '<svg xmlns="http://www.w3.org/2000/svg"/>'
      : JSON.stringify({ theme: 'dark', permissions: { allow: ['Read'], deny: ['Bash(rm:*)'] } }),
  }))
  on('fs.write', async ($: any, e: any) => { writes.push(e); refused = false; allowed = [...new Set([...allowed, ...JSON.parse(e.text).permissions.allow])]; return { value: undefined } })
  on('session.surfaces', async () => ({ value: [] }))
  on('session.start', async ($: any, e: any) => e)
  on('command.register', async () => ({ value: {} }))
  on('ui.status', async () => ({ value: undefined }))
  on('ui.toast', async () => ({ value: undefined }))
  on('clock.now', async () => ({ value: 0 }))
  on('clock.after', async () => { reloads += 1; return { value: {} } })
  await $.session.start({ cwd: '/tmp', source: 'startup' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()

  const ui = await $.ui.mount({ plugin: 'bulldozer', surface: 'desktop', component: 'Pane', requestId: 'bdz-project', props: {} as any })
  const buttons = (await ui.findAll({ type: 'Button' } as any)).map((b: any) => b.props.label)
  expect(buttons).toContain('Autoriser les lectures du panneau')

  await $.ui.press({ plugin: 'bulldozer', key: 'allow-reads' } as any)
  const confirm = (await ui.findAll({ type: 'Button' } as any)).map((b: any) => b.props.label)
  expect(confirm).toContain('Oui, autoriser')
  expect(writes.length).toBe(0)
  await $.ui.press({ plugin: 'bulldozer', key: 'allow-reads-yes' } as any)
  for (let i = 0; i < 2000; i++) await Promise.resolve()
  const written = writes.find(w => w.path === '/home/x/.claude/settings.json')
  expect(written).toBeTruthy()
  const settings = JSON.parse(written!.text)
  console.log('ALLOW', settings.permissions.allow.length, settings.permissions.allow[1])
  expect(settings.theme).toBe('dark')
  expect(settings.permissions.deny).toEqual(['Bash(rm:*)'])
  expect(settings.permissions.allow[0]).toBe('Read')
  expect(settings.permissions.allow).toContain('mcp__plugin_bulldozer_bulldozer__bdzGetStacks')
  // Only the missing rules were added, once each.
  expect(settings.permissions.allow.filter((r: string) => r.endsWith('__bdzListUserProjectMemberships')).length).toBe(0)
  const after = (await ui.findAll({ type: 'Button' } as any)).map((b: any) => b.props.label)
  expect(after).not.toContain('Autoriser les lectures du panneau')
  // No AskUserQuestion for the classifier to refuse, and a delayed reload once the settings are written.
  expect(asked).toBe(0)
  expect(reloads).toBe(1)
})
