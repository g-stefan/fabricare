# Writing scripts

Every fabricare action is a script in Quantum Script, a JavaScript-like
language (see the [quantum-script](https://github.com/g-stefan/quantum-script)
documentation for the language: `typeof(x)` with parentheses, `&&` / `||`
return booleans, no `let` / `const` / arrow functions, `substring(start, length)`,
`replace` replaces all). A project changes how it is built by adding scripts
to its `fabricare/` folder.

## How an action is found

`Fabricare.include(name)` runs the first script that exists of:

1. `./fabricare/solution/<type>.<name>.js` — project, for this solution type
2. `./fabricare/<name>.js` — project
3. `<exe folder>/fabricare/solution/<type>.<name>.js` — next to the fabricare executable
4. `<exe folder>/fabricare/<name>.js`
5. `fabricare://solution/<type>.<name>.js` — built into fabricare
6. `fabricare://<name>.js` — built into fabricare

`<type>` is `Solution.type` (`xyo-cpp`, `generic`). It returns `false` when
none exists. `fabricare <action>` runs `Fabricare.include(<action>)`, so:

- `fabricare/make.js` **replaces** `make` for this project;
- `fabricare/mytool.js` adds a new action, `fabricare mytool`;
- `fabricare/make.done.js` adds a step after a successful `make`, without
  replacing it (also `make.config.js`, `make.prepare.js` before);
- a script can run the built-in one it replaces with
  `Script.include("fabricare://make.js")`.

The built-in scripts are in
[`source/XYO/Fabricare/Internal`](../source/XYO/Fabricare/Internal) —
the best reference for what an action does.

## What runs before an action

1. The executable loads the script engine with its extensions and runs
   `Library.js`: reads `.fabricare.json`, `~/.fabricare.json` and
   `fabricare.json`, fills `Config`, `UserConfig`, `Workspace`, `Solution`.
2. The platform is detected (or `--platform`), `platform/<name>.js` runs:
   it enters the compiler environment (possibly starting fabricare again),
   sets `pathRepository`, `pathRelease`, `pathSuper`, `PATH`, and loads
   `solution/generic.library.js` (the helpers below).
3. `fabricare/workspace.js` runs if it exists; otherwise
   `solution/<type>.solution.js` loads the solution helpers
   (`solution/xyo-cpp.library.js`), expands the projects, selects the main
   project and includes the action.

## Global objects

| Name | Content |
|------|---------|
| `Fabricare` | `action` (the action name), `include(name)`, `isDebug()`, `isRelease()`, `isStatic()`, `isDynamic()`, `getVersion()`, `loadConfig()` / `saveConfig()`, `loadUserConfig()` / `saveUserConfig()`, `configFile`, `userConfigFile`, `workspaceFile` |
| `Solution` | the `solution` object of `fabricare.json` |
| `Project` | the current project (set by `forEachProject`, `selectMainProject`, `projectSet`) |
| `Platform` | `name`, `machine`, `osName`, `osType`, `version`, `path` |
| `Workspace`, `Config`, `UserConfig` | the manifest and the config files |
| `pathRepository` | the SDK repository of the platform, `~/.fabricare/<platform>` |
| `pathRelease` | the release repository, `~/.fabricare/release` |
| `pathSuper` | the folder of the fabricare executable |
| `OS` | `isWindows()`, `isLinux()`, `isMinGW()`, `isEmscripten()` |
| `XYO` | `getPlatform()` (the platform fabricare was built for), `isConfigDefined("XYO_PLATFORM_...")` |
| `Application` | `arguments`, `getArgument(index, default)`, `getFlagValue(name, default)` (`--name=value`), `hasFlag(name)`, `getPathExecutable()` |

Extensions loaded: `Console`, `Shell`, `ShellFind`, `File`, `JSON`, `CSV`,
`URL`, `Buffer`, `DateTime`, `Math`, `ProcessInteractive`, `SHA512`,
`Thread`, `Task`, `Job`, `Make`, `Application`.

## Helpers (all solutions)

From `solution/generic.library.js`:

| Function | Purpose |
|----------|---------|
| `messageAction(info)` | prints `- <solution>[.<project>]: info` |
| `messageError(info)` | prints `- <solution>: [ ERROR ] : info` |
| `exitIf(value, message)` | if `value` is true / non-zero: print the error and exit with `value` |
| `exit(code, message)` | print the error and exit |
| `exitIfTest(value, name)` | prints `name : [ PASS ]`, or `[ FAIL ]` and exits |
| `runInPath(path, fn)` | runs `fn` with `path` as the current folder, then returns to the previous one (also on exceptions) |
| `forEachProject(category, fn)` | for each project of the category (default `"make"`), sets `Project`, calls `fn` |
| `selectMainProject()`, `projectSet(project)`, `projectReset()`, `prepareProjects()` | the current project; expand projects with a list of names |
| `getVersion()`, `getVersionInfo()` | the solution version (`"1.2.3"`) / its `version.json` entry |
| `getProjectVersion()`, `getProjectVersionInfo()`, `getProjectVersionAsInfo()` | the same for `Project` |
| `getReleasePrefix()`, `getReleaseName(platform)` | `<namespace>.<name>`, `<prefix>.v<version>.<platform>` ([Releases](releases.md)) |
| `removeReleaseChecksum(jsonFile, releaseFile)` | removes one entry from a `.sha512.json` file |
| `copyFileIfExists(file, folder)` | copies `file` into `folder` if it exists |
| `addOutputBinToPath()` | puts `output/bin` first in `PATH` (and `LD_LIBRARY_PATH`) |
| `csvDecode(text)` | CSV text to an array of rows |
| `flagExtra()`, `cmdArgumentsExtra()`, `subroutineArgumentsExtra()` | the forwarded options (every `--` option except those in `flagExtraExclude`: `--platform`, `--platform-subroutine`, `--platform-active`, `--workspace`), for starting fabricare again |

Tools built into fabricare (no executable needed), called like programs with
string arguments; they return the exit code:

| Function | Tool |
|----------|------|
| `xyoCC(args...)` | `xyo-cc`, the compiler driver; `--platform=<platform>` is added |
| `xyoVersion(args...)` | `xyo-version`, `version.json` and `Version.rh` |
| `fileToCS(args...)` | `file-to-cs`, a file as a C array / string |
| `fileToRC(args...)`, `htmlToRC(args...)` | a file / HTML as Windows resource data |
| `fileToJS(args...)` | `file-to-js`, a file as a JavaScript string |

## Helpers (xyo-cpp)

From `solution/xyo-cpp.library.js`:

| Function | Purpose |
|----------|---------|
| `compileExe(cp)`, `compileLib(cp)`, `compileDll(cp)` | add the dependency defines and libraries to `cp`, write `temp/<project>.compile.json`, run `xyo-cc` |
| `compileAndRunTemp(cp)` | build `temp/<project>` and run it (code generators) |
| `compileAndRunTest(cp)` | build into `output/test` and run it |
| `xyoCCExtra(args...)` | the arguments plus the include / library folders of `output`, the SDK repository and `pathSuper/..`, and `--debug` |
| `getDependency()` | the link list of `Project` ([Dependencies](dependencies.md)) |
| `getDependencyOfProject(name)`, `getDependencyVersion()` | a descriptor; the versions of the dependencies |
| `getFileListIgnoreSpecialsSourcePath(base, sourcePath, pattern)` | files of the source folders, without `.Source.` / `.Template.` / `.Amalgam.` files |
| `copyHeaderFilesIgnoreSpecialsSourcePath(base, sourcePath, pattern, destination)` | copies headers keeping the folder |

The compile project `cp`, as `xyo-cc` reads it:

```javascript
var cp = {
	project: "libz",                       // output name
	defines: ["ZLIB_DLL"],
	includePath: ["output/include", "source"],
	cSource: ["source/adler32.c"],          // and/or cppSource, hppSource
	library: ["ws2_32"],                    // link names; dependencies are added
	libraryPath: [],
	linkerDefinitionsFile: "source/win32/zlib.def",
	resources: {
		includePath: ["source"],
		rcSource: ["source/win32/zlib1.rc"]
	},
	crt: "static"                           // optional
};
```

## Examples

### A step after make

`fabricare/make.done.js`:

```javascript
messageAction("make.done");

Shell.mkdirRecursivelyIfNotExists("output/bin/data");
exitIf(!Shell.copyFile("data/config.json", "output/bin/data/config.json"));
```

### A generated source before make

`fabricare/make.prepare.js` (what fabricare itself does with `Library.js`):

```javascript
messageAction("make.prepare");

runInPath("source/XYO/MyTool", function() {
	exitIf(fileToCS("--touch=Library.cpp", "--file-in=Library.js",
	                "--file-out=Library.Source.cpp", "--is-string", "--name=librarySource"));
});
```

### A third party library

A `vendor-*` project has no C++ sources of its own. `fabricare/vendor.js`
downloads the archive, `fabricare/make.js` builds it:

```javascript
// fabricare/make.js
Fabricare.include("vendor");

messageAction("make");

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("temp");
Shell.copyFile("source/zlib.h", "output/include/zlib.h");

compileLib({
	project: "libz",
	includePath: ["output/include", "source"],
	cSource: Shell.getFileList("source/*.c")
});
```

`compileLib` only builds. If other projects list this library in
`dependency`, also write its descriptor `output/lib/<name>.json`
(see [Dependencies](dependencies.md)), as `make.lib` does.

### A new action

`fabricare/deploy.js`, run with `fabricare deploy --target=server1`:

```javascript
messageAction("deploy");

var target = Application.getFlagValue("target");
exitIf(Script.isNil(target), "--target=name required");

forEachProject("make", function() {
	exitIf(Shell.system("scp output/bin/" + Project.name + " " + target + ":/opt/bin/"));
});
```

### A standalone script

Scripts can use the fabricare environment without a project:

```
fabricare --run-script=tools/report.js
```

`--run-script` skips the platform and the solution: load the helpers you need
with `Script.include("fabricare://solution/generic.library.js")`.

## Style

The XYO scripts use tabs, double quotes, `var`, and `;` after every
statement and block (`};`). Start each script with the SPDX header used in
the repository.
