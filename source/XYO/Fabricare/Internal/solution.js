// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("solution/xyo-cpp.project.library");

prepareProjects();
selectMainProject();

if (Fabricare.include(Fabricare.action)) {
	return;
};

messageError("Action " + Fabricare.action + " not found!");
