// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.noInstall)) {
	if (Solution.noInstall) {
		return;
	};
};

// ---

messageAction("install");

exitIf(!Shell.copyDirRecursively("output/bin", pathRepository + "/bin"));
exitIf(!Shell.copyDirRecursively("output/include", pathRepository + "/include"));
exitIf(!Shell.copyDirRecursively("output/lib", pathRepository + "/lib"));
