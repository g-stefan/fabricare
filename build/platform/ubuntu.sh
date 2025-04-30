#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

. ./build/ubuntu.config.sh

RESTORE_PATH=$PATH
RESTORE_LD_LIBRARY_PATH=$LD_LIBRARY_PATH

PATH=$pathRepository/bin:$PATH
LD_LIBRARY_PATH=$pathRepository/bin:$LD_LIBRARY_PATH

if [ -d "output" ]; then
	POPD=$PWD
	cd output
	PATH=$PWD:$PATH
	LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
	cd $POPD
fi

action=$1
if [ "$action" = "" ]; then
	action=default
fi

if [ -f "./build/ubuntu.$action.sh" ]; then
	. ./build/ubuntu.$action.sh
	retV=$?
	PATH=$RESTORE_PATH
	LD_LIBRARY_PATH=$RESTORE_LD_LIBRARY_PATH
	export PATH
	export LD_LIBRARY_PATH
	if [ "$retV" = "1" ]; then
		exit 1
	fi
	exit 0
fi

if [ -f "./build/platform/ubuntu.$action.sh" ]; then
	. ./build/platform/ubuntu.$action.sh
	retV=$?
	PATH=$RESTORE_PATH
	LD_LIBRARY_PATH=$RESTORE_LD_LIBRARY_PATH
	export PATH
	export LD_LIBRARY_PATH
	if [ "$retV" = "1" ]; then
		exit 1
	fi
	exit 0
fi
	
echo  "* Error: Action $action not found!"
