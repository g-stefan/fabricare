// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (Script.isNil(Project.githubRelease)) {
	return;
};

if (!Project.githubRelease) {
	return;
};

messageAction("github-release-remove-all");

var repository = Project.name;
if (!Script.isNil(Project.githubRepository)) {
	repository = Project.githubRepository;
};

var version = getVersion();

Shell.system("github-release info --repo " + repository + " --tag \"v" + version + "\"");
var json = JSON.decode(Fabricare.runInteractive("github-release info --repo " + repository + " --json"));
if (Script.isNil(json)) {
	return;
};

var releaseToDelete = json["Releases"];

for (i = 0; i < releaseToDelete.length; ++i) {
	Console.writeLn("Remove release " + releaseToDelete[i]["tag_name"]);
	Shell.system("github-release delete --repo " + repository + " --tag \"" + releaseToDelete[i]["tag_name"] + "\"");
	Shell.system("git push --delete origin \"" + releaseToDelete[i]["tag_name"] + "\"");
};

Shell.system("git fetch --prune --prune-tags");
