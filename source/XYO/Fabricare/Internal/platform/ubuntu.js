// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.pathHome = Shell.getenv("HOME");
global.pathRepository = pathHome + "/SDK";
global.pathRelease = pathRepository + "/release";

Shell.setenv("PATH", pathRepository + "/bin:" + Shell.getenv("PATH"));
Shell.setenv("LD_LIBRARY_PATH", pathRepository + "/bin:" + Shell.getenv("LD_LIBRARY_PATH"));

Fabricare.include("solution");
