// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("xyo-cpp.library");

Project.name = Application.getFlagValue("project", Project.name);

global.getAllFileList = function(pathAndFilename) {
	var path = Shell.getFilePath(pathAndFilename);
	var filename = Shell.getFileName(pathAndFilename);
	var dirList = Shell.getDirList(path + "/*");
	var files = [];
	for (var dir of dirList) {
		var scan = dir + "/" + filename;
		if (scan == pathAndFilename) {
			break;
		};
		for (var file of getAllFileList(dir + "/" + filename)) {
			files[files.length] = file;
		};
	};
	var fileList = Shell.getFileList(pathAndFilename);
	for (var file of fileList) {
		files[files.length] = file;
	};
	return files;
};

global.getFileListIgnoreSpecials = function(files) {
	var retV = [];
	var fileList = Shell.getFileList(files);
	for (var file of fileList) {
		if (file.toLowerCaseAscii().indexOf(".source.") >= 0) {
			continue;
		};
		if (file.toLowerCaseAscii().indexOf(".template.") >= 0) {
			continue;
		};
		if (file.toLowerCaseAscii().indexOf(".amalgam.") >= 0) {
			continue;
		};
		retV.push(file);
	};
	return retV;
};

global.getFileListIgnoreSpecialsSourcePath = function(basePath, sourcePath, extension) {
	var paths = [].concat(sourcePath);
	var files = [];
	for (var path of paths) {
		var pathToScan = basePath + "/" + path + "/" + extension;
		if (path.indexOf("@") == 0) {
			pathToScan = path.substring(1) + "/" + extension;
		};
		var fileList = getFileListIgnoreSpecials(pathToScan);
		for (var file of fileList) {
			files[files.length] = file;
		};
	};

	return files;
};

global.copyHeaderFilesIgnoreSpecials = function(path, destinationPath) {
	var fileList = getFileListIgnoreSpecials(path);
	for (var file of fileList) {
		var source = file;
		var destination = destinationPath + "/" + Shell.getFileName(file);
		exitIf(!Shell.copyFile(source, destination));
	};
};

global.copyHeaderFilesIgnoreSpecialsSourcePath = function(basePath, sourcePath, extension, destinationPath) {
	var paths = [].concat(sourcePath);
	for (var path of paths) {
		copyHeaderFilesIgnoreSpecials(basePath + "/" + path + "/" + extension, destinationPath + "/" + path);
	};
};

global.copyFileIfExists = function(source, destinationPath) {
	if (Shell.fileExists(source)) {
		var destination = destinationPath + "/" + Shell.getFileName(source);
		exitIf(!Shell.copyFile(source, destination));
	};
};

global.getVersion = function(file) {
	if (Script.isNil(file)) {
		file = "version.json";
	};
	var json = Shell.fileGetContents(file);
	if (!Script.isNil(json)) {
		var retV = JSON.decode(json);
		exitIf(Script.isNil(retV));
		if (!Script.isNil(Project.linkVersion)) {
			if (!Script.isNil(retV[Project.linkVersion])) {
				retV[Project.name] = retV[Project.linkVersion];
				return retV;
			};
		};
		if (!Script.isNil(retV[Project.name])) {
			return retV;
		};
	};
	if ((Fabricare.action == "version") || (Fabricare.action == "clean")) {
		var retV = {};
		retV[Project.name] = {
			"version" : "0.0.0",
			"build" : "0",
			"date" : "0000-00-00",
			"time" : "00:00:00"
		};
		return retV;
	};
	messageError("no version");
	Script.exit(1);
};

global.getDependencyOfProject = function(projectName) {
	var json = Shell.fileGetContents(pathRepository + "/lib/" + projectName + ".json");
	var retV = JSON.decode(json);
	if (!Script.isNil(retV)) {
		return retV;
	};

	var json = Shell.fileGetContents("output/lib/" + projectName + ".json");
	var retV = JSON.decode(json);
	if (!Script.isNil(retV)) {
		return retV;
	};

	retV = {};
	retV[projectName] = {};
	return retV;
};

global.dependencyProcess = function(projectName, projectList, projectDependency) {
	if (projectList[projectName]) {
		++projectDependency[projectName];
		return;
	};

	projectList[projectName] = true;
	projectDependency[projectName] = 1;

	var dependency = getDependencyOfProject(projectName);
	if (dependency[projectName].library) {
		for (var library of dependency[projectName].library) {
			dependencyProcess(library, projectList, projectDependency);
		};
	};
};

global.getDependency = function() {
	var projectList = {};
	var projectDependency = {};
	if (!Script.isNil(Project.dependency)) {
		for (var dependency of Project.dependency) {
			dependencyProcess(dependency, projectList, projectDependency);
		};
	};
	if (!Script.isNil(Project.library)) {
		for (var library of Project.library) {
			dependencyProcess(library, projectList, projectDependency);
		};
	};
	var property = "osUnknown";
	if (OS.isWindows()) {
		property = "osWindows";
	};
	if (OS.isLinux()) {
		property = "osLinux";
	};
	if (!Script.isNil(Project[property])) {
		if (!Script.isNil(Project[property].dependency)) {
			for (var dependency of Project[property].dependency) {
				dependencyProcess(dependency, projectList, projectDependency);
			};
		};
		if (!Script.isNil(Project[property].library)) {
			for (var library of Project[property].library) {
				dependencyProcess(library, projectList, projectDependency);
			};
		};
	};

	var listProject = [];
	var listIndex = [];	
	for (var library in projectDependency) {
		listProject[listProject.length]=library;
	};
	var powIndex=Math.pow(Math.floor(Math.log10(listProject.length)),10);
	for (var index in listProject) {
		listIndex[index]=projectDependency[listProject[index]]*powIndex+index;
	};
	var sortedIndex=listIndex.sort();
	var retV = [];
	for (var sIndex of sortedIndex) {
		var index = sIndex%powIndex;
		retV[retV.length] = ":" + listProject[index];
	};
	return retV;
};

global.compileProjectDependency = function(compileProject) {
	var dependency = getDependency();
	if (Script.isNil(compileProject.library)) {
		compileProject.library = dependency;
		return;
	};
	for (var library of dependency) {
		compileProject.library[compileProject.library.length] = library;
	};
};

global.xyoCCExtra = function() {
	arguments.push(

	    "--inc=output/include",
	    "--use-lib-path=output/lib",
	    "--rc-inc=output/include",

	    "--inc=" + pathRepository + "/include",
	    "--use-lib-path=" + pathRepository + "/lib",
	    "--rc-inc=" + pathRepository + "/include"

	);
	return arguments;
};

global.compileExe = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	var outputPath = "output/bin";
	if (!Script.isNil(Project.outputPath)) {
		outputPath = Project.outputPath;
	};
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=" + outputPath)));
};

global.compileExeStatic = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	var outputPath = "output/bin";
	if (!Script.isNil(Project.outputPath)) {
		outputPath = Project.outputPath;
	};
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=" + outputPath, "--crt-static")));
};

global.compileLib = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib", "--crt-static")));
};

global.compileDll = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
};

global.compileLibAndDll = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib", "--crt-static")));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
};

global.compileDllStatic = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	var outputPath = "output/bin";
	if (!Script.isNil(Project.outputPath)) {
		outputPath = Project.outputPath;
	};
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll-x-static", "--output-bin-path=" + outputPath, "--crt-static")));
};

global.compileAndRunTemp = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-path=temp")));
	exitIf(Shell.system("./temp/" + compileProject.project));
};

global.compileAndRunTest = function(compileProject) {
	compileProjectDependency(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-path=output/test")));

	Shell.setenv("PATH", Shell.realPath(Shell.getcwd()) + "\\output\\bin;" + Shell.getenv("PATH"));

	runInPath("output/test", function() {
		exitIf(Shell.system(compileProject.project));
	});
};

// ---

exitIf(!Fabricare.include(Platform.subroutine));
