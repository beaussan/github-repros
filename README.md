# Circular TypeScript project references

A minimal pnpm monorepo with two libraries. `@example/a` and `@example/b` each have a workspace dependency on, a TypeScript project reference to, and a type-only import from the other. The type-only imports avoid introducing a JavaScript runtime cycle; the project reference graph is still cyclic.

## Reproduce

With Node.js and pnpm 11.21.0 installed:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck:a
pnpm typecheck:b
```

These commands intentionally fail. With TypeScript 5.9.3 on a clean checkout:

- pnpm warns about cyclic workspace dependencies, but installs successfully.
- `pnpm build` (`tsc -b`) fails with TS6202: project references may not form a circular graph. No project is built.
- Each individual `tsc -p ... --noEmit` fails with TS6305, reporting that its own declaration output has not been built from its source. This is the observed clean-checkout result, not a claim about every configuration or previously built workspace.

Try changing the references or imports and rerunning the commands to explore alternatives.
