// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/generic.library");

Fabricare.action = Application.getArgument(0, "default");
Fabricare.isPlatformSubroutine = Application.getFlagValue("platform-subroutine");
Fabricare.platformActive = Application.getFlagValue("platform-active");

if (!Fabricare.isPlatformSubroutine) {
	if (Fabricare.platformActive != Platform.name) {
		Fabricare.platformActive = Platform.name;

		var tempFileBase = Shell.getenv("TEMP") + "\\fabricare." + (new DateTime()).toUnixTime() + ".";
		var tempIndex = 0;
		var tempFileArguments;
		var tempFileCmd;
		var tempFileSh;
		while (true) {
			tempFileArguments = tempFileBase + tempIndex + ".arguments";
			tempFileCmd = tempFileBase + tempIndex + ".cmd";
			tempFileSh = tempFileBase + tempIndex + ".sh";
			if (Shell.fileExists(tempFileArguments)) {
				++tempIndex;
				if (tempIndex >= 32768) {
					break;
				};
				continue;
			};
			break;
		};

		var subroutineArguments = "";
		subroutineArguments += "--platform-subroutine=true\r\n";
		subroutineArguments += "--platform-active=" + Fabricare.platformActive + "\r\n";
		subroutineArguments += "--platform=" + Platform.name + "\r\n";
		subroutineArguments += "--workspace=" + Fabricare.workspaceFile + "\r\n";
		subroutineArguments += subroutineArgumentsExtra();
		subroutineArguments += Fabricare.action + "\r\n";
		Shell.filePutContents(tempFileArguments, subroutineArguments);

		var cmdScript = "";
		cmdScript += "@echo off\r\n";
		cmdScript += "set CHERE_INVOKING=enabled_from_arguments\r\n";
		cmdScript += "set SHLVL=2\r\n";
		cmdScript += "set MSYSTEM=" + Platform.next.toUpperCaseAscii() + "\r\n";
		cmdScript += "C:\\msys64\\usr\\bin\\sh --login -- \"" + tempFileSh + "\"\r\n";
		cmdScript += "if errorlevel 1 exit 1\r\n";
		cmdScript += "del \"" + tempFileArguments + "\"\r\n";
		cmdScript += "del \"" + tempFileSh + "\"\r\n";
		cmdScript += "(goto) 2> NUL & del \"%~f0\"\r\n";
		Shell.filePutContents(tempFileCmd, cmdScript);

		var cmdSh = "";
		cmdSh += "#!/bin/sh\n";
		cmdSh += "export PATH=$PATH:/c/msys64/" + Platform.name + "/bin/../libexec;\n";
		cmdSh += "fabricare \"@" + tempFileArguments + "\"\n";
		cmdSh += "RETV=$?\n";
		cmdSh += "if [ \"$RETV\" = \"1\" ]; then\n";
		cmdSh += "	exit 1\n";
		cmdSh += "fi\n";
		cmdSh += "exit 0\n";
		Shell.filePutContents(tempFileSh, cmdSh);

		var cmd = "cmd.exe /C \"" + tempFileCmd + "\"";
		Script.exit(Shell.system(cmd));
		return;
	};
};

Shell.setenv("XYO_PLATFORM", Platform.next);

// ---

var folderName = Solution.name;

var buildPath = Shell.getenv("HOME") + "/.xyo-sdk/" + Platform.next + "/source/" + folderName;

if (Fabricare.action == "clean") {
	messageAction("clean");
	Shell.system("rm -rf \"" + buildPath + "\"");
	return;
};

Shell.mkdirRecursivelyIfNotExists(buildPath);

if ((Fabricare.action == "default") || (Fabricare.action == "sync")) {
	var cmd = "C:\\msys64\\usr\\bin\\sh --login -c \"";
	cmd += "rsync --progress -avz --numeric-ids --delete-before --relative -LK ./ ";
	cmd += "\\\"$HOME/.xyo-sdk/" + Platform.next + "/source/" + folderName + "\\\"\"";
	Shell.system(cmd);
	if (Fabricare.action == "sync") {
		return;
	};
};

var retV = 1;

runInPath(buildPath, function() {
	retV = Shell.system("fabricare " + Fabricare.action);
});

if (Fabricare.action == "release") {
	exitIf(!Shell.copyDirRecursively(buildPath + "/release", "release"));
};

exitIf(retV);
