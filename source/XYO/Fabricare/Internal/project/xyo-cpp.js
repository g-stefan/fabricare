// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.subroutine = "project/xyo-cpp.subroutine";

// ---

if (Fabricare.action == "install") {
	if (!Script.isNil(Project.noInstall)) {
		if (Project.noInstall) {
			return;
		};
	};
};

if (Fabricare.action == "version" || Fabricare.action == "version-patch" || Fabricare.action == "version-minor" || Fabricare.action == "version-major") {
	if (!Script.isNil(Project.noVersion)) {
		if (Project.noVersion) {
			return;
		};
	};

	if (!Script.isNil(Project.linkVersion)) {
		return;
	};
};

if (Fabricare.action == "release") {
	if (!Script.isNil(Project.noRelease)) {
		if (Project.noRelease) {
			return;
		};
	};
};

// ---

Platform.name = Application.getFlagValue("platform");
if (!Platform.name) {
	Fabricare.include("platform/detect");
};

if (!Fabricare.include("platform/" + Platform.name)) {
	Console.writeLn("Error: Platform " + Platform.name + " not found!");
	Script.exit(1);
};
