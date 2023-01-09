// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Platform.machine = "x86";
Platform.osName = "windows";
Platform.osType = "win32";
Platform.version = "2022";
Platform.path = "C:\\Program Files\\Microsoft Visual Studio\\" + Platform.version + "\\Community\\VC\\Auxiliary\\Build";

Fabricare.include("platform/msvc.subroutine");
