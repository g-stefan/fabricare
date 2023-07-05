// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("gitea-release");

var gitRepository = Solution.name;
if (!Script.isNil(Solution.giteaRepository)) {
	gitRepository = Solution.giteaRepository;
};

exitIf(!Shell.directoryExists("release"), "no release");

var version = getVersion();

var releasePrefix = Solution.name;
if (!Script.isNil(Solution.releaseName)) {
	releasePrefix = Solution.releaseName;
};
var pathSeparator = "/";
if (OS.isWindows()) {
	if (Platform.name.indexOf("mingw") >= 0) {
		pathSeparator = "/";
	} else {
		pathSeparator = "\\";
	};
};
var jsonFilename = "release" + pathSeparator + releasePrefix + "-" + version + ".sha512.json";

Console.writeLn("Release v" + version);

Shell.system("git pull --tags origin main");
if (Shell.system("git rev-parse --quiet \"v" + version + "\"")) {

	// Create release
	Shell.system("git tag -a \"v" + version + "\" -m \"v" + version + "\"");
	Shell.system("git push --tags");
	Console.writeLn("Create release v" + version);

	var assetsList = [];

	// On gitea upload source archive also
	var fileList = Shell.getFileList("archive/*-" + version + "*.7z");
	for (var file of fileList) {
		Console.writeLn("Add " + Shell.getFileName(file));
		assetsList.push(file);

		var json = {};
		var jsonFile = Shell.fileGetContents(jsonFilename);
		if (jsonFile) {
			json = JSON.decode(jsonFile);
			if (Script.isNil(json)) {
				json = {};
			};
		};
		json[Shell.getFileName(file)] = SHA512.fileHash(file);
		Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
	};

	var fileList = Shell.getFileList("release/*-" + version + "*.7z");
	for (var file of fileList) {
		Console.writeLn("Add " + Shell.getFileName(file));
		assetsList.push(file);
	};

	var fileList = Shell.getFileList("release/*-" + version + "*.exe");
	for (var file of fileList) {
		Console.writeLn("Add " + Shell.getFileName(file));
		assetsList.push(file);
	};

	var fileList = Shell.getFileList("release/*-" + version + "*.json");
	for (var file of fileList) {
		Console.writeLn("Add " + Shell.getFileName(file));
		assetsList.push(file);
	};

	var asset = "";
	for (var file of assetsList) {
		asset += " --asset \"" + file + "\"";
	};
	Shell.system("tea releases create --repo " + gitRepository + " --tag \"v" + version + "\" --title \"v" + version + "\" --note \"Release\" " + asset);

} else {
	if (!Application.hasFlag("replace")) {
		Console.writeLn("Release v" + version + " exists");
		return;
	};
};
