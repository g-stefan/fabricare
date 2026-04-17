@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: release

rem ---

goto cmdXDefined
:cmdX
echo %*
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo %ESC%[31m* Error:%ESC%[0m release
exit 1
:cmdXDefined

rem ---

call :cmdX call node output/bin/fabricare release

