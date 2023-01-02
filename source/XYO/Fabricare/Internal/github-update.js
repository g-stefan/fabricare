// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (Script.isNil(Solution.hasGithub)) {
	return;
};

if (!Solution.hasGithub) {
	return;
};

messageAction("github-update");

Shell.system("git fetch --prune --prune-tags");
Shell.system("git add --all");
Shell.system("git commit -m \"Update\"");
Shell.system("git push");
