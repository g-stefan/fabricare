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

compileLib({
	project : Project.name,
	defines : Project.defines,
	includePath : Project.includePath.concat("source"),
	hppSource : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.hpp"),
	cppSource : getFileListIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.cpp")
});

// ---

copyHeaderFilesIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.hpp", "output/include");
copyFileIfExists("source/" + Project.sourcePath + ".hpp", "output/include/" + Shell.getFilePath(Project.sourcePath));
copyHeaderFilesIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.rh", "output/include");

// ---

var library = [];
for (var lib of Project.dependency) {
	library[library.length] = lib + ".static";
};

var dependency = {};
dependency[Project.name + ".static"] = {
	version : version[Project.name],
	"SPDX-License-Identifier" : Project["SPDX-License-Identifier"],
	library : library
};

exitIf(!Shell.filePutContents("output/lib/" + Project.name + ".static.json", JSON.encodeWithIndentation(dependency)));
