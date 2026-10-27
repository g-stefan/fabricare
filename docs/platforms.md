# Platforms

A *platform* is a compiler, a target and an SDK repository. Its name is part
of the SDK path (`~/.fabricare/<platform>`) and of the release file names.

## Platform names

| Platform | Compiler / system |
|----------|-------------------|
| `win64-msvc-2026`, `win64-msvc-2022`, `win64-msvc-2019`, `win64-msvc-2017` | Visual Studio, 64 bit |
| `win32-msvc-2026`, `win32-msvc-2022`, `win32-msvc-2019`, `win32-msvc-2017` | Visual Studio, 32 bit |
| `win64-msvc-2026.static`, `win64-msvc-2022.static` | Visual Studio 64 bit, everything static (`--static`, static C runtime), own SDK repository |
| `mingw32`, `mingw64`, `ucrt64` | gcc inside an MSYS2 shell (`MSYSTEM` set) |
| `msys2-mingw32`, `msys2-mingw64`, `msys2-ucrt64` | from Windows: build in MSYS2 (`C:\msys64`) as `mingw32` / `mingw64` / `ucrt64` |
| `ubuntu-18.04` ... `ubuntu-26.04`, `debian-11`, `debian-12` | gcc on that Linux |
| `wsl-ubuntu-18.04` ... `wsl-ubuntu-26.04` | from Windows: build in that WSL distribution as `ubuntu-XX.XX` |
| `emscripten` | Emscripten (`emcc`), running under Linux / Node |
| `win-emsdk` | from Windows: Emscripten from `C:\emsdk`, platform name `emscripten` |
| `unknown` | no compiler: only the operating system is known (see [The unknown platform](#the-unknown-platform)) |

`fabricare --platform=<name> <action>` selects one. The Visual Studio
platforms expect the Community edition in its default folder
(`C:\Program Files\Microsoft Visual Studio\18\Community` for 2026,
`...\2022\Community`, `C:\Program Files (x86)\...\2019` and `2017`).

## Detection

Without `--platform`:

1. **Windows:** `XYO_PLATFORM` if it is set; `mingw32` / `mingw64` / `ucrt64`
   from `MSYSTEM` (inside MSYS2); else the newest Visual Studio found (2026,
   2022, 2019, 2017), `win64-` or `win32-` by `PROCESSOR_ARCHITECTURE`.
2. **Emscripten build of fabricare:** `emscripten`.
3. **Linux:** `<id>-<release>` from `lsb_release` (or `ID` / `VERSION_ID`
   of `/etc/os-release` when `lsb_release` is not installed), lower case
   (`ubuntu-26.04`, `debian-12`).

If no platform is found, or there is no `platform/<name>.js` for the detected
one (for example `fedora-40`), fabricare uses the `unknown` platform. A
`--platform=<name>` without a `platform/<name>.js` stops with
`Error: Platform <name> not found!`.

## The platform descriptor

`platform/<name>.js` fills the `Platform` object:

| Field | Content |
|-------|---------|
| `name` | the platform name, `win64-msvc-2026`, `ubuntu-24.04`, `unknown` |
| `machine` | `x64`, `x86`, `x32` (Emscripten), `arm64` |
| `osName` | `windows`, `ubuntu`, `debian`, `emscripten`, the Linux distribution (`linux` if unknown) |
| `osType` | `win64`, `win32`, `linux`, `emscripten` |
| `osVersion` | the Linux release (`24.04`, `12`), `unknown` on Windows |
| `compilerType` | `msvc`, `gcc` (Linux, MinGW), `emscripten`, `unknown` |
| `compilerVersion` | the Visual Studio version (`2026`, `2022`, ...); for `gcc` on Linux the release of the distribution (`24.04`), the compiler that comes with it; `unknown` for MinGW |
| `path` | the folder of `vcvarsall.bat` / `emsdk_env.bat` |

Fields not set are `unknown`. The `*.static` platforms have the same
`compilerVersion` as the plain ones (`2026`), the name tells them apart.

## The unknown platform

Without a compiler (no Visual Studio on Windows, a Linux distribution without
a descriptor) fabricare still runs on the `unknown` platform: `name`,
`compilerType` and `compilerVersion` are `unknown`, `machine`, `osName`,
`osType` and `osVersion` are those of the operating system. It runs directly
(no compiler environment), with the SDK repository `~/.fabricare/unknown`
(`%USERPROFILE%\.fabricare\unknown`) and `XYO_PLATFORM=unknown`.

Everything that does not compile works: `version`, `release`, the
`git-*` / `gitea-*` / `github-*` actions, `fabricare.self-install`, and the
`generic` solutions (for example xyo.web). Release names get `.unknown` unless
`releaseNoPlatform` is set. Compiling (`xyoCC`, the `make` of `xyo-cpp`
projects) stops with `Error: No compiler on platform unknown`; select a
platform with `--platform=<name>`. `--platform=unknown` selects it on a
machine that has a compiler.

## Entering the compiler environment

**Visual Studio.** Fabricare writes a temporary `.cmd` (in `%TEMP%`) that
runs `vcvarsall.bat x64` (or `x86`) and starts fabricare again with the same
action and options, plus `--platform-subroutine=true`. The inner fabricare
does the work; the outer one returns its exit code. When `XYO_PLATFORM`
already names the platform (you are in a fabricare-prepared shell), it runs
directly. Emscripten on Windows does the same with `emsdk_env.bat`.

**WSL.** Fabricare runs itself inside the distribution
(`wsl -d ubuntu-26.04 --shell-type login`), which must have its own Linux
fabricare installed (`fabricare fabricare.self-install` there). The project is
copied with `rsync` to `~/.fabricare/<linux-platform>/source/<solution>` inside
WSL and built there, so Windows and Linux builds do not share `output/` and
`temp/`. The copy is refreshed by the `default` action (no action given) and by
`sync`; `release` copies `release/` back to the Windows folder; `clean`
removes the copy.

**MSYS2.** The same, with `C:\msys64\usr\bin\sh --login` and `MSYSTEM` set;
the copy is in the MSYS2 home folder.

**Linux, MinGW, Emscripten, unknown.** Fabricare runs directly.

In all cases fabricare then puts the SDK repository first in the search paths:
`PATH` gets `<repository>/bin` and the folder of the fabricare executable;
on Windows `INCLUDE` and `LIB` get `<repository>/include` and `/lib`; on Linux
`LD_LIBRARY_PATH` gets `<repository>/bin`. It sets `XYO_PLATFORM` to the
platform for the programs it runs.

## The SDK repository

```
~/.fabricare/                        %USERPROFILE%\.fabricare on Windows
    win64-msvc-2026/
        bin/        fabricare, tools, DLLs (and .so on Linux)
        include/    headers of the installed libraries
        lib/        .lib / .a, and the descriptors <name>.json
    win64-msvc-2026.static/
    ubuntu-26.04/
        source/     project copies of wsl-* builds (inside WSL)
    release/        release-install copies release files here
```

- `fabricare install` copies `output/bin`, `output/include` and `output/lib`
  of the current project here.
- `XYO_PLATFORM_PATH` replaces the repository folder, when `XYO_PLATFORM` is
  the same platform (for example for a CI cache).
- `FABRICARE_PATH_RELEASE` replaces the release folder.
- The folder of the fabricare executable (`pathSuper`) is also searched: its
  `../include` and `../lib`, so a fabricare unpacked with a complete SDK
  (`bin/`, `include/`, `lib/` side by side) works without `install`.

Each platform has its own repository; build and install the dependencies for
every platform you use.

## Building for several platforms

The fabricare repository has `install-platforms.txt` (one platform per line,
`#` for comments) and `install-platforms.cmd`, which runs `clean`, `make`,
`install`, `clean` for each. The same loop works for any project:

```
for %p in (win64-msvc-2026 win64-msvc-2026.static) do fabricare --platform=%p clean && fabricare --platform=%p make && fabricare --platform=%p install
```

`output/` and `temp/` are shared by the platforms (except WSL / MSYS2), so
`clean` comes first for each platform.
