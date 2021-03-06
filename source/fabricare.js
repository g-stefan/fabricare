//
// Fabricare
//
// Copyright (c) 2021-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

Script.requireExtension("Application");
Script.requireExtension("Base16");
Script.requireExtension("Base32");
Script.requireExtension("Base64");
Script.requireExtension("Buffer");
Script.requireExtension("Console");
Script.requireExtension("Crypt");
Script.requireExtension("CSV");
Script.requireExtension("DateTime");
Script.requireExtension("File");
Script.requireExtension("HTTP");
Script.requireExtension("Job");
Script.requireExtension("JSON");
Script.requireExtension("Make");
Script.requireExtension("Math");
Script.requireExtension("MD5");
Script.requireExtension("OpenSSL");
Script.requireExtension("Pixel32");
Script.requireExtension("ProcessInteractive");
Script.requireExtension("Random");
Script.requireExtension("SHA256");
Script.requireExtension("SHA512");
Script.requireExtension("Shell");
Script.requireExtension("ShellFind");
Script.requireExtension("Socket");
Script.requireExtension("SSHRemote");
Script.requireExtension("Task");
Script.requireExtension("Thread");
Script.requireExtension("URL");
Script.requireExtension("Version");
Script.requireExtension("XML");

// ---

Script.resetIncludePath();
Script.setIncludePath(Application.getPathExecutable()+"/fabricare");
Script.setIncludePath(Shell.getcwd());

// ---

Config = {};

Fabricare.loadConfig = function() {
	var cwd = Shell.getcwd();
	if(!Script.isNil(cwd)){
		cwd+="/";
	};

	var json=Shell.fileGetContents(cwd+"fabricare.json");
	if(!Script.isNil(json)) {
		Config = JSON.decode(json);
		if(!Script.isNil(global.Configuration)){
			return true;
		};
	};

	global.Config = {};
	return false;
};

Fabricare.saveConfig = function() {
	var cwd = Shell.getcwd();
	if(!Script.isNil(cwd)){
		cwd+="/";
	};

	return Shell.filePutContents(cwd+"fabricare.json",JSON.encodeWithIndentation(Config));
};

// ---
