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
3. **Linux:** `<id>-<release>` from `lsb_release`, lower case
   (`ubuntu-26.04`, `debian-12`).

If no platform is found, or `platform/<name>.js` does not exist, fabricare
stops with `Error: Platform <name> not found!`.

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

**Linux, MinGW, Emscripten.** Fabricare runs directly.

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
