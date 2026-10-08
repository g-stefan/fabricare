// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("spdx");

// name : SPDX-License-Identifier, the projects first, then their dependencies
var spdx = {};

forEachProject("make", function() {
	if (Script.isNil(spdx[Project.name])) {
		spdx[Project.name] = Project["SPDX-License-Identifier"];
	};
});

forEachProject("make", function() {
	for (var dependency of getDependency()) {
		// Packages only, system libraries (no ":" prefix) have no descriptor
		if (dependency.substring(0, 1) != ":") {
			continue;
		};
		var name = projectNameFromDependency(dependency);
		if (!Script.isNil(spdx[name])) {
			continue;
		};
		spdx[name] = "LicenseRef-Unknown";
		var info = getDependencyOfProject(name);
		if (!Script.isNil(info[name])) {
			if (!Script.isNil(info[name]["SPDX-License-Identifier"])) {
				spdx[name] = info[name]["SPDX-License-Identifier"];
			};
		};
	};
});

Console.writeLn(JSON.encodeWithIndentation(spdx));
