@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

goto buildAndInstallDefined
:buildAndInstall
if "%1" == "" goto :eof

cmd.exe /C "build.cmd --platform:%1 clean"
cmd.exe /C "build.cmd --platform:%1"
cmd.exe /C "build.cmd --platform:%1 install"
cmd.exe /C "build.cmd --platform:%1 clean"

goto :eof
:buildAndInstallDefined

for /F "eol=# tokens=1" %%i in (.\install-platforms.txt) do call :buildAndInstall %%i

