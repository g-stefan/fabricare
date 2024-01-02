// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

messageAction("make.prepare");

exitIf(!Fabricare.include("prepare"));

runInPath("source/XYO/Fabricare",function(){
	exitIf(Shell.system("file-to-cs --touch=Library.cpp --file-in=Library.js --file-out=Library.Source.cpp --is-string --name=librarySource"));
	exitIf(Shell.system("file-to-cs --touch=Application.cpp --file-in=Process.js --file-out=Process.Source.cpp --is-string --name=processSource"));
});
