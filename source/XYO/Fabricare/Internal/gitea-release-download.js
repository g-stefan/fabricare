// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("gitea-release-download");

Shell.mkdirRecursivelyIfNotExists("release");

var gitRepository = Solution.name;
if (!Script.isNil(Solution.giteaRepository)) {
	gitRepository = Solution.giteaRepository;
};

var version = getVersion();

var releaseToDownload = csvDecode(ProcessInteractive.run("tea releases list --output csv --repo " + gitRepository));

if (releaseToDownload.length <= 1) {
	Console.writeLn("No releases");
	return;
};

var found = false;
var tarFile = null;
var tagName = "v" + version;

for (var i = 1; i < releaseToDownload.length; ++i) {
	if (releaseToDownload[i].length < 5) {
		continue;
	};
	if (releaseToDownload[i][0] == tagName) {
		found = true;
		tarFile = releaseToDownload[i][4];
		break;
	};
};

if (!found) {
	Console.writeLn("Release " + tagName + " not found!");
	return;
};


var userAndRepo = Shell.getFilePath(Shell.getFilePath(URL.getPathAndFileName(tarFile))).substring(1);
var curlCMD = "curl --silent --insecure -X \"GET\" \"" + URL.getSchemeName(tarFile) + "://" + URL.getHostNameAndPort(tarFile) + "/api/v1/repos/" + userAndRepo + "/releases/tags/" + tagName + "\"";
curlCMD += " -H \"accept: application/json\"";
if (Shell.hasEnv("GITEA_TOKEN")) {
	curlCMD += " -H \"Authorization: token " + Shell.getenv("GITEA_TOKEN") + "\"";
};

var jsonString = ProcessInteractive.run(curlCMD);
// Skip console control chars
var index = jsonString.indexOf("{");
if (index >= 0) {
	jsonString = jsonString.substring(index);
};

var json = JSON.decode(jsonString);
if (Script.isNil(json)) {
	Console.writeLn("Release not found for version " + version);
	return;
};

if (Script.isNil(json.tag_name)) {
	Console.writeLn("Release not found for version " + version);
	return;
};
if (json.tag_name != tagName) {
	Console.writeLn("Release not found for version " + version);
	return;
};

var releasePrefix = getReleasePrefix();

for (var i = 0; i < json.assets.length; ++i) {
	if ((json.assets[i].name.indexOf(releasePrefix + ".v" + version) == 0) || (json.assets[i].name.indexOf(releasePrefix + ".v" + version + ".sha512.json") == 0)) {
		var fileName = "release/" + json.assets[i].name;
		if (json.assets[i].name.indexOf(releasePrefix + ".v" + version + ".zip") == 0) {
			Shell.mkdirRecursivelyIfNotExists("archive");
			fileName = "archive/" + json.assets[i].name;
		};
		if (!Shell.fileExists(fileName)) {
			var curlCMD = "curl --insecure -X \"GET\" \"" + json.assets[i].browser_download_url + "\"";
			if (Shell.hasEnv("GITEA_TOKEN")) {
				curlCMD += " -H \"Authorization: token " + Shell.getenv("GITEA_TOKEN") + "\"";
			};
			curlCMD += " --output \"" + fileName + "\"";
			exitIf(Shell.system(curlCMD));
			if (!(Shell.getFileSize(fileName) > 16)) {
				Shell.remove(fileName);
				messageError("download release");
				Script.exit(1);
			};
		};
	};
};

