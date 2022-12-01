#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export pathRepository=$HOME/SDK
export pathRelease=$HOME/SDK/release

. ./build/ubuntu.config.sh

# On WSL we must build on home folder to keep executable bits on files
WSL_BUILD_PROCESS_PATH=$HOME/SDK/source/$project

. ./build/platform/wsl.process.sh $1
RETV=$?

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
