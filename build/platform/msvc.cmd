@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

setlocal 

if not exist .\output\ goto :buildStep
pushd .\output
set PATH=%CD%;%PATH%	
popd
:buildStep

if exist .\build\msvc.config.cmd call .\build\msvc.config.cmd

set action=%1
if "%1" == "" set action=default

if exist ".\build\msvc.%action%.cmd" (
	call ".\build\msvc.%action%.cmd"
	goto :eof
)

if exist ".\build\platform\msvc.%action%.cmd" (
	call ".\build\platform\msvc.%action%.cmd"
	goto :eof
)

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo %ESC%[31m* Error:%ESC%[0m Action %ESC%[33m%action%%ESC%[0m not found!
