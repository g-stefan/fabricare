@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: default

rem ---

cmd.exe /C "build\platform\msvc.cmd make"
