// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("temp");

// ---

if (Script.isNil(Project.defines)) {
	Project.defines = [];
};

if (Script.isNil(Project.dependency)) {
	Project.dependency = [];
};

if (Script.isNil(Project.library)) {
	Project.library = [];
};

if (Script.isNil(Project.includePath)) {
	Project.includePath = [];
};

// ---

var dependency = [];
for (var project of Project.dependency) {
	dependency[dependency.length] = project + ".static";
};

Project.dependency = dependency;

// ---

var version = getVersion();

// ---

compileExeStatic({
	project : Project.name,
	defines : Project.defines,
	includePath : Project.includePath.concat("source"),
	hppSource : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.hpp"),
	cppSource : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.cpp"),
	library : Project.library,
	resources : {
		"includePath" : [
			"source"
		],
		"rcSource" : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.rc")
	}
});
