#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export platform="ubuntu-20.04"
export pathRepository=$HOME/.xyo-sdk/$platform
export pathRelease=$HOME/.xyo-sdk/$platform/release

/bin/sh -- ./build/platform/ubuntu.sh $1
RETV=$?

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
