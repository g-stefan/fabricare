// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.pathHome = Shell.getenv("HOME");
global.pathRepository = pathHome + "/SDK/" + Platform.name;
global.pathRelease = pathRepository + "/release";

Shell.setenv("PATH", pathRepository + "\\bin;" + Shell.getenv("PATH"));
Shell.setenv("LD_LIBRARY_PATH", pathRepository + "\\bin;" + Shell.getenv("LD_LIBRARY_PATH"));

messageAction();

if (Fabricare.include("ubuntu." + Fabricare.action)) {
	return;
};

messageError("Action ubuntu." + Fabricare.action + " not found!");
