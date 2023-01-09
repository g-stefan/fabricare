// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
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
var releaseOutput = false;
if (!Script.isNil(Solution.releaseDev)) {
	releaseDev = Solution.releaseDev;
};
if (!Script.isNil(Solution.releaseOutput)) {
	releaseOutput = Solution.releaseOutput;
};
if (releaseOutput) {
	releaseDev = false;
};

var releasePrefix = Solution.name;
if (!Script.isNil(Solution.releaseName)) {
	releasePrefix = Solution.releaseName;
};

var releaseName = releasePrefix + "-" + version + "-" + Platform.name;
var releaseList = [];

releaseList.push(releaseName + ".7z");
if (releaseDev) {
	releaseList.push(releaseName + "-dev.7z");
};

var release = {
	name : name,
	project : Solution.name,
	version : version,
	release : releaseList
};

if (!Script.isNil(path)) {
	exitIf(!Shell.filePutContents(path + "/" + name + "." + Solution.name + ".json", JSON.encodeWithIndentation(release)));
	return;
};

Console.writeLn(JSON.encodeWithIndentation(release));
