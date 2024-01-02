// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.dll.static");

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

if (Script.isNil(Project.sourcePrefix)) {
	Project.sourcePrefix = "";
};

if (Script.isNil(Project.libraryPath)) {
	Project.libraryPath = [];
};

// ---

var dependency = [];
for (var project of Project.dependency) {
	dependency[dependency.length] = project + ".static";
};

Project.dependency = dependency;

// ---

compileDllStatic({
	project : Project.name,
	defines : Project.defines,
	includePath : Project.includePath.concat("source"),
	hppSource : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, Project.sourcePrefix + "*.hpp"),
	cppSource : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, Project.sourcePrefix + "*.cpp"),
	libraryPath : Project.libraryPath,
	resources : {
		"includePath" : [
			"source"
		],
		"rcSource" : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, Project.sourcePrefix + "*.rc")
	}
});
