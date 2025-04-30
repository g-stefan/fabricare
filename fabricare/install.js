// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("install");

if (OS.isWindows()) {
	Console.writeLn("run build.cmd install");
};
if (OS.isLinux()) {
	Console.writeLn("run build.sh install");
};

Script.exit(0);
