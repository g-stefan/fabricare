# fabricare.json

`fabricare.json` is the manifest of a project folder (the *workspace*).
Fabricare reads it at start, before the platform is selected. All its keys go
to the `Workspace` script object; the `solution` key is also copied to the
`Solution` object that the actions use.

```json
{
	"solution": {
		"namespace": "xyo",
		"name": "xyo-system",
		"type": "xyo-cpp",
		"projects": [
			{
				"name": "xyo-system",
				"make": "dll-or-lib",
				"SPDX-License-Identifier": "MIT",
				"sourcePath": "XYO/System",
				"dependency": ["xyo-encoding", "xyo-multithreading"]
			},
			{
				"name": "xyo-system.static",
				"make": "lib",
				"SPDX-License-Identifier": "MIT",
				"sourcePath": "XYO/System",
				"dependency": ["xyo-encoding.static", "xyo-multithreading.static"],
				"dependencyDefines": ["XYO_SYSTEM_LIBRARY"],
				"linkVersion": "xyo-system",
				"crt": "static"
			},
			{
				"name": ["test.01", "test.02"],
				"make": "exe",
				"category": "test",
				"SPDX-License-Identifier": "Unlicense",
				"dependency": ["xyo-system"]
			}
		]
	}
}
```

Use `--workspace=file` to read another file.

## Solution

| Field | Default | Meaning |
|-------|---------|---------|
| `name` | | solution name; the project with this name is the *main* project |
| `namespace` | `"unknown"` | first part of the release names (`<namespace>.<name>.v1.0.0...`) |
| `type` | `"generic"` | `"xyo-cpp"` for C / C++ projects built with `xyo-cc`; `"generic"` for anything else (only the actions that do not compile) |
| `projects` | `[]` | the projects, see below |
| `version` | | the solution version; else the main project's `version`, else `version.json` |
| `versionName` | | key of `version.json` to read instead of `name` |
| `linkVersion` | | like `versionName`, checked first |
| `noInstall` | `false` | `true`: `install` and `install-bin` do nothing |
| `hasRelease` | `true` | `false`: the `release*` actions do nothing |
| `releaseName` | `name` | release names use `<namespace>.<releaseName>` |
| `releaseBin` | `true` | `release` packs `output/bin` into `.bin.zip` |
| `releaseDev` | `true` | `release` packs all of `output/` into `.dev.zip` |
| `releaseOutput` | `false` | `release` packs all of `output/` into one `.zip` (instead of `.bin.zip` and `.dev.zip`) |
| `releaseNoPlatform` | `false` | release names without the platform (for platform independent releases) |
| `githubRepository` | `name` | repository for the `github-*` actions |
| `giteaRepository` | `name` | repository for the `gitea-*` actions |

## Projects

A solution has one or more projects. Each has a *category*: `make` (the
default) projects are built by `make`, `test` projects by `test`. Actions
loop over them with `forEachProject(category, fn)`, which sets the global
`Project`.

| Field | Meaning |
|-------|---------|
| `name` | project name: the output file name and the `version.json` key. An **array** of names makes one project per name, with the same fields. |
| `category` | `"make"` (default) or `"test"`; scripts may use other categories |
| `make` | `"exe"`, `"lib"`, `"dll"` or `"dll-or-lib"` (DLL, or static library with `--static`). Leave it out when the project's `fabricare/make.js` builds it. |
| `SPDX-License-Identifier` | license, written to the library descriptor |
| `sourcePath` | folder (or array of folders) under `source/` with the sources; a value starting with `@` is a path from the project folder (`"@test"`). Default `source/` itself. |
| `sourcePrefix` | only files whose name starts with this prefix |
| `includePath` | more include folders (`source` is always added) |
| `defines` | preprocessor defines |
| `dependencyDefines` | defines used to compile this project **and** the projects that depend on it (written to the descriptor), for example the `..._LIBRARY` define of a static library |
| `dependency` | XYO libraries this project links, resolved with their own dependencies ([Dependencies](dependencies.md)) |
| `library` | other libraries to link, by link name, not resolved further unless they have a descriptor |
| `libraryPath` | more library folders |
| `osWindows`, `osLinux` | `{ "dependency": [...], "library": [...] }` added on that operating system (MinGW uses `osLinux`) |
| `crt` | `"static"` to link the C runtime statically |
| `outputPath` | `exe` only: output folder, default `output/bin` (`output/test` for tests) |
| `version` | the project version, instead of `version.json` |
| `versionName` | key of `version.json` for this project |
| `linkVersion` | take the version from another `version.json` key; `version*` actions skip the project |
| `noVersion` | `true`: the `version*` actions skip the project |

Fields a project script may use for its own purpose are kept: for example
`vendor` and `sourceLink` in the `vendor-*` projects.

### What `make` builds

For `xyo-cpp` projects, from every folder of `sourcePath`:

- `*.cpp` are compiled (`*.c` too, in projects with their own `make.js`),
  `*.rc` resources are compiled for `exe` and `dll`;
- files with `.Source.`, `.Template.` or `.Amalgam.` in their name are
  skipped (they are included by other files or generated);
- `lib` / `dll` copy the `*.hpp` and `*.rh` headers to
  `output/include/<sourcePath>`, the umbrella header next to the first
  folder (`source/XYO/System.hpp` for `XYO/System`) to `output/include/XYO`,
  and write the descriptor `output/lib/<name>.json`.

Subfolders are not scanned: list each folder in `sourcePath`, or use
`Amalgam` files that include the others.

### Test projects

A project of category `test` gets these defaults:

| Field | Default |
|-------|---------|
| `sourcePath` | `"@test"` |
| `sourcePrefix` | the project name: `test.01` builds `test/test.01*.cpp` |
| `includePath` | adds `source` and `test` |
| `libraryPath` | adds `output/lib` |
| `outputPath` | `output/test` |

`fabricare test` builds them all, then runs each from `output/test` with
`output/bin` first in `PATH` (and `LD_LIBRARY_PATH`).

## version.json

```json
{
	"xyo-system": {
		"version": "4.1.0",
		"build": "12",
		"date": "2026-09-01",
		"time": "10:00:00"
	}
}
```

One key per versioned project (the project `name`, or its `versionName`).
The `version*` actions update it (with `xyo-version`, built into fabricare)
and, for `xyo-cpp`, generate `source/<first sourcePath>/Version.rh` from
`Version.Template.rh`. Libraries record their version in their descriptor;
`release` names its files with the solution version.

## Config files

| File | Object | Option | Purpose |
|------|--------|--------|---------|
| `.fabricare.json` (project folder) | `Config` | `--config=file` | local settings of this checkout, not committed |
| `~/.fabricare.json` | `UserConfig` | `--user-config=file` | settings of the user |

Both are optional JSON objects. The built-in actions do not use them; they are
loaded for project scripts. Scripts can save them with
`Fabricare.saveConfig()` / `Fabricare.saveUserConfig()`.

## Workspace scripts

If the project has `fabricare/workspace.js`, it runs instead of the solution
logic (after the platform is ready), with the whole `Workspace` object
available. Use it for folders that drive other projects.
