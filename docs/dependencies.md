# Dependencies

An `xyo-cpp` project lists the XYO libraries it uses by name:

```json
"dependency": ["xyo-system"]
```

and fabricare links `xyo-system` and everything `xyo-system` needs
(`xyo-encoding`, `xyo-multithreading`, ..., `xyo-platform`), in an order the
linker accepts, with the defines those libraries require.

## Library descriptors

When `make` builds a `lib` or `dll` project it writes
`output/lib/<name>.json`; `install` copies it to the SDK repository with the
library:

```json
{
	"xyo-system": {
		"version": { "version": "8.0.0", "build": "18", "date": "2026-10-05", "time": "12:05:41" },
		"SPDX-License-Identifier": "MIT",
		"library": [":xyo-encoding", ":xyo-multithreading"],
		"defines": [],
		"dependency": {
			"xyo-platform": "2.0.0",
			"xyo-managed-memory": "4.0.0",
			"xyo-data-structures": "3.9.0",
			"xyo-encoding": "6.0.0",
			"xyo-multithreading": "4.0.0"
		}
	}
}
```

| Key | Meaning |
|-----|---------|
| `library` | what this library links: `:name` for an XYO library with its own descriptor (from `dependency`), plain names for other libraries (from `library`), including the `osWindows` / `osLinux` entries of the platform it was built on |
| `defines` | the project's `dependencyDefines`: added when compiling anything that depends on it |
| `version` | the library's version |
| `dependency` | the versions of the libraries it was built with |
| `crt` | `"static"` if built with the static C runtime |

## Resolution

For each name in `dependency` (and `library`, and the `osWindows` /
`osLinux` block of the current system) fabricare reads the descriptor
`<name>.json`, looking in this order:

1. `<fabricare executable folder>/../lib` (a fabricare shipped with its SDK),
2. `~/.fabricare/<platform>/lib` (the SDK repository),
3. `output/lib` (libraries built by an earlier project of the same solution).

Then it follows the `library` lists of those descriptors, recursively. A name
without a descriptor (a system library such as `ws2_32` or `pthread`) is
linked as given and not followed.

Each library gets a weight: the sum of the depths at which it is reached. The
link list is sorted by weight, lowest first, so the direct dependencies come
first and the libraries many others need come last — the order GNU `ld`
needs. Equal weights keep the order they were found in.

The defines of all the resolved descriptors are added to the project's
`defines`, each once.

`fabricare dependency-version` prints what a project resolves to, with
versions. `fabricare --spdx` prints the licenses, from the
`SPDX-License-Identifier` of each descriptor:

```json
{
	"file-crypt": "MIT",
	"xyo-platform": "MIT",
	"xyo-managed-memory": "MIT",
	"xyo-data-structures": "MIT",
	"xyo-encoding": "MIT",
	"xyo-multithreading": "MIT",
	"xyo-system": "MIT",
	"xyo-cryptography": "MIT"
}
```

The projects come first, then the packages (`:name`) in link order. System
libraries (`advapi32`, ...) are not listed; a package without a descriptor
is `LicenseRef-Unknown`.

## Dynamic and static variants

The `xyo-*` libraries come in two variants:

| Name | Built by | Linked as |
|------|----------|-----------|
| `xyo-system` | `"make": "dll-or-lib"` | DLL / shared library (or static with `--static`) |
| `xyo-system.static` | `"make": "lib"`, `crt: "static"`, `dependencyDefines: ["XYO_SYSTEM_LIBRARY"]` | static library, static C runtime |

A static program depends on the `.static` names
(`"dependency": ["xyo-system.static"]`) and usually sets `"crt": "static"`.
The `dependencyDefines` of a static library (its `..._LIBRARY` define)
reach every project that links it, so its headers do not use
`dllimport`.

The `*.static` platforms (`win64-msvc-2026.static`) build everything static
into a separate SDK repository, with `--static` set.

## Order of building

A dependency must be built and installed before the projects that use it. For
the XYO stack that is, bottom up:

```
xyo-platform
xyo-managed-memory
xyo-data-structures
xyo-multithreading
xyo-encoding
xyo-system
xyo-cryptography, ...
quantum-script, quantum-script--*, ...
applications
```

In each repository: `fabricare make`, `fabricare install` (and
`fabricare test`). Alternatively install the release archives
(`install-from-release` after downloading them, or extract the `.dev.zip`
files into the SDK repository).

Within one solution, projects are built in the order listed; a later project
can depend on an earlier one, found in `output/lib`.

## Problems

| Symptom | Cause |
|---------|-------|
| `cannot find -l:name.a`, `cannot open file 'name.lib'` | `name` is not installed for this platform: build and `install` it (or its `.static` variant) |
| unresolved symbols from a library that is installed | the installed library is older than its headers / dependents: rebuild and install it; after `clean`, `test` links the installed library, run `make` first |
| `dllimport` / `__imp_` errors with a static library | depend on the `.static` name, so its `dependencyDefines` apply |
| a library linked twice or in the wrong order | a project lists both `name` and `name.static`, or a descriptor is stale |
