// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (OS.isWindows()) {
	messageError("run build.cmd install");
};
if (OS.isLinux()) {
	messageError("run build.sh install");
};

Script.exit(1);
