// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("github-release-check");

var gitRepository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	gitRepository = Solution.githubRepository;
};

var version = getVersion();

Shell.system("github-release info --repo " + gitRepository + " --tag \"v" + version + "\"");
