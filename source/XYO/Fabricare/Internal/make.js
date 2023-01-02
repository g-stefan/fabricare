// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

forEachProject(function() {
	if (Script.isNil(Project.make)) {
		messageError("No project.make defined!");
		exit(1);
	};

	if (!Fabricare.include("make." + Project.make)) {
		messageError("Don't know how to make '" + Project.make + "'!");
		exit(1);
	};
});
