// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("release");

function commandFix(cmd) {
	if (Platform.name.indexOf("mingw") >= 0) {
		return "C:\\msys64\\usr\\bin\\sh -c \"" + cmd.replace("\"", "\\\"") + "\"";
	};
	return cmd;
};

var p7zipCompress = "7z a -mx9 -mmt4 -r- -w. -y -t7z";
var pathSeparator = "/";
if (OS.isWindows()) {
	if (Platform.name.indexOf("mingw") >= 0) {
		pathSeparator = "/";
	} else {
		p7zipCompress += " -sse";
		pathSeparator = "\\";
	};
};

var version = Project.version;
if(Script.isNil(version)){
	var versionInfo = getVersion();
	version = version[Project.name].version;
};

var releaseName = Project.name + "-" + version + "-" + Platform.name;
var jsonFilename = "release" + pathSeparator + Project.name + "-" + version + ".sha512.json";
var releaseDev = true;
var releaseBin = true;

if (!Script.isNil(Project.releaseDev)) {
	releaseDev = Project.releaseDev;
};
if (!Script.isNil(Project.releaseBin)) {
	releaseBin = Project.releaseBin;
};

Shell.mkdirRecursivelyIfNotExists("release");

// Release bin
if (releaseBin) {
	if (Shell.fileExists("release" + pathSeparator + releaseName + ".7z")) {
		Shell.removeFile("release" + pathSeparator + releaseName + ".7z");
	};
	if (Shell.directoryExists("output/bin")) {
		runInPath("output/bin", function() {
			exitIf(Shell.system(commandFix(p7zipCompress + " \".." + pathSeparator + ".." + pathSeparator + "release" + pathSeparator + releaseName + ".7z\" .")));
		});
	};
	if (Shell.fileExists("release" + pathSeparator + releaseName + ".7z")) {
		var json = {};
		var jsonFile = Shell.fileGetContents(jsonFilename);
		if (jsonFile) {
			json = JSON.decode(jsonFile);
			if (Script.isNil(json)) {
				json = {};
			};
		};
		json[releaseName + ".7z"] = SHA512.fileHash("release" + pathSeparator + releaseName + ".7z");
		Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
	};
};

// Release dev
if (releaseDev) {
	if (Shell.fileExists("release" + pathSeparator + releaseName + "-dev.7z")) {
		Shell.removeFile("release" + pathSeparator + releaseName + "-dev.7z");
	};
	if (Shell.directoryExists("output")) {
		runInPath("output", function() {
			exitIf(Shell.system(commandFix(p7zipCompress + " \".." + pathSeparator + "release" + pathSeparator + releaseName + "-dev.7z\" .")));
		});
	};
	if (Shell.fileExists("release" + pathSeparator + releaseName + "-dev.7z")) {
		var json = {};
		var jsonFile = Shell.fileGetContents(jsonFilename);
		if (jsonFile) {
			json = JSON.decode(jsonFile);
			if (Script.isNil(json)) {
				json = {};
			};
		};
		json[releaseName + "-dev.7z"] = SHA512.fileHash("release" + pathSeparator + releaseName + "-dev.7z");
		Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
	};
};

// Copy to local release repository
copyFileIfExists("release" + pathSeparator + releaseName + ".7z",global.pathRelease);
copyFileIfExists("release" + pathSeparator + releaseName + "-dev.7z",global.pathRelease);
copyFileIfExists(jsonFilename,global.pathRelease);
