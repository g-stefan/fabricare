// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
global.pathRepository = pathHome + "/SDK/" + Platform.name;
global.pathRelease = pathRepository + "/release";

global.pathSuper = Application.getPathExecutable();

Shell.setenv("PATH", pathRepository + "\\bin;" + pathSuper + ";" + Shell.getenv("PATH"));
Shell.setenv("INCLUDE", pathRepository + "\\include;" + pathSuper + "\\..\\include;" + Shell.getenv("INCLUDE"));
Shell.setenv("LIB", pathRepository + "\\lib;" + pathSuper + "\\..\\lib;" + Shell.getenv("LIB"));

Fabricare.include("solution");
