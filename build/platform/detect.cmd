@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

set platformMachine=win64
if  "%PROCESSOR_ARCHITECTURE%" == "x86" set platformMachine=win32

set platformVersion=2022
set platformPath=C:\Program Files\Microsoft Visual Studio\%platformVersion%\Community\VC\Auxiliary\Build\
if exist "%platformPath%\vcvarsall.bat" goto :PlatformDetected
set platformPath=2019
set platformPath=C:\Program Files (x86)\Microsoft Visual Studio\%platformVersion%\Community\VC\Auxiliary\Build\
if exist "%platformPath%\vcvarsall.bat" goto :PlatformDetected
set platformPath=2017
set platformPath=C:\Program Files (x86)\Microsoft Visual Studio\%platformVersion%\Community\VC\Auxiliary\Build\
if exist "%platformPath%\vcvarsall.bat" goto :PlatformDetected
goto :eof

:PlatformDetected

set platform=%platformMachine%-msvc-%platformVersion%
