// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Solution helpers: projects, versions, include precedence, user config

var testName = "01";
Script.include("test/test.common.js");

// --- prepareProjects: a project with a list of names becomes one project per name

Solution.name = "demo";
Solution.projects = [
	{ name : "demo", make : "lib" },
	{ name : ["test.01", "test.02"], make : "exe", category : "test" }
];
prepareProjects();
check("prepareProjects length", Solution.projects.length, 3);
check("prepareProjects name 1", Solution.projects[1].name, "test.01");
check("prepareProjects name 2", Solution.projects[2].name, "test.02");
check("prepareProjects copy make", Solution.projects[2].make, "exe");

// --- forEachProject: by category, "make" when not set

var names = [];
forEachProject("make", function() {
	names.push(Project.name);
});
check("forEachProject make", names.join(","), "demo");
check("forEachProject default category", Solution.projects[0].category, "make");

names = [];
forEachProject("test", function() {
	names.push(Project.name);
});
check("forEachProject test", names.join(","), "test.01,test.02");

// --- selectMainProject: the project with the solution name

selectMainProject();
check("selectMainProject", Project.name, "demo");

// --- versions from version.json

writeJSON("version.json", {
	demo : { version : "1.2.3", build : "4", date : "2026-01-02", time : "03:04:05" },
	other : { version : "9.8.7", build : "1", date : "2026-01-02", time : "03:04:05" }
});
check("getVersion", getVersion(), "1.2.3");
check("getVersionInfo build", getVersionInfo().build, "4");

Solution.versionName = "other";
check("getVersion versionName", getVersion(), "9.8.7");
Solution.versionName = null;

Solution.version = "5.0.0";
check("getVersion solution", getVersion(), "5.0.0");
Solution.version = null;

projectSet({ name : "other" });
check("getProjectVersion", getProjectVersion(), "9.8.7");
projectSet({ name : "other", version : "2.0.0" });
check("getProjectVersion project", getProjectVersion(), "2.0.0");
check("getProjectVersionAsInfo", getProjectVersionAsInfo().version, "2.0.0");

// --- Fabricare.include: local solution script, then local script, then internal

Shell.mkdirRecursivelyIfNotExists("fabricare/solution");
Shell.filePutContents("fabricare/probe.js", "global.probe = \"local\";");
Shell.filePutContents("fabricare/solution/xyo-cpp.probe.js", "global.probe = \"local-solution\";");

global.probe = "";
checkTrue("include local", Fabricare.include("probe"));
check("include solution first", global.probe, "local-solution");

Shell.remove("fabricare/solution/xyo-cpp.probe.js");
global.probe = "";
checkTrue("include local 2", Fabricare.include("probe"));
check("include local script", global.probe, "local");

check("include missing", Fabricare.include("no-such-action"), false);

// make.config is internal (fabricare://make.config.js), it does nothing
checkTrue("include internal", Fabricare.include("make.config"));

// --- user config: <home>/.fabricare.json

var pathHome = testPath + "/home";
Shell.mkdirRecursivelyIfNotExists(pathHome);
writeJSON(pathHome + "/.fabricare.json", { value : "user" });
if (OS.isWindows() && !OS.isMinGW()) {
	Shell.setenv("HOMEDRIVE", pathHome.substring(0, 2));
	Shell.setenv("HOMEPATH", pathHome.substring(2));
} else {
	Shell.setenv("HOME", pathHome);
};

checkTrue("loadUserConfig", Fabricare.loadUserConfig());
check("loadUserConfig file", Fabricare.userConfigFile, pathHome + "/.fabricare.json");
check("loadUserConfig value", UserConfig.value, "user");

// --- debug / static from the environment

Shell.setenv("XYO_PLATFORM_COMPILE_DEBUG", "ON");
checkTrue("isDebug env", Fabricare.isDebug());
Shell.setenv("XYO_PLATFORM_COMPILE_DEBUG", "OFF");
check("isDebug env off", Fabricare.isDebug(), false);

Shell.setenv("XYO_PLATFORM_COMPILE_STATIC", "1");
checkTrue("isStatic env", Fabricare.isStatic());
Shell.setenv("XYO_PLATFORM_COMPILE_STATIC", "0");
checkTrue("isDynamic env", Fabricare.isDynamic());

testDone();
