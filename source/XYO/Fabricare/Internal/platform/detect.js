// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
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
	var info = Fabricare.runInteractive("uname -s").trim();
	if (info.indexOf("Linux") >= 0) {
		Platform.name = "ubuntu";
		if (Shell.fileExists("/etc/lsb-release")) {
			var release = Fabricare.runInteractive("/bin/sh -c \"cat /etc/lsb-release | grep DISTRIB_RELEASE | cut -d \\\"=\\\" -f 2\"").trim();
			Platform.name += "-" + release;
		};
		return;
	};
};
