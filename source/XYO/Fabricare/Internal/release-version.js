// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("release-version");

var path = Application.getFlagValue("release-path");
var name = Application.getFlagValue("release-name");

var version = getVersion();

var releaseDev = true;
var releaseOutput = false;
if (!Script.isNil(Project.releaseDev)) {
	releaseDev = Project.releaseDev;
};
if (!Script.isNil(Project.releaseOutput)) {
	releaseOutput = Project.releaseOutput;	
};
if(releaseOutput){
	releaseDev = false;
};

var releaseName = Project.name + "-" + version + "-" + Platform.name;
var releaseList = [];

releaseList.push(releaseName+".7zip");
if(releaseDev) {
	releaseList.push(releaseName+"-dev.7zip");
};

var release = {
	name : name,
	project : Project.name,
	version : version,
	release : releaseList
};

if (!Script.isNil(path)) {
	exitIf(!Shell.filePutContents(path + "/" + name + "." + Project.name + ".json", JSON.encodeWithIndentation(release)));
	return;
};

Console.writeLn(JSON.encodeWithIndentation(release));
