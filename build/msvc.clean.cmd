@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: clean

rem ---

if exist output\ rmdir /Q /S output
if exist temp\ rmdir /Q /S temp

rmdir /Q /S source\XYO\Fabricare\Internal.Source
del /Q /F source\XYO\Fabricare\Internal.Source.cpp
del /Q /F source\XYO\Fabricare\Library.Source.cpp

