// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2024-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/generic.library");

global.pathRepository = Shell.getenv("HOME") + "/.xyo-sdk/"+ Platform.name;
if(Shell.hasEnv("XYO_PLATFORM")) {
	if (Shell.getenv("XYO_PLATFORM") == Platform.name) {
		if(Shell.hasEnv("XYO_PLATFORM_PATH")) {
			global.pathRepository = Shell.getenv("XYO_PLATFORM_PATH");
		};
	};
};
Shell.setenv("XYO_PLATFORM", Platform.name);

// ---

global.pathRelease = pathRepository + "/release";

global.pathSuper = Application.getPathExecutable();

Shell.setenv("PATH", pathRepository + "/bin:" + pathSuper + ":" + Shell.getenv("PATH"));
Shell.setenv("LD_LIBRARY_PATH", pathRepository + "/bin:" + pathSuper + ":" + Shell.getenv("LD_LIBRARY_PATH"));

Fabricare.processWorkspace();
