// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Platform.name = "wsl-ubuntu-26.04";
Platform.run = "wsl -d ubuntu-26.04 --shell-type login --";
Platform.next = "ubuntu-26.04";

Fabricare.include("platform/wsl.run");
