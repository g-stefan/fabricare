// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("gitea-release-remove-all");

var gitRepository = Solution.name;
if (!Script.isNil(Solution.giteaRepository)) {
	gitRepository = Solution.giteaRepository;
};

var version = getVersion();

var releaseToDelete = csvDecode(ProcessInteractive.run("tea releases list --output csv --repo " + gitRepository));

if (releaseToDelete.length == 1) {
	Console.writeLn(releaseToDelete[0]);
};

for (i = 1; i < releaseToDelete.length; ++i) {
	if (releaseToDelete[i].length < 3) {
		continue;
	};
	Console.writeLn("Remove release " + releaseToDelete[i][0]);
	Shell.system("tea releases delete --confirm --delete-tag --repo " + gitRepository + " \"" + releaseToDelete[i][0] + "\"");
};

Shell.system("git fetch --prune --prune-tags");
