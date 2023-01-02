// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/xyo-cpp.library");

Fabricare.action = Application.getArgument(0, "default");
Fabricare.isPlatformSubroutine = Application.getFlagValue("platform-subroutine");
Fabricare.platformActive = Application.getFlagValue("platform-active");
Fabricare.subroutine = Application.getFlagValue("subroutine", Fabricare.subroutine);

Platform.subroutine = "platform/mingw";

Fabricare.isPlatformSubroutine = true;
Fabricare.platformActive = Platform.name;

Shell.setenv("XYO_PLATFORM", Platform.name);

Fabricare.include(Fabricare.subroutine);
