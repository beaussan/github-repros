# Reproduction Nx Relative Path Generators

Before Nx 20, you could use `projectNameAndRootFormat: 'as-provided'` in generators to use the new behavior. However, this broke with Nx 20 for relative paths.

The way the directory option on the library is based on the current working directory, and not the workspace root. That means if you want to enforce a specific folder structure, you had to calculate the relative path yourself. I copied the [getRelativeCwdToRoot](https://github.com/nrwl/nx/blob/master/packages/devkit/src/generators/project-name-and-root-utils.ts#L196-L210) utility from the Nx repo, maybe it should be in the devkit ?

## Steps to reproduce


### Freshly generated nx 19 workspace (`npx create-nx-workspace@19.8.10` using the simple, integrated template)

- `cd nx-19.x`
- `npm install`
- `npx nx generate my-generator --dry-run --name test` => should work and generate to `libs/enforced/structure/test/`
- `cd example/nested/dir`
- `npx nx generate my-generator --dry-run --name test` => should work and generate to `libs/enforced/structure/test/`

=> everything works as expected ✅

### The same 19.8 workspace, after `nx migrate latest` and migration applied

- `cd nx-20.x`
- `npm install`
- `npx nx generate my-generator --dry-run --name test` => should work and generate to `libs/enforced/structure/test/`
- `cd example/nested/dir`
- `npx nx generate my-generator --dry-run --name test` => breaks 💥 with the following error:

```
npx nx generate my-generator --dry-run --name test

 NX  Generating @nx-19.x/my-plugin:my-generator


 NX   The directory should match the pattern "(?:^@[a-zA-Z0-9-*~][a-zA-Z0-9-*._~]*\/[a-zA-Z0-9-~][a-zA-Z0-9-._~]*|^[a-zA-Z][^:]*)$". The provided value "../../../libs/enforced/structure/test" does not match.

```

