// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
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


Shell.mkdirRecursivelyIfNotExists(global.pathRelease);

copyFileIfExists("release" + pathSeparator + releaseName + ".7z", global.pathRelease);
copyFileIfExists("release" + pathSeparator + releaseName + "-dev.7z", global.pathRelease);
copyFileIfExists(jsonFilename, global.pathRelease);
