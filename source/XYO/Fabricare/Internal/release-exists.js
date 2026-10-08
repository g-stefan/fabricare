// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

var noMessage = Application.hasFlag("no-message");
if (!noMessage) {
	messageAction("release-exists");
};

var separateData = "@DATA:";
var hasSeparateData = Application.hasFlag("separate-data");
if (hasSeparateData) {
	separateData = Application.getFlagValue("separate-data", separateData);
};

var releaseInfo = {
	"exists": false,
	"release": []
};

if (!Script.isNil(Solution.hasRelease)) {
	if (!Solution.hasRelease) {
		Console.writeLn(JSON.encodeWithIndentation(releaseInfo));
		return;
	};
};

var pathSeparator = "/";
if (OS.isWindows()) {
	if (Platform.name.indexOf("mingw") >= 0) {
		pathSeparator = "/";
	} else {
		pathSeparator = "\\";
	};
};

// The release of a platform that builds on another one is named after that one
var platformName = Application.getFlagValue("for-platform", Platform.name);

if (platformName.indexOf("msys2-") == 0) {
	platformName = platformName.substring(6);
} else if (platformName.indexOf("sys-") == 0) {
	platformName = platformName.substring(4);
} else if (platformName.indexOf("wsl-") == 0) {
	platformName = platformName.substring(4);
};

var releaseName = getReleaseName(platformName);

if (Shell.fileExists("release" + pathSeparator + releaseName + ".bin.zip")) {
	releaseInfo.exists = true;
	releaseInfo.release.push(releaseName + ".bin.zip");
};

if (Shell.fileExists("release" + pathSeparator + releaseName + ".dev.zip")) {
	releaseInfo.exists = true;
	releaseInfo.release.push(releaseName + ".dev.zip");
};

if (Shell.fileExists("release" + pathSeparator + releaseName + ".zip")) {
	releaseInfo.exists = true;
	releaseInfo.release.push(releaseName + ".zip");
};

if (hasSeparateData) {
	Console.writeLn(separateData);
};

Console.writeLn(JSON.encodeWithIndentation(releaseInfo));
