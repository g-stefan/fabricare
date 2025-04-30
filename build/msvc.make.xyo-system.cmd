@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
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

set INC=
set INC= %INC% /Ivendor\xyo-system\source

set DEF=

set SRC=
set SRC=%SRC% vendor\xyo-system\source\XYO\System.Config.cpp

call :cmdX %CXX% /std:c++17 /MD /Zi /EHsc /GR /TP %DEF% %INC% %SRC% /Fotemp\ /Fdtemp\xyo-system.config.pdb /Fetemp\xyo-system.config.exe

pushd "vendor\xyo-system"
if not exist temp\ mkdir temp
call :cmdX ..\..\temp\xyo-system.config.exe
popd 
