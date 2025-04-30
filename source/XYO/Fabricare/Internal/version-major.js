// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

forEachProject("make", function() {
	if (!Script.isNil(Project.noVersion)) {
		if (Project.noVersion) {
			return;
		};
	};

	if (!Script.isNil(Project.linkVersion)) {
		return;
	};

	// ---

	var project = Project.name;

	if (!Script.isNil(Project.versionName)) {
		project = Project.versionName;
	};

	messageAction("version-major");

	exitIf(xyoVersion("--project=" + project,
	                  "--bump-major"));
});
