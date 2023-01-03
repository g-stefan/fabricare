// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/xyo-cpp.library");

var folderName = Solution.name;

var buildPath = Shell.getenv("HOME") + "/SDK/" + Platform.next + "/source/" + folderName;

if (Fabricare.action == "clean") {
	Shell.system("rm -rf \"" + buildPath + "\"");
	return;
};

Shell.mkdirRecursivelyIfNotExists(buildPath);

if (Fabricare.action == "default") {
	var cmd = "C:\\msys64\\usr\\bin\\sh --login -c \"";
	cmd += "rsync --progress -avz --numeric-ids --delete-before --relative -LK ./ ";
	cmd += "\\\"$HOME/SDK/" + Platform.next + "/source/" + folderName + "\\\"\"";
	Shell.system(cmd);
};

var retV = 1;

runInPath(buildPath, function() {
	retV = Shell.system("fabricare " + Fabricare.action);
});

if (Fabricare.action == "release") {
	exitIf(!Shell.copyDirRecursively(buildPath + "/release", "release"));
};

exitIf(retV);
