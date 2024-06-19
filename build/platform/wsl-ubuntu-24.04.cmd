@echo off
rem Created by Grigore Stefan <g_stefan@yahoo.com>
rem Public domain (Unlicense) <http://unlicense.org>
rem SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
rem SPDX-License-Identifier: Unlicense

ubuntu2404.exe -c "platform=ubuntu-24.04 ./build/platform/wsl.sh %1"
