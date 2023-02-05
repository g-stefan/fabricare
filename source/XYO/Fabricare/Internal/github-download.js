// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (Script.isNil(Solution.hasGithub)) {
	return;
};

if (!Solution.hasGithub) {
	return;
};

messageAction("github-download");

Shell.mkdirRecursivelyIfNotExists("release");

var repository = Solution.name;
if (!Script.isNil(Solution.githubRepository)) {
	repository = Solution.githubRepository;
};

var version = getVersion();

var json = JSON.decode(Fabricare.runInteractive("github-release info --repo " + repository + " --tag \"v" + version + "\" --json"));
if (Script.isNil(json)) {
	exit(1, "Release not found for version " + version);
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
