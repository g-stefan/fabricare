// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/xyo-cpp.library");

Fabricare.action = Application.getArgument(0, "default");
Fabricare.isPlatformSubroutine = Application.getFlagValue("platform-subroutine");
Fabricare.platformActive = Application.getFlagValue("platform-active");
Fabricare.subroutine = Application.getFlagValue("subroutine", Fabricare.subroutine);

Platform.subroutine = "platform/wsl";

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
			var drive = (list[0]).toLowerCaseAscii();
			return "/mnt/" + drive + (list[1]).replace("\\", "/");
		};

		var subroutineArguments = "";
		subroutineArguments += "--platform-subroutine=true\r\n";
		subroutineArguments += "--platform-active=" + Fabricare.platformActive + "\r\n";
		subroutineArguments += "--platform=" + Platform.name + "\r\n";
		subroutineArguments += "--subroutine=" + Fabricare.subroutine + "\r\n";
		subroutineArguments += "--config=" + wslTranslatePath(Fabricare.configFile) + "\r\n";
		subroutineArguments += subroutineArgumentsExtra();
		subroutineArguments += Fabricare.action + "\r\n";
		Shell.filePutContents(tempFileArguments, subroutineArguments);

		var cmdSh = "";
		cmdSh += "#!/bin/sh\n";
		cmdSh += "if [ -d \"$HOME/SDK/bin\" ] ; then\n";
		cmdSh += "	PATH=\"$HOME/SDK/bin:$PATH\"\n";
		cmdSh += "	LD_LIBRARY_PATH=\"$HOME/SDK/bin:$LD_LIBRARY_PATH\"\n";
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

Fabricare.include(Fabricare.subroutine);
