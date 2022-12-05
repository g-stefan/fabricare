// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Script.requireExtension("Console");
Script.requireExtension("Application");
Script.requireExtension("ApplicationVersion");
Script.requireExtension("Buffer");
Script.requireExtension("DateTime");
Script.requireExtension("JSON");
Script.requireExtension("Make");
Script.requireExtension("Shell");
Script.requireExtension("ShellFind");
Script.requireExtension("Thread");
Script.requireExtension("Job");
Script.requireExtension("Task");
Script.requireExtension("Math");
Script.requireExtension("ProcessInteractive");
Script.requireExtension("File");
Script.requireExtension("Base16");
Script.requireExtension("Base32");
Script.requireExtension("Base64");
Script.requireExtension("SHA256");
Script.requireExtension("SHA512");
Script.requireExtension("Random");

// ---

Script.resetIncludePath();

// ---

Config = {};
Fabricare = {};
Fabricare.configFile = "";

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

Fabricare.loadConfig();

Fabricare.configOk = false;

// ---

if (!Script.isNil(Config.solution)) {
	for (var property in Config.solution) {
		Solution[property] = Config.solution[property];
	};
};

if (!Script.isNil(Solution.type)) {
	Fabricare.configOk = true;
	if(!Fabricare.include(Solution.type+".solution")){
		Console.writeLn("* Error: Solution type "+Solution.type+" not found!");
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
	if(!Fabricare.include(Project.type+".project")){
		Console.writeLn("* Error: Project type "+Solution.type+" not found!");
	};
};

// ---

if (!Fabricare.configOk) {
	Console.writeLn("fabricare [--platform=...] [action]");
};
