// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.noInstall)) {
	if (Solution.noInstall) {
		return;
	};
};

// ---

messageAction("install-bin");

exitIf(!Shell.copyDirRecursively("output/bin", pathRepository + "/bin"));
