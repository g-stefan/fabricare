// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Shared by the test scripts, run as:
//     output/bin/fabricare --run-script=test/test.NN.js
// from the project root. --run-script skips the platform selection and the
// solution, so each test loads the embedded scripts it needs from
// fabricare:// (the copies built into this fabricare executable).

var testFailed = 0;

function check(name, value, expected) {
	if (value === expected) {
		return;
	};
	Console.writeLn("-> test " + testName + " fail: " + name + " = [" + value + "], expected [" + expected + "]");
	++testFailed;
};

function checkTrue(name, value) {
	check(name, value, true);
};

function testDone() {
	Shell.chdir(testPathRoot);
	if (testFailed) {
		throw "test " + testName + " failed";
	};
};

// Empty working folder temp/test.NN, the test runs inside it
var testPathRoot = Shell.realPath(Shell.getcwd());
var testPath = testPathRoot + "/temp/test." + testName;

Shell.removeDirRecursively(testPath);
Shell.mkdirRecursivelyIfNotExists(testPath);
Shell.chdir(testPath);

// The state the platform scripts set before an action runs
Script.include("fabricare://solution/generic.library.js");

Platform.name = "test-platform";
Fabricare.action = "test";
Solution = {
	name : "demo",
	namespace : "xyo",
	type : "xyo-cpp",
	projects : []
};

global.pathRepository = testPath + "/repository";
global.pathRelease = testPath + "/repository-release";
global.pathSuper = testPath + "/super/bin";

function writeJSON(file, value) {
	Shell.mkdirFilePath(file);
	exitIf(!Shell.filePutContents(file, JSON.encodeWithIndentation(value)));
};

function readJSON(file) {
	return JSON.decode(Shell.fileGetContents(file));
};
