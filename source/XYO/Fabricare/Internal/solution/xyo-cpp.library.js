// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.Project = {};
global.projectReset = function() {
	global.Project = {};
	global.Project.name = "unknwon";
	global.Project["SPDX-License-Identifier"] = "LicenseRef-Unknwon";
};
global.projectReset();

global.projectSet = function(project) {
	global.projectReset();
	for (var property in project) {
		global.Project[property] = project[property];
	};
};

global.forEachProject = function(fn) {
	for (var project of Solution.projects) {
		global.projectSet(project);
		fn();
	};
};

// ---

global.messageAction = function(info) {
	if (Script.isNil(info)) {
		info = Fabricare.action;
	};
	Console.writeLn("- \x1B[32m" + Solution.name + "\x1B[0m: " + info);
};

global.messageError = function(info) {
	if (Script.isNil(info)) {
		info = Fabricare.action;
	};
	Console.writeLn("- \x1B[31m* Error\x1B[0m: " + info);
};

global.exitIf = function(retV, message) {
	if (retV) {
		messageError(message);
		Script.exit(retV);
	};
};

global.exit = function(retV, message) {
	messageError(message);
	Script.exit(retV);
};

global.runInPath = function(path, fn) {
	var savePath = Shell.realPath(Shell.getcwd());
	if (Script.isNil(savePath)) {
		exit(1);
	};
	if (!Shell.directoryExists(path)) {
		global.messageError("path not found \"" + path + "\"");
		exit(1);
	};
	Shell.chdir(path);
	try {
		fn();
	} catch (e) {
		throw e;
	} finally {
		Shell.chdir(savePath);
	};
};

// ---

global.flagExtra = function() {
	var retV = [];
	var flagList = [
		"dependency-path",
		"dependency-name",
		"dependency-project",
		"dependency-make",
		"release-path",
		"release-name",
		"no-message"
	];
	var scan;
	var flag;
	for (flag of flagList) {
		for (scan of Application.arguments) {
			if (scan.indexOf("--" + flag) == 0) {
				retV[retV.length] = scan;
			};
		};
	};
	return retV;
};

global.subroutineArgumentsExtra = function() {
	var retV = "";
	var flag;
	var list = global.flagExtra();
	for (flag of list) {
		retV += flag + "\r\n";
	};
	return retV;
};

global.cmdArgumentsExtra = function() {
	var retV = "";
	var flag;
	var list = global.flagExtra();
	for (flag of list) {
		retV += "\"" + flag + "\" ";
	};
	return retV;
};

// ---

global.getVersionInfo = function(file) {
	if (Script.isNil(file)) {
		file = "version.json";
	};
	var json = Shell.fileGetContents(file);
	if (!Script.isNil(json)) {
		var retV = JSON.decode(json);
		exitIf(Script.isNil(retV));
		if (!Script.isNil(Solution.linkVersion)) {
			if (!Script.isNil(retV[Solution.linkVersion])) {
				return retV[Solution.linkVersion];
			};
		};
		if (!Script.isNil(Solution.versionName)) {
			if (!Script.isNil(retV[Solution.versionName])) {
				return retV[Solution.versionName];
			};
		};
		if (!Script.isNil(retV[Solution.name])) {
			return retV[Solution.name];
		};
	};	
	if ((Fabricare.action == "version") || (Fabricare.action == "clean")) {
		return {
			"version" : "0.0.0",
			"build" : "0",
			"date" : "0000-00-00",
			"time" : "00:00:00"
		};
	};
	messageError("no version");
	Script.exit(1);
};

global.getVersion = function(file) {
	var version = Solution.version;
	if (Script.isNil(version)) {
		for(var project of Solution.projects){
			if(Solution.name==project.name) {
				if(!Script.isNil(project.version)){
					return project.version;
				};				
			};
		};
		var versionInfo = getVersionInfo();
		version = versionInfo.version;
	};
	return version;
};

// ---

global.getProjectVersionInfo = function(file) {
	if (Script.isNil(file)) {
		file = "version.json";
	};
	var json = Shell.fileGetContents(file);
	if (!Script.isNil(json)) {
		var retV = JSON.decode(json);
		exitIf(Script.isNil(retV));
		if (!Script.isNil(Project.linkVersion)) {
			if (!Script.isNil(retV[Project.linkVersion])) {
				return retV[Project.linkVersion];
			};
		};
		if (!Script.isNil(Project.versionName)) {
			if (!Script.isNil(retV[Project.versionName])) {
				return retV[Project.versionName];
			};
		};
		if (!Script.isNil(retV[Project.name])) {
			return retV[Project.name];
		};
	};
	if ((Fabricare.action == "version") || (Fabricare.action == "clean")) {
		return {
			"version" : "0.0.0",
			"build" : "0",
			"date" : "0000-00-00",
			"time" : "00:00:00"
		};
	};
	messageError("no version");
	Script.exit(1);
};

global.getProjectVersion = function(file) {
	var version = Project.version;
	if (Script.isNil(version)) {
		var versionInfo = getProjectVersionInfo();
		version = versionInfo.version;
	};
	return version;
};

global.getProjectVersionAsInfo = function(file) {
	if (Script.isNil(Project.version)) {
		return getProjectVersionInfo();
	};
	return {
		version : Project.version
	};
};
