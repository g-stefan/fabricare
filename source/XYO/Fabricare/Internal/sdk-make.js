// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("sdk-make");

exitIf(Shell.system("fabricare make"));
exitIf(Shell.system("fabricare install"));
exitIf(Shell.system("fabricare release"));
exitIf(Shell.system("fabricare release-install"));
