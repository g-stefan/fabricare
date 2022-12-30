// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
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

Fabricare = {};
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
		pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
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
		pathHome = Shell.getenv("HOMEDRIVE") + Shell.getenv("HOMEPATH");
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

Project = {};
Project.name = "unknwon";
Project["SPDX-License-Identifier"] = "LicenseRef-Unknwon";
Project.type = null;

// ---

Solution = {};
Solution.name = "unknwon";
Solution["SPDX-License-Identifier"] = "LicenseRef-Unknwon";
Solution.type = null;
Solution.projects = [];

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

Fabricare.runInteractive = function(cmd) {
	var line;
	var retV = "";
	var process = new ProcessInteractive();
	process.execute(cmd);
	while (process.isRunning()) {
		if (process.waitToRead(10)) {
			line = process.readLn();
			if (line) {
				retV += line;
			};
		};
	};
	// data in buffer after end
	line = process.read();
	if (line) {
		retV += line;
	};
	process.close();
	return retV;
};

// ---

Fabricare.loadUserConfig();
Fabricare.loadConfig();
Fabricare.configOk = false;
Fabricare.isSolution = false;
Fabricare.isProject = false;

// ---

if (!Script.isNil(Config.solution)) {
	for (var property in Config.solution) {
		Solution[property] = Config.solution[property];
	};
};

if (!Script.isNil(Solution.type)) {
	Fabricare.configOk = true;
	Fabricare.isSolution = true;
	if (!Fabricare.include("solution/" + Solution.type)) {
		Console.writeLn("* Error: Solution type " + Solution.type + " not found!");
	};
};

// ---

if (!Script.isNil(Config.project)) {
	for (var property in Config.project) {
		Project[property] = Config.project[property];
	};
};

if (!Script.isNil(Project.type)) {
	Fabricare.configOk = true;
	Fabricare.isProject = true;
	if (!Fabricare.include("project/" + Project.type)) {
		Console.writeLn("* Error: Project type " + Project.type + " not found!");
	};
};

// ---

if (Shell.fileExists("fabricare/fabricare.js")) {
	Fabricare.configOk = true;
};

if (Application.getFlagValue("run-script")) {
	Fabricare.configOk = true;
};

// ---

if (!Fabricare.configOk) {
	Console.writeLn("fabricare [--platform=...] [action]");
};
