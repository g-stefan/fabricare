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

set DEF=
set DEF= %DEF% -DXYO_PLATFORM_OS_EMSCRIPTEN
set DEF= %DEF% -DXYO_PLATFORM_COMPILER_GCC
set DEF= %DEF% -DXYO_PLATFORM_32BIT
set DEF= %DEF% -DXYO_PLATFORM_MULTI_THREAD
set DEF= %DEF% -DXYO_PLATFORM_NAME="%platform%"

rem ---
goto :expandDEFDefined
:expandDEF
if "%1" == "" goto :eof
set DEF=%DEF% /D%1
shift
goto :expandDEF
:expandDEFDefined

call :expandDEF %XYO_PLATFORM_CONFIG%
rem ---

set INC=
set INC= %INC% -Ivendor/xyo-platform/source

set SRC=
set SRC=%SRC% vendor\xyo-platform\source\XYO\Platform.Config.cpp

call :cmdX call %CXX% -o temp/xyo-platform.config -O1 -std=c++17 -std=gnu++17 %DEF% %INC% %SRC% -lstdc++ -lpthread -lm -s NODERAWFS=1 -pthread

pushd "vendor\xyo-platform"
if not exist temp\ mkdir temp
call :cmdX call node ..\..\temp\xyo-platform.config
popd
