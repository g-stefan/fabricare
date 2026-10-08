// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// flagExtra: the options forwarded when fabricare starts itself again in a
// compiler environment (win-msvc, win-emsdk, msys2-mingw, wsl)

var testName = "05";
Script.include("test/test.common.js");

var saveArguments = Application.arguments;

// Every --flag, in order, project flags too; not the action and not the
// flags the restart sets itself
Application.arguments = [
	"--platform=win64-msvc-2022",
	"--sdk",
	"--no-vendor",
	"--workspace=C:\\project\\fabricare.json",
	"--platform-subroutine=true",
	"--only-vendor",
	"--platform-active=win64-msvc-2022",
	"release-exists",
	"--use-no-release",
	"--commit",
	"--debug",
	"--config=custom.json",
	"--release-path=C:\\release",
	"--",
	"extra"
];

check("flagExtra", flagExtra().join(" "), "--sdk --no-vendor --only-vendor --use-no-release --commit --debug --config=custom.json --release-path=C:\\release");
check("subroutineArgumentsExtra", subroutineArgumentsExtra(), "--sdk\r\n--no-vendor\r\n--only-vendor\r\n--use-no-release\r\n--commit\r\n--debug\r\n--config=custom.json\r\n--release-path=C:\\release\r\n");
check("cmdArgumentsExtra", cmdArgumentsExtra(), "\"--sdk\" \"--no-vendor\" \"--only-vendor\" \"--use-no-release\" \"--commit\" \"--debug\" \"--config=custom.json\" \"--release-path=C:\\release\" ");

// Only the name before "=" is matched: a flag that starts like an excluded
// one is forwarded
Application.arguments = [
	"--platform-name=x",
	"--workspaces",
	"make"
];
check("flagExtra prefix", flagExtra().join(" "), "--platform-name=x --workspaces");

// Nothing to forward
Application.arguments = [
	"--platform=win64-msvc-2022",
	"make"
];
check("flagExtra empty", flagExtra().length, 0);
check("subroutineArgumentsExtra empty", subroutineArgumentsExtra(), "");

Application.arguments = saveArguments;

testDone();
