// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

forEachProject(function() {
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

	// get first Project.sourcePath
	var sourcePath = ([].concat(Project.sourcePath))[0];

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

	messageAction("version-major ["+Project.name+"]");

	exitIf(xyoVersion("--project=" + project,
	                  "--bump-major",
	                  "--file-in=source/" + sourcePath + "/Version.Template.rh",
	                  "--file-out=source/" + sourcePath + "/Version.rh"));
});
