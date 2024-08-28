@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
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

if "%CXX%" == "" set CXX=cl

rem ---

set DEF=
set DEF= %DEF% /DXYO_PLATFORM_OS_WINDOWS
set DEF= %DEF% /DXYO_PLATFORM_COMPILER_MSVC
if "%platform%" == "win64-msvc-2022" set DEF= %DEF% /DXYO_PLATFORM_64BIT
if "%platform%" == "win32-msvc-2022" set DEF= %DEF% /DXYO_PLATFORM_32BIT
if "%platform%" == "win64-msvc-2019" set DEF= %DEF% /DXYO_PLATFORM_64BIT
if "%platform%" == "win32-msvc-2019" set DEF= %DEF% /DXYO_PLATFORM_32BIT
if "%platform%" == "win64-msvc-2017" set DEF= %DEF% /DXYO_PLATFORM_64BIT
if "%platform%" == "win32-msvc-2017" set DEF= %DEF% /DXYO_PLATFORM_32BIT
set DEF= %DEF% /D_CRT_SECURE_NO_WARNINGS
set DEF= %DEF% /DXYO_PLATFORM_MULTI_THREAD
set DEF= %DEF% /DXYO_PLATFORM_NAME="%platform%"

rem set DEF= %DEF% /DXYO_PLATFORM_MEMORY_LEAK_DETECTOR_VLD

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
set INC= %INC% /Ivendor\xyo-platform\source

set SRC=
set SRC=%SRC% vendor\xyo-platform\source\XYO\Platform.Config.cpp

call :cmdX %CXX% /std:c++17 /MD /Zi /EHsc /GR /TP %DEF% %INC% %SRC% /Fotemp\ /Fdtemp\xyo-platform.config.pdb /Fetemp\xyo-platform.config.exe

pushd "vendor\xyo-platform"
if not exist temp\ mkdir temp
call :cmdX ..\..\temp\xyo-platform.config.exe
popd
