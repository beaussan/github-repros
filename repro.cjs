const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const nxRoot = path.dirname(require.resolve('nx/package.json'));
const nx = name => require(path.join(nxRoot, 'dist/src', name));

async function main() {
  let bundlePath = process.env.NX_CLOUD_BUNDLE;
  let version;
  if (!bundlePath) {
    const manager = nx('nx-cloud/update-manager.js');
    ({ version } = await manager.verifyOrUpdateNxCloudClient({}));
    bundlePath = path.join(manager.getBundleInstallDefaultLocation(), version, 'index.js');
  }
  bundlePath = path.resolve(bundlePath);
  version ??= path.basename(path.dirname(bundlePath));
  console.log(`Nx ${require('nx/package.json').version}; Cloud client ${version}`);

  // Parse locally installed code. Only these pure sizing helpers are evaluated.
  // The proprietary bundle and extracted source are never copied into this repo.
  const source = ts.createSourceFile('cloud.js', fs.readFileSync(bundlePath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const names = [
    'normalizePath', 'normalizeProjectRoot', 'findProjectForPath',
    'createProjectRootMappings', 'getTouchedProjectsFromFileList',
    'extractGlobalFilesFromNamedAndTargetInputs', 'extractFilesFromNamedInputs',
    'extractFilesFromTargetInputs', 'extractGlobalFilesFromInputs',
    'getAffectedProjectCount', 'getAffectedProjectRatio',
  ];
  const functions = source.statements.filter(node => ts.isFunctionDeclaration(node) && names.includes(node.name?.text));
  assert.equal(functions.length, names.length, 'Cloud helper names changed; inspect the new bundle before adapting this repro.');
  const sandbox = { console, VERBOSE_LOGGING: false };
  const code = functions.map(node => node.getText(source)).join('\n');
  for (const alias of code.match(/\bimport_path\d*\b/g) ?? []) sandbox[alias] = path;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: 5000 });

  // Five independent projects. A shared input must affect all five.
  const graph = { nodes: {}, dependencies: {}, externalNodes: {} };
  for (const name of ['plugin-tools', 'app-a', 'app-b', 'lib-a', 'lib-b']) {
    graph.nodes[name] = {
      name, type: 'lib',
      data: { root: name === 'plugin-tools' ? 'tools/plugins' : `packages/${name}`, targets: { check: { command: 'echo check', inputs: ['default'] } } },
    };
    graph.dependencies[name] = [];
  }
  const config = JSON.parse(fs.readFileSync('nx.json', 'utf8'));
  const globals = sandbox.extractGlobalFilesFromNamedAndTargetInputs(config);
  const { filterAffected } = nx('project-graph/affected/affected-project-graph.js');
  const cases = [
    ['plugin glob', 'tools/plugins/storybook.ts'],
    ['workflow glob', '.nx/workflows/agents.yaml'],
    ['exact file control', '.nx/ci-config.yaml'],
    ['project file control', 'packages/app-a/index.ts'],
  ];
  let mismatches = 0;
  for (const [label, file] of cases) {
    const touched = sandbox.getTouchedProjectsFromFileList(graph.nodes, globals, [file]);
    const cloudCount = sandbox.getAffectedProjectCount(touched, graph);
    const ratio = sandbox.getAffectedProjectRatio(touched, graph);
    const affected = await filterAffected(graph, [{ file, ext: path.extname(file), getChanges: () => [{ type: 'WholeFileChange' }] }], config, {});
    const nxCount = Object.keys(affected.nodes).length;
    const mismatch = cloudCount !== nxCount;
    mismatches += Number(mismatch);
    console.log(`${label}: Cloud ${cloudCount}/5 (${ratio}%), Nx ${nxCount}/5${mismatch ? ' <-- MISMATCH' : ''}`);
    if (label === 'exact file control') assert.equal(nxCount, 5);
    if (label === 'project file control') assert.equal(nxCount, 1);
    if (label.endsWith('glob')) assert.equal(nxCount, 5);
  }
  if (mismatches) {
    console.log(`\nReproduced: ${mismatches} global input globs undercounted by Cloud agent sizing.`);
  } else {
    console.log('\nNo mismatch: this Cloud client may contain a fix.');
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
