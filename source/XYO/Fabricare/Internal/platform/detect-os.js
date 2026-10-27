// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// The operating system fabricare runs on: Platform.machine, .osName, .osType, .osVersion
// The compiler is not detected here

if (OS.isWindows()) {
	Platform.machine = "x64";
	Platform.osName = "windows";
	Platform.osType = "win64";

	if (Shell.getenv("PROCESSOR_ARCHITECTURE") == "x86") {
		Platform.machine = "x86";
		Platform.osType = "win32";
	};
	return;
};

if (OS.isEmscripten()) {
	Platform.machine = "x32";
	Platform.osName = "emscripten";
	Platform.osType = "emscripten";
	return;
};

if (OS.isLinux()) {
	Platform.osName = "linux";
	Platform.osType = "linux";

	var machine = ProcessInteractive.run("uname -m");
	if (!Script.isNil(machine)) {
		machine = machine.trim().toLowerCaseASCII();
		if (machine == "x86_64") {
			machine = "x64";
		};
		if ((machine == "i386") || (machine == "i686")) {
			machine = "x86";
		};
		if (machine == "aarch64") {
			machine = "arm64";
		};
		if (machine.length > 0) {
			Platform.machine = machine;
		};
	};

	// lsb_release, or /etc/os-release if lsb_release is not installed
	var id = ProcessInteractive.run("/bin/sh -c \"lsb_release --id 2>/dev/null | cut -d ':' -f 2\"");
	var release = ProcessInteractive.run("/bin/sh -c \"lsb_release --release 2>/dev/null | cut -d ':' -f 2\"");
	id = Script.isNil(id) ? "" : id.trim().toLowerCaseASCII();
	release = Script.isNil(release) ? "" : release.trim().toLowerCaseASCII();

	if ((id.length == 0) || (release.length == 0)) {
		var osRelease = Shell.fileGetContents("/etc/os-release");
		if (!Script.isNil(osRelease)) {
			for (var line of osRelease.split("\n")) {
				var index = line.indexOf("=");
				if (index <= 0) {
					continue;
				};
				var key = line.substring(0, index).trim();
				var value = line.substring(index + 1, line.length - index - 1).trim().replace("\"", "").replace("'", "").toLowerCaseASCII();
				if (key == "ID") {
					id = value;
				};
				if (key == "VERSION_ID") {
					release = value;
				};
			};
		};
	};

	if (id.length > 0) {
		Platform.osName = id;
	};
	if (release.length > 0) {
		Platform.osVersion = release;
	};
	return;
};
