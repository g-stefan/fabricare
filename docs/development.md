# Developing fabricare

## Source layout

```
fabricare.json                  fabricare built by fabricare (xyo-cpp, one exe, static)
version.json
source/XYO/
    Fabricare.hpp
    Fabricare.Prepare.cpp       fabricare-prepare: runs fabricare/prepare.js (bootstrap only)
    Fabricare/
        Application.cpp         main: options, @file, starts the script engine
        Library.cpp             initExecutive: extensions, built-in tools (xyoCC, ...), OS / XYO objects
        Library.js              the first script: config, workspace, Fabricare.include
        Process.js              the build process: platform detection, then the platform script
        Internal/               the built-in scripts, embedded as fabricare://...
            *.js                actions (make, clean, install, release, ...)
            platform/*.js       platforms and their run scripts
            solution/*.js       generic and xyo-cpp solution logic and helpers
        Version.Template.rh     version template, Version.rh is generated
fabricare/
    make.prepare.js             before make: embed Library.js, Process.js, Internal/**
    prepare.js                  Internal/**/*.js -> Internal.Source/*.cpp + Internal.Source.cpp
    install.js                  install = self-install from output/bin
    test.js                     test = run test/test.NN.js with output/bin/fabricare
build/                          bootstrap build without fabricare (build.cmd / build.sh)
test/                           tests of the scripts
docs/                           this documentation
```

The scripts are compiled into the executable: `fabricare/prepare.js` converts
every `Internal/**/*.js` with `file-to-cs` into
`Internal.Source/<path>.cpp` and writes `Internal.Source.cpp`, which
registers each one with `setIncludeSource("fabricare://<path>.js", ...)`.
`Library.js` and `Process.js` become `Library.Source.cpp` and
`Process.Source.cpp`. These generated files are not committed (except
`Process.Source.cpp`, used by the bootstrap). Edit the `.js` files.

## Building with fabricare

With a fabricare and the XYO libraries installed (the dependencies of
`fabricare.json`, all `.static`):

```
fabricare            # make: prepare the embedded scripts, build output/bin/fabricare
fabricare test       # run the script tests with the new executable
fabricare install    # output/bin/fabricare fabricare.self-install
fabricare clean
```

On Windows, from a Claude Code or other shell that sets
`NoDefaultCurrentDirectoryInExePath`, clear it first: the Visual Studio
environment script is started with a bare `call vcvarsall.bat` from its own
folder, which that setting prevents.

## Bootstrap build

Without an installed fabricare, `build.cmd` (Windows) and `./build.sh`
(Linux, MinGW) build it from the sources of all its dependencies:

```
build.cmd vendor     # git clone the XYO repositories into vendor/ (FABRICARE_SOURCE_GIT, default https://github.com/g-stefan)
build.cmd            # build temp/xyo-cc, temp/file-to-cs, temp/fabricare-prepare, then output/bin/fabricare
build.cmd install    # copy fabricare to ~/.fabricare/<platform>/bin
build.cmd clean
```

`build.cmd --platform:win64-msvc-2022 [action]` selects the platform (note
the `:`), else `build/platform/detect.cmd` finds the newest Visual Studio.
`build/platform/<platform>.cmd|.sh` enters the compiler environment and runs
`build/msvc.<action>.cmd` or `build/ubuntu.<action>.sh`.

`install-platforms.cmd` builds and installs fabricare for each platform in
`install-platforms.txt`.

## Tests

`fabricare test` runs, with the just built `output/bin/fabricare`:

- `fabricare --version`;
- `test/test.NN.js` with `--run-script`. Each test works in
  `temp/test.NN`, loads the built-in scripts it checks from `fabricare://`
  (so it tests the scripts compiled into the executable) and fails by throwing
  after reporting the failed checks (`check(name, value, expected)` from
  `test/test.common.js`).

| Test | Checks |
|------|--------|
| `test.01.js` | projects (`prepareProjects`, `forEachProject`, `selectMainProject`), versions, `Fabricare.include` precedence, the user config path, debug / static flags |
| `test.02.js` | dependency resolution: descriptor lookup order, link order, defines, versions, `osWindows` / `osLinux` |
| `test.03.js` | release names, `release-version`, `release-exists`, `release-install`, `release-remove` |
| `test.04.js` | `fabricare.self-install`, on Linux the `~/.profile` / `~/.bashrc` block |
| `test.05.js` | `flagExtra`: the options forwarded when fabricare starts itself again in a compiler environment |

A new test: `test/test.NN.js` with the next number, then raise the loop bound
in `fabricare/test.js`. Run one test directly:

```
output/bin/fabricare --run-script=test/test.03.js
```

To try a change to a built-in script without rebuilding, copy it into a
project's `fabricare/` folder (it takes precedence), run, then remove it.

## Conventions

- C++: tabs, `};` after blocks, CRLF, SPDX headers (MIT in `source/`,
  Unlicense in `fabricare/`, `build/`, `test/`).
- Scripts: the Quantum Script style (tabs, `var`, `;` after statements and
  blocks, double quotes).
- Keep `README.md`, `docs/` and `.claude/skills/fabricare/` in step with
  behavior changes.
- License compliance: `.reuse/dep5`, checked with `reuse lint`.
