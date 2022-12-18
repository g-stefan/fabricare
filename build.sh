#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

export platform=

for arg in "$@"
do
	case "$arg" in
		--platform:*)
			export platform=${arg:11}
			shift
            	;;
	esac
done

action=$1
if [ "$action" = "" ]; then
	action=default
fi

if [ "$platform" = "" ]; then
	. ./build/platform/detect.sh
fi

if [ -f "./build/platform/$platform.sh" ]; then
	. ./build/platform/$platform.sh $action
	retV=$?
	if [ "$retV" = "1" ]; then
		exit 1
	fi
	exit 0
fi

echo "build [--platform:...] [action]"
exit 0
