// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("gitea-release-remove-all");

var repository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	repository = Solution.githubRepository;
};

var version = getVersion();

var releaseToDelete = csvDecode(ProcessInteractive.run("tea releases list --output csv --repo " + repository));

for (i = 1; i < releaseToDelete.length; ++i) {
	if (releaseToDelete[i].length < 3) {
		continue;
	};
	Console.writeLn("Remove release " + releaseToDelete[i][0]);
	Shell.system("tea releases delete --confirm --delete-tag --repo " + repository + " \"" + releaseToDelete[i][0] + "\"");
};

Shell.system("git fetch --prune --prune-tags");
