// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

(function() {

if (Application.getFlagValue("run-script")) {
	return;
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

// ---

})();
