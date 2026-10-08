// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("test");

// The tests run the scripts built into output/bin/fabricare, run make first

var executable = "output/bin/fabricare";
if (OS.isWindows()) {
	executable = "output\\bin\\fabricare.exe";
};

exitIf(!Shell.fileExists(executable), "run make first, " + executable + " not found");

Shell.mkdirRecursivelyIfNotExists("temp");

exitIfTest(Shell.execute(executable + " --version"), "version");

for (var k = 1; k <= 5; ++k) {
	var name = "test.0" + k;
	exitIfTest(Shell.execute(executable + " --run-script=test/" + name + ".js"), name);
};
