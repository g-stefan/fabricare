// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Platform.machine = "x64";
Platform.osName = "windows";
Platform.osType = "win64";
Platform.version = "2019";
Platform.path = "C:\\Program Files (x86)\\Microsoft Visual Studio\\" + Platform.version + "\\Community\\VC\\Auxiliary\\Build";

Fabricare.include("platform/msvc.subroutine");
