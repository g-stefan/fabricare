// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("analyze");

if (OS.isWindows()) {

	if (OS.isMinGW()) {
		exitIf(Shell.system("scan-build fabricare make"));
		return;
	};

	Shell.setenv("CXX", "cl /analyze /analyze:stacksize 65536 /analyze:max_paths 1024");
	Fabricare.include("make");
	return;
};

if (OS.isLinux()) {
	exitIf(Shell.system("scan-build fabricare make"));
	return;
};
