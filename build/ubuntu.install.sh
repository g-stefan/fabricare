#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: install"

mkdir -p "$HOME/SDK/bin"
mkdir -p "$HOME/SDK/include"
mkdir -p "$HOME/SDK/lib"

if grep -q "# set SDK PATH if exists" "$HOME/.profile"; then
	echo -e "\n" >> "$HOME/.profile"
	echo -e "# set SDK PATH if exists\n" >> "$HOME/.profile"
	echo -e "if [ -d \"$HOME/SDK/bin\" ] ; then\n" >> "$HOME/.profile"
	echo -e "    PATH=\"$HOME/SDK/bin:$PATH\"\n" >> "$HOME/.profile"
	echo -e "    LD_LIBRARY_PATH=\"$HOME/SDK/bin:$LD_LIBRARY_PATH\"\n" >> "$HOME/.profile"
	echo -e "fi\n\n" >> "$HOME/.profile"
fi

source "$HOME/.profile"

cp output/bin/fabricare "$HOME/SDK/bin/fabricare"
