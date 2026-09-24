# Uppy online-status timer survives destroy()

Minimal reproduction using **@uppy/core 6.0.1** and **jsdom 26.1.0**.
No React, Vitest, application code, fake timers, or Uppy patches are involved.
Verified with Node.js 26.5.0 and pnpm 12.3.4.

## Run

```sh
pnpm install --frozen-lockfile
pnpm repro
```

The script creates an Uppy instance and immediately calls `destroy()`, then closes
jsdom and removes the `window` global, simulating test-environment teardown.
Approximately three seconds later, the process exits with code 1:

```text
ReferenceError: window is not defined
    at Uppy.updateOnlineStatus (.../@uppy/core/lib/Uppy.js:1135:24)
```

## Compare with the DOM retained

```sh
pnpm control
```

This runs the same script but retains the DOM. After approximately three seconds:

```text
BUG: is-online emitted after destroy()
```

The script deliberately sets exit code 1 when that event is observed. This isolates
the lifecycle problem from the missing-global exception; it does not establish a
user-visible production failure.

## Expected

`destroy()` cancels the pending initial online-status check. Both commands should
exit successfully without waiting for that check, throwing, or emitting an
online-status event after destruction.

## Suspected cause

Core schedules `setTimeout(this.#updateOnlineStatus, 3000)` without retaining its
handle. `destroy()` removes the online/offline listeners but does not cancel that
timeout. A potential fix is to retain and clear the handle during destruction.

- [Timer and callback in 6.0.1](https://github.com/transloadit/uppy/blob/%40uppy/core%406.0.1/packages/%40uppy/core/src/Uppy.ts#L1884-L1908)
- [destroy() in 6.0.1](https://github.com/transloadit/uppy/blob/%40uppy/core%406.0.1/packages/%40uppy/core/src/Uppy.ts#L2043-L2060)
- [Related historical listener-cleanup issue #3026](https://github.com/transloadit/uppy/issues/3026)
