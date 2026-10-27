// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

(function() {

if (Application.getFlagValue("run-script")) {
	return;
};

// ---

Platform.name = Application.getFlagValue("platform");
if (Platform.name) {
	if (!Fabricare.include("platform/" + Platform.name)) {
		Console.writeLn("Error: Platform " + Platform.name + " not found!");
		Script.exit(1);
	};
	return;
};

Fabricare.include("platform/detect");
if (Platform.name) {
	if (Fabricare.include("platform/" + Platform.name)) {
		return;
	};
};

// No compiler platform found (or no descriptor for it), only the operating system is known
Platform.name = "unknown";
Fabricare.include("platform/unknown");

// ---

})();
