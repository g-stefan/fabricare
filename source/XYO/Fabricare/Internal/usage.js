// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Console.writeLn("Fabricare - Build system");
Console.writeLn("version " + Fabricare.getVersion());
Console.writeLn("options: ");
Console.writeLn("    --usage             this info");
Console.writeLn("    --license           show license");
Console.writeLn("    --version           show version");
Console.writeLn("    --run-script=file   run script");
Console.writeLn("    --config=file       use config file");
Console.writeLn("");
Console.writeLn("Solution type xyo-cpp");
Console.writeLn("options:");
Console.writeLn("    --platform=[platform]  build for specified platform");
Console.writeLn("actions:");
Console.writeLn("    usage      this info");
Console.writeLn("    clean");
Console.writeLn("    make");
Console.writeLn("    test");
Console.writeLn("    version    bump build and date");
Console.writeLn("    install    install bin,include,lib folders");
Console.writeLn("    analyze    make using code analysis compiler");
Console.writeLn("    release");
Console.writeLn("- related to version:");
Console.writeLn("    version-major    bump major version");
Console.writeLn("    version-minor    bump minor version");
Console.writeLn("    version-patch    bump patch version");
Console.writeLn("- related to install:");
Console.writeLn("    install-bin             install only bin folder");
Console.writeLn("    install-from-release    install from current release");
Console.writeLn("- related to release:");
Console.writeLn("    release-extract    extract current release");
Console.writeLn("    release-remove     remove current release");
Console.writeLn("- related to github:");
Console.writeLn("    github-update                 update from/to github");
Console.writeLn("    github-release                create and upload current release");
Console.writeLn("    github-download               download current release");
Console.writeLn("    github-release-keep-last-3    remove all releases older than last 3");
Console.writeLn("    github-release-remove-all     remove all releases");
Console.writeLn("");

