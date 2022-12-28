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

global.forceRemoveDirRecursively = function(path) {
	if (!Shell.removeDirRecursively(Project.vendor)) {
		if (OS.isWindows()) {
			Shell.system("rmdir /Q /S \"" + path + "\" 1>NUL 2>NUL");
		} else {
			Shell.system("rm -f \"" + path + "\"");
		};
		Shell.removeDirRecursively(Project.vendor);
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
		"release-name"
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
