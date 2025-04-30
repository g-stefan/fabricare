#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

if [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
	export ID=`lsb_release --id | cut -d ':' -f 2 | sed -e 's/\(.*\)/\L\1/' | xargs`
	export RELEASE=`lsb_release --release | cut -d ':' -f 2 | xargs`
	export platform="$ID-$RELEASE"
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
