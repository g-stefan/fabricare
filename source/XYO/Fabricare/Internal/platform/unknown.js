// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// No compiler platform detected (or --platform=unknown): only the operating system is known.
// Enough for the actions that do not compile: version, release, git / gitea / github,
// fabricare.self-install, and for generic solutions (for example xyo.web)

if (Platform.osType == "unknown") {
	Fabricare.include("platform/detect-os");
};

Platform.name = "unknown";
Platform.compilerType = "unknown";
Platform.compilerVersion = "unknown";

Fabricare.include("solution/generic.library");

var pathHome = Shell.getenv("HOME");
var pathListSeparator = ":";
if (OS.isWindows() && !OS.isMinGW()) {
	pathHome = Shell.getenv("USERPROFILE");
	pathListSeparator = ";";
};

global.pathRepository = pathHome + "/.fabricare/" + Platform.name;
if (Shell.hasEnv("XYO_PLATFORM")) {
	if (Shell.getenv("XYO_PLATFORM") == Platform.name) {
		if (Shell.hasEnv("XYO_PLATFORM_PATH")) {
			global.pathRepository = Shell.getenv("XYO_PLATFORM_PATH");
		};
	};
};
Shell.setenv("XYO_PLATFORM", Platform.name);

// ---

global.pathRelease = pathHome + "/.fabricare/" + "/release";
if (Shell.hasEnv("FABRICARE_PATH_RELEASE")) {
	global.pathRelease = Shell.getenv("FABRICARE_PATH_RELEASE");
}

// ---

global.pathSuper = Application.getPathExecutable();

Shell.setenv("PATH", pathRepository + "/bin" + pathListSeparator + pathSuper + pathListSeparator + Shell.getenv("PATH"));
if (OS.isLinux()) {
	Shell.setenv("LD_LIBRARY_PATH", pathRepository + "/bin:" + pathSuper + ":" + Shell.getenv("LD_LIBRARY_PATH"));
};

Fabricare.processWorkspace();
