#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

cmdX(){
	if ! "$@" ; then
		echo "* Error: make"
		exit 1
	fi
}

[ -d output ] || mkdir -p output
[ -d temp ] || mkdir -p temp

if [ "$CXX" = "" ]; then
	CXX=gcc
	export CXX=$CXX
fi

DEF=""

INC=""
INC="$INC -Ivendor/xyo-system/source"

SRC=""
SRC="$SRC vendor/xyo-system/source/XYO/System.Config.cpp"

cmdX $CXX -o temp/xyo-system.config -O1 -std=c++11 -std=gnu++11 $DEF $INC $SRC -lstdc++ -lpthread -lm

cd "vendor/xyo-system"
[ -d temp ] || mkdir -p temp
cmdX "../../temp/xyo-system.config"
cd "../../"
