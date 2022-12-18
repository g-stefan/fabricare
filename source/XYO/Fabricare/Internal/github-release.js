// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Project.githubRelease)) {
	if (!Project.githubRelease) {
		return;
	};
};

messageAction("github-release");

exitIf(!Shell.directoryExists("release"), "no release");

var versionInfo = getVersion();
var version = version[Project.name].version;
var releaseName = Project.name + "-" + version + "-" + Platform.name;

Console.writeLn("Release v" + version);

Shell.system("git pull --tags origin main");
if (!Shell.system("git rev-parse --quiet \"v%VERSION%\"")) {
	Console.writeLn("release v" + version + " already exists");
	return;
};
Shell.system("git tag -a v" + version + " -m \"v" + version + "\"");
Shell.system("git push --tags");
Console.writeLn("Create release v" + version);
Shell.system("github-release release --repo " + Project.name + " --tag v" + version + " --name \"v" + version + "\" --description \"Release\"");

var fileList = Shell.getFileList("release/*.7z");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --repo " + Project.name + " --tag v" + version + " --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};

var fileList = Shell.getFileList("release/*.json");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --repo " + Project.name + " --tag v" + version + " --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};
