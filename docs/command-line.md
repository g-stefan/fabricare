# Command line

```
fabricare [options] [action]
```

The first argument that does not start with `--` is the action; without one
the action is `default`, which runs `make`. Options can be anywhere.

## Options

Handled by the executable before any script runs:

| Option | Effect |
|--------|--------|
| `--help`, `--usage` | print the options and exit |
| `--license` | print the license and exit |
| `--version` | print `version X.Y.Z build N [date]` and exit |
| `--run-script=file` | run `file` instead of the build process (see below) |
| `@file` | read more arguments from `file`, split like a command line |

Used by the scripts:

| Option | Effect |
|--------|--------|
| `--platform=name` | use this platform instead of detecting one ([Platforms](platforms.md)) |
| `--debug` | debug build (`xyo-cc --debug`); also `XYO_PLATFORM_COMPILE_DEBUG=1/ON/TRUE` |
| `--static` | static build: `dll-or-lib` projects make a `lib`; also `XYO_PLATFORM_COMPILE_STATIC=1/ON/TRUE` |
| `--spdx` | run the `spdx` action instead of the one given |
| `--workspace=file` | manifest file, default `fabricare.json` in the current folder |
| `--config=file` | local config file, default `.fabricare.json` in the current folder |
| `--user-config=file` | user config file, default `~/.fabricare.json` |
| `--replace` | `github-release` / `gitea-release`: work on an existing release |
| `--no-message` | `release-version`, `release-exists`: print only the JSON |
| `--release-path=dir`, `--release-name=name` | `release-version`: write `dir/name.<namespace>.<name>.json` |
| `--dependency-path=dir`, `--dependency-name=name` | `dependency-version`: write `dir/name.<project>.<make>.json` |
| `--for-platform=name` | `release-exists`: check the release of another platform |
| `--separate-data[=marker]` | `release-exists`: print `marker` (default `@DATA:`) before the JSON |

When fabricare starts itself again in a compiler environment (MSVC,
Emscripten, WSL, MSYS2) it forwards every `--` option, in order, including
the ones a project defines for its own scripts (for example `--sdk`), except
`--platform`, `--platform-subroutine`, `--platform-active` and `--workspace`,
which the restart sets itself. Only the first argument that is not an option,
the action, is passed on.

## Actions

The built-in actions. A project can add its own or replace any of them with
a script in its `fabricare/` folder ([Writing scripts](scripts.md));
`fabricare help` lists them.

### Build

| Action | Effect |
|--------|--------|
| `default` | `make` |
| `make` | runs `make.config`, `make.prepare`, then `make.<make>` for every project of category `make`, then `make.done` |
| `clean` | removes `output/` and `temp/` |
| `test` | builds the projects of category `test` into `output/test` and runs them, `PASS` / `FAIL` per project, stops at the first failure |
| `analyze` | (`xyo-cpp`) `make` with the compiler's static analysis (`cl /analyze`, or `scan-build` with gcc) |
| `dependency-version` | (`xyo-cpp`) prints the version of every dependency of each project, as JSON |
| `spdx` | prints, as JSON, the `SPDX-License-Identifier` of each project and (`xyo-cpp`) of every package it depends on, read from the `lib/<name>.json` descriptors; `LicenseRef-Unknown` when a package has no descriptor (the `vendor-*` libraries) |
| `help`, `usage` | lists options and actions |

`make.config`, `make.prepare` and `make.done` do nothing by default; they are
hooks for projects. `make.exe`, `make.lib`, `make.dll` and `make.dll-or-lib`
are the `xyo-cpp` builders selected by a project's `make` field.

### Install

| Action | Effect |
|--------|--------|
| `install` | copies `output/bin`, `output/include`, `output/lib` to the SDK repository `~/.fabricare/<platform>` (skipped if `Solution.noInstall`) |
| `install-bin` | copies only `output/bin` |
| `install-from-release` | `release-extract`, then `install` |
| `fabricare.self-install` | run from a folder with the `fabricare` executable: copies it to `~/.fabricare/<platform>/bin`; on Linux / MSYS2 adds that folder to `PATH` in `~/.profile` and `~/.bashrc` |
| `sdk-make` | `fabricare make`, `install`, `release`, `release-install`, stops at the first error |

### Version

| Action | Effect |
|--------|--------|
| `version` | build number +1, date and time set to now, in `version.json` |
| `version-patch` / `version-minor` / `version-major` | bump that part of the version, the lower parts become 0 (the build number is not changed) |

For `xyo-cpp` solutions the version actions also generate
`source/<sourcePath>/Version.rh` from `Version.Template.rh`. Projects with
`noVersion` or `linkVersion` are skipped.

### Release

| Action | Effect |
|--------|--------|
| `release` | packs `output/bin` into `release/<name>.bin.zip` and `output/` into `release/<name>.dev.zip`, records SHA-512 checksums (needs `7z`) |
| `release-version` | prints, as JSON, the version and the release files `release` makes |
| `release-exists` | prints, as JSON, whether the release files of the current version exist in `release/` |
| `release-extract` | extracts the release of the current version into `output/` |
| `release-remove` | removes the release files of the current version and platform and their checksums |
| `release-install` | copies the release files of the current version to the release repository (`~/.fabricare/release`) |

### Publish

| Action | Effect |
|--------|--------|
| `git-update` | `git fetch --prune --prune-tags`, `git add --all`, `git commit -m "Update"`, `git push` |
| `github-release` | tags `vVERSION`, creates the GitHub release and uploads `release/*.vVERSION*` (`.zip`, `.exe`, `.json`) |
| `github-release-download` | downloads the assets of the current version's release into `release/` |
| `github-release-check` | shows the release of the current version |
| `github-release-keep-last-3` | deletes all the releases and tags except the newest 3 |
| `github-release-remove-all` | deletes all the releases and tags |
| `gitea-release` | tags `vVERSION`, creates the Gitea release with `tea` and uploads the release files and `archive/*.vVERSION*.zip` |
| `gitea-release-download` | downloads the assets of the current version's release (`GITEA_TOKEN` for private repositories) |
| `gitea-release-remove-all` | deletes all the releases and tags |

The `*-remove-all` and `keep-last-3` actions delete releases and tags on the
server; they cannot be undone. See [Releases](releases.md).

### Platform specific

| Action | Effect |
|--------|--------|
| `sync` | (`wsl-*`, `msys2-*`) copy the project into the WSL / MSYS2 build folder without building; `default` (no action) copies and builds, the other actions use the last copy |

## Running a script: `--run-script`

```
fabricare --run-script=tool.js arg1 --flag=value
```

Runs `tool.js` with the fabricare script environment: all the built-in
extensions (`Shell`, `JSON`, `ProcessInteractive`, ...), the `Fabricare`,
`Config`, `Workspace`, `Solution`, `OS`, `XYO` objects, and the built-in tools
(`xyoCC`, `fileToCS`, ...). No platform is selected and no action runs; the
built-in scripts can be loaded with `Script.include("fabricare://...")`.
The exit code is the script's (`Script.exit(n)`), 1 on an uncaught error.

## Exit code

0 on success. An action that fails prints `- <solution>: [ ERROR ] message`
and exits with a non-zero code (the failing tool's code, or 1).

## Environment variables

| Variable | Meaning |
|----------|---------|
| `XYO_PLATFORM` | the active platform; set by fabricare for the tools it runs. If set when fabricare starts on Windows, it is used instead of detection. |
| `XYO_PLATFORM_PATH` | SDK repository to use instead of `~/.fabricare/<platform>`, when `XYO_PLATFORM` is that platform |
| `FABRICARE_PATH_RELEASE` | release repository for `release-install`, instead of `~/.fabricare/release` |
| `XYO_PLATFORM_COMPILE_DEBUG` | `1`, `ON` or `TRUE`: same as `--debug` |
| `XYO_PLATFORM_COMPILE_STATIC` | `1`, `ON` or `TRUE`: same as `--static` |
| `CXX` | compiler command (`analyze` sets it on MSVC) |
| `GITEA_TOKEN` | token for the Gitea API (`gitea-release-download`) |
| `TEMP` | (Windows) folder for the temporary files used to enter the compiler environment |

## Files

| File | Purpose |
|------|---------|
| `fabricare.json` | the manifest ([fabricare.json](fabricare-json.md)) |
| `version.json` | versions per project |
| `.fabricare.json` | optional local config (`Config` object) |
| `~/.fabricare.json` | optional user config (`UserConfig` object) |
| `fabricare/*.js` | project scripts, override the built-in actions |
| `output/` | build results: `bin/`, `include/`, `lib/`, `test/` |
| `temp/` | intermediate files, `temp/<project>.compile.json` |
| `release/` | release zip files and `*.sha512.json` |
