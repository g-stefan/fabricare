@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

for /F %%a in ('echo prompt $E ^| cmd') do set ESC=%%a
echo - %ESC%[32m%project%%ESC%[0m: vendor

rem ---

set SOURCE_HOST=https://github.com/g-stefan

rem ---

if not exist vendor\ mkdir vendor
pushd vendor

goto cmdVendorDefined
:cmdVendor
echo %1
if not exist "%1" git clone --depth 1 %SOURCE_HOST%/%1
if errorlevel 1 goto cmdVendorError
goto :eof
:cmdVendorError
echo %ESC%[31m* Error:%ESC%[0m vendor
exit 1
:cmdVendorDefined


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
