// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("test");

Shell.mkdirRecursivelyIfNotExists("output/test");
Shell.mkdirRecursivelyIfNotExists("temp");

// Build
forEachProject("test", function() {
	if (Script.isNil(Project.make)) {
		messageError("No project.make defined!");
		exit(1);
	};

	if (Script.isNil(Project.sourcePath)) {
		Project.sourcePath = "@test";
	};

	if (Script.isNil(Project.sourcePrefix)) {
		Project.sourcePrefix = Project.name;
	};

	if (Script.isNil(Project.includePath)) {
		Project.includePath = [];
	};

	Project.includePath = Project.includePath.concat("source");
	Project.includePath = Project.includePath.concat("test");

	if (Script.isNil(Project.libraryPath)) {
		Project.libraryPath = [];
	};

	Project.libraryPath = Project.libraryPath.concat("output/lib");

	if (Script.isNil(Project.outputPath)) {
		Project.outputPath = "output/test";
	};

	if (!Fabricare.include("make." + Project.make)) {
		messageError("Don't know how to make '" + Project.make + "'!");
		exit(1);
	};
});

if (OS.isWindows()) {
	Shell.setenv("PATH", Shell.realPath(Shell.getcwd()) + "\\output\\bin;" + Shell.getenv("PATH"));
} else {
	Shell.setenv("PATH", Shell.realPath(Shell.getcwd()) + "/output/bin:" + Shell.getenv("PATH"));
};

// Run
forEachProject("test", function() {
	runInPath("output/test", function() {
		messageAction("run [" + Project.name + "]");
		exitIf(Shell.system(Project.name));
	});
});
