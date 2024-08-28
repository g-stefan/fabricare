// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Platform.machine = "x64";
Platform.osName = "windows";
Platform.osType = "win64";
Platform.version = "2022.static";
Platform.path = "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build";

Shell.setenv("XYO_PLATFORM_COMPILE_STATIC","ON");
Shell.setenv("XYO_PLATFORM_COMPILE_CRT_STATIC","ON");

Fabricare.include("platform/win-msvc.run");
