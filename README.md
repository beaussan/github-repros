# Nx Cloud agent sizing ignores globs in global inputs

`start-nx-agents` can underestimate the work when a changed file matches a glob in a workspace global input. This repro evaluates the installed Cloud client's sizing helpers and compares their result with Nx's affected project calculation on the same five-project graph.

## Run

Requires Node.js 22+ and pnpm.

```sh
git clone --branch nx-cloud-agent-global-input-globs --single-branch https://github.com/beaussan/github-repros.git
cd github-repros
pnpm install
pnpm repro
```

The first run downloads the current Cloud client using Nx's client updater. It does not start agents, register a CI execution, or run project tasks. The script prints the Cloud bundle version so results can be tied to that version.

To inspect a specific client already installed on your machine:

```sh
NX_CLOUD_BUNDLE=/absolute/path/to/cloud/2610.16.0011.hotfix1/index.js pnpm repro
```

## Observed output

Validated with Nx 23.3.0 and Cloud client `2610.16.0011.hotfix1`:

```text
plugin glob: Cloud 1/5 (20%), Nx 5/5 <-- MISMATCH
workflow glob: Cloud 0/5 (0%), Nx 5/5 <-- MISMATCH
exact file control: Cloud 5/5 (100%), Nx 5/5
project file control: Cloud 1/5 (20%), Nx 1/5

Reproduced: 2 global input globs undercounted by Cloud agent sizing.
```

Expected: both glob cases report 5/5 for Cloud sizing, matching Nx.

## Cause

The Cloud helper `extractGlobalFilesFromInputs` removes the `{workspaceRoot}/` prefix. Then `getTouchedProjectsFromFileList` compares each changed path with the resulting strings using `===`. A pattern such as `tools/plugins/*.ts` never equals `tools/plugins/storybook.ts`.

The file falls back to its owning project, if it has one. The ratio helper follows reverse project dependencies and floors the result to a percentage. In this fixture the projects are independent, so a shared plugin edit counts as 1/5 and a workflow edit as 0/5. Nx expands both patterns and counts all five.

The sizing path uses its own helper rather than Nx's affected selector. `NX_LEGACY_AFFECTED=false` does not change this helper. With a map of agent pools, the underestimated ratio can select a smaller pool than the work needs.

## Scope

The fixture graph and configuration are synthetic. The script parses named functions from the locally installed proprietary Cloud bundle and evaluates only the sizing helpers. The bundle and extracted code are not committed. This demonstrates the selection calculation without provisioning agents; it does not measure CI duration.

The script also works as a check after a fix: if the counts match, it prints `No mismatch`. It stops with an explicit error if helper names change, rather than silently substituting a model of Cloud's implementation.
