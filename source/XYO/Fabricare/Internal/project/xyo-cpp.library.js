// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.messageAction = function(info) {
	if (Script.isNil(info)) {
		info = Fabricare.action;
	};
	Console.writeLn("- \x1B[32m" + Project.name + "\x1B[0m: " + info);
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

global.getVersionInfo = function(file) {
	if (Script.isNil(file)) {
		file = "version.json";
	};
	var json = Shell.fileGetContents(file);
	if (!Script.isNil(json)) {
		var retV = JSON.decode(json);
		exitIf(Script.isNil(retV));
		if (!Script.isNil(Project.linkVersion)) {
			if (!Script.isNil(retV[Project.linkVersion])) {
				retV[Project.name] = retV[Project.linkVersion];
				return retV;
			};
		};
		if (!Script.isNil(Project.versionName)) {
			if (!Script.isNil(retV[Project.versionName])) {
				retV[Project.name] = retV[Project.versionName];
				return retV;
			};
		};
		if (!Script.isNil(retV[Project.name])) {
			return retV;
		};
	};
	if ((Fabricare.action == "version") || (Fabricare.action == "clean")) {
		var retV = {};
		retV[Project.name] = {
			"version" : "0.0.0",
			"build" : "0",
			"date" : "0000-00-00",
			"time" : "00:00:00"
		};
		return retV;
	};
	messageError("no version");
	Script.exit(1);
};

global.getVersion = function(file) {
	var version = Project.version;
	if (Script.isNil(version)) {
		var versionInfo = getVersionInfo();
		version = versionInfo[Project.name].version;
	};
	return version;
};
