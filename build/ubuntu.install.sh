#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: install"

export platformPath=$platform
export platformPathStr=$platform
if [ "$platform" = "mingw32" ]; then
	export platformPath=$MINGW_PREFIX
	export platformPathStr=\$MINGW_PREFIX
fi
if [ "$platform" = "mingw64" ]; then
	export platformPath=$MINGW_PREFIX
	export platformPathStr=\$MINGW_PREFIX
fi

export pathRepository=$HOME/.xyo-sdk/$platformPath
export pathRepositoryStr=\$HOME/.xyo-sdk/$platformPathStr
if ! [ "$XYO_PLATFORM_PATH" = "" ]; then
	pathRepository=$XYO_PLATFORM_PATH
	pathRepositoryStr=$XYO_PLATFORM_PATH
	export pathRepository=$XYO_PLATFORM_PATH
	export pathRepositoryStr=$XYO_PLATFORM_PATH
fi

mkdir -p "$pathRepository"
mkdir -p "$pathRepository/bin"
mkdir -p "$pathRepository/include"
mkdir -p "$pathRepository/lib"

if ! grep -q "# set XYO SDK PATH if exists" "$HOME/.profile"; then
	echo "" >> "$HOME/.profile"
	echo "# set XYO SDK PATH if exists" >> "$HOME/.profile"
	echo "if [ -d \"$pathRepositoryStr/bin\" ] ; then" >> "$HOME/.profile"
	echo "    PATH=\"$pathRepositoryStr/bin:\$PATH\"" >> "$HOME/.profile"
	echo "    LD_LIBRARY_PATH=\"$pathRepositoryStr/bin:\$LD_LIBRARY_PATH\"" >> "$HOME/.profile"
	echo "fi" >> "$HOME/.profile"
	echo "" >> "$HOME/.profile"
fi

cp output/bin/fabricare "$pathRepository/bin/fabricare"
