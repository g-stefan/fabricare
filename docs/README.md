# Fabricare — Documentation

Fabricare is the build tool of the XYO C++ projects. It is one executable,
`fabricare`, with a script engine ([Quantum Script](https://github.com/g-stefan/quantum-script),
a JavaScript-like language) and the build tools of the XYO stack built in.
Every action — `make`, `clean`, `install`, `test`, `release`, ... — is a
script, and every script can be replaced by a project.

```
fabricare                    # make the project in the current folder
fabricare install            # copy output/ to the SDK repository
fabricare test               # build and run the test programs
fabricare release            # pack output/ into release/*.zip
```

## What it does

- **Reads a manifest.** `fabricare.json` in the project folder describes the
  *solution*: its name, type and *projects* (an executable, a library, a
  DLL, the test programs), their sources, defines and dependencies.
- **Selects a platform and enters its environment.** It detects the
  compiler (Visual Studio 2017 - 2026, MinGW, MSYS2, gcc on Ubuntu / Debian,
  Emscripten) or takes `--platform=name`. For Visual Studio it runs
  `vcvarsall.bat` and starts itself again inside that environment, so no
  developer command prompt is needed. For WSL and MSYS2 it copies the project
  into that system and runs there.
- **Builds.** For `xyo-cpp` solutions it collects the sources, resolves the
  dependencies, writes a compile description and gives it to `xyo-cc`, the
  compiler driver built into fabricare, which calls `cl` / `gcc` / `emcc`
  and only rebuilds what changed. The results go to `output/`.
- **Shares the results.** `install` copies `output/bin`, `output/include`
  and `output/lib` to the *SDK repository* `~/.fabricare/<platform>`. Other
  projects find their dependencies there: headers, libraries and a small
  JSON descriptor per library that lists what it needs in turn.
- **Versions and releases.** `version` bumps `version.json` (and generates
  `Version.rh`), `release` packs `output/` into zip files with SHA-512
  checksums, and the `github-*` / `gitea-*` actions publish them.

## Why it exists

The XYO stack is many small repositories (`xyo-platform`,
`xyo-managed-memory`, ..., `quantum-script` and its extensions, tools,
`vendor-*` builds of third party libraries) that must build the same way on
Windows and Linux, with dynamic and static variants, and depend on each other.
Fabricare keeps that uniform:

| Need | How fabricare handles it |
|------|--------------------------|
| Same build on Windows (MSVC, MinGW) and Linux (gcc) | one manifest, per-platform scripts select and enter the toolchain |
| Many libraries depending on each other | `install` to a per-platform SDK repository, transitive dependency resolution from JSON descriptors, correct link order |
| DLL and static variants | `make: "dll-or-lib"` follows `--static`; `name.static` dependencies; `crt: "static"` |
| Projects with special needs (third party sources, generated code) | any action can be overridden by a script in the project's `fabricare/` folder |
| Bootstrap without other tools | the compiler driver, the version tool and the file embedding tools are inside the `fabricare` executable |
| Repeatable releases | release names from `version.json` and the platform, SHA-512 checksum files, GitHub / Gitea upload |

## Documentation

- [Getting started](getting-started.md) - install, first project, the everyday cycle
- [Command line](command-line.md) - options, actions, flags, environment variables
- [fabricare.json](fabricare-json.md) - the solution manifest, `version.json`, the config files
- [Platforms](platforms.md) - platform names, detection, the SDK repository, WSL and MSYS2
- [Dependencies](dependencies.md) - how libraries are found, linked and described
- [Writing scripts](scripts.md) - overriding actions, the script API, examples
- [Releases](releases.md) - release files, checksums, GitHub and Gitea
- [Developing fabricare](development.md) - building fabricare itself, the source layout, tests

## Requirements

- A C++ compiler for the platform: Visual Studio (Build Tools) 2017 - 2026,
  MinGW / MSYS2, gcc on Linux, or Emscripten.
- `git` and `7z` (7-Zip) on `PATH`; `curl` for the download actions.
- For publishing: [`tea`](https://gitea.com/gitea/tea) (Gitea) and
  [`github-release`](https://github.com/github-release/github-release) (GitHub).

## License

Copyright (c) 2021-2026 Grigore Stefan.
Fabricare is licensed under the [MIT](../LICENSE) license. The scripts in
`fabricare/`, `build/` and `test/` are public domain (Unlicense).
