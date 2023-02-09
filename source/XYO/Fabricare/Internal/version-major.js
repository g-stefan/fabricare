// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
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

	var sourceVersionPath = "source/";
	if (!Script.isNil(Project.sourcePath)) {
		// get first Project.sourcePath
		sourceVersionPath += ([].concat(Project.sourcePath))[0];
		sourceVersionPath += "/";
	};

	var dependencyProject = Application.getFlagValue("dependency-project");
	var dependencyMake = Application.getFlagValue("dependency-make");

	if (!Script.isNil(dependencyProject)) {
		if (Project.name != dependencyProject) {
			return;
		};
	};

	if (!Script.isNil(dependencyMake)) {
		if (Project.make != dependencyMake) {
			return;
		};
	};

	messageAction("version-major [" + Project.name + "]");

	exitIf(xyoVersion("--project=" + project,
	                  "--bump-major",
	                  "--file-in=" + sourceVersionPath + "Version.Template.rh",
	                  "--file-out=" + sourceVersionPath + "Version.rh"));
});
