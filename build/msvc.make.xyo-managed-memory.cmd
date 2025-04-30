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

set DEF=
set DEF= %DEF% /D_CRT_SECURE_NO_WARNINGS

rem set DEF= %DEF% /DXYO_TMEMORYPOOL_CHECK
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_CHECK_INFO
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_CHECK_COUNT_INFO
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_NEW_MEMORY_INFO
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_DELETE_MEMORY_INFO
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_CONSTRUCTOR_INFO
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_DESTRUCTOR_INFO
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_SYSTEM
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_ACTIVE_AS_UNIFIED
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_ACTIVE_LEVEL_IS_SYSTEM
rem set DEF= %DEF% /DXYO_TMEMORYPOOL_UNIFIED_AS_SYSTEM

rem ---
goto :expandDEFDefined
:expandDEF
if "%1" == "" goto :eof
set DEF=%DEF% /D%1
shift
goto :expandDEF
:expandDEFDefined

call :expandDEF %XYO_MANAGED_MEMORY_CONFIG%
rem ---

set INC=
set INC= %INC% /Ivendor\xyo-managed-memory\source

set SRC=
set SRC=%SRC% vendor\xyo-managed-memory\source\XYO\ManagedMemory.Config.cpp

call :cmdX %CXX% /std:c++17 /MD /Zi /EHsc /GR /TP %DEF% %INC% %SRC% /Fotemp\ /Fdtemp\xyo-managed-memory.config.pdb /Fetemp\xyo-managed-memory.config.exe

pushd "vendor\xyo-managed-memory"
if not exist temp\ mkdir temp
call :cmdX ..\..\temp\xyo-managed-memory.config.exe
popd
