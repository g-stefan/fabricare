@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: test

rem ---

goto cmdTestXDefined
:cmdTestX
echo * %ESC%[33m%*%ESC%[0m
%*
if errorlevel 1 goto cmdXError
echo - %ESC%[33m%*%ESC%[0m %ESC%[32mPass%ESC%[0m
goto :eof
:cmdXError
echo - %ESC%[31m%*%ESC%[0m %ESC%[31mFAIL%ESC%[0m
exit 1
:cmdTestXDefined

rem ---

pushd output
call :cmdTestX fabricare --run-script=../test/test.01.js
popd
