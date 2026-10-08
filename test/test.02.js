// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// xyo-cpp dependencies: descriptors, link order, defines, versions

var testName = "02";
Script.include("test/test.common.js");
Script.include("fabricare://solution/xyo-cpp.library.js");

// Library descriptors, as make.lib / make.dll write them:
//     app -> a, b
//     a   -> c, a-system (a system library, no descriptor)
//     b   -> c
//     c

writeJSON("output/lib/a.json", {
	a : {
		version : { version : "1.0.0" },
		library : [":c", "a-system"],
		defines : ["A_DEFINE", "SHARED_DEFINE"]
	}
});
writeJSON("output/lib/b.json", {
	b : {
		version : { version : "2.0.0" },
		library : [":c"],
		defines : []
	}
});
// c is found in the repository, not in output/lib
writeJSON(pathRepository + "/lib/c.json", {
	c : {
		version : { version : "3.0.0" },
		library : [],
		defines : ["C_DEFINE", "SHARED_DEFINE"]
	}
});

projectSet({
	name : "app",
	make : "exe",
	dependency : ["a", "b"]
});

// Direct dependencies first, then the libraries they need, the most used last
var dependency = getDependency();
check("getDependency", dependency.join(","), ":a,:b,a-system,:c");

// The defines of all the dependencies, each once
var compileProject = {
	project : "app",
	defines : ["APP_DEFINE"]
};
compileProjectDependencyToDefines(compileProject);
var defines = compileProject.defines.sort();
check("defines", defines.join(","), "APP_DEFINE,A_DEFINE,C_DEFINE,SHARED_DEFINE");

compileProjectDependencyToLibrary(compileProject);
check("library", compileProject.library.join(","), ":a,:b,a-system,:c");

var version = getDependencyVersion();
check("version a", version.a, "1.0.0");
check("version b", version.b, "2.0.0");
check("version c", version.c, "3.0.0");
check("version a-system", Script.isNil(version["a-system"]), true);

// Operating system specific dependencies
var osProperty = "osLinux";
if (OS.isWindows() && !OS.isMinGW()) {
	osProperty = "osWindows";
};
var project = {
	name : "app",
	make : "exe",
	dependency : ["b"]
};
project[osProperty] = {
	library : ["os-library"]
};
projectSet(project);
check("getDependency os", getDependency().join(","), ":b,os-library,:c");

// A descriptor from pathSuper/../lib is used before the repository and output/lib
writeJSON(pathSuper + "/../lib/b.json", {
	b : {
		version : { version : "2.1.0" },
		library : []
	}
});
projectSet({
	name : "app",
	make : "exe",
	dependency : ["b"]
});
check("getDependency super", getDependency().join(","), ":b");
check("version super", getDependencyVersion().b, "2.1.0");

testDone();
