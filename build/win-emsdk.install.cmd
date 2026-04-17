@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2026 Grigore Stefan <g_stefan@yahoo.com>
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

set pathRepository=%USERPROFILE%\.xyo-sdk\%platform%
if  not "%XYO_PLATFORM_PATH%" == "" set pathRepository=%XYO_PLATFORM_PATH%

if not exist %pathRepository%\bin\ mkdir %pathRepository%\bin

call :cmdX copy /Y /B output\bin\fabricare %pathRepository%\bin\fabricare
call :cmdX copy /Y /B output\bin\fabricare.wasm %pathRepository%\bin\fabricare.wasm
