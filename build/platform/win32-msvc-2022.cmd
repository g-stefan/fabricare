@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

set platformMachine=win32
set platformVersion=2022
set platformPath=C:\Program Files\Microsoft Visual Studio\%platformVersion%\Community\VC\Auxiliary\Build\

if not "%XYO_PLATFORM%" == "" set platformActive=%XYO_PLATFORM%

if "%platformActive%" == "%platformMachine%-msvc-%platformVersion%" goto :process
pushd "%platformPath%"
call vcvarsall.bat x86
popd
set platformActive=%platformMachine%-msvc-%platformVersion%
set platform=%platformActive%
set XYO_PLATFORM_PATH=

:process
call .\build\platform\msvc.cmd %1
