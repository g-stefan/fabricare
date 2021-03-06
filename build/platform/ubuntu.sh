#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

if [ -f ./build/ubuntu.config.sh ]; then
	. ./build/ubuntu.config.sh
fi

RESTORE_PATH=$PATH
RESTORE_LD_LIBRARY_PATH=$LD_LIBRARY_PATH

PATH=$XYO_PATH_REPOSITORY/bin:$PATH
LD_LIBRARY_PATH=$XYO_PATH_REPOSITORY/bin:$LD_LIBRARY_PATH

if [ -d "output" ]; then
	POPD=$PWD
	cd output
	PATH=$PWD:$PATH
	LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
	cd $POPD
fi

if [ -d "output/bin" ]; then
	POPD=$PWD
	cd output/bin
	PATH=$PWD:$PATH
	LD_LIBRARY_PATH=$PWD:$LD_LIBRARY_PATH
	cd $POPD
fi

export LD_LIBRARY_PATH
export XYO_PATH_REPOSITORY
export XYO_PATH_RELEASE

RETV=0

if [ "$1" = "" ]; then
	if [ -f "./build/ubuntu.make.sh" ]; then
		. ./build/ubuntu.make.sh make
	else
		. ./build/platform/ubuntu.make.sh make
	fi
else
	if [ -f "./build/ubuntu.$1.sh" ]; then
		. ./build/ubuntu.$1.sh $1
	elif [ -f "./build/platform/ubuntu.$1.sh" ]; then
		. ./build/platform/ubuntu.$1.sh $1
	elif [ -f "./build/ubuntu.make.sh" ]; then
		. ./build/ubuntu.make.sh $1
	else
		. ./build/platform/ubuntu.make.sh $1
	fi
fi

RETV=$?

PATH=$RESTORE_PATH
LD_LIBRARY_PATH=$RESTORE_LD_LIBRARY_PATH
export LD_LIBRARY_PATH

if [ "$RETV" = "1" ]; then
	exit 1
fi
exit 0
