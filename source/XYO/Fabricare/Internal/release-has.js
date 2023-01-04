// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

var noMessage = Application.hasFlag("no-message");
if (!noMessage) {
	messageAction("release-has");
};

var releaseInfo = {
	"hasRelease" : false,
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

var releaseName = releasePrefix + "-" + version + "-" + Platform.name;

if (Shell.fileExists("release" + pathSeparator + releaseName + ".7z")) {
	releaseInfo.hasRelease = true;
	releaseInfo.release.push(releaseName + ".7z");
};

if (Shell.fileExists("release" + pathSeparator + releaseName + "-dev.7z")) {
	releaseInfo.hasRelease = true;
	releaseInfo.release.push(releaseName + "-dev.7z");
};

Console.writeLn(JSON.encodeWithIndentation(releaseInfo));
