@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo -^> test fabricare

goto StepX
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: test"
exit 1
:StepX

call :cmdX output\fabricare --execution-time test/test.0001.js
