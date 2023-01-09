@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

ubuntu2004.exe -c "platform=ubuntu-20.04 ./build/platform/wsl.sh %1"
