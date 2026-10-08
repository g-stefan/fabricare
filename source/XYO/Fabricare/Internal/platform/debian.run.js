// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2024-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/generic.library");

global.pathRepository = Shell.getenv("HOME") + "/.fabricare/" + Platform.name;
if (Shell.hasEnv("XYO_PLATFORM")) {
	if (Shell.getenv("XYO_PLATFORM") == Platform.name) {
		if (Shell.hasEnv("XYO_PLATFORM_PATH")) {
			global.pathRepository = Shell.getenv("XYO_PLATFORM_PATH");
		};
	};
};
Shell.setenv("XYO_PLATFORM", Platform.name);

// ---

global.pathRelease = Shell.getenv("HOME") + "/.fabricare/" + "/release";
if (Shell.hasEnv("FABRICARE_PATH_RELEASE")) {
	global.pathRelease = Shell.getenv("FABRICARE_PATH_RELEASE");
}

// ---

global.pathSuper = Application.getPathExecutable();

Shell.setenv("PATH", pathRepository + "/bin:" + pathSuper + ":" + Shell.getenv("PATH"));
Shell.setenv("LD_LIBRARY_PATH", pathRepository + "/bin:" + pathSuper + ":" + Shell.getenv("LD_LIBRARY_PATH"));

Fabricare.processWorkspace();
