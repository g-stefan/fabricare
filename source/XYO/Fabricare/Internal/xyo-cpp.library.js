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

global.exitIf = function(retV) {
	if (retV) {
		messageError();
		Script.exit(retV);
	};
};

global.exit = function(retV) {
	messageError();
	Script.exit(retV);
};

global.runInPath = function(path, fn) {
	var savePath = Shell.realPath(Shell.getcwd());
	if (Script.isNil(savePath)) {
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
