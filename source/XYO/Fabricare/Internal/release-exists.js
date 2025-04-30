// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
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
	"exists" : false,
	"release" : []
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

var version = getVersion();

var releasePrefix = Solution.name;
if (!Script.isNil(Solution.releaseName)) {
	releasePrefix = Solution.releaseName;
};

var platformName = Application.getFlagValue("for-platform", platformName);

if (platformName.indexOf("sys-") >= 0) {
	platformName = platformName.substring(4);
} else if (platformName.indexOf("wsl-") >= 0) {
	platformName = platformName.substring(4);
};

var releaseName = releasePrefix + "-" + version + "-" + platformName;
if (!Script.isNil(Solution.releaseNoPlatform)) {
	if (Solution.releaseNoPlatform) {
		releaseName = releasePrefix + "-" + version;
	};
};


if (Shell.fileExists("release" + pathSeparator + releaseName + ".7z")) {
	releaseInfo.exists = true;
	releaseInfo.release.push(releaseName + ".7z");
};

if (Shell.fileExists("release" + pathSeparator + releaseName + "-dev.7z")) {
	releaseInfo.exists = true;
	releaseInfo.release.push(releaseName + "-dev.7z");
};

if (hasSeparateData) {
	Console.writeLn(separateData);
};

Console.writeLn(JSON.encodeWithIndentation(releaseInfo));
