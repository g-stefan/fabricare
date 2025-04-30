#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
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

CC_LIB=""

DEF=""

INC=""
INC="$INC -Ivendor/xyo-managed-memory/source"

SRC=""
SRC="$SRC vendor/xyo-managed-memory/source/XYO/ManagedMemory.Config.cpp"

cmdX $CXX -o temp/xyo-managed-memory.config -O1 -std=c++11 -std=gnu++11 $DEF $INC $SRC -lstdc++ -lpthread -lm

cd "vendor/xyo-managed-memory"
[ -d temp ] || mkdir -p temp
cmdX "../../temp/xyo-managed-memory.config"
cd "../../"
