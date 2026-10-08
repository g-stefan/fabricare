// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.action = "fabricare.self-install";
Solution.name = "fabricare";

if(OS.isWindows()||OS.isMinGW()) {
	if (!Shell.fileExists("fabricare.exe")) {
		messageError("This must be run from a fabricare release/bin folder");
		return;
	};
};

if(OS.isLinux()) {
	if (!Shell.fileExists("fabricare")) {
		messageError("This must be run from a fabricare release/bin folder");
		return;
	};
};

var cwdPath = Shell.realPath(Shell.getcwd());
var repoPath = Shell.realPath(pathRepository+"/bin");

if(cwdPath == repoPath ){
	messageAction("Already installed");
	return;
};

if(OS.isWindows()) {
	var pathRepositoryBin = pathRepository+"/bin";

	Shell.mkdirRecursivelyIfNotExists(pathRepositoryBin);

	if(Shell.fileExists(pathRepositoryBin+"/fabricare.exe")) {
		var tempPath = Shell.getenv("TEMP");
		if(!Script.isNil(tempPath) && (tempPath.length>0)) {
			Shell.remove(tempPath+"/fabricare.delete-me.exe");
			Shell.rename(pathRepositoryBin+"/fabricare.exe",tempPath+"/fabricare.delete-me.exe");
		};
	};

	Shell.copyFile("fabricare.exe",pathRepositoryBin+"/fabricare.exe");

	return;
};

if(OS.isLinux()||OS.isMinGW()) {

	var pathRepositoryBin = pathRepository+"/bin";

	Shell.mkdirRecursivelyIfNotExists(pathRepositoryBin);

	if(OS.isMinGW()) {
		if(Shell.fileExists(pathRepositoryBin+"/fabricare.exe")) {
			var tempPath = Shell.getenv("TEMP");
			if(!Script.isNil(tempPath) && (tempPath.length>0)) {
				Shell.remove(tempPath+"/fabricare.delete-me.exe");
				Shell.rename(pathRepositoryBin+"/fabricare.exe",tempPath+"/fabricare.delete-me.exe");
			};
		};
	};

	if(OS.isLinux()) {
		if(Shell.fileExists(pathRepositoryBin+"/fabricare")) {
			var tempPath = "/tmp";
			if(tempPath.length>0) {
				Shell.remove(tempPath+"/fabricare.delete-me");
				Shell.rename(pathRepositoryBin+"/fabricare",tempPath+"/fabricare.delete-me");
			};
		};		
	};


	Shell.copyFile("fabricare",pathRepositoryBin+"/fabricare");

	var guard = "# set FABRICARE PATH if exists";
	var newLine = "\n";

	var append = "";

	append += newLine; 
	append += guard + newLine;
	append += "if [ -d \"" + pathRepositoryBin + "\" ] ; then" + newLine;
	append += "    export PATH=\"" + pathRepositoryBin + ":$PATH\"" + newLine;
	append += "    export LD_LIBRARY_PATH=\"" + pathRepositoryBin + ":$LD_LIBRARY_PATH\"" + newLine;
	append += "fi" + newLine;
	append += newLine;

	var profileList = [
		Shell.getenv("HOME") + "/.profile",
		Shell.getenv("HOME") + "/.bashrc"
	];
	for (var profile of profileList) {
		var content = Shell.fileGetContents(profile);
		if (!Script.isNil(content)) {
			if (content.indexOf(guard, 0) >= 0) {
				continue;
			};
		};
		var file = new File();
		if (file.openAppend(profile)) {
			file.write(append);
			file.flush();
			file.close();
		};
	};

	return;
};

messageError("Unknown system");

