@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: vendor

rem ---

if "%FABRICARE_SOURCE_GIT%" == "" set FABRICARE_SOURCE_GIT=https://github.com/g-stefan

rem ---

if not exist vendor\ mkdir vendor
pushd vendor

goto cmdVendorDefined
:cmdVendor
echo %FABRICARE_SOURCE_GIT%/%1
if not exist "%1" git clone --depth 1 %FABRICARE_SOURCE_GIT%/%1
if errorlevel 1 goto cmdVendorError
goto :eof
:cmdVendorError
echo %ESC%[31m* Error:%ESC%[0m vendor
exit 1
:cmdVendorDefined

echo Using %FABRICARE_SOURCE_GIT%
call :cmdVendor quantum-script
call :cmdVendor quantum-script--application
call :cmdVendor quantum-script--buffer
call :cmdVendor quantum-script--datetime
call :cmdVendor quantum-script--json
call :cmdVendor quantum-script--shell
call :cmdVendor quantum-script--shellfind
call :cmdVendor quantum-script--math
call :cmdVendor quantum-script--processinteractive
call :cmdVendor quantum-script--sha512
call :cmdVendor quantum-script--thread
call :cmdVendor quantum-script--task
call :cmdVendor quantum-script--job
call :cmdVendor quantum-script--make
call :cmdVendor quantum-script--csv
call :cmdVendor quantum-script--url
call :cmdVendor file-json
call :cmdVendor file-to-cs
call :cmdVendor file-to-rc
call :cmdVendor html-to-rc
call :cmdVendor xyo-cc
call :cmdVendor xyo-version
call :cmdVendor xyo-system
call :cmdVendor xyo-encoding
call :cmdVendor xyo-data-structures
call :cmdVendor xyo-managed-memory
call :cmdVendor xyo-multithreading
call :cmdVendor xyo-cryptography

popd
