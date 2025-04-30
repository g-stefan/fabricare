// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.hasRelease)) {
	if (!Solution.hasRelease) {
		return;
	};
};

// ---

messageAction("release-extract");

function commandFix(cmd) {
	if (Platform.name.indexOf("mingw") >= 0) {
		return "C:\\msys64\\usr\\bin\\sh -c \"" + cmd.replace("\"", "\\\"") + "\"";
	};
	return cmd;
};

var p7zipDecompress = "7z x -aoa";
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



var filenameBin = "release" + pathSeparator + releaseName + ".7z";
var filenameDev = "release" + pathSeparator + releaseName + "-dev.7z";

var outputPath = null;
var outputFile = null;

if (Shell.fileExists(filenameBin)) {
	outputPath = "output/bin";
	outputFile = filenameBin;
};

if (Shell.fileExists(filenameDev)) {
	outputPath = "output";
	outputFile = filenameDev;
};

if (!Script.isNil(Solution.releaseOutput)) {
	releaseOutput = Solution.releaseOutput;
};

if (releaseOutput) {
	outputPath = "output";
	outputFile = filenameBin;
};

if (Script.isNil(outputFile)) {
	exit(1, "Release not found for version " + version);
};

if (!Shell.fileExists(outputFile)) {
	exit(1, "Release not found for version " + version);
};

Shell.removeDirRecursively("output");
Shell.mkdirRecursivelyIfNotExists(outputPath);

exitIf(Shell.system(commandFix(p7zipDecompress + " -o" + outputPath + " " + outputFile)));
