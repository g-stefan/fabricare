// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.action = Application.getArgument(0, "default");
Fabricare.isPlatformSubroutine = Application.getFlagValue("platform-subroutine");
Fabricare.platformActive = Application.getFlagValue("platform-active");
Fabricare.subroutine = Application.getFlagValue("subroutine", Fabricare.subroutine);

Platform.subroutine = "ubuntu";

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
				if (tempIndex >= 16384) {
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
		subroutineArguments += "--subroutine=" + Fabricare.subroutine + "\r\n";
		subroutineArguments += "--config=" + Fabricare.configFile + "\r\n";
		subroutineArguments += Fabricare.action + "\r\n";
		Shell.filePutContents(tempFileArguments, subroutineArguments);

		var cmdScript = "";
		cmdScript += "@echo off\r\n";
		cmdScript += "set CHERE_INVOKING=enabled_from_arguments\r\n";
		cmdScript += "set SHLVL=2\r\n";
		cmdScript += "set MSYSTEM=" + Platform.name.toUpperCaseAscii() + "\r\n";
		cmdScript += "C:\\msys64\\usr\\bin\\sh --login -- \"" + tempFileSh + "\"\r\n";
		cmdScript += "del \"" + tempFileArguments + "\"\r\n";
		cmdScript += "del \"" + tempFileSh + "\"\r\n";
		cmdScript += "(goto) 2> NUL & del \"%~f0\"\r\n";
		Shell.filePutContents(tempFileCmd, cmdScript);

		var cmdSh = "";
		cmdSh += "#!/bin/sh\n";
		cmdScript += "export PATH=$PATH:/c/msys64/" + Platform.name + "/bin/../libexec;\n";
		cmdScript += "fabricare \"@" + tempFileArguments + "\"\n";
		cmdScript += "RETV=$?\n";
		cmdScript += "if [ \"$RETV\" = \"1\" ]; then\n";
		cmdScript += "	exit 1\n";
		cmdScript += "fi\n";
		cmdScript += "exit 0\n";
		Shell.filePutContents(tempFileSh, cmdSh);

		var cmd = "cmd.exe /C \"" + tempFileCmd + "\"";
		Script.exit(Shell.system(cmd));
		return;
	};
};

Fabricare.include(Fabricare.subroutine);