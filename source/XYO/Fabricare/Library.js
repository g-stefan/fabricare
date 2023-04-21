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

// ---

Script.resetIncludePath();

// ---

Fabricare.configFile = "";
Fabricare.userConfigFile = "";
Fabricare.action = Application.getArgument(0, "default");

// ---

Config = {};

Fabricare.loadConfig = function() {
	var cwd = Shell.getcwd();
	if (!Script.isNil(cwd)) {
		cwd += "/";
	};

	Fabricare.configFile = Application.getFlagValue("config", cwd + "fabricare.json");

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

	Fabricare.configFile = Application.getFlagValue("config", cwd + "fabricare.json");

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

Fabricare.include = function(file) {
	var internal = "fabricare://" + file + ".js";
	var application = Application.getPathExecutable() + "/fabricare/" + file + ".js";
	var local = Shell.getcwd() + "/fabricare/" + file + ".js";

	if (Shell.fileExists(local)) {
		Script.include(local);
		return true;
	};
	if (Shell.fileExists(application)) {
		Script.include(application);
		return true;
	};
	if (Script.hasIncludeSource(internal)) {
		Script.include(internal);
		return true;
	};
	return false;
};

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

Fabricare.loadUserConfig();
Fabricare.loadConfig();
Fabricare.configOk = false;
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

if (!Script.isNil(Config.solution)) {
	for (var property in Config.solution) {
		Solution[property] = Config.solution[property];
	};
};

// ---

(function() {

if (Application.getFlagValue("run-script")) {
	return;
};

if (Shell.fileExists("fabricare/fabricare.js")) {
	Script.include("fabricare/fabricare.js");
	return;
};

if (!Script.isNil(Solution.type)) {
	if (Fabricare.include("solution/" + Solution.type)) {
		return;
	};
	Console.writeLn("* Error: Solution type " + Solution.type + " not found!");
	return;
};

Fabricare.include("usage");
})();
