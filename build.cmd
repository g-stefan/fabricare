@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

setlocal enableDelayedExpansion

set platform=
if not "%XYO_PLATFORM%" == "" set platform=%XYO_PLATFORM%

:parseArguments
set processArg=%1
set processArgPrefix=%processArg:~0,2%
if "%processArgPrefix%" == "--" (
	for /f "tokens=1,2 delims=:" %%a in ("%processArg%") do (
		if "%%a" == "--platform" (
			set platform=%%b
		)
	)
	shift
	goto :parseArguments
)

set action=%1
if "%1" == "" set action=default

if "%platform%" == "" (
	call ".\build\platform\detect.cmd"
)

if exist ".\build\platform\%platform%.cmd" (	
	call ".\build\platform\%platform%.cmd" %action%
	goto :eof
)

echo build [--platform:...] [action]
