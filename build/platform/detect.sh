#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

if [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
	export platform="ubuntu"
	if [ -f "/etc/lsb-release" ]; then
		RELEASE=`cat /etc/lsb-release | grep DISTRIB_RELEASE| cut -d "=" -f 2`
		export platform="ubuntu-$RELEASE"
	fi
	if command -v termux-setup-storage >/dev/null; then
		export platform="termux"
	fi
fi

if [ "$(expr substr $(uname -s) 1 10)" = "MINGW32_NT" ]; then
	export platform="mingw32"
fi

if [ "$(expr substr $(uname -s) 1 10)" = "MINGW64_NT" ]; then
	export platform="mingw64"
fi
