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
set DEF= %DEF% /D_CRT_SECURE_NO_WARNINGS
set DEF= %DEF% /DXYO_PLATFORM_NO_VERSION
set DEF= %DEF% /DXYO_MANAGEDMEMORY_NO_VERSION
set DEF= %DEF% /DXYO_DATASTRUCTURES_NO_VERSION
set DEF= %DEF% /DXYO_MULTITHREADING_NO_VERSION
set DEF= %DEF% /DXYO_ENCODING_NO_VERSION
set DEF= %DEF% /DXYO_SYSTEM_NO_VERSION
set DEF= %DEF% /DXYO_FILEJSON_NO_VERSION
set DEF= %DEF% /DXYO_CPPCOMPILERCOMMANDDRIVER_NO_VERSION
set DEF= %DEF% /DXYO_CPPCOMPILERCOMMANDDRIVER_APPLICATION_NO_VERSION

set INC=
set INC= %INC% /Ivendor\xyo-cc\source
set INC= %INC% /Ivendor\xyo-platform\source
set INC= %INC% /Ivendor\xyo-managed-memory\source
set INC= %INC% /Ivendor\xyo-data-structures\source
set INC= %INC% /Ivendor\xyo-multithreading\source
set INC= %INC% /Ivendor\xyo-encoding\source
set INC= %INC% /Ivendor\xyo-system\source
set INC= %INC% /Ivendor\file-json\source

set SRC=
set SRC=%SRC% vendor\xyo-cc\source\XYO\CPPCompilerCommandDriver.Application.Amalgam.cpp
set SRC=%SRC% vendor\file-json\source\XYO\FileJSON.Amalgam.cpp
set SRC=%SRC% vendor\xyo-platform\source\XYO\Platform.Amalgam.cpp
set SRC=%SRC% vendor\xyo-managed-memory\source\XYO\ManagedMemory.Amalgam.cpp
set SRC=%SRC% vendor\xyo-data-structures\source\XYO\DataStructures.Amalgam.cpp
set SRC=%SRC% vendor\xyo-multithreading\source\XYO\Multithreading.Amalgam.cpp
set SRC=%SRC% vendor\xyo-encoding\source\XYO\Encoding.Amalgam.cpp
set SRC=%SRC% vendor\xyo-system\source\XYO\System.Amalgam.cpp

call :cmdX %CXX% /std:c++17 /MTd /Zi /EHsc /GR /TP %DEF% %INC% %SRC% /Fotemp\ /Fdtemp\xyo-cc.pdb /Fetemp\xyo-cc.exe
