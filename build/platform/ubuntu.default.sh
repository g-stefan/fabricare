#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: default"

/bin/sh -- ./build/platform/ubuntu.sh make
