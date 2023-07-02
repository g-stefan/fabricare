// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Script.requireExtension("Console");
Script.requireExtension("Application");
Script.requireExtension("Buffer");
Script.requireExtension("DateTime");
Script.requireExtension("JSON");
Script.requireExtension("Shell");
Script.requireExtension("ShellFind");
Script.requireExtension("Math");
Script.requireExtension("ProcessInteractive");
Script.requireExtension("SHA512");
Script.requireExtension("Thread");
Script.requireExtension("CSV");

// ---

Script.resetIncludePath();

// ---

Fabricare.configFile = "";
Fabricare.userConfigFile = "";
Fabricare.workspaceFile = "";
Fabricare.action = Application.getArgument(0, "default");

// ---

Config = {};

Fabricare.loadConfig = function() {
	var cwd = Shell.getcwd();
	if (!Script.isNil(cwd)) {
		cwd += "/";
	};

	Fabricare.configFile = Application.getFlagValue("config", cwd + ".fabricare.json");

	var json = Shell.fileGetContents(Fabricare.configFile);
	if (!Script.isNil(json)) {
		Config = JSON.decode(json);
		if (!Script.isNil(global.Config)) {
			return true;
		};
	};

	global.Config = {};
	return false;
};

Fabricare.saveConfig = function() {
	var cwd = Shell.getcwd();
	if (!Script.isNil(cwd)) {
		cwd += "/";
	};

	Fabricare.configFile = Application.getFlagValue("config", cwd + ".fabricare.json");

	return Shell.filePutContents(Fabricare.configFile, JSON.encodeWithIndentation(Config));
};

// ---

UserConfig = {};

Fabricare.loadUserConfig = function() {
	var pathHome = null;
	if (OS.isWindows()) {
		if (OS.isMinGW()) {
			pathHome = Shell.getenv("HOME");
			if (Script.isNil(pathHome)) {
				pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
			};
		} else {
			pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
		};
	};
	if (OS.isLinux()) {
		pathHome = Shell.getenv("HOME");
	};
	if (Script.isNil(pathHome)) {
		Console.writeLn("* Error: Unable to determine user home path!");
		Script.exit(1);
	};

	Fabricare.userConfigFile = Application.getFlagValue("user-config", pathHome + ".fabricare.json");

	if (!Shell.fileExists(Fabricare.userConfigFile)) {
		global.UserConfig = {};
		return false;
	};

	var json = Shell.fileGetContents(Fabricare.userConfigFile);
	if (!Script.isNil(json)) {
		UserConfig = JSON.decode(json);
		if (!Script.isNil(global.UserConfig)) {
			return true;
		};
	};

	global.UserConfig = {};
	return false;
};

Fabricare.saveUserConfig = function() {
	var pathHome = null;
	if (OS.isWindows()) {
		if (OS.isMinGW()) {
			pathHome = Shell.getenv("HOME");
			if (Script.isNil(pathHome)) {
				pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
			};
		} else {
			pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
		};
	};
	if (OS.isLinux()) {
		pathHome = Shell.getenv("HOME");
	};
	if (Script.isNil(pathHome)) {
		Console.writeLn("* Error: Unable to determine user home path!");
		Script.exit(1);
	};

	Fabricare.userConfigFile = Application.getFlagValue("user-config", pathHome + ".fabricare.json");

	return Shell.filePutContents(Fabricare.userConfigFile, JSON.encodeWithIndentation(UserConfig));
};

// ---

Workspace = {};

// ---

Platform = {};
Platform.name = "unknwon";
Platform.machine = "unknwon";
Platform.osName = "unknwon";
Platform.osType = "unknwon";

// ---

Solution = {};
Solution.name = "unknwon";
Solution["SPDX-License-Identifier"] = "LicenseRef-Unknwon";
Solution.type = null;
Solution.projects = [];

// ---

Fabricare.include = function(file) {	
	var files = [
		// Local
		Shell.getcwd() + "/fabricare/solution/" + Solution.type + "." + file + ".js",
		Shell.getcwd() + "/fabricare/" + file + ".js",
		// Application
		Application.getPathExecutable() + "/fabricare/solution/" + Solution.type + "." + file + ".js",
		Application.getPathExecutable() + "/fabricare/" + file + ".js"
	];
	for (var index=0;index<files.length; ++index) {
		if (Shell.fileExists(files[index])) {			
			Script.include(files[index]);
			return true;
		};
	};
	files = [
		// Internal
		"fabricare://solution/" + Solution.type + "." + file + ".js",
		"fabricare://" + file + ".js"
	];
	for (var index=0;index<files.length; ++index) {
		if (Script.hasIncludeSource(files[index])) {			
			Script.include(files[index]);
			return true;
		};
	};
	return false;
};

// ---

fileToCS = Internal.fileToCS;
fileToRC = Internal.fileToRC;
htmlToRC = Internal.htmlToRC;
fileToJS = Internal.fileToJS;

xyoCC = function() {
	arguments.push("--platform=" + Platform.name);
	return Internal.xyoCC.apply(null, arguments);
};

xyoVersion = Internal.xyoVersion;

// ---

Fabricare.loadConfig();
Fabricare.loadUserConfig();

// ---
Fabricare.isDebug = function() {
	if (Application.hasFlag("debug")) {
		return true;
	};
	if (Shell.hasEnv("XYO_COMPILE_DEBUG")) {
		return true
	};
	return false;
};
Fabricare.isRelease = function() {
	return !Fabricare.isDebug();
};
// ---
Fabricare.loadWorkspace = function() {
	var cwd = Shell.getcwd();
	if (!Script.isNil(cwd)) {
		cwd += "/";
	};

	Fabricare.workspaceFile = Application.getFlagValue("workspace", cwd + "fabricare.json");

	var json = Shell.fileGetContents(Fabricare.workspaceFile);
	if (!Script.isNil(json)) {
		jsonWorkspace = JSON.decode(json);
		if (!Script.isNil(jsonWorkspace)) {
			for (var property in jsonWorkspace) {
				Workspace[property] = jsonWorkspace[property];
			};
		};
	};
};
Fabricare.loadWorkspace();
if (!Script.isNil(Workspace.solution)) {

	for (var property in Workspace.solution) {
		Solution[property] = Workspace.solution[property];
	};
};

if (Script.isNil(Solution.type)) {
	Solution.type = "generic";
};

// ---

Fabricare.processSolution = function() {	
	return Fabricare.include("solution/" + Solution.type + ".solution");
};

Fabricare.processWorkspace = function() {
	var runWorkspace=Shell.getcwd() + "/fabricare/workspace.js";
	if (Shell.fileExists(runWorkspace)) {
		return Script.include(runWorkspace);
	};
	return Fabricare.processSolution();
};

// ---

(function() {

if (Application.getFlagValue("run-script")) {
	return;
};

// ---

Platform.name = Application.getFlagValue("platform");
if (!Platform.name) {
	Fabricare.include("platform/detect");
};
if (!Fabricare.include("platform/" + Platform.name)) {
	Console.writeLn("Error: Platform " + Platform.name + " not found!");
	Script.exit(1);
};

// ---
})();
