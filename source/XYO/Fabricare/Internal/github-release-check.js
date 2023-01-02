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

messageAction("github-release-check");

var repository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	repository = Solution.githubRepository;
};

var version = getVersion();

Shell.system("github-release info --repo " + repository + " --tag \"v" + version + "\"");
