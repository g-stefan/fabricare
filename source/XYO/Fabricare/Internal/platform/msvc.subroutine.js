// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/xyo-cpp.library");

Fabricare.action = Application.getArgument(0, "default");
Fabricare.isPlatformSubroutine = Application.getFlagValue("platform-subroutine");
Fabricare.platformActive = Application.getFlagValue("platform-active");
Fabricare.subroutine = Application.getFlagValue("subroutine", Fabricare.subroutine);

Platform.subroutine = "platform/msvc";

Platform.name = Platform.osType + "-msvc-" + Platform.version;

if (Shell.getenv("XYO_PLATFORM") == Platform.name) {
	Fabricare.isPlatformSubroutine = true;
	Fabricare.platformActive = Platform.name;
};

if (!Fabricare.isPlatformSubroutine) {
	if (Fabricare.platformActive != Platform.name) {
		Fabricare.platformActive = Platform.name;

		var tempFileBase = Shell.getenv("TEMP") + "\\fabricare." + (new DateTime()).toUnixTime() + ".";
		var tempIndex = 0;
		var tempFileArguments;
		var tempFileCmd;
		while (true) {
			tempFileArguments = tempFileBase + tempIndex + ".arguments";
			tempFileCmd = tempFileBase + tempIndex + ".cmd";
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
		subroutineArguments += "--subroutine=" + Fabricare.subroutine + "\r\n";
		subroutineArguments += "--config=" + Fabricare.configFile + "\r\n";
		subroutineArguments += subroutineArgumentsExtra();
		subroutineArguments += Fabricare.action + "\r\n";
		Shell.filePutContents(tempFileArguments, subroutineArguments);

		var cmdScript = "";
		cmdScript += "@echo off\r\n";
		cmdScript += "pushd \"" + Platform.path + "\"\r\n";
		cmdScript += "call vcvarsall.bat " + Platform.machine + "\r\n";
		cmdScript += "popd\r\n";
		cmdScript += "fabricare \"@" + tempFileArguments + "\"\r\n";
		cmdScript += "if errorlevel 1 exit 1\r\n";
		cmdScript += "del \"" + tempFileArguments + "\"\r\n";
		cmdScript += "(goto) 2> NUL & del \"%~f0\"\r\n";
		Shell.filePutContents(tempFileCmd, cmdScript);

		var cmd = "cmd.exe /C \"" + tempFileCmd + "\"";
		Script.exit(Shell.system(cmd));
		return;
	};
};

Shell.setenv("XYO_PLATFORM", Platform.name);

Fabricare.include(Fabricare.subroutine);
