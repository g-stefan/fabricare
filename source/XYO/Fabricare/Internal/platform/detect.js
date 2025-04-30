// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (OS.isWindows()) {

	Platform.machine = "x64";
	Platform.osName = "windows";
	Platform.osType = "win64";

	if (Shell.getenv("PROCESSOR_ARCHITECTURE") == "x86") {
		Platform.machine = "x86";
		Platform.osName = "windows";
		Platform.osType = "win32";
	};

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

	Platform.version = "2022";
	Platform.path = "C:\\Program Files\\Microsoft Visual Studio\\" + Platform.version + "\\Community\\VC\\Auxiliary\\Build";
	if (Shell.fileExists(Platform.path + "\\vcvarsall.bat")) {
		Platform.name = Platform.osType + "-msvc-" + Platform.version;
		return;
	};

	Platform.version = "2019";
	Platform.path = "C:\\Program Files (x86)\\Microsoft Visual Studio\\" + Platform.version + "\\Community\\VC\\Auxiliary\\Build";
	if (Shell.fileExists(Platform.path + "\\vcvarsall.bat")) {
		Platform.name = Platform.osType + "-msvc-" + Platform.version;
		return;
	};

	Platform.version = "2017";
	Platform.path = "C:\\Program Files (x86)\\Microsoft Visual Studio\\" + Platform.version + "\\Community\\VC\\Auxiliary\\Build";
	if (Shell.fileExists(Platform.path + "\\vcvarsall.bat")) {
		Platform.name = Platform.osType + "-msvc-" + Platform.version;
		return;
	};
};

if (OS.isLinux()) {
	var info = ProcessInteractive.run("uname -s").trim().toLowerCaseASCII();
	if (info.indexOf("linux") >= 0) {
		var id=ProcessInteractive.run("/bin/sh -c \"lsb_release --id | cut -d ':' -f 2\"").trim().toLowerCaseASCII();
		var release=ProcessInteractive.run("/bin/sh -c \"lsb_release --release | cut -d ':' -f 2\"").trim().toLowerCaseASCII();
		Platform.name = id + "-" + release;
		return;
	};
};
