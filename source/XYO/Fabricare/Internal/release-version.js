// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Solution.hasRelease)) {
	if (!Solution.hasRelease) {
		return;
	};
};

var noMessage = Application.hasFlag("no-message");
if (!noMessage) {
	messageAction("release-version");
};

var path = Application.getFlagValue("release-path");
var name = Application.getFlagValue("release-name");

var version = getVersion();

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

var releaseName = getReleaseName();

var releaseList = [];

if (releaseBin) {
	releaseList.push(releaseName + ".bin.zip");
};
if (releaseOutput) {
	releaseList.push(releaseName + ".zip");
};
if (releaseDev) {
	releaseList.push(releaseName + ".dev.zip");
};

var release = {
	name: name,
	project: Solution.namespace + "." + Solution.name,
	version: version,
	release: releaseList
};

if (!Script.isNil(path)) {
	exitIf(!Shell.filePutContents(path + "/" + name + "." + Solution.namespace + "." + Solution.name + ".json", JSON.encodeWithIndentation(release)));
	return;
};

Console.writeLn(JSON.encodeWithIndentation(release));
