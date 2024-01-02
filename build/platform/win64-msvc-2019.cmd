@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

set platformMachine=win64
set platformVersion=2019
set platformPath=C:\Program Files (x86)\Microsoft Visual Studio\%platformVersion%\Community\VC\Auxiliary\Build\

if not "%XYO_PLATFORM%" == "" set platformActive=%XYO_PLATFORM%

if "%platformActive%" == "%platformMachine%-msvc-%platformVersion%" goto :process
pushd "%platformPath%"
call vcvarsall.bat x64
popd
set platformActive=%platformMachine%-msvc-%platformVersion%
set platform=%platformActive%

:process
call .\build\platform\msvc.cmd %1
