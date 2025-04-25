# ConfigDirTs

Repro steps:


```sh
nx g @nx/js:library --directory=my-library --unitTestRunner=vitest --no-interactive
```

Use `${configDir}` in the tsconfig files

Then view the target

```
nx show project my-library --json 
```


Here is the current result (trimmed to only show inputs and outputs):

```json
{
  "targets": {
    "typecheck": {
      "inputs": [
        "{projectRoot}/package.json",
        "{workspaceRoot}/tsconfig.base.json",
        "{projectRoot}/tsconfig.json",
        "{projectRoot}/tsconfig.lib.json",
        "{projectRoot}/tsconfig.spec.json",
        "{projectRoot}/${configDir}/src/**/*.ts",
        "{projectRoot}/${configDir}/vite.config.ts",
        "{projectRoot}/${configDir}/vite.config.mts",
        "{projectRoot}/${configDir}/vitest.config.ts",
        "{projectRoot}/${configDir}/vitest.config.mts",
        "{projectRoot}/${configDir}/src/**/*.test.ts",
        "{projectRoot}/${configDir}/src/**/*.spec.ts",
        "{projectRoot}/${configDir}/src/**/*.test.tsx",
        "{projectRoot}/${configDir}/src/**/*.spec.tsx",
        "{projectRoot}/${configDir}/src/**/*.test.js",
        "{projectRoot}/${configDir}/src/**/*.spec.js",
        "{projectRoot}/${configDir}/src/**/*.test.jsx",
        "{projectRoot}/${configDir}/src/**/*.spec.jsx",
        "{projectRoot}/${configDir}/src/**/*.d.ts",
        "^production",
        {
          "externalDependencies": [
            "typescript"
          ]
        }
      ],
      "outputs": [
        "{projectRoot}/**/*.js",
        "{projectRoot}/**/*.cjs",
        "{projectRoot}/**/*.mjs",
        "{projectRoot}/**/*.jsx",
        "{projectRoot}/**/*.js.map",
        "{projectRoot}/**/*.jsx.map",
        "{projectRoot}/**/*.d.ts",
        "{projectRoot}/**/*.d.cts",
        "{projectRoot}/**/*.d.mts",
        "{projectRoot}/**/*.d.ts.map",
        "{projectRoot}/**/*.d.cts.map",
        "{projectRoot}/**/*.d.mts.map",
        "{projectRoot}/tsconfig.tsbuildinfo",
        "{projectRoot}/dist/**/*.d.ts",
        "{projectRoot}/dist/tsconfig.lib.tsbuildinfo",
        "{projectRoot}/out-tsc/vitest/**/*.d.ts",
        "{projectRoot}/out-tsc/vitest/tsconfig.tsbuildinfo"
      ]
    },
    "build": {
      "inputs": [
        "{projectRoot}/package.json",
        "{workspaceRoot}/tsconfig.base.json",
        "{projectRoot}/tsconfig.lib.json",
        "{projectRoot}/${configDir}/src/**/*.ts",
        "!{projectRoot}/${configDir}/vite.config.ts",
        "!{projectRoot}/${configDir}/vite.config.mts",
        "!{projectRoot}/${configDir}/vitest.config.ts",
        "!{projectRoot}/${configDir}/vitest.config.mts",
        "!{projectRoot}/${configDir}/src/**/*.test.ts",
        "!{projectRoot}/${configDir}/src/**/*.spec.ts",
        "!{projectRoot}/${configDir}/src/**/*.test.tsx",
        "!{projectRoot}/${configDir}/src/**/*.spec.tsx",
        "!{projectRoot}/${configDir}/src/**/*.test.js",
        "!{projectRoot}/${configDir}/src/**/*.spec.js",
        "!{projectRoot}/${configDir}/src/**/*.test.jsx",
        "!{projectRoot}/${configDir}/src/**/*.spec.jsx",
        "^production",
        {
          "externalDependencies": [
            "typescript"
          ]
        }
      ],
      "outputs": [
        "{projectRoot}/dist"
      ]
    }
  }
}
```

As you can see, the inputs and outputs are not valid.

Expected result:

```json
{
  "targets": {
    "typecheck": {
      "inputs": [
        "{projectRoot}/package.json",
        "{workspaceRoot}/tsconfig.base.json",
        "{projectRoot}/tsconfig.json",
        "{projectRoot}/tsconfig.lib.json",
        "{projectRoot}/tsconfig.spec.json",
        "{projectRoot}/src/**/*.ts",
        "{projectRoot}/vite.config.ts",
        "{projectRoot}/vite.config.mts",
        "{projectRoot}/vitest.config.ts",
        "{projectRoot}/vitest.config.mts",
        "{projectRoot}/src/**/*.test.ts",
        "{projectRoot}/src/**/*.spec.ts",
        "{projectRoot}/src/**/*.test.tsx",
        "{projectRoot}/src/**/*.spec.tsx",
        "{projectRoot}/src/**/*.test.js",
        "{projectRoot}/src/**/*.spec.js",
        "{projectRoot}/src/**/*.test.jsx",
        "{projectRoot}/src/**/*.spec.jsx",
        "{projectRoot}/src/**/*.d.ts",
        "^production",
        {
          "externalDependencies": [
            "typescript"
          ]
        }
      ],
      "outputs": [
        "{projectRoot}/dist/**/*.d.ts",
        "{projectRoot}/dist/**/*.d.ts.map",
        "{projectRoot}/dist/tsconfig.lib.tsbuildinfo",
        "{projectRoot}/out-tsc/vitest/**/*.d.ts",
        "{projectRoot}/out-tsc/vitest/**/*.d.ts.map",
        "{projectRoot}/out-tsc/vitest/tsconfig.tsbuildinfo"
      ]
    },
    "build": {
      "inputs": [
        "{projectRoot}/package.json",
        "{workspaceRoot}/tsconfig.base.json",
        "{projectRoot}/tsconfig.lib.json",
        "{projectRoot}/src/**/*.ts",
        "!{projectRoot}/vite.config.ts",
        "!{projectRoot}/vite.config.mts",
        "!{projectRoot}/vitest.config.ts",
        "!{projectRoot}/vitest.config.mts",
        "!{projectRoot}/src/**/*.test.ts",
        "!{projectRoot}/src/**/*.spec.ts",
        "!{projectRoot}/src/**/*.test.tsx",
        "!{projectRoot}/src/**/*.spec.tsx",
        "!{projectRoot}/src/**/*.test.js",
        "!{projectRoot}/src/**/*.spec.js",
        "!{projectRoot}/src/**/*.test.jsx",
        "!{projectRoot}/src/**/*.spec.jsx",
        "^production",
        {
          "externalDependencies": [
            "typescript"
          ]
        }
      ],
      "outputs": [
        "{projectRoot}/dist"
      ]
    }
  }
}
```