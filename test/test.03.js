// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Release names and the release-* actions that do not need 7-Zip or a server

var testName = "03";
Script.include("test/test.common.js");

writeJSON("version.json", {
	demo : { version : "1.2.3", build : "4", date : "2026-01-02", time : "03:04:05" }
});

var pathSeparator = "/";
if (OS.isWindows() && !OS.isMinGW()) {
	pathSeparator = "\\";
};

// --- release name

check("getReleasePrefix", getReleasePrefix(), "xyo.demo");
check("getReleaseName", getReleaseName(), "xyo.demo.v1.2.3.test-platform");
check("getReleaseName platform", getReleaseName("other"), "xyo.demo.v1.2.3.other");

Solution.releaseName = "demo-tools";
check("getReleasePrefix releaseName", getReleasePrefix(), "xyo.demo-tools");
Solution.releaseName = null;

Solution.releaseNoPlatform = true;
check("getReleaseName releaseNoPlatform", getReleaseName(), "xyo.demo.v1.2.3");
Solution.releaseNoPlatform = false;
check("getReleaseName releaseNoPlatform false", getReleaseName(), "xyo.demo.v1.2.3.test-platform");
Solution.releaseNoPlatform = null;

// --- release-version: the files the release action makes

Application.arguments = ["release-version", "--no-message", "--release-path=" + testPath, "--release-name=info"];
Script.include("fabricare://release-version.js");
var info = readJSON("info.xyo.demo.json");
checkTrue("release-version", !Script.isNil(info));
if (!Script.isNil(info)) {
	check("release-version version", info.version, "1.2.3");
	check("release-version list", info.release.join(","), "xyo.demo.v1.2.3.test-platform.bin.zip,xyo.demo.v1.2.3.test-platform.dev.zip");
};

Solution.releaseDev = false;
Script.include("fabricare://release-version.js");
info = readJSON("info.xyo.demo.json");
check("release-version no dev", info.release.join(","), "xyo.demo.v1.2.3.test-platform.bin.zip");

Solution.releaseOutput = true;
Script.include("fabricare://release-version.js");
info = readJSON("info.xyo.demo.json");
check("release-version output", info.release.join(","), "xyo.demo.v1.2.3.test-platform.zip");
Solution.releaseDev = null;
Solution.releaseOutput = null;

// --- release-exists, without --for-platform it uses the current platform

Shell.mkdirRecursivelyIfNotExists("release");
Shell.filePutContents("release/xyo.demo.v1.2.3.test-platform.bin.zip", "bin");
Application.arguments = ["release-exists", "--no-message"];
Script.include("fabricare://release-exists.js");
check("release-exists", releaseInfo.exists, true);
check("release-exists list", releaseInfo.release.join(","), "xyo.demo.v1.2.3.test-platform.bin.zip");

Application.arguments = ["release-exists", "--no-message", "--for-platform=other"];
Script.include("fabricare://release-exists.js");
check("release-exists other", releaseInfo.exists, false);

// --- release-install: copy the release files to pathRelease

Shell.filePutContents("release/xyo.demo.v1.2.3.test-platform.dev.zip", "dev");
writeJSON("release/xyo.demo.v1.2.3.sha512.json", {});
Application.arguments = ["release-install"];
Script.include("fabricare://release-install.js");
checkTrue("release-install bin", Shell.fileExists(pathRelease + "/xyo.demo.v1.2.3.test-platform.bin.zip"));
checkTrue("release-install dev", Shell.fileExists(pathRelease + "/xyo.demo.v1.2.3.test-platform.dev.zip"));
checkTrue("release-install sha512", Shell.fileExists(pathRelease + "/xyo.demo.v1.2.3.sha512.json"));

// --- release-remove: removes this platform's files and their checksums only

writeJSON("release/xyo.demo.v1.2.3.sha512.json", {
	"xyo.demo.v1.2.3.test-platform.bin.zip" : "1",
	"xyo.demo.v1.2.3.test-platform.dev.zip" : "2",
	"xyo.demo.v1.2.3.other.bin.zip" : "3"
});
Application.arguments = ["release-remove"];
Script.include("fabricare://release-remove.js");
check("release-remove bin", Shell.fileExists("release/xyo.demo.v1.2.3.test-platform.bin.zip"), false);
check("release-remove dev", Shell.fileExists("release/xyo.demo.v1.2.3.test-platform.dev.zip"), false);
var sha512 = readJSON("release/xyo.demo.v1.2.3.sha512.json");
checkTrue("release-remove sha512 kept", !Script.isNil(sha512));
if (!Script.isNil(sha512)) {
	check("release-remove sha512 bin", Script.isNil(sha512["xyo.demo.v1.2.3.test-platform.bin.zip"]), true);
	check("release-remove sha512 dev", Script.isNil(sha512["xyo.demo.v1.2.3.test-platform.dev.zip"]), true);
	check("release-remove sha512 other", sha512["xyo.demo.v1.2.3.other.bin.zip"], "3");
};

// The last entry removed, the checksum file goes too
Shell.filePutContents("release/xyo.demo.v1.2.3.test-platform.bin.zip", "bin");
writeJSON("release/xyo.demo.v1.2.3.sha512.json", {
	"xyo.demo.v1.2.3.test-platform.bin.zip" : "1"
});
Script.include("fabricare://release-remove.js");
check("release-remove sha512 empty", Shell.fileExists("release/xyo.demo.v1.2.3.sha512.json"), false);

testDone();
