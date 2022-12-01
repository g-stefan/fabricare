@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

ubuntu2204.exe -c "platform=ubuntu-22.04 ./build/platform/wsl.sh %1"
