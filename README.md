# ReproTypescriptLocalTsconfigPackage

The issue is when you have a library that is local in the monorepo that contains typescript configs, the way nx resolves typescript config is using the ts.System of typescript, however given it's going though the FsTree, it will prefix everything with workspaceRoot. However, due to the way ts.System resolves librarires, they are already prefixed with workspaceRoot, making the resolve of any typescript config in node_module not resolving.


Reproduction:
- Create a typescript based monorepo (`npx create-nx-workspace --preset=ts`)
- Create two libs (`nx g @nx/js:library --directory=example-lib --no-interactive`)
- Run Nx sync => should work and referenced are populated
- Create a lib of ts config, past the content of tsconfig.base in it
- Use it in both libs
- Run Nx Sync => no references are generated
