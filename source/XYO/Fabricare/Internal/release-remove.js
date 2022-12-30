// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("release-remove");

var pathSeparator = "/";
if (OS.isWindows()) {
	if (Platform.name.indexOf("mingw") >= 0) {
		pathSeparator = "/";
	} else {
		pathSeparator = "\\";
	};
};

var version = getVersion();

var releaseName = Project.name + "-" + version + "-" + Platform.name;
var jsonFilename = "release" + pathSeparator + Project.name + "-" + version + ".sha512.json";
var releaseDev = true;
var releaseBin = true;
var releaseOutput = false;

if (!Script.isNil(Project.releaseDev)) {
	releaseDev = Project.releaseDev;
};
if (!Script.isNil(Project.releaseBin)) {
	releaseBin = Project.releaseBin;
};
if (!Script.isNil(Project.releaseOutput)) {
	releaseOutput = Project.releaseOutput;
};

if (releaseOutput) {
	releaseDev = false;
	releaseBin = false;
};

// Release bin
if (releaseBin) {
	if (Shell.fileExists("release" + pathSeparator + releaseName + ".7z")) {
		Shell.remove("release" + pathSeparator + releaseName + ".7z");
	};
	if (Shell.fileExists(jsonFilename)) {
		var json = {};
		var jsonFile = Shell.fileGetContents(jsonFilename);
		if (jsonFile) {
			json = JSON.decode(jsonFile);
			if (Script.isNil(json)) {
				json = {};
			};
		};
		if (!Script.isNil(json[releaseName + ".7z"])) {
			delete json[releaseName + ".7z"];
			Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		};
	};
};

// Release dev
if (releaseDev) {
	if (Shell.fileExists("release" + pathSeparator + releaseName + "-dev.7z")) {
		Shell.remove("release" + pathSeparator + releaseName + "-dev.7z");
	};
	if (Shell.fileExists(jsonFilename)) {
		var json = {};
		var jsonFile = Shell.fileGetContents(jsonFilename);
		if (jsonFile) {
			json = JSON.decode(jsonFile);
			if (Script.isNil(json)) {
				json = {};
			};
		};
		if (!Script.isNil(json[releaseName + "-dev.7z"])) {
			delete json[releaseName + "-dev.7z"];
			Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		};
	};
};

// Release output
if (releaseOutput) {
	if (Shell.fileExists("release" + pathSeparator + releaseName + ".7z")) {
		Shell.remove("release" + pathSeparator + releaseName + ".7z");
	};
	if (Shell.fileExists(jsonFilename)) {
		var json = {};
		var jsonFile = Shell.fileGetContents(jsonFilename);
		if (jsonFile) {
			json = JSON.decode(jsonFile);
			if (Script.isNil(json)) {
				json = {};
			};
		};
		if (!Script.isNil(json[releaseName + ".7z"])) {
			delete json[releaseName + ".7z"];
			Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		};
	};
};
