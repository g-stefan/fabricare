# Fabricare reference

Detailed reference for the fabricare build tool. Read `SKILL.md` first for the
mental model. Source of truth: `fabricare/source/XYO/Fabricare/Internal/**`.

## Execution flow (what happens on `fabricare <action>`)

1. **`Process.js`** runs. Detects platform: uses `--platform=<name>` or includes
   `platform/detect` (probes `PROCESSOR_ARCHITECTURE`, `MSYSTEM`, installed
   Visual Studio `vcvarsall.bat`, `uname`/`lsb_release`, emscripten). Then
   includes `platform/<name>`.
2. **`platform/<name>.js`** (e.g. `win64-msvc-2026.js`) sets `Platform.machine`,
   `.osName`, `.osType`, `.version`, `.path`, then includes `platform/<family>.run`.
3. **`platform/<family>.run.js`** (e.g. `win-msvc.run.js`):
   - Loads `solution/generic.library` (defines the helper globals).
   - Sets `Fabricare.action = argument[0] || "default"`.
   - Computes `pathRepository = %USERPROFILE%/.fabricare/<platform>`
     (override with env `XYO_PLATFORM_PATH` when `XYO_PLATFORM` matches).
   - If not already inside the platform subroutine, writes a temp `.cmd` that
     `call vcvarsall.bat <machine>` then re-runs `fabricare "@<args-file>"` with
     `--platform-subroutine=true`; exits with that child's code. This is how the
     MSVC/toolchain environment is entered.
   - Inside the subroutine: sets `XYO_PLATFORM`, prepends
     `pathRepository\bin`, `pathSuper` to `PATH`, and the SDK `include`/`lib` to
     `INCLUDE`/`LIB`, then calls `Fabricare.processWorkspace()`.
4. **`processWorkspace()`** → runs local `fabricare/workspace.js` if present,
   else `processSolution()` → includes `solution/<Solution.type>.solution`.
5. **`solution/<type>.solution.js`** (e.g. `xyo-cpp.solution.js`) loads the
   solution library, `prepareProjects()`, `selectMainProject()`, then
   `Fabricare.include(Fabricare.action)` — runs the action. Unknown action → error.

`@file` on the command line expands to arguments read from that file (one token
per whitespace/line). Recognized top-level flags: `--help`, `--usage`,
`--license`, `--version`, `--run-script=<file>` (run an arbitrary script instead
of the built-in process), `--config=<file>`, `--workspace=<file>`,
`--platform=<name>`, `--debug`, `--static`, `--spdx`, `--user-config=<file>`, plus
action flags (`--dependency-path`, `--dependency-name`, `--release-path`,
`--release-name`, `--no-message`, `--separate-data`, `--for-platform`,
`--replace`). When fabricare re-runs itself inside a compiler environment it
forwards every `--` option (`flagExtra()` in `generic.library.js`), including
project-defined ones such as xyo-sdk's `--sdk`, except `--platform`,
`--platform-subroutine`, `--platform-active` and `--workspace`
(`flagExtraExclude`), which the restart sets itself.

## Config files

| File | Object | Purpose | Committed |
|------|--------|---------|-----------|
| `fabricare.json` | `Workspace` → `Solution` | Solution/project manifest (the `solution` key) | yes |
| `.fabricare.json` (project) | `Config` | Local per-project config state | usually not / optional |
| `~/.fabricare.json` | `UserConfig` | Per-user config | no |
| `version.json` | — | Version/build/date per project name | yes |

Override paths with `--workspace=`, `--config=`, `--user-config=`.

## `solution` object fields (in fabricare.json)

| Field | Meaning |
|-------|---------|
| `name` | Solution name; also default "main" project name |
| `type` | `xyo-cpp` or `generic` (dispatch logic) |
| `projects` | array of project objects (below) |
| `version` | override solution version (else from version.json / project) |
| `versionName` / `linkVersion` | key to read in version.json |
| `namespace` | first part of release names (`<namespace>.<name>.v<version>...`) |
| `releaseName` | release name used instead of `name` |
| `releaseDev` | package all of `output/` → `<prefix>.v<ver>.<platform>.dev.zip`; default true |
| `releaseBin` | package `output/bin` → `<prefix>.v<ver>.<platform>.bin.zip`; default true |
| `releaseOutput` | package all of `output/` → `<prefix>.v<ver>.<platform>.zip` (no dev/bin) |
| `releaseNoPlatform` | omit `.<platform>` from release names |
| `githubRepository` / `giteaRepository` | repository for the github-* / gitea-* actions (default `name`) |
| `hasRelease` | set false to skip the `release` action |
| `noInstall` | set true to skip the `install` action |

## Project object fields

| Field | Meaning |
|-------|---------|
| `name` | project name; may be an **array** (fanned out by `prepareProjects`) |
| `make` | `exe` \| `lib` \| `dll` \| `dll-or-lib` (omit for custom `make.js`) |
| `category` | project group for `forEachProject`; default `make` (tests use `test`) |
| `SPDX-License-Identifier` | license id, embedded in the lib descriptor |
| `sourcePath` | subpath(s) under `source/` to scan; entries beginning `@` are literal paths (e.g. `@test`) |
| `sourcePrefix` | filename prefix filter for source globbing |
| `includePath` | extra include dirs (`source` is always added) |
| `defines` | preprocessor defines |
| `dependencyDefines` | defines both used here and **exported** to dependents |
| `dependency` | XYO libraries (resolved transitively via SDK `<name>.json`) |
| `library` | raw libraries to link (no transitive descriptor lookup by `:`) |
| `libraryPath` | extra lib search dirs |
| `crt` | `static` for static C runtime |
| `outputPath` | override output dir (default `output/bin`) |
| `osWindows` / `osLinux` / `osUnknown` | per-OS `{dependency, library}` blocks |
| `version` / `versionName` / `linkVersion` | version selection |
| `noVersion` | skip version bumping for this project |
| `sourceLink`, `vendor` | vendor bookkeeping (used by vendor scripts) |

### Dependency naming convention

- `"xyo-system"` → link `xyo-system` and pull its transitive deps.
- `"quantum-script.static"` → the static-variant library name.
- Leading `:` (`":name"`) in internal processing marks "resolve this project's
  own dependency list". In `fabricare.json` you just list plain names; fabricare
  prefixes `:` internally.
- Transitive resolution reads `<name>.json` descriptors from, in order:
  `pathSuper/../lib`, `~/.fabricare/<platform>/lib`, `./output/lib`.
  Link order: each library is weighted by the sum of the depths it is reached
  at; sorted ascending, so direct dependencies come first and widely shared
  low-level libraries last (what GNU ld needs).

## Built-in actions (Internal/*.js)

| Action | Effect |
|--------|--------|
| `default` | → `make` |
| `make` | run `make.config` → `make.prepare` → per project `make.<exe/lib/dll>` → `make.done` |
| `make.config`, `make.prepare`, `make.done` | hook stages (override locally to inject steps) |
| `clean` | remove `output/` and `temp/` (vendor clean also removes extracted `source/`) |
| `install` | copy `output/{bin,include,lib}` → `~/.fabricare/<platform>/` |
| `install-bin` | copy only binaries |
| `install-from-release` | `release-extract` then `install` |
| `release-install` | copy the current release files + `.sha512.json` to `pathRelease` (`~/.fabricare/release`) |
| `version`, `version-major`, `version-minor`, `version-patch` | bump version.json via `xyoVersion` |
| `test` | build `category:test` projects then run them (`exitIfTest` = PASS/FAIL) |
| `release` | package `output` → `release/*.bin.zip`, `*.dev.zip` (or `*.zip`) + `*.sha512.json` (7z) |
| `release-version` | JSON: version + release file names (`--release-path`, `--release-name` write it to a file) |
| `release-exists` | JSON: which release files exist (`--for-platform`) |
| `release-extract` | extract the current release into `output/` |
| `release-remove` | delete this platform's release files and their checksum entries |
| `sdk-make` | `make`, `install`, `release`, `release-install` |
| `git-update` | fetch --prune, add --all, commit "Update", push |
| `gitea-release`, `gitea-release-download`, `gitea-release-remove-all` | Gitea publishing (`tea`) |
| `github-release`, `github-release-download`, `github-release-check`, `github-release-keep-last-3`, `github-release-remove-all` | GitHub publishing (`github-release`) |
| `fabricare.self-install` | copy the running `fabricare` binary into `~/.fabricare/<platform>/bin` and add it to PATH (run from a release `bin/` folder) |

`spdx` (or `--spdx`) prints the `SPDX-License-Identifier` of each project as
JSON; `xyo-cpp` adds every `:package` dependency, read from its
`lib/<name>.json` descriptor (`LicenseRef-Unknown` if there is none).

`xyo-cpp` also provides: `analyze`, `dependency-version`, `help`, `usage`,
`library` (helper include), and the `make.dll-or-lib` selector.

## Scripting API catalog

Defined in `Library.js` (bootstrap) and `solution/generic.library.js` (helpers),
plus solution libs. All are globals inside action scripts.

### Status / control
- `messageAction(info?)` — `- <solution[.project]>: <info>` (green).
- `messageError(info?)` — red error line.
- `exitIf(retV, message?)` — if `retV` truthy: error + `Script.exit(retV)`.
- `exitIfTest(retV, message?)` — prints PASS/FAIL; exits on fail.
- `exit(retV, message?)` — error + exit.
- `runInPath(path, fn)` — chdir(path), run fn, always chdir back.

### Project iteration
- `forEachProject(category, fn)` — for each `Solution.projects` whose `category`
  matches (default `make`); populates global `Project`.
- `selectMainProject()` — set `Project` to the solution's main project.
- `projectSet(obj)` / `projectReset()` — manage the current `Project`.
- `prepareProjects()` — expand array-valued `project.name` into separate projects.

### Compilation
- `compileExe(cp)`, `compileLib(cp)`, `compileDll(cp)` — add dep defines+libs,
  write `temp/<project>.compile.json`, call `xyoCC`.
- `compileAndRunTemp(cp)`, `compileAndRunTest(cp)` — build to temp/test and run.
- `xyoCC(...args)` — compiler driver (adds `--platform`); `xyoCCExtra(...)` appends
  the standard include/lib search paths (`output`, `pathRepository`, `pathSuper/..`)
  and `--debug` when the flag is set.
- `getFileListIgnoreSpecialsSourcePath(base, sourcePath, "*.cpp")` — glob sources,
  skipping `*.source.*`, `*.template.*`, `*.amalgam.*` files.
- `copyHeaderFilesIgnoreSpecialsSourcePath(...)`; `copyFileIfExists(file, dir)`
  (generic library).
- `getDependency()`, `getDependencyOfProject(name)`, `getDependencyVersion()` —
  resolve the transitive dependency graph from `<name>.json` descriptors.

### Compile-project object (`cp`) shape
```js
{
  project: "name",                 // output base name
  defines: ["FOO"],
  includePath: ["output/include", "source"],
  cppSource: [...], cSource: [...], hppSource: [...],
  library: ["libz"],               // link names
  libraryPath: [...],
  linkerDefinitionsFile: "source/win32/zlib.def",
  resources: { includePath:[...], rcSource:[...] },
  crt: "static"
}
```

### Versions and releases
- `getVersion()`, `getVersionInfo(file?)`, `getProjectVersion()`,
  `getProjectVersionInfo()`, `getProjectVersionAsInfo()` — read `version.json`.
- `getReleasePrefix()` — `<namespace>.<name|releaseName>`;
  `getReleaseName(platform?)` — `<prefix>.v<version>[.<platform>]`.
- `removeReleaseChecksum(jsonFile, releaseFile)` — drop one checksum entry
  (file removed when empty).
- `addOutputBinToPath()` — `output/bin` first in `PATH` / `LD_LIBRARY_PATH`.

### Tooling wrappers (map to bundled tools)
`fileToCS` (embed a file as a C string), `fileToRC`, `fileToJS`, `htmlToRC`,
`xyoCC` (compiler), `xyoVersion` (version bumper). Underlying exes:
`file-to-cs`, `file-to-rc`, `file-to-js`, `html-to-rc`, `xyo-cc`, `xyo-version`.

### Runtime / OS (QuantumScript extensions)
`Shell` (`system`, `mkdirRecursivelyIfNotExists`, `copyFile`, `copyDirRecursively`,
`rename`, `remove`/`removeFile`, `removeDirRecursively[Force]`, `fileExists`,
`directoryExists`, `getFileSize`, `getFileList`, `getDirList`, `getFileName`,
`getFilePath`, `fileGetContents`, `filePutContents`, `getcwd`, `chdir`,
`realPath`, `getenv`, `setenv`, `hasEnv`),
`Console` (`write`, `writeLn`), `JSON` (`decode`, `encode`, `encodeWithIndentation`),
`OS` (`isWindows`, `isLinux`, `isMinGW`, `isEmscripten`),
`Application` (`getArgument(i,default)`, `getFlagValue(name,default)`, `hasFlag`,
`arguments`, `getPathExecutable`),
`ProcessInteractive.run(cmd)`, `SHA512.fileHash(file)`, `DateTime`, `CSV`, `URL`,
`Math`, `File`, `Script` (`include`, `exit`, `isNil`, `isArray`, `requireExtension`).

## Platform names

`win32/win64-msvc-{2017,2019,2022,2026}` (+ `.static`), `mingw32`, `mingw64`,
`ucrt64`, `msys2-mingw32`, `msys2-mingw64`, `msys2-ucrt64`, `emscripten`,
`ubuntu-{18.04..26.04}`, `debian-{11,12}`, `wsl-ubuntu-*`. Detected automatically
or forced with `--platform=<name>`. The env var `XYO_PLATFORM` also selects one.

## Generated / gitignored directories

- `output/` — build products (`bin/`, `include/`, `lib/`, `test/`).
- `temp/` — intermediate objects and generated `*.compile.json`.
- `release/` — packaged `*.zip` archives + `*.sha512.json`.
- `archive/` — downloaded vendor source archives (`vendor-*` projects).
- `source/` — extracted vendor source (regenerated; gitignored for vendors).
- `vendor/` — sub-project checkouts (fabricare bootstrap project only).
- `~/.fabricare/<platform>/` — the shared SDK repository (bin/include/lib).

## Reusing this skill in another CPP project

This skill lives in the `fabricare` repo. To make it available while working in a
sibling project (e.g. `xyo-system`, `file-crypt`), copy the `fabricare/` skill
folder to that project's `.claude/skills/`, or install it once for all projects
under `~/.claude/skills/fabricare/`.
