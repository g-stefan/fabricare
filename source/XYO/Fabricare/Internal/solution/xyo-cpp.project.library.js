// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

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

global.projectNameFromDependency = function(name) {
	if (name.substring(0, 1) == ":") {
		return name.substring(1);
	};
	return name;
};

global.getDependencyOfProject = function(projectName) {
	var json = Shell.fileGetContents(pathRepository + "/lib/" + projectNameFromDependency(projectName) + ".json");
	var retV = JSON.decode(json);
	if (!Script.isNil(retV)) {
		return retV;
	};

	var json = Shell.fileGetContents("output/lib/" + projectNameFromDependency(projectName) + ".json");
	var retV = JSON.decode(json);
	if (!Script.isNil(retV)) {
		return retV;
	};

	retV = {};
	retV[projectName] = {};
	return retV;
};

global.dependencyProcess = function(projectName, projectDependency, level) {
	if (Script.isNil(projectDependency[projectName])) {
		projectDependency[projectName] = 0;
	};

	projectDependency[projectName] += level;

	// Circular reference protection or very deep dependency tree
	if (projectDependency[projectName] >= 65536) {
		return;
	};

	projectName = projectNameFromDependency(projectName);
	var dependency = getDependencyOfProject(projectName);
	if (dependency[projectName].library) {
		for (var library of dependency[projectName].library) {
			dependencyProcess(library, projectDependency, level + 1);
		};
	};
};

global.getDependency = function() {
	var projectDependency = {};
	if (!Script.isNil(Project.dependency)) {
		for (var dependency of Project.dependency) {
			dependencyProcess(":" + dependency, projectDependency, 1);
		};
	};
	if (!Script.isNil(Project.library)) {
		for (var library of Project.library) {
			dependencyProcess(library, projectDependency, 1);
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
				dependencyProcess(":" + dependency, projectDependency, 1);
			};
		};
		if (!Script.isNil(Project[property].library)) {
			for (var library of Project[property].library) {
				dependencyProcess(library, projectDependency, 1);
			};
		};
	};

	var listProject = [];
	var listIndex = [];
	for (var library in projectDependency) {
		listProject[listProject.length] = "" + library;
	};
	var powIndex = Math.pow(10, 1 + Math.floor(Math.log10(listProject.length)));
	for (var index in listProject) {
		listIndex[index] = projectDependency[listProject[index]] * powIndex + index;
	};
	var sortedIndex = listIndex.sort();

	var retV = [];
	for (var sIndex of sortedIndex) {
		var index = sIndex % powIndex;
		retV[retV.length] = listProject[index];
	};
	return retV;
};

global.compileProjectDependencyToLibrary = function(compileProject) {
	var dependency = getDependency();
	if (Script.isNil(compileProject.library)) {
		var library = [];
		for (var project of dependency) {
			library[library.length] = project;
		};
		compileProject.library = library;
		return;
	};
	for (var library of dependency) {
		compileProject.library[compileProject.library.length] = library;
	};
};

global.getDependencyVersion = function() {
	var dependencyVersion = {};
	var projectDependency = getDependency();
	for (project of projectDependency) {
		var info = getDependencyOfProject(project);
		var projectName = projectNameFromDependency(project);
		if (!Script.isNil(info[projectName].version)) {
			dependencyVersion[projectName] = info[projectName].version.version;
		};
	};
	return dependencyVersion;
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
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	var outputPath = "output/bin";
	if (!Script.isNil(Project.outputPath)) {
		outputPath = Project.outputPath;
	};
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=" + outputPath)));
};

global.compileExeStatic = function(compileProject) {
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	var outputPath = "output/bin";
	if (!Script.isNil(Project.outputPath)) {
		outputPath = Project.outputPath;
	};
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=" + outputPath, "--crt-static")));
};

global.compileLib = function(compileProject) {
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib", "--crt-static")));
};

global.compileDll = function(compileProject) {
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
};

global.compileDllStatic = function(compileProject) {
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	var outputPath = "output/bin";
	if (!Script.isNil(Project.outputPath)) {
		outputPath = Project.outputPath;
	};
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll-x-static", "--output-bin-path=" + outputPath, "--crt-static")));
};

global.compileAndRunTemp = function(compileProject) {
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-path=temp")));
	if (OS.isWindows()) {
		exitIf(Shell.system("temp\\" + compileProject.project));
	} else {
		exitIf(Shell.system("./temp/" + compileProject.project));
	};
};

global.compileAndRunTest = function(compileProject) {
	compileProjectDependencyToLibrary(compileProject);
	Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
	exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-path=output/test")));

	Shell.setenv("PATH", Shell.realPath(Shell.getcwd()) + "\\output\\bin;" + Shell.getenv("PATH"));

	runInPath("output/test", function() {
		exitIf(Shell.system(compileProject.project));
	});
};
