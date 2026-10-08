// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.hasRelease)) {
	if (!Solution.hasRelease) {
		return;
	};
};

// ---

messageAction("release");

function commandFix(cmd) {
	if (Platform.name.indexOf("mingw") >= 0) {
		return "C:\\msys64\\usr\\bin\\sh -c \"" + cmd.replace("\"", "\\\"") + "\"";
	};
	return cmd;
};

var p7zipCompress = "7z a -mx9 -mmt4 -r- -w. -y -tzip";
var pathSeparator = "/";
if (OS.isWindows()) {
	if (Platform.name.indexOf("mingw") >= 0) {
		pathSeparator = "/";
	} else {
		p7zipCompress += " -sse";
		pathSeparator = "\\";
	};
};

var version = getVersion();

var releasePrefix = getReleasePrefix();
var releaseName = getReleaseName();
var jsonFilename = "release" + pathSeparator + releasePrefix + ".v" + version + ".sha512.json";
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

Shell.mkdirRecursivelyIfNotExists("release");

// Release bin
if (releaseBin) {
	if (!Shell.fileExists("release" + pathSeparator + releaseName + ".bin.zip")) {
		if (Shell.directoryExists("output/bin")) {
			if (!Shell.isEmptyDir("output/bin")) {
				runInPath("output/bin", function () {
					exitIf(Shell.system(commandFix(p7zipCompress + " \".." + pathSeparator + ".." + pathSeparator + "release" + pathSeparator + releaseName + ".bin.zip\" .")));
				});
			};
		};
		if (Shell.fileExists("release" + pathSeparator + releaseName + ".bin.zip")) {
			var json = {};
			var jsonFile = Shell.fileGetContents(jsonFilename);
			if (jsonFile) {
				json = JSON.decode(jsonFile);
				if (Script.isNil(json)) {
					json = {};
				};
			};
			json[releaseName + ".bin.zip"] = SHA512.fileHash("release" + pathSeparator + releaseName + ".bin.zip");
			Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		};
	};
};

// Release dev
if (releaseDev) {
	if (!Shell.fileExists("release" + pathSeparator + releaseName + ".dev.zip")) {		
		if (Shell.directoryExists("output")) {
			if (!Shell.isEmptyDir("output")) {
				runInPath("output", function () {
					exitIf(Shell.system(commandFix(p7zipCompress + " \".." + pathSeparator + "release" + pathSeparator + releaseName + ".dev.zip\" .")));
				});
			};
		};
		if (Shell.fileExists("release" + pathSeparator + releaseName + ".dev.zip")) {
			var json = {};
			var jsonFile = Shell.fileGetContents(jsonFilename);
			if (jsonFile) {
				json = JSON.decode(jsonFile);
				if (Script.isNil(json)) {
					json = {};
				};
			};
			json[releaseName + ".dev.zip"] = SHA512.fileHash("release" + pathSeparator + releaseName + ".dev.zip");
			Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		};
	};
};

// Release output
if (releaseOutput) {
	if (!Shell.fileExists("release" + pathSeparator + releaseName + ".zip")) {
		if (Shell.directoryExists("output")) {
			if (!Shell.isEmptyDir("output")) {
				runInPath("output", function () {
					exitIf(Shell.system(commandFix(p7zipCompress + " \".." + pathSeparator + "release" + pathSeparator + releaseName + ".zip\" .")));
				});
			};
		};
		if (Shell.fileExists("release" + pathSeparator + releaseName + ".zip")) {
			var json = {};
			var jsonFile = Shell.fileGetContents(jsonFilename);
			if (jsonFile) {
				json = JSON.decode(jsonFile);
				if (Script.isNil(json)) {
					json = {};
				};
			};
			json[releaseName + ".zip"] = SHA512.fileHash("release" + pathSeparator + releaseName + ".zip");
			Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		};
	};
};
