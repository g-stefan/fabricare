@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

rem ---

goto cmdXDefined
:cmdX
echo %*
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo %ESC%[31m* Error:%ESC%[0m make
exit 1
:cmdXDefined

rem ---

if not exist output\ mkdir output
if not exist temp\ mkdir temp

if "%CXX%" == "" set CXX=emcc

rem ---

set INC=
set INC= %INC% -Ivendor/xyo-system/source

set DEF=

set SRC=
set SRC=%SRC% vendor/xyo-system/source/XYO/System.Config.cpp

call :cmdX call %CXX% -o temp/xyo-system.config -O1 -std=c++17 -std=gnu++17 %DEF% %INC% %SRC% -lstdc++ -lpthread -lm -s NODERAWFS=1 -pthread

pushd "vendor\xyo-system"
if not exist temp\ mkdir temp
call :cmdX call node ..\..\temp\xyo-system.config
popd 
