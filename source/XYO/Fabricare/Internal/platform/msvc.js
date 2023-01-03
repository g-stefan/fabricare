// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
global.pathRepository = pathHome + "/SDK/"+Platform.name;
global.pathRelease = pathRepository + "/release";

Shell.setenv("PATH", pathRepository + "\\bin;" + Shell.getenv("PATH"));
Shell.setenv("INCLUDE", pathRepository + "\\include;" + Shell.getenv("INCLUDE"));
Shell.setenv("LIB", pathRepository + "\\lib;" + Shell.getenv("LIB"));

Fabricare.include("solution");
