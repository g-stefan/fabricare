#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export platform=mingw64
export pathRepository=$HOME/SDK/mingw64
export pathRelease=$HOME/SDK/mingw64/release
export PATH=$PATH:/c/msys64/mingw64/bin/../libexec;

. ./build/ubuntu.config.sh

export WSL_BUILD_PROCESS_PATH=$HOME/SDK/mingw64/source/$project

/bin/sh -- ./build/platform/wsl.process.sh $1
RETV=$?

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
