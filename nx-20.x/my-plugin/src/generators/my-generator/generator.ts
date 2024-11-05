import { normalizePath, offsetFromRoot,
  Tree, workspaceRoot,
} from '@nx/devkit';
import { libraryGenerator as nxJsLibraryGenerator } from '@nx/js';
import * as path from 'path';
import { MyGeneratorGeneratorSchema } from './schema';


// Extracted from https://github.com/nrwl/nx/blob/master/packages/devkit/src/generators/project-name-and-root-utils.ts#L196-L210
/**
 * When running a script with the package manager (e.g. `npm run`), the package manager will
 * traverse the directory tree upwards until it finds a `package.json` and will set `process.cwd()`
 * to the folder where it found it. The actual working directory is stored in the INIT_CWD
 * environment variable (see here: https://docs.npmjs.com/cli/v9/commands/npm-run-script#description).
 */
function getCwd(): string {
  return process.env.INIT_CWD?.startsWith(workspaceRoot)
    ? process.env.INIT_CWD
    : process.cwd();
}

function getRelativeCwd(): string {
  return normalizePath(path.relative(workspaceRoot, getCwd())).replace(/\/$/, '');
}

export function getRelativeCwdToRoot(): string {
  const maybeRelative = getRelativeCwd();
  if (maybeRelative === '') {
    return ''
  }
  return offsetFromRoot(maybeRelative)
}


export async function myGeneratorGenerator(
  tree: Tree,
  options: MyGeneratorGeneratorSchema
) {
  const expectedFolder = `libs/enforced/structure/${options.name}`;
  const relativeFolder = getRelativeCwdToRoot();
  const finalFolder = path.join(relativeFolder, expectedFolder);
  await nxJsLibraryGenerator(tree, {
    name: options.name,
    directory: finalFolder,
    js: false,
    pascalCaseFiles: false,
    // That was supposed to be Nx 20 new value
    projectNameAndRootFormat: 'as-provided',
    bundler: 'none',
    linter: 'none',
    unitTestRunner: 'none',
    skipFormat: true,
  });
}

export default myGeneratorGenerator;
