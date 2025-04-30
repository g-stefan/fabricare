// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
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
		var tempFileSh;
		while (true) {
			tempFileArguments = tempFileBase + tempIndex + ".arguments";
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

		function wslTranslatePath(path) {
			var list = path.split(":");
			var drive = (list[0]).toLowerCaseASCII();
			return "/mnt/" + drive + (list[1]).replace("\\", "/");
		};

		var subroutineArguments = "";
		subroutineArguments += "--platform-subroutine=true\r\n";
		subroutineArguments += "--platform-active=" + Fabricare.platformActive + "\r\n";
		subroutineArguments += "--platform=" + Platform.name + "\r\n";
		subroutineArguments += "--workspace=" + wslTranslatePath(Fabricare.workspaceFile) + "\r\n";
		subroutineArguments += subroutineArgumentsExtra();
		subroutineArguments += Fabricare.action + "\r\n";
		Shell.filePutContents(tempFileArguments, subroutineArguments);

		var cmdSh = "";
		cmdSh += "#!/bin/sh\n";
		cmdSh += "if [ -d \"$HOME/.xyo-sdk/"+Platform.next+"/bin\" ] ; then\n";
		cmdSh += "	PATH=\"$HOME/.xyo-sdk/"+Platform.next+"/bin:$PATH\"\n";
		cmdSh += "	LD_LIBRARY_PATH=\"$HOME/.xyo-sdk/"+Platform.next+"/bin:$LD_LIBRARY_PATH\"\n";
		cmdSh += "fi\n";
		cmdSh += "fabricare \"@" + wslTranslatePath(tempFileArguments) + "\"\n";
		cmdSh += "RETV=$?\n";
		cmdSh += "if [ \"$RETV\" = \"1\" ]; then\n";
		cmdSh += "	exit 1\n";
		cmdSh += "fi\n";
		cmdSh += "exit 0\n";
		Shell.filePutContents(tempFileSh, cmdSh);

		var cmd = Platform.run + " -c \"" + wslTranslatePath(tempFileSh) + "\"";
		var retV = Shell.system(cmd);

		Shell.removeFile(tempFileArguments);
		Shell.removeFile(tempFileSh);

		Script.exit(retV);
		return;
	};
};

Shell.setenv("XYO_PLATFORM", Platform.next);

// ---

var folderName = Solution.name;

var buildPath = Shell.getenv("HOME") + "/.xyo-sdk/source/" + folderName;

if (Fabricare.action == "clean") {
	Shell.system("rm -rf \"" + buildPath + "\"");
	return;
};

Shell.mkdirRecursivelyIfNotExists(buildPath);

if ((Fabricare.action == "default") || (Fabricare.action == "sync")) {
	Shell.system("rsync --progress -avz --numeric-ids --delete-before --relative -LK ./ \"" + buildPath + "\"");
	if (Fabricare.action == "sync") {
		return;
	};
};

var retV = 1;

runInPath(buildPath, function() {
	Shell.system("chmod -R -x+X source");
	if (Shell.directoryExists("vendor")) {
		Shell.system("chmod -R -x+X vendor");
	};
	retV = Shell.system("fabricare " + Fabricare.action);
});

if (Fabricare.action == "release") {
	exitIf(!Shell.copyDirRecursively(buildPath + "/release", "release"));
};

exitIf(retV);
