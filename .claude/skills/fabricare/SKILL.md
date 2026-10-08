---
name: fabricare
description: >-
  How to build, clean, install, test, version and release C/C++ projects with
  the XYO "fabricare" build tool, and how to customize it. Use whenever a
  folder contains a fabricare.json and/or a fabricare/ folder of .js scripts
  (make.js, vendor.js, make.prepare.js, make.done.js, ...), when the user
  mentions fabricare, building an xyo-* / quantum-script* / vendor-* project,
  the ~/.fabricare SDK repository, platforms such as win64-msvc-2026 or
  wsl-ubuntu-26.04, library descriptors in lib/<name>.json, or actions like
  make, test, install, version, release, github-release, self-install; also
  when working inside the fabricare repository itself (Internal/*.js scripts,
  Library.js, Process.js, build.cmd bootstrap).
---

# Fabricare

Script-driven build tool of the XYO C/C++ projects. One executable,
`fabricare`, embeds a JavaScript-like engine (Quantum Script) and the XYO
build tools (`xyo-cc` compiler driver, `xyo-version`, `file-to-cs`, ...).
Every action is a script; a project overrides any of them from its
`fabricare/` folder.

Full documentation: `docs/` in the fabricare repository — README (purpose),
getting-started, command-line, fabricare-json, platforms, dependencies,
scripts, releases, development. Read the matching page when you need more
than this summary. The built-in action scripts are the source of truth:
`source/XYO/Fabricare/Internal/**` (`solution/*.js` for the solution logic,
`platform/*.js` for platforms). Field / API tables: `reference.md` next to
this file.

## Mental model

1. Run `fabricare [options] [action]` in a project folder (the one with
   `fabricare.json`). No action → `default` → `make`.
2. The platform is detected (newest Visual Studio on Windows, MSYS2 `MSYSTEM`,
   `lsb_release` on Linux) or given with `--platform=name`. For MSVC fabricare
   writes a temp `.cmd` that calls `vcvarsall.bat` and **runs itself again**
   inside it — no developer prompt needed. `wsl-*` / `msys2-*` platforms
   rsync the project into WSL / MSYS2 and run the Linux / MinGW fabricare there.
3. `fabricare.json` → `Solution`; `solution/<type>.solution.js` expands the
   projects and runs `Fabricare.include(<action>)`.
4. `xyo-cpp` projects: sources of each `sourcePath` folder (not recursive;
   `.Source.` / `.Template.` / `.Amalgam.` files skipped) →
   `temp/<project>.compile.json` → `xyo-cc` (incremental) → `output/`.
5. `install` copies `output/{bin,include,lib}` to the **SDK repository**
   `~/.fabricare/<platform>` (`%USERPROFILE%\.fabricare\<platform>`), where
   other projects find headers, libraries and `lib/<name>.json` descriptors.

## Everyday commands

```
fabricare                 # make
fabricare test            # build + run projects of category "test" (does NOT build make projects)
fabricare install         # copy output/ to the SDK repository (does NOT build)
fabricare clean           # remove output/ and temp/
fabricare version         # build +1 in version.json (+ Version.rh for xyo-cpp)
fabricare version-patch   # or version-minor / version-major
fabricare release         # release/<ns>.<name>.v<ver>.<platform>.bin.zip / .dev.zip + .sha512.json (needs 7z)
fabricare --platform=win64-msvc-2026.static make
fabricare --debug make    # --static: dll-or-lib makes a lib
fabricare help            # all actions and options
```

Typical library cycle: `make` → `test` → `install` → `clean`. After a `clean`
the tests link the *installed* library (possibly stale): always `make` before
`test`, and `make` for the same platform before `install`.

## fabricare.json essentials

```json
{
	"solution": {
		"namespace": "xyo",
		"name": "file-crypt",
		"type": "xyo-cpp",
		"projects": [
			{
				"name": "file-crypt",
				"make": "exe",
				"SPDX-License-Identifier": "MIT",
				"sourcePath": "XYO/FileCrypt",
				"dependency": ["xyo-system.static", "xyo-cryptography.static"],
				"crt": "static"
			},
			{
				"name": ["test.01", "test.02"],
				"make": "exe",
				"category": "test",
				"dependency": ["xyo-system"]
			}
		]
	}
}
```

- `make`: `exe` | `lib` | `dll` | `dll-or-lib`; leave out when
  `fabricare/make.js` builds the project (vendor projects).
- `dependency`: XYO libraries, resolved transitively from descriptors;
  `name.static` = static variant. `library`: plain link names.
- `dependencyDefines`: defines exported to dependents (the `..._LIBRARY`
  define of a static lib). `osWindows` / `osLinux`: per-OS
  `{dependency, library}`.
- Test projects: `category: "test"`, sources `test/<name>*.cpp`, output
  `output/test`.
- `version.json` holds `{ "<name>": {version, build, date, time} }`; needed
  by libraries, `version*` and `release*`.
- Release switches: `releaseBin`, `releaseDev`, `releaseOutput`,
  `releaseNoPlatform`, `releaseName`, `hasRelease`, `noInstall`.

## Customizing: the fabricare/ folder

`Fabricare.include(name)` runs the first found of:
`./fabricare/solution/<type>.<name>.js`, `./fabricare/<name>.js`, the same two
next to the executable, `fabricare://solution/<type>.<name>.js`,
`fabricare://<name>.js` (built in). So `fabricare/make.js` replaces make,
`fabricare/foo.js` adds action `foo`, `fabricare/make.prepare.js` /
`make.done.js` hook before / after make, `fabricare/workspace.js` replaces
the whole solution logic.

Script API most used (globals): `messageAction(msg)`, `messageError(msg)`,
`exitIf(retV, msg)`, `exit(code, msg)`, `exitIfTest(retV, name)`,
`runInPath(dir, fn)`, `forEachProject(category, fn)` (sets `Project`),
`compileExe/compileLib/compileDll(cp)`, `xyoCC(...)`, `fileToCS(...)`,
`getVersion()`, `getReleaseName()`, `copyFileIfExists`, `addOutputBinToPath()`,
`Shell.*`, `JSON.*`, `OS.isWindows()/isLinux()/isMinGW()`,
`Application.getFlagValue(name, default)`, `Fabricare.isStatic()/isDebug()`,
`pathRepository`, `pathRelease`, `pathSuper`, `Solution`, `Platform`.

Quantum Script is not JavaScript: `typeof(x)` needs parentheses, `&&` / `||`
return booleans, `null == 0` is true, no `let` / `const` / `=>` / regex,
`substring(start, length)`, `replace` replaces all, a top-level `var` in an
included script is global. Style: tabs, `;` after every statement and block
(`};`).

## Dependencies

Descriptors `<name>.json` are searched in `pathSuper/../lib`, then
`pathRepository/lib`, then `output/lib`. Link order: by accumulated depth,
direct dependencies first, shared low-level libraries last. Build and
`install` dependencies bottom-up (xyo-platform → xyo-managed-memory →
xyo-data-structures → xyo-multithreading → xyo-encoding → xyo-system → ...)
before the projects that use them. `fabricare dependency-version` shows what
a project resolves to.

## Running fabricare from Claude Code on Windows

- The Claude Code shell sets `NoDefaultCurrentDirectoryInExePath=1`; the MSVC
  re-entry does `pushd <VC\Auxiliary\Build>` + bare `call vcvarsall.bat`,
  which then fails (*"'vcvarsall.bat' is not recognized"*, then *"'cl.exe'
  is not recognized"*). Clear it for the child only:

  ```powershell
  $env:NoDefaultCurrentDirectoryInExePath = $null
  cmd /c "fabricare make 2>&1"; "EXIT=$LASTEXITCODE"
  ```

  `cmd /c ... 2>&1` keeps PowerShell 5.1 from turning stderr into errors.
  Output has ANSI colors.
- Source files in the XYO repositories use CRLF; keep them CRLF when editing
  (check with `git ls-files --eol` and `git diff --stat`).
- Linux builds through WSL: put the commands in a script and run
  `wsl -d ubuntu-26.04 -e bash -l /mnt/<drive>/<path>/script.sh` (login
  shell, so `~/.profile` puts fabricare on PATH). A Linux build in the same
  folder rewrites shared `output/`, `temp/` and generated `Config.hpp`
  files: rebuild on Windows afterwards, and never run both at once.
- To try a changed built-in script without rebuilding fabricare, copy it to
  the project's `fabricare/` folder, run, then remove the copy.

## Working on fabricare itself

- Built with `fabricare make` (needs the `.static` XYO libraries installed),
  or without fabricare via `build.cmd [vendor|make|install|clean]` /
  `./build.sh` (clones dependencies into `vendor/`).
- `fabricare/make.prepare.js` embeds `Internal/**/*.js` as `fabricare://`
  sources (generated `Internal.Source*`, `Library.Source.cpp`, not
  committed): edit the `.js` files.
- `fabricare test` runs `test/test.NN.js` with
  `output/bin/fabricare --run-script=...`; tests load the built-in scripts
  from `fabricare://` and use `check(name, value, expected)` from
  `test/test.common.js`. Run `make` first. New test: next number + raise the
  loop bound in `fabricare/test.js`.
- `fabricare install` = `fabricare.self-install` from `output/bin`.

## External tools

`7z`, `git`, `curl`; `tea` (Gitea) / `github-release` (GitHub) for
publishing; a compiler for the platform (Visual Studio 2017-2026, MinGW /
MSYS2, gcc, Emscripten).
