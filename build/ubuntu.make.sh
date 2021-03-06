#!/bin/sh
# Public domain
# http://unlicense.org/
# Created by Grigore Stefan <g_stefan@yahoo.com>

ACTION=$1
if [ "$ACTION" = "" ]; then
	ACTION=make
fi

echo "- $BUILD_PROJECT > $ACTION"

cmdX(){
	if ! "$@" ; then
		echo "Error: $ACTION"
		exit 1
	fi
}

cmdX file-to-cs --touch=source/fabricare.cpp --file-in=source/fabricare.js --file-out=source/fabricare.src --is-string --name=fabricareSource
cmdX xyo-cc --mode=$ACTION @build/source/fabricare.compile
