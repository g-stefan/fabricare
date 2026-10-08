// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// fabricare.self-install: copy the executable to the repository bin folder,
// on Linux also add that folder to PATH in ~/.profile and ~/.bashrc

var testName = "04";
Script.include("test/test.common.js");

var executable = "fabricare";
if (OS.isWindows()) {
	executable = "fabricare.exe";
};

var pathHome = testPath + "/home";
Shell.mkdirRecursivelyIfNotExists(pathHome);
Shell.setenv("HOME", pathHome);
Shell.setenv("TEMP", testPath);

Shell.mkdirRecursivelyIfNotExists("release/bin");
checkTrue("copy executable", Shell.copyFile(testPathRoot + "/output/bin/" + executable, "release/bin/" + executable));

// Not from a release bin folder: nothing to do
Script.include("fabricare://fabricare.self-install.js");
check("not a release folder", Shell.fileExists(pathRepository + "/bin/" + executable), false);

Shell.chdir("release/bin");
Script.include("fabricare://fabricare.self-install.js");
Shell.chdir(testPath);
checkTrue("installed", Shell.fileExists(pathRepository + "/bin/" + executable));

if (OS.isLinux()) {
	// ~/.bashrc is missing, ~/.profile exists
	Shell.filePutContents(pathHome + "/.profile", "# profile\n");
	Shell.remove(pathHome + "/.bashrc");

	Shell.chdir("release/bin");
	Script.include("fabricare://fabricare.self-install.js");
	// A second run must not add the block again
	Script.include("fabricare://fabricare.self-install.js");
	Shell.chdir(testPath);

	var pathBin = pathRepository + "/bin";
	var block = "if [ -d \"" + pathBin + "\" ] ; then\n";
	block += "    export PATH=\"" + pathBin + ":$PATH\"\n";

	var profile = Shell.fileGetContents(pathHome + "/.profile");
	check("profile kept", profile.indexOf("# profile\n"), 0);
	checkTrue("profile block", profile.indexOf(block) > 0);
	check("profile block once", profile.indexOf(block, profile.indexOf(block) + 1), -1);

	var bashrc = Shell.fileGetContents(pathHome + "/.bashrc");
	checkTrue("bashrc created", !Script.isNil(bashrc));
	if (!Script.isNil(bashrc)) {
		checkTrue("bashrc block", bashrc.indexOf(block) >= 0);
	};

	// The block is valid shell: it puts the folder first in PATH
	var output = ProcessInteractive.run("/bin/sh -c \". '" + pathHome + "/.profile'; echo $PATH\"");
	check("profile PATH", output.indexOf(pathBin + ":"), 0);
};

testDone();
