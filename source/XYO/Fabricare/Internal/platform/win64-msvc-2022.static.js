// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Platform.name = "win64-msvc-2022.static";
Platform.machine = "x64";
Platform.osName = "windows";
Platform.osType = "win64";
Platform.compilerType = "msvc";
Platform.compilerVersion = "2022";
Platform.path = "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build";

Shell.setenv("XYO_PLATFORM_COMPILE_STATIC","ON");
Shell.setenv("XYO_PLATFORM_COMPILE_CRT_STATIC","ON");

Fabricare.include("platform/win-msvc.run");
