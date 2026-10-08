// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("spdx");

// name : SPDX-License-Identifier of each project
var spdx = {};

forEachProject("make", function() {
	if (Script.isNil(spdx[Project.name])) {
		spdx[Project.name] = Project["SPDX-License-Identifier"];
	};
});

Console.writeLn(JSON.encodeWithIndentation(spdx));
