#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: install"

mkdir -p "$HOME/SDK/bin"
mkdir -p "$HOME/SDK/include"
mkdir -p "$HOME/SDK/lib"

if ! grep -q "# set SDK PATH if exists" "$HOME/.profile"; then
	echo "" >> "$HOME/.profile"
	echo "# set SDK PATH if exists" >> "$HOME/.profile"
	echo "if [ -d \"\$HOME/SDK/bin\" ] ; then" >> "$HOME/.profile"
	echo "    PATH=\"\$HOME/SDK/bin:\$PATH\"" >> "$HOME/.profile"
	echo "    LD_LIBRARY_PATH=\"\$HOME/SDK/bin:\$LD_LIBRARY_PATH\"" >> "$HOME/.profile"
	echo "fi" >> "$HOME/.profile"
	echo "" >> "$HOME/.profile"
fi

cp output/bin/fabricare "$HOME/SDK/bin/fabricare"
