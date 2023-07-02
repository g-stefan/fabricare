#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export platform=mingw64
export pathRepository=$HOME/.xyo-sdk/mingw64
export pathRelease=$HOME/.xyo-sdk/mingw64/release
export PATH=$PATH:/c/msys64/mingw64/bin/../libexec;

. ./build/platform/ubuntu.sh $1
RETV=$?
if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
