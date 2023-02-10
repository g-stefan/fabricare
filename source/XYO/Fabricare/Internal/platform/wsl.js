// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/xyo-cpp.library");

var folderName = Solution.name;

var buildPath = Shell.getenv("HOME") + "/SDK/source/" + folderName;

if (Fabricare.action == "clean") {
	Shell.system("rm -rf \"" + buildPath + "\"");
	return;
};

Shell.mkdirRecursivelyIfNotExists(buildPath);

if ((Fabricare.action == "default")||(Fabricare.action == "sync")) {
	Shell.system("rsync --progress -avz --numeric-ids --delete-before --relative -LK ./ \"" + buildPath + "\"");
	if(Fabricare.action == "sync") {
		return;
	};
};

var retV = 1;

runInPath(buildPath, function() {
	Shell.system("chmod -R -x+X source");
	if (Shell.directoryExists("vendor")) {
		Shell.system("chmod -R -x+X vendor");
	};
	retV = Shell.system("fabricare " + Fabricare.action);
});

if (Fabricare.action == "release") {
	exitIf(!Shell.copyDirRecursively(buildPath + "/release", "release"));
};

exitIf(retV);
