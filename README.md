# NxReproConformanceModulesBoundariesBug


Two reproduction in one:

### Lazy loaded library, detected statically from package.json

On regular nx modules boundaries, if a lazy loaded library is detected, it's only complaining about static references in the project code. The conformance rule is complaining about the package.json content.

Not an issue with regular eslint rule

### Lazy loaded library, with dual entry points, only one is lazy loaded

If you have a dual entry point library, and only one of the entry points is lazy loaded, then all imports are marked as issues

Already an issue with regular eslint rule: https://github.com/nrwl/nx/issues/18552

### Conformance result:

```
 ┌  @nx/conformance/enforce-project-boundaries - maintainability | medium severity | status: enforced
 │
 ◼  @nx-repro/main-library
 │    ▲ Static dependencies on lazy-loaded projects are forbidden (found "@nx-repro/dual-entry-lazy-library")
 │    - packages/main-library/package.json
 │    - packages/main-library/src/lib/main-library.ts
 │
 │    ▲ Static dependencies on lazy-loaded projects are forbidden (found "@nx-repro/lazy-loaded-library")
 └    - packages/main-library/package.json
```

Expected result: all is good