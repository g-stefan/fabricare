# Fabricare

Build system based on scripts
- The build tool of the XYO C++ projects, one executable for Windows and Linux.
- Every action (`make`, `clean`, `test`, `install`, `version`, `release`, ...) is a
Quantum Script script; a project overrides or adds actions from its `fabricare/` folder.
- Manifest `fabricare.json`: solution, projects (`exe`, `lib`, `dll`, `dll-or-lib`, tests),
sources, defines, dependencies.
- Selects the platform (Visual Studio 2017 - 2026, MinGW / MSYS2, gcc on Ubuntu / Debian,
WSL, Emscripten) and enters its compiler environment by itself.
- Shared SDK repository `~/.fabricare/<platform>` with transitive dependency resolution.
- Releases with SHA-512 checksums, GitHub and Gitea publishing.
- Built in: `xyo-cc` (compiler driver), `xyo-version`, `file-to-cs`, `file-to-rc`,
`file-to-js`, `html-to-rc`.

## Documentation

- [Overview](docs/README.md) - purpose and design
- [Getting started](docs/getting-started.md) - install, first project, the everyday cycle
- [Command line](docs/command-line.md) - options, actions, flags, environment variables
- [fabricare.json](docs/fabricare-json.md) - the solution manifest, `version.json`, config files
- [Platforms](docs/platforms.md) - platform names, detection, SDK repository, WSL and MSYS2
- [Dependencies](docs/dependencies.md) - library descriptors, resolution, link order, static variants
- [Writing scripts](docs/scripts.md) - overriding actions, the script API, examples
- [Releases](docs/releases.md) - release files, checksums, GitHub and Gitea
- [Developing fabricare](docs/development.md) - bootstrap build, source layout, tests

A Claude Code skill for fabricare is in
[.claude/skills/fabricare](.claude/skills/fabricare/SKILL.md).

## Require external programs

- 7zip
- git
- curl
- tea
- github-release

## License

Copyright (c) 2021-2026 Grigore Stefan
Licensed under the [MIT](LICENSE) license.
