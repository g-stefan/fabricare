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

messageAction("github-release");

var repository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	repository = Solution.githubRepository;
};

exitIf(!Shell.directoryExists("release"), "no release");

var version = getVersion();
var releaseName = repository + "-" + version + "-" + Platform.name;

Console.writeLn("Release v" + version);

Shell.system("git pull --tags origin main");
if (Shell.system("git rev-parse --quiet \"v" + version + "\"")) {

	// Create release
	Shell.system("git tag -a \"v" + version + "\" -m \"v" + version + "\"");
	Shell.system("git push --tags");
	Console.writeLn("Create release v" + version);
	Shell.system("github-release release --repo " + repository + " --tag \"v" + version + "\" --name \"v" + version + "\" --description \"Release\"");

	// Wait a little for github to update release info
	CurrentThread.sleep(1500);
	Shell.system("github-release info --repo " + repository + " --tag \"v" + version + "\"");

};

var version = getVersion();

var json = JSON.decode(Fabricare.runInteractive("github-release info --repo " + repository + " --tag \"v" + version + "\" --json"));
if (Script.isNil(json)) {
	Console.writeLn("Release not found for version " + version);
	return;
};

var releaseToCheck = json["Releases"];
var i, j;
var releaseList = {};

for (i = 0; i < releaseToCheck.length; ++i) {
	Console.writeLn("Check release " + releaseToCheck[i]["tag_name"]);
	for (j = 0; j < releaseToCheck[i].assets.length; ++j) {
		Console.writeLn("\t- " + releaseToCheck[i].assets[j].name);
		if (Shell.fileExists("release/" + releaseToCheck[i].assets[j].name)) {
			releaseList["release/" + releaseToCheck[i].assets[j].name] = true;
		};
	};
};


var fileList = Shell.getFileList("release/*-" + version + "*.7z");
for (var file of fileList) {
	if(Script.isNil(releaseList[file])) {
		Console.writeLn("Upload " + Shell.getFileName(file));
		Shell.system("github-release upload --replace --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
	};
};

var fileList = Shell.getFileList("release/*-" + version + "*.json");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --replace --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};

