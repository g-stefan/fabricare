// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.subroutine = "xyo-cpp-solution.subroutine";

// ---

Platform.name = Application.getFlagValue("platform");
if (!Platform.name) {
	Fabricare.include("platform.detect");
};

Fabricare.include(Platform.name);
