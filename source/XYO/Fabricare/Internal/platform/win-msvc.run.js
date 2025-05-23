// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/generic.library");

Fabricare.action = Application.getArgument(0, "default");
Fabricare.isPlatformSubroutine = Application.getFlagValue("platform-subroutine");
Fabricare.platformActive = Application.getFlagValue("platform-active");

Platform.name = Platform.osType + "-msvc-" + Platform.version;

global.pathRepository = Shell.getenv("USERPROFILE") + "/.xyo-sdk/"+ Platform.name;
if (Shell.getenv("XYO_PLATFORM") == Platform.name) {
	Fabricare.isPlatformSubroutine = true;
	Fabricare.platformActive = Platform.name;
	if(Shell.hasEnv("XYO_PLATFORM_PATH")) {
		global.pathRepository = Shell.getenv("XYO_PLATFORM_PATH");
	};
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
		subroutineArguments += "--workspace=" + Fabricare.workspaceFile + "\r\n";
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

// ---

global.pathRelease = pathRepository + "/release";

global.pathSuper = Application.getPathExecutable();

Shell.setenv("PATH", pathRepository + "\\bin;" + pathSuper + ";" + Shell.getenv("PATH"));
Shell.setenv("INCLUDE", pathRepository + "\\include;" + pathSuper + "\\..\\include;" + Shell.getenv("INCLUDE"));
Shell.setenv("LIB", pathRepository + "\\lib;" + pathSuper + "\\..\\lib;" + Shell.getenv("LIB"));

Fabricare.processWorkspace();
