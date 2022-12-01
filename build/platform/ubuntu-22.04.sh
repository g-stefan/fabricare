#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export platform="ubuntu-22.04"

/bin/sh -- ./build/platform/ubuntu.sh $1
RETV=$?

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
