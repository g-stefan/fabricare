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

XYO_APPLICATION="XYO_APPLICATION_64BIT"
XYO_OS="XYO_OS_LINUX"
CC_LIB=""

if [ "$(expr substr $(uname -s) 1 10)" = "MINGW32_NT" ]; then
	XYO_OS="XYO_OS_MINGW"
	XYO_APPLICATION="XYO_APPLICATION_32BIT"
	CC_LIB="-luser32 -lws2_32"
elif [ "$(expr substr $(uname -s) 1 10)" = "MINGW64_NT" ]; then
	XYO_OS="XYO_OS_MINGW"
	CC_LIB="-luser32 -lws2_32"
fi

DEF=""
DEF="$DEF -D$XYO_OS"
DEF="$DEF -DXYO_COMPILER_GCC"
DEF="$DEF -DXYO_APPLICATION_64BIT"
DEF="$DEF -DXYO_PLATFORM=$platform"
DEF="$DEF -DXYO_MULTI_THREAD"

INC=""
INC="$INC -Ivendor/xyo-managed-memory/source"

SRC=""
SRC="$SRC vendor/xyo-managed-memory/source/XYO/ManagedMemory.Config.cpp"

cmdX $CXX -o temp/xyo-managed-memory.config -O1 -std=c++11 -std=gnu++11 $DEF $INC $SRC -lstdc++ -lpthread -lm

cd "vendor/xyo-managed-memory"
[ -d temp ] || mkdir -p temp
cmdX "../../temp/xyo-managed-memory.config"
cd "../../"
