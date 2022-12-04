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

Project.library = Project.library.concat(Project.dependency);

// ---

var version = getVersion();

// ---

compileDll({
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

// ---

copyHeaderFilesIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.hpp", "output/include");
copyHeaderFilesIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.rh", "output/include");
var sourcePath = [].concat(Project.sourcePath);
copyFileIfExists("source/" + sourcePath[0] + ".hpp", "output/include/" + Shell.getFilePath(Project.sourcePath[0]));

// ---

var dependency = {};
dependency[Project.name] = {
	version : version[Project.name],
	"SPDX-License-Identifier" : Project["SPDX-License-Identifier"],
	library : Project.dependency
};

exitIf(!Shell.filePutContents("output/lib/" + Project.name + ".json", JSON.encodeWithIndentation(dependency)));
