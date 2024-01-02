#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

if [ "$1" = "clean" ]; then
	rm -rf $WSL_BUILD_PROCESS_PATH
	exit 0
fi

[ -d $WSL_BUILD_PROCESS_PATH ] || mkdir -p $WSL_BUILD_PROCESS_PATH

if [ "$1" = "default" ]; then
	rsync --progress -avz --numeric-ids --delete-before --relative -LK ./ $WSL_BUILD_PROCESS_PATH
fi

WSL_POPD=$PWD
cd $WSL_BUILD_PROCESS_PATH

chmod -R -x+X source
[ -d ./vendor/ ] && chmod -R -x+X vendor

/bin/sh -- ./build/platform/ubuntu.sh $1
RETV=$?

cd $WSL_POPD

if [ "$1" = "release" ]; then
	[ -d ./release ] || mkdir -p ./release 
	if ls $WSL_BUILD_PROCESS_PATH/release/*.7z 1> /dev/null 2>&1; then
		cp -rfu $WSL_BUILD_PROCESS_PATH/release/*.7z ./release/
	fi
	if ls $WSL_BUILD_PROCESS_PATH/release/*.json 1> /dev/null 2>&1; then
		cp -rfu $WSL_BUILD_PROCESS_PATH/release/*.json ./release/
	fi
fi

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
