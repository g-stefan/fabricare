// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
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

var releasePrefix = getReleasePrefix();
var releaseName = getReleaseName();

var jsonFilename = "release" + pathSeparator + releasePrefix + ".v" + getVersion() + ".sha512.json";
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

function releaseRemove(releaseFile) {
	if (Shell.fileExists("release" + pathSeparator + releaseFile)) {
		Shell.remove("release" + pathSeparator + releaseFile);
	};
	removeReleaseChecksum(jsonFilename, releaseFile);
};

if (releaseBin) {
	releaseRemove(releaseName + ".bin.zip");
};

if (releaseDev) {
	releaseRemove(releaseName + ".dev.zip");
};

if (releaseOutput) {
	releaseRemove(releaseName + ".zip");
};
