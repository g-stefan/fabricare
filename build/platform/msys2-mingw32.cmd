@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

set CHERE_INVOKING=enabled_from_arguments
set SHLVL=2
set MSYSTEM=MINGW32
C:\msys64\usr\bin\sh --login -- ./build/platform/msys2-mingw32.sh %1
