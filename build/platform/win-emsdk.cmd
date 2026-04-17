@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2026 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense


setlocal

set platformPath=C:\emsdk

if not "%XYO_PLATFORM%" == "" set platformActive=%XYO_PLATFORM%

if "%platformActive%" == "emscripten" goto :process
pushd "%platformPath%"
call emsdk_env.bat
popd
set platformActive=emscripten
set platform=%platformActive%
set XYO_PLATFORM_PATH=
set XYO_PLATFORM=emscripten

:process

if not exist .\output\ goto :buildStep
pushd .\output
set PATH=%CD%;%PATH%	
popd
:buildStep

if exist .\build\win-emsdk.config.cmd call .\build\win-emsdk.config.cmd

set action=%1
if "%1" == "" set action=default

if exist ".\build\win-emsdk.%action%.cmd" (
	call ".\build\win-emsdk.%action%.cmd"
	goto :eof
)

if exist ".\build\platform\win-emsdk.%action%.cmd" (
	call ".\build\platform\win-emsdk.%action%.cmd"
	goto :eof
)

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo %ESC%[31m* Error:%ESC%[0m Action %ESC%[33m%action%%ESC%[0m not found!
