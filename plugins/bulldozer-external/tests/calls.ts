// The mod reads with $.mcp.call and the model calls tools through tool.call: one stand-in answers both.
export function onCalls(on: any, handler: ($: any, e: any) => any) {
  on('tool.call', handler)
  on('mcp.call', async ($: any, e: any) => {
    const tool = `mcp__${String(e.server).replace(/[^\w-]/g, '_')}__${e.tool}`
    const r = await handler($, { ...e.args, tool })

    return { value: { content: [{ type: 'text', text: r?.text ?? '' }], isError: Boolean(r?.isError) } }
  })
}
