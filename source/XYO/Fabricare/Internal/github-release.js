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

messageAction("github-release");

var repository = Project.name;
if (!Script.isNil(Project.githubRepository)) {
	repository = Project.githubRepository;
};

exitIf(!Shell.directoryExists("release"), "no release");

var version = getVersion();
var releaseName = repository + "-" + version + "-" + Platform.name;

Console.writeLn("Release v" + version);

Shell.system("git pull --tags origin main");
if (!Shell.system("git rev-parse --quiet \"v" + version + "\"")) {
	Console.writeLn("release v" + version + " already exists");
	return;
};
Shell.system("git tag -a \"v" + version + "\" -m \"v" + version + "\"");
Shell.system("git push --tags");
Console.writeLn("Create release v" + version);
Shell.system("github-release release --repo " + repository + " --tag \"v" + version + "\" --name \"v" + version + "\" --description \"Release\"");

// Wait a little for github to update release info
CurrentThread.sleep(1500);
Shell.system("github-release info --repo " + repository + " --tag \"v" + version + "\"");

var fileList = Shell.getFileList("release/*.7z");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};

var fileList = Shell.getFileList("release/*.json");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};
