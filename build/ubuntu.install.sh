#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: install"

export platformPath=
export platformPathStr=
if [ "$platform" = "mingw32" ]; then
	export platformPath=$MINGW_PREFIX
	export platformPathStr=\$MINGW_PREFIX
fi
if [ "$platform" = "mingw64" ]; then
	export platformPath=$MINGW_PREFIX
	export platformPathStr=\$MINGW_PREFIX
fi

mkdir -p "$HOME/SDK$platformPath/bin"
mkdir -p "$HOME/SDK$platformPath/include"
mkdir -p "$HOME/SDK$platformPath/lib"

if ! grep -q "# set SDK PATH if exists" "$HOME/.profile"; then
	echo "" >> "$HOME/.profile"
	echo "# set SDK PATH if exists" >> "$HOME/.profile"
	echo "if [ -d \"\$HOME/SDK$platformPathStr/bin\" ] ; then" >> "$HOME/.profile"
	echo "    PATH=\"\$HOME/SDK$platformPathStr/bin:\$PATH\"" >> "$HOME/.profile"
	echo "    LD_LIBRARY_PATH=\"\$HOME/SDK$platformPathStr/bin:\$LD_LIBRARY_PATH\"" >> "$HOME/.profile"
	echo "fi" >> "$HOME/.profile"
	echo "" >> "$HOME/.profile"
fi

cp output/bin/fabricare "$HOME/SDK$platformPath/bin/fabricare"
