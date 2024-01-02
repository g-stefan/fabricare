// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("git-update");

Shell.system("git fetch --prune --prune-tags");
Shell.system("git add --all");
Shell.system("git commit -m \"Update\"");
Shell.system("git push");
