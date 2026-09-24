import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

// Optional module URL permits running the same assertions against the unpatched repro.
const { default: Uppy } = await import(process.env.UPPY_MODULE ?? '@uppy/core')

function setup(t) {
  const dom = new JSDOM('<!doctype html>')
  globalThis.window = dom.window
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const uppy = new Uppy()
  t.after(() => {
    t.mock.timers.reset()
    dom.window.close()
    delete globalThis.window
  })
  return { uppy, dom }
}

test('destroy cancels the pending check before DOM teardown', (t) => {
  const { uppy, dom } = setup(t)
  uppy.destroy()
  dom.window.close()
  delete globalThis.window
  assert.doesNotThrow(() => t.mock.timers.tick(3001))
})

test('destroyed instances emit no delayed online-status events', (t) => {
  const { uppy } = setup(t)
  let onlineEvents = 0
  uppy.on('is-online', () => onlineEvents++)
  uppy.destroy()
  t.mock.timers.tick(3001)
  assert.equal(onlineEvents, 0)
})

test('live instances retain their initial check and browser event handling', (t) => {
  const { uppy } = setup(t)
  let onlineEvents = 0
  uppy.on('is-online', () => onlineEvents++)
  t.mock.timers.tick(3001)
  assert.equal(onlineEvents, 1)
  window.dispatchEvent(new window.Event('online'))
  assert.equal(onlineEvents, 2)
  uppy.destroy()
  window.dispatchEvent(new window.Event('online'))
  assert.equal(onlineEvents, 2)
})
