# Uppy destroy-timeout: proposed fix

Companion to [the unpatched repro](https://github.com/beaussan/github-repros/tree/codex/uppy-destroy-timeout). Uses the same Uppy 6.0.1 and jsdom 26.1.0,
with a reproducible pnpm dependency patch. The original repro is unchanged.

## Run

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm repro
pnpm control
```

All three commands should exit successfully. The two original real-timer scenarios
no longer keep the process alive for Uppy’s three-second check, throw after DOM
teardown, or emit an online event after destruction.

## Patch

`patches/@uppy__core@6.0.1.patch` stores the startup timeout handle in a private
field and clears it at the start of `destroy()`. It updates TypeScript source and
the compiled ESM entry used by this repro. Prebuilt browser bundles are not rebuilt.
An upstream PR would modify source and let Uppy’s build generate distribution files.

## Regression coverage

`lifecycle.test.mjs` uses Node’s test runner and controlled timers to verify:

1. Destroying Uppy before removing window prevents a late ReferenceError.
2. Destroyed instances emit no delayed online-status event.
3. A live instance still runs its startup check and handles online events;
   destruction removes those listeners.

Verified on Node.js 26.5.0 / pnpm 12.3.4:

| Dependency | Teardown test | No late event | Live behavior |
| --- | --- | --- | --- |
| Original 6.0.1 | FAIL | FAIL | PASS |
| Patched 6.0.1 | PASS | PASS | PASS |

To repeat the comparison from a fresh clone of this branch, install the original
repro in a sibling worktree first (skip this if it already exists):

```sh
git fetch origin codex/uppy-destroy-timeout
git worktree add --detach ../uppy-destroy-timeout origin/codex/uppy-destroy-timeout
pnpm --dir ../uppy-destroy-timeout install --frozen-lockfile
```

Run the same tests against the original dependency:

```sh
UPPY_MODULE="$(node --input-type=module -e 'console.log(new URL("../uppy-destroy-timeout/node_modules/@uppy/core/lib/index.js", import.meta.url).href)')" pnpm test
```

Expected: two failures, one pass. This changes neither installation.

The real-timer repro commands were also run successfully against the patch.
These are focused lifecycle checks, not the full upstream Uppy test suite.
