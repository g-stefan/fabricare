// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.hasRelease)) {
	if (!Solution.hasRelease) {
		return;
	};
};

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

var releasePrefix = Solution.name;
if (!Script.isNil(Solution.releaseName)) {
	releasePrefix = Solution.releaseName;
};

var releaseName = releasePrefix + "-" + version + "-" + Platform.name;
if (!Script.isNil(Solution.releaseNoPlatform)) {
	if (Solution.releaseNoPlatform) {
		releaseName = releasePrefix + "-" + version;
	};
};

var jsonFilename = "release" + pathSeparator + releasePrefix + "-" + version + ".sha512.json";
var releaseDev = true;
var releaseBin = true;
var releaseOutput = false;

if (!Script.isNil(Solution.releaseDev)) {
	releaseDev = Solution.releaseDev;
};
if (!Script.isNil(Solution.releaseBin)) {
	releaseBin = Solution.releaseBin;
};
if (!Script.isNil(Solution.releaseOutput)) {
	releaseOutput = Solution.releaseOutput;
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
			if (json.length) {
				Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
			} else {
				Shell.remove(jsonFilename);
			};
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
			if (json.length) {
				Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
			} else {
				Shell.remove(jsonFilename);
			};
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
			if (json.length) {
				Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
			} else {
				Shell.remove(jsonFilename);
			};
		};
	};
};
