@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

set CHERE_INVOKING=enabled_from_arguments
set SHLVL=2
set MSYSTEM=MINGW64
C:\msys64\usr\bin\sh --login -- ./build/platform/sys-mingw64.sh %1
