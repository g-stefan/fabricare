#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export platform=ucrt64
export pathRepository=$HOME/.xyo-sdk/ucrt64
export pathRelease=$HOME/.xyo-sdk/ucrt64/release
export PATH=$PATH:/c/msys64/ucrt64/bin/../libexec;

. ./build/ubuntu.config.sh

export WSL_BUILD_PROCESS_PATH=$HOME/.xyo-sdk/ucrt64/source/$project

/bin/sh -- ./build/platform/wsl.process.sh $1
RETV=$?

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
