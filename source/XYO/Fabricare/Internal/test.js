// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("test");

Shell.mkdirRecursivelyIfNotExists("output/test");
Shell.mkdirRecursivelyIfNotExists("temp");

forEachProject(function() {
	// ---

	if (Script.isNil(Project.includePath)) {
		Project.includePath = [];
	};

	// ---

	for (var testSource of Project.testSource) {
		compileAndRunTest({
			project : testSource,
			includePath : Project.includePath.concat("source"),
			cppSource : [ "test/" + testSource + ".cpp" ],
			libraryPath : [ "output/lib" ],
			library : [ Project.name ]
		});
	};
});
