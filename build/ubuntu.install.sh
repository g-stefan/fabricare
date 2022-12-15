#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: install"

export platformPath=
if [ "$platform" = "mingw32" ]; then
	export platformPath=\$MINGW_MOUNT_POINT
fi
if [ "$platform" = "mingw64" ]; then
	export platformPath=\$MINGW_MOUNT_POINT
fi

mkdir -p "$HOME/SDK$platformPath/bin"
mkdir -p "$HOME/SDK$platformPath/include"
mkdir -p "$HOME/SDK$platformPath/lib"

if ! grep -q "# set SDK PATH if exists" "$HOME/.profile"; then
	echo "" >> "$HOME/.profile"
	echo "# set SDK PATH if exists" >> "$HOME/.profile"
	echo "if [ -d \"\$HOME/SDK$platformPath/bin\" ] ; then" >> "$HOME/.profile"
	echo "    PATH=\"\$HOME/SDK$platformPath/bin:\$PATH\"" >> "$HOME/.profile"
	echo "    LD_LIBRARY_PATH=\"\$HOME/SDK$platformPath/bin:\$LD_LIBRARY_PATH\"" >> "$HOME/.profile"
	echo "fi" >> "$HOME/.profile"
	echo "" >> "$HOME/.profile"
fi

cp output/bin/fabricare "$HOME/SDK/bin/fabricare"
