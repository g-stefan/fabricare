#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
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
DEF="$DEF -DXYO_PLATFORM_NO_VERSION"
DEF="$DEF -DXYO_MANAGEDMEMORY_NO_VERSION"
DEF="$DEF -DXYO_DATASTRUCTURES_NO_VERSION"
DEF="$DEF -DXYO_MULTITHREADING_NO_VERSION"
DEF="$DEF -DXYO_ENCODING_NO_VERSION"
DEF="$DEF -DXYO_SYSTEM_NO_VERSION"
DEF="$DEF -DXYO_FILEJSON_NO_VERSION"
DEF="$DEF -DXYO_CPPCOMPILERCOMMANDDRIVER_NO_VERSION"
DEF="$DEF -DXYO_CPPCOMPILERCOMMANDDRIVER_APPLICATION_NO_VERSION"

INC=""
INC="$INC -Ivendor/xyo-cc/source"
INC="$INC -Ivendor/xyo-platform/source"
INC="$INC -Ivendor/xyo-managed-memory/source"
INC="$INC -Ivendor/xyo-data-structures/source"
INC="$INC -Ivendor/xyo-multithreading/source"
INC="$INC -Ivendor/xyo-encoding/source"
INC="$INC -Ivendor/xyo-system/source"
INC="$INC -Ivendor/file-json/source"

SRC=""
SRC="$SRC vendor/xyo-cc/source/XYO/CPPCompilerCommandDriver.Application.Amalgam.cpp"
SRC="$SRC vendor/file-json/source/XYO/FileJSON.Amalgam.cpp"
SRC="$SRC vendor/xyo-platform/source/XYO/Platform.Amalgam.cpp"
SRC="$SRC vendor/xyo-managed-memory/source/XYO/ManagedMemory.Amalgam.cpp"
SRC="$SRC vendor/xyo-data-structures/source/XYO/DataStructures.Amalgam.cpp"
SRC="$SRC vendor/xyo-multithreading/source/XYO/Multithreading.Amalgam.cpp"
SRC="$SRC vendor/xyo-encoding/source/XYO/Encoding.Amalgam.cpp"
SRC="$SRC vendor/xyo-system/source/XYO/System.Amalgam.cpp"

cmdX $CXX -o temp/xyo-cc -O1 -std=c++11 -std=gnu++11 $DEF $INC $SRC -lstdc++ -lpthread -lm
