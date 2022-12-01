// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Platform.machine = "x86";
Platform.osName = "windows";
Platform.osType = "win32";
Platform.version = "2017";
Platform.path = "C:\\Program Files (x86)\\Microsoft Visual Studio\\" + Platform.version + "\\Community\\VC\\Auxiliary\\Build";

Fabricare.include("platform.msvc.subroutine");
