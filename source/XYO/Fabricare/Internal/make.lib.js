// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.lib");

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

var version = getVersionInfo();

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
copyHeaderFilesIgnoreSpecialsSourcePath("source", Project.sourcePath, "*.rh", "output/include");
var sourcePath = [].concat(Project.sourcePath);
copyFileIfExists("source/" + sourcePath[0] + ".hpp", "output/include/" + Shell.getFilePath(sourcePath[0]));

// ---

var library = [];
for (var lib of Project.dependency) {
	library[library.length] = lib + ".static";
};
for (var lib of Project.library) {
	library[library.length] = lib;
};
var property = "osUnknown";
if (OS.isWindows()) {
	property = "osWindows";
};
if (OS.isLinux()) {
	property = "osLinux";
};
if (!Script.isNil(Project[property])) {
	if (!Script.isNil(Project[property].dependency)) {
		for (var lib of Project[property].dependency) {
			library[library.length] = lib + ".static";
		};
	};
	if (!Script.isNil(Project[property].library)) {
		for (var lib of Project[property].library) {
			library[library.length] = lib;
		};
	};
};

// ---

var dependency = {};
dependency[Project.name + ".static"] = {
	version : version[Project.name],
	"SPDX-License-Identifier" : Project["SPDX-License-Identifier"],
	library : library,
	dependency : getDependencyVersion()
};

exitIf(!Shell.filePutContents("output/lib/" + Project.name + ".static.json", JSON.encodeWithIndentation(dependency)));
