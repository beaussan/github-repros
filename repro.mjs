import Uppy from '@uppy/core'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html>')
globalThis.window = dom.window

const uppy = new Uppy()
uppy.on('is-online', () => {
  console.log('BUG: is-online emitted after destroy()')
  process.exitCode = 1
})

uppy.destroy()
console.log('Uppy destroyed immediately after construction.')

if (!process.argv.includes('--keep-dom')) {
  dom.window.close()
  delete globalThis.window
  console.log('DOM torn down. Waiting for Uppy’s pending three-second timer…')
} else {
  console.log('DOM retained. Waiting for an event from the destroyed instance…')
  process.once('beforeExit', () => {
    dom.window.close()
    delete globalThis.window
  })
}
