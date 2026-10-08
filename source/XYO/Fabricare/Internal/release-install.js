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

messageAction("release-install");

var pathSeparator = "/";
if (OS.isWindows()) {
	if (Platform.name.indexOf("mingw") >= 0) {
		pathSeparator = "/";
	} else {
		pathSeparator = "\\";
	};
};

var version = getVersion();

var releasePrefix = getReleasePrefix();
var releaseName = getReleaseName();


var jsonFilename = "release" + pathSeparator + releasePrefix + ".v" + version + ".sha512.json";


Shell.mkdirRecursivelyIfNotExists(global.pathRelease);

copyFileIfExists("release" + pathSeparator + releaseName + ".zip", global.pathRelease);
copyFileIfExists("release" + pathSeparator + releaseName + ".bin.zip", global.pathRelease);
copyFileIfExists("release" + pathSeparator + releaseName + ".dev.zip", global.pathRelease);
copyFileIfExists(jsonFilename, global.pathRelease);
