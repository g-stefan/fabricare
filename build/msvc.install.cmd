@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: install

rem ---

goto cmdXDefined
:cmdX
echo %*
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo %ESC%[31m* Error:%ESC%[0m install
exit 1
:cmdXDefined

rem ---

set pathHome=%HOMEDRIVE%%HOMEPATH%
set pathRepository=%pathHome%\SDK\%platform%

if not exist %pathRepository%\bin\ mkdir %pathRepository%\bin

call :cmdX copy /Y /B output\bin\fabricare.exe %pathRepository%\bin\fabricare.exe
