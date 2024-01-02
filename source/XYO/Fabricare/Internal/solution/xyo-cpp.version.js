// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
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

	messageAction("version");

	var project = Project.name;

	if (!Script.isNil(Project.versionName)) {
		project = Project.versionName;
	};

	var sourceVersionPath = "source/";
	if (!Script.isNil(Project.sourcePath)) {
		// get first Project.sourcePath
		sourceVersionPath += ([].concat(Project.sourcePath))[0];
		sourceVersionPath += "/";
	};

	exitIf(xyoVersion("--project=" + project,
	                  "--bump-build",
	                  "--file-in=" + sourceVersionPath + "Version.Template.rh",
	                  "--file-out=" + sourceVersionPath + "Version.rh"));
});
