// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("github-release-download");

Shell.mkdirRecursivelyIfNotExists("release");

var gitRepository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	gitRepository = Solution.githubRepository;
};

var version = getVersion();

var jsonString=ProcessInteractive.run("github-release info --repo " + gitRepository + " --tag \"v" + version + "\" --json");
// Skip console control chars
var index=jsonString.indexOf("{");
if(index>=0) {
	jsonString=jsonString.substring(index);
};

var json = JSON.decode(jsonString);
if (Script.isNil(json)) {
	Console.writeLn("Release not found for version " + version);
	return;
};

var releaseToDownload = json["Releases"];
var i, j;

for (i = 0; i < releaseToDownload.length; ++i) {
	Console.writeLn("Download release " + releaseToDownload[i]["tag_name"]);
	for (j = 0; j < releaseToDownload[i].assets.length; ++j) {
		Console.writeLn("\t- " + releaseToDownload[i].assets[j].name);
		if (!Shell.fileExists("release/" + releaseToDownload[i].assets[j].name)) {
			exitIf(Shell.system("curl --insecure --location \"" + releaseToDownload[i].html_url + "/" + releaseToDownload[i].assets[j].name + "\" --output \"release/" + releaseToDownload[i].assets[j].name + "\""));
			if (!(Shell.getFileSize("release/" + releaseToDownload[i].assets[j].name) > 16)) {
				Shell.remove("release/" + releaseToDownload[i].assets[j].name);
				messageError("download release");
				Script.exit(1);
			};
		};
	};
};
