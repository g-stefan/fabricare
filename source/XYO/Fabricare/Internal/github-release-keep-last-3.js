// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (Script.isNil(Solution.hasGithub)) {
	return;
};

if (!Solution.hasGithub) {
	return;
};

messageAction("github-release-keep-last-3");

var repository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	repository = Solution.githubRepository;
};

var version = getVersion();

Shell.system("github-release info --repo " + repository + " --tag \"v" + version + "\"");
var json = JSON.decode(Fabricare.runInteractive("github-release info --repo " + repository + " --json"));
if (Script.isNil(json)) {
	return;
};

var releaseList = json["Releases"];
if (releaseList.length <= 3) {
	return;
};
var releaseToDelete = [];
var index;
var i;
for (i = 0, index = 3; index < releaseList.length; ++i, ++index) {
	releaseToDelete[i] = releaseList[index];
};

for (i = 0; i < releaseToDelete.length; ++i) {
	Console.writeLn("Remove release " + releaseToDelete[i]["tag_name"]);
	Shell.system("github-release delete --repo " + repository + " --tag \"" + releaseToDelete[i]["tag_name"] + "\"");
	Shell.system("git push --delete origin \"" + releaseToDelete[i]["tag_name"] + "\"");
};

Shell.system("git fetch --prune --prune-tags");
