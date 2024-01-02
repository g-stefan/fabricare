@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: make

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
set PATH=%CD%\temp;%PATH%

if not exist temp\xyo-managed-memory.config.exe call :cmdX cmd.exe /C ".\build\msvc.make.xyo-managed-memory.cmd"
if not exist temp\xyo-system.config.exe         call :cmdX cmd.exe /C ".\build\msvc.make.xyo-system.cmd"
if not exist temp\xyo-cc.exe                    call :cmdX cmd.exe /C ".\build\msvc.make.xyo-cc.cmd"
if not exist temp\file-to-cs.exe                call :cmdX xyo-cc.exe --output-path=temp @build/file-to-cs.compile.json
if not exist temp\fabricare-prepare.exe         call :cmdX xyo-cc.exe --output-path=temp @build/fabricare-prepare.compile.json

call :cmdX fabricare-prepare.exe

pushd "source\XYO\Fabricare"
call :cmdX file-to-cs --touch=Library.cpp --file-in=Library.js --file-out=Library.Source.cpp --is-string --name=librarySource
call :cmdX file-to-cs --touch=Application.cpp --file-in=Process.js --file-out=Process.Source.cpp --is-string --name=processSource
popd

call :cmdX xyo-cc.exe --output-path=output/bin @build/fabricare.compile.json
