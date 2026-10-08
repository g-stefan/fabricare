# Getting started

## Install fabricare

### From a release

Download the release for your platform (for example
`xyo.fabricare.v8.0.0.win64-msvc-2026.bin.zip`), extract it, and run the
self install from the extracted folder:

```
cd xyo.fabricare.v8.0.0.win64-msvc-2026.bin
fabricare fabricare.self-install
```

`fabricare.self-install` copies the executable to
`~/.fabricare/<platform>/bin` (on Windows `%USERPROFILE%\.fabricare\<platform>\bin`).
It must be run from the folder that contains the `fabricare` executable.

- **Linux / MSYS2:** it also appends a block to `~/.profile` and `~/.bashrc`
  that puts that folder first in `PATH` and `LD_LIBRARY_PATH`. Open a new
  login shell (or `. ~/.profile`) to use it.
- **Windows:** add `%USERPROFILE%\.fabricare\<platform>\bin` to your user
  `PATH` once. The libraries and tools you `install` later go to the same
  folder.

Check it:

```
fabricare --version
```

### From source

Fabricare builds itself without an existing fabricare. See
[Developing fabricare](development.md): `build.cmd` (Windows) or
`./build.sh` (Linux) clone the XYO sources into `vendor/`, build fabricare
with the compiler directly, and `build.cmd install` copies it to the SDK
repository.

## A first project

A folder with a `fabricare.json` is a project:

```
hello/
    fabricare.json
    version.json
    source/
        Hello/
            Hello.cpp
```

`fabricare.json`:

```json
{
	"solution": {
		"namespace": "xyo",
		"name": "hello",
		"type": "xyo-cpp",
		"projects": [
			{
				"name": "hello",
				"make": "exe",
				"SPDX-License-Identifier": "MIT",
				"sourcePath": "Hello",
				"dependency": ["xyo-system"]
			}
		]
	}
}
```

`version.json` (needed by `release`, `version` and libraries):

```json
{
	"hello": {
		"version": "1.0.0",
		"build": "1",
		"date": "2026-01-01",
		"time": "00:00:00"
	}
}
```

Build it:

```
cd hello
fabricare
```

Fabricare detects the platform, enters the compiler environment, compiles
every `.cpp` in `source/Hello` (subfolders are not scanned), finds `xyo-system` and everything it
depends on in the SDK repository, and links `output/bin/hello` (`hello.exe`
on Windows). The intermediate files are in `temp/`.

The dependency must be installed in the SDK repository first (build and
`fabricare install` the `xyo-*` libraries, from the bottom of the stack up,
or install their releases). See [Dependencies](dependencies.md).

## The everyday cycle

```
fabricare            # same as fabricare make
fabricare test       # build and run the projects of category "test"
fabricare install    # copy output/{bin,include,lib} to ~/.fabricare/<platform>
fabricare clean      # remove output/ and temp/
```

- `make` builds the projects of category `make` (the default category) in
  the order they are listed.
- `test` builds the projects of category `test` (by default from the
  `test/` folder, into `output/test`) and runs each one; a non-zero exit code
  is a failure. The programs and libraries in `output/bin` are found before
  the installed ones. `test` does not build the `make` projects: run `make`
  first.
- `install` copies what is in `output/`, it does not build. Run `make` for
  the same platform first.
- `clean` leaves the source tree as it was checked out.

A library project (`"make": "lib"`, `"dll"` or `"dll-or-lib"`) also copies
its headers to `output/include` and writes `output/lib/<name>.json`, the
descriptor that other projects use to link it.

## Choosing the platform and the variant

```
fabricare --platform=win64-msvc-2022 make
fabricare --platform=wsl-ubuntu-24.04
fabricare --debug make
fabricare --static make
```

Without `--platform` fabricare picks the newest Visual Studio found on
Windows, `mingw32` / `mingw64` / `ucrt64` inside MSYS2, and
`<distribution>-<release>` (for example `ubuntu-26.04`) on Linux. See
[Platforms](platforms.md).

`--static` makes `dll-or-lib` projects static libraries; the `*.static`
platforms (for example `win64-msvc-2026.static`) set it for every build and
use a separate SDK repository.

## Versions and releases

```
fabricare version          # build number +1, date and time updated
fabricare version-patch    # 1.0.0 -> 1.0.1
fabricare release          # release/xyo.hello.v1.0.1.<platform>.bin.zip (+ .dev.zip)
```

See [Releases](releases.md).

## Next steps

- All the actions and options: [Command line](command-line.md).
- All the fields of `fabricare.json`: [fabricare.json](fabricare-json.md).
- Custom build steps, third party sources, generated files:
  [Writing scripts](scripts.md).
