// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.noInstall)) {
	if (Solution.noInstall) {
		return;
	};
};

// ---

messageAction("install-bin");

exitIf(!Shell.copyDirRecursively("output/bin", pathRepository + "/bin"));
