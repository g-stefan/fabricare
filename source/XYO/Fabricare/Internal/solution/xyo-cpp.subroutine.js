// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("project/xyo-cpp.library");

Fabricare.action = Application.getArgument(0, "default");

if (Solution.projects.length == 0) {
	messageError("No projects defined!");
	Script.exit(1);
};

var tempPath = "./temp";
if (OS.isWindows()) {
	tempPath = Shell.getenv("TEMP");
};
if (OS.isLinux()) {
	tempPath = "/tmp";
};

for (var project of Solution.projects) {
	Shell.mkdirRecursivelyIfNotExists(tempPath);
	var tempFileBase = tempPath + "/fabricare." + (new DateTime()).toUnixTime() + ".";
	var tempIndex = 0;
	var tempFileProject;
	while (true) {
		tempFileProject = tempFileBase + tempIndex + ".project.json";
		if (Shell.fileExists(tempFileProject)) {
			++tempIndex;
			if (tempIndex >= 16384) {
				break;
			};
			continue;
		};
		break;
	};
	var json = {
		"project" : project
	};
	Shell.filePutContents(tempFileProject, JSON.encodeWithIndentation(json));

	var cmdArguments = "";
	cmdArguments += "--platform-subroutine=true ";
	cmdArguments += "--platform-active=" + Fabricare.platformActive + " ";
	cmdArguments += "--platform=" + Platform.name + " ";
	cmdArguments += "\"--config=" + tempFileProject + "\" ";
	cmdArguments += cmdArgumentsExtra();
	cmdArguments += Fabricare.action;

	var retV = Shell.system("fabricare " + cmdArguments);
	Shell.remove(tempFileProject);
	exitIf(retV);
};
