// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (Script.isNil(Project.githubRelease)) {
	return;
};

if (!Project.githubRelease) {
	return;
};

messageAction("github-release-check");

var repository = Project.name;
if (!Script.isNil(Project.githubRepository)) {
	repository = Project.githubRepository;
};

var version = getVersion();

Shell.system("github-release info --repo " + repository + " --tag v" + version);
