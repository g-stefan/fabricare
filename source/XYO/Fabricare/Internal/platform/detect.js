// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("platform/detect-os");

if (OS.isWindows()) {

	if (Shell.getenv("XYO_PLATFORM") != "") {
		Platform.name = Shell.getenv("XYO_PLATFORM");
		return;
	};

	if (Shell.getenv("MSYSTEM") == "MINGW32") {
		Platform.name = "mingw32";
		return;
	};

	if (Shell.getenv("MSYSTEM") == "MINGW64") {
		Platform.name = "mingw64";
		return;
	};

	if (Shell.getenv("MSYSTEM") == "UCRT64") {
		Platform.name = "ucrt64";
		return;
	};

	// Newest Visual Studio first
	var msvcList = [
		["2026", "C:\\Program Files\\Microsoft Visual Studio\\18\\Community\\VC\\Auxiliary\\Build"],
		["2022", "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build"],
		["2019", "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\VC\\Auxiliary\\Build"],
		["2017", "C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\VC\\Auxiliary\\Build"]
	];
	for (var msvc of msvcList) {
		if (Shell.fileExists(msvc[1] + "\\vcvarsall.bat")) {
			Platform.compilerType = "msvc";
			Platform.compilerVersion = msvc[0];
			Platform.path = msvc[1];
			Platform.name = Platform.osType + "-msvc-" + Platform.compilerVersion;
			return;
		};
	};

	// No compiler found
	return;
};

if (OS.isEmscripten()) {
	Platform.name = "emscripten";
	return;
};

if (OS.isLinux()) {
	if ((Platform.osName != "linux") && (Platform.osVersion != "unknown")) {
		Platform.name = Platform.osName + "-" + Platform.osVersion;
	};
	return;
};
