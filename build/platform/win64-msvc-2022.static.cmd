@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

set platformMachine=win64
set platformVersion=2022.static
set platformPath=C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\

set XYO_PLATFORM_COMPILE_STATIC=ON
set XYO_PLATFORM_COMPILE_CRT_STATIC=ON

if not "%XYO_PLATFORM%" == "" set platformActive=%XYO_PLATFORM%

if "%platformActive%" == "%platformMachine%-msvc-%platformVersion%" goto :process
pushd "%platformPath%"
call vcvarsall.bat x64
popd
set platformActive=%platformMachine%-msvc-%platformVersion%
set platform=%platformActive%
set XYO_PLATFORM_PATH=

:process
call .\build\platform\msvc.cmd %1
