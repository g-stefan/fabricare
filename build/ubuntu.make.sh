#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: make"

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

PATH=$PWD/temp:$PATH

if ! [ -f "./temp/xyo-managed-memory.config" ]; then
	cmdX /bin/sh -- ./build/ubuntu.make.xyo-managed-memory.sh
fi
if ! [ -f "./temp/xyo-system.config" ]; then
	cmdX /bin/sh -- ./build/ubuntu.make.xyo-system.sh
fi
if ! [ -f "./temp/xyo-cc" ]; then
	cmdX /bin/sh -- ./build/ubuntu.make.xyo-cc.sh
fi
if ! [ -f "./temp/file-to-cs" ]; then
	cmdX xyo-cc --output-path=temp @build/file-to-cs.compile.json
fi
if ! [ -f "./temp/fabricare-prepare" ]; then
	cmdX xyo-cc --output-path=temp @build/fabricare-prepare.compile.json
fi

cmdX fabricare-prepare

cd "source/XYO/Fabricare"
cmdX file-to-cs --touch=Library.cpp --file-in=Library.js --file-out=Library.Source.cpp --is-string --name=librarySource
cmdX file-to-cs --touch=Application.cpp --file-in=Process.js --file-out=Process.Source.cpp --is-string --name=processSource
cd ../../..

cmdX xyo-cc --output-path=output/bin @build/fabricare.compile.json
