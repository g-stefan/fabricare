// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.Project = {};
global.projectReset = function() {
	global.Project = {};
	global.Project.name = "unknown";
	global.Project.category = "unknown";
	global.Project["SPDX-License-Identifier"] = "LicenseRef-Unknown";
};
global.projectReset();

global.projectSet = function(project) {
	global.projectReset();
	for (var property in project) {
		global.Project[property] = project[property];
	};
	if (Script.isNil(global.Project.category)) {
		global.Project.category = "make";
	};
};

global.forEachProject = function(category, fn) {
	if (Script.isNil(category)) {
		category = "make";
	};
	for (var project of Solution.projects) {
		if (Script.isNil(project.category)) {
			project.category = "make";
		};
		if (project.category == category) {
			global.projectSet(project);
			fn();
		};
	};
};

global.selectMainProject = function() {
	global.projectReset();
	if (Solution.projects.length == 1) {
		global.projectSet(Solution.projects[0]);
		return;
	};
	for (var project of Solution.projects) {
		if (Solution.name == project.name) {
			global.projectSet(project);
			return;
		};
	};
};

global.prepareProjects = function() {
	var projectList = [];
	for (var project of Solution.projects) {
		if (!Script.isArray(project.name)) {
			projectList[projectList.length] = project;
			continue;
		};
		for (var name of project.name) {
			var newProject = {};
			for (var property in project) {
				newProject[property] = project[property];
			};
			newProject.name = name;
			projectList[projectList.length] = newProject;
		};
	};

	Solution.projects = projectList;
};

// ---

global.messageAction = function(info) {
	if (Script.isNil(info)) {
		info = Fabricare.action;
	};
	var name = Solution.name;
	if (Solution.projects.length) {
		if (Solution.name != Project.name) {
			name += "." + Project.name;
		};
	};
	Console.writeLn("- \x1B[32m" + name + "\x1B[0m: " + info);
};

global.messageError = function(info) {
	if (!Script.isNil(info)) {
		info = ": " + info;
	} else {
		info = "";
	};
	global.messageAction("\x1B[33m[ \x1B[31mERROR\x1B[33m ] \x1B[0m" + info);
};

global.exitIf = function(retV, message) {
	if (retV) {
		messageError(message);
		Script.exit(retV);
	};
};

global.exitIfTest = function(retV, message) {
	if (!Script.isNil(message)) {
		message += " : ";
	} else {
		message = "";
	};
	if (retV) {
		messageAction(message + "\x1B[33m[ \x1B[31mFAIL\x1B[33m ] \x1B[0m");
		Script.exit(retV);
	} else {
		messageAction(message + "\x1B[33m[ \x1B[32mPASS\x1B[33m ] \x1B[0m");
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

// Flags set by the platform restart itself, not forwarded
global.flagExtraExclude = [
	"platform",
	"platform-subroutine",
	"platform-active",
	"workspace"
];

// Every --flag of the command line, in order, except flagExtraExclude,
// so project scripts can define their own flags
global.flagExtra = function() {
	var retV = [];
	var scan;
	var name;
	var index;
	var exclude;
	var isExcluded;
	for (scan of Application.arguments) {
		if (scan.indexOf("--") != 0) {
			continue;
		};
		name = scan.substring(2);
		index = name.indexOf("=");
		if (index >= 0) {
			name = name.substring(0, index);
		};
		if (name.length == 0) {
			continue;
		};
		isExcluded = false;
		for (exclude of global.flagExtraExclude) {
			if (name == exclude) {
				isExcluded = true;
				break;
			};
		};
		if (isExcluded) {
			continue;
		};
		retV[retV.length] = scan;
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
		if (Solution.projects.length == 1) {
			if (!Script.isNil(Solution.projects[0].version)) {
				return Solution.projects[0].version;
			};
		};
		for (var project of Solution.projects) {
			if (Solution.name == project.name) {
				if (!Script.isNil(project.version)) {
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

// ---

global.copyFileIfExists = function(source, destinationPath) {
	if (Shell.fileExists(source)) {
		var destination = destinationPath + "/" + Shell.getFileName(source);
		exitIf(!Shell.copyFile(source, destination));
	};
};

// Programs and libraries just built in output/bin are used before the installed ones
global.addOutputBinToPath = function() {
	var pathBin = Shell.realPath(Shell.getcwd());
	var separator = ":";
	if (OS.isWindows()) {
		pathBin += "\\output\\bin";
		separator = ";";
	} else {
		pathBin += "/output/bin";
	};
	var pathList = Shell.getenv("PATH");
	if (Script.isNil(pathList) || (pathList.length == 0)) {
		Shell.setenv("PATH", pathBin);
	} else {
		Shell.setenv("PATH", pathBin + separator + pathList);
	};
	if (OS.isWindows()) {
		return;
	};
	// An empty entry in LD_LIBRARY_PATH is the current folder, do not add one
	pathList = Shell.getenv("LD_LIBRARY_PATH");
	if (Script.isNil(pathList) || (pathList.length == 0)) {
		Shell.setenv("LD_LIBRARY_PATH", pathBin);
		return;
	};
	Shell.setenv("LD_LIBRARY_PATH", pathBin + ":" + pathList);
};

// ---

// namespace.name, or namespace.releaseName
global.getReleasePrefix = function() {
	if (!Script.isNil(Solution.releaseName)) {
		return Solution.namespace + "." + Solution.releaseName;
	};
	return Solution.namespace + "." + Solution.name;
};

// prefix.vVERSION.platform, or prefix.vVERSION if Solution.releaseNoPlatform
global.getReleaseName = function(platformName) {
	var releaseName = getReleasePrefix() + ".v" + getVersion();
	if (!Script.isNil(Solution.releaseNoPlatform)) {
		if (Solution.releaseNoPlatform) {
			return releaseName;
		};
	};
	if (Script.isNil(platformName)) {
		platformName = Platform.name;
	};
	return releaseName + "." + platformName;
};

// Remove the checksum of releaseFile from the checksum file (prefix.vVERSION.sha512.json),
// the checksum file is removed when it becomes empty
global.removeReleaseChecksum = function(jsonFilename, releaseFile) {
	if (!Shell.fileExists(jsonFilename)) {
		return;
	};
	var json = JSON.decode(Shell.fileGetContents(jsonFilename));
	if (Script.isNil(json)) {
		return;
	};
	if (Script.isNil(json[releaseFile])) {
		return;
	};
	delete json[releaseFile];
	for (var key in json) {
		Shell.filePutContents(jsonFilename, JSON.encodeWithIndentation(json));
		return;
	};
	Shell.remove(jsonFilename);
};

// ---

global.csvDecode = function(csv) {
	if (Script.isNil(csv)) {
		return null;
	};
	var csvLines = csv.split("\n");
	var csvTable = [];
	for (var line of csvLines) {
		csvTable.push(CSV.decode(line));
	};
	return csvTable;
};
