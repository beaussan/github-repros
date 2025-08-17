# Code Pushup TypeScript Resolutions Reproduction

This repository demonstrates a monorepo setup with TypeScript configuration inheritance and Code Pushup integration.

## Repository Structure

```
repro-code-pushup-typescript-resolutions/
├── packages/
│   ├── lib/                    # Library package
│   │   ├── src/
│   │   │   └── index.ts       # Main library code
│   │   ├── code-pushup.config.ts  # Code Pushup configuration
│   │   ├── package.json       # Package configuration
│   │   └── tsconfig.json      # TypeScript configuration (extends base)
│   └── tsconfig/              # Shared TypeScript configurations
│       ├── base.json          # Base TypeScript configuration
│       └── package.json       # Package for exporting tsconfig
├── package.json               # Root package configuration
├── pnpm-workspace.yaml        # PNPM workspace configuration
└── pnpm-lock.yaml            # Lock file
```

## TypeScript Configuration Architecture

### Shared Configuration Package (`packages/tsconfig/`)

The `@repo/tsconfig` package provides shared TypeScript configurations:

- **`base.json`** (`packages/tsconfig/base.json:1-56`): Contains comprehensive TypeScript compiler options that uses `${configDir}` variables for flexible path resolution ([typescript docs about it](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#the-configdir-template-variable-for-configuration-files))

```json

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compileOnSave": false,
  "compilerOptions": {
    "noImplicitReturns": false,
    "noUnusedLocals": false,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "downlevelIteration": true,
    "resolveJsonModule": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "lib": ["es2021"],
    "rootDir": "${configDir}",
    "sourceMap": true,
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "allowJs": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2020",
    "outDir": "${configDir}/dist"
  },
  "exclude": [
    "${configDir}/src/**/*.spec.ts",
    "${configDir}/src/**/*.test.ts",
    "${configDir}/src/**/*.spec.tsx",
    "${configDir}/src/**/*.test.tsx",
    "${configDir}/src/**/*.spec.js",
    "${configDir}/src/**/*.test.js",
    "${configDir}/src/**/*.spec.jsx",
    "${configDir}/src/**/*.test.jsx",
    "${configDir}/src/**/*.stories.ts",
    "${configDir}/src/**/*.stories.js",
    "${configDir}/src/**/*.stories.jsx",
    "${configDir}/src/**/*.stories.tsx",
    "${configDir}/**/__tests__/**/*.ts",
    "${configDir}/**/__tests__/**/*.tsx"
  ],
  "include": [
    "${configDir}/src/@types/*.d.ts",
    "${configDir}/src/**/*.js",
    "${configDir}/src/**/*.jsx",
    "${configDir}/src/**/*.ts",
    "${configDir}/src/**/*.tsx"
  ]
}
```


### Library Package Configuration

The `@repo/lib` package demonstrates the configuration inheritance:

- **`tsconfig.json`** (`packages/lib/tsconfig.json:2`): Extends `@repo/tsconfig/base.json` using the package reference
- **`package.json`** (`packages/lib/package.json:13`): Declares `@repo/tsconfig` as a workspace dependency with `workspace:*`

## Steps to reproduce


Code pushup config:

```ts
import typescriptPlugin from '@code-pushup/typescript-plugin';

export default {
  plugins: [
    await typescriptPlugin(),
  ],
};
```

Run: `cd packages/lib && pnpm run code-pushup`



Failure logs:

```
code-pushup --no-progress --verbose

Code PushUp CLI
[ info ] Run autorun...
[ warn ] Plugins failed: 
[ warn ] Error: - Plugin TypeScript (typescript) produced the following error:
  - No files matched by the TypeScript configuration. Check your "include", "exclude" or "files" settings.
Error: Executing 1 plugin failed.

Error: - Plugin TypeScript (typescript) produced the following error:
  - No files matched by the TypeScript configuration. Check your "include", "exclude" or "files" settings.


    at executePlugins (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+core@0.74.0/node_modules/@code-pushup/core/src/lib/implementation/execute-plugin.js:108:15)
    at async collect (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+core@0.74.0/node_modules/@code-pushup/core/src/lib/implementation/collect.js:14:27)
    at async collectAndPersistReports (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+core@0.74.0/node_modules/@code-pushup/core/src/lib/collect-and-persist.js:7:26)
    at async handler (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+cli@0.74.0/node_modules/@code-pushup/cli/src/lib/autorun/autorun-command.js:25:13)
    at async Object.handler (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+cli@0.74.0/node_modules/@code-pushup/cli/src/lib/implementation/global.utils.js:26:20)
Error: Executing 1 plugin failed.

Error: - Plugin TypeScript (typescript) produced the following error:
  - No files matched by the TypeScript configuration. Check your "include", "exclude" or "files" settings.


    at executePlugins (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+core@0.74.0/node_modules/@code-pushup/core/src/lib/implementation/execute-plugin.js:108:15)
    at async collect (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+core@0.74.0/node_modules/@code-pushup/core/src/lib/implementation/collect.js:14:27)
    at async collectAndPersistReports (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+core@0.74.0/node_modules/@code-pushup/core/src/lib/collect-and-persist.js:7:26)
    at async handler (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+cli@0.74.0/node_modules/@code-pushup/cli/src/lib/autorun/autorun-command.js:25:13)
    at async Object.handler (file:///repro-code-pushup-typescript-resolutions/node_modules/.pnpm/@code-pushup+cli@0.74.0/node_modules/@code-pushup/cli/src/lib/implementation/global.utils.js:26:20)
 ELIFECYCLE  Command failed with exit code 1.
```