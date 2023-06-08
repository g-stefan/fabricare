// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

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
	CurrentThread.sleep(3000);
} else {
	if (!Application.hasFlag("replace")) {
		Console.writeLn("Release v" + version + " exists");
		return;
	};
};

var version = getVersion();

var json = JSON.decode(ProcessInteractive.run("github-release info --repo " + repository + " --tag \"v" + version + "\" --json"));
if (Script.isNil(json)) {
	Console.writeLn("Release not found for version " + version);
	return;
};

var fileList = Shell.getFileList("release/*-" + version + "*.7z");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --replace --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};

var fileList = Shell.getFileList("release/*-" + version + "*.exe");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --replace --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};

var fileList = Shell.getFileList("release/*-" + version + "*.json");
for (var file of fileList) {
	Console.writeLn("Upload " + Shell.getFileName(file));
	Shell.system("github-release upload --replace --repo " + repository + " --tag \"v" + version + "\" --name \"" + Shell.getFileName(file) + "\" --file \"" + file + "\"");
};
