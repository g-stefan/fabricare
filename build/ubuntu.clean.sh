#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: clean"

rm -rf output
rm -rf temp

rm -rf source/XYO/Fabricare/Internal.Source
rm -f source/XYO/Fabricare/Internal.Source.cpp
rm -f source/XYO/Fabricare/Library.Source.cpp
