// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (!Script.isNil(Project.githubRelease)) {
	if (!Project.githubRelease) {
		return;
	};
};

messageAction("github-release-check");

var versionInfo = getVersion();
var version = version[Project.name].version;

Shell.system("github-release info --repo " + Project.name + " --tag v" + version);
