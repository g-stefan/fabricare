// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.dll-or-lib");

if (Fabricare.isDynamic()) {
	Fabricare.include("make.dll");
};

if (Fabricare.isStatic()) {
	Fabricare.include("make.lib");
};
