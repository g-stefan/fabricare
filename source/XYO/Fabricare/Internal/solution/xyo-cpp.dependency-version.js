// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("dependency-version");

var path = Application.getFlagValue("dependency-path");
var name = Application.getFlagValue("dependency-name");

forEachProject("make", function() {
	var dependency = {
		name : name,
		project : Project.name,
		type : Project.type,
		make : Project.make,
		version : getProjectVersionAsInfo(),
		"SPDX-License-Identifier" : Project["SPDX-License-Identifier"],
		dependency : getDependencyVersion()
	};

	if (!Script.isNil(path)) {
		exitIf(!Shell.filePutContents(path + "/" + name + "." + Project.name + "." + Project.make + ".json", JSON.encodeWithIndentation(dependency)));
		return;
	};

	Console.writeLn(JSON.encodeWithIndentation(dependency));
});
