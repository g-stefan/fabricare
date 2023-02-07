// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.pathHome = Shell.getenv("HOME");
global.pathRepository = pathHome + "/SDK/" + Platform.name;
global.pathRelease = pathRepository + "/release";

global.pathSuper = Application.getPathExecutable();

Shell.setenv("PATH", pathRepository + "\\bin;" + pathSuper + ";" + Shell.getenv("PATH"));
Shell.setenv("LD_LIBRARY_PATH", pathRepository + "/bin:" + pathSuper + ":" + Shell.getenv("LD_LIBRARY_PATH"));

Fabricare.include("solution");
