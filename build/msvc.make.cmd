@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set ACTION=%1
if "%1" == "" set ACTION=make

echo - %BUILD_PROJECT% ^> %ACTION%

goto cmdXDefined
:cmdX
cmd.exe /C "%*"
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: %ACTION%"
exit 1
:cmdXDefined

call :cmdX file-to-cs --touch=source/fabricare.cpp --file-in=source/fabricare.js --file-out=source/fabricare.src --is-string --name=fabricareSource
call :cmdX xyo-cc --mode=%ACTION% @build/source/fabricare.compile --use-lib=crypt32
call :cmdX xyo-cc --mode=%ACTION% @build/source/fabricarew.compile --use-lib=crypt32
