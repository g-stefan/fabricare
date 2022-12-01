// Fabricare
// Copyright (c) 2022 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include <XYO/Fabricare.hpp>
#include <XYO/Fabricare/Application.hpp>
#include <XYO/Fabricare/Copyright.hpp>
#include <XYO/Fabricare/License.hpp>
#include <XYO/Fabricare/Version.hpp>

#include <XYO/Fabricare/Library.hpp>

namespace XYO::Fabricare {

	void Application::showUsage() {
		printf("Fabricare - Build system\n");
		showVersion();
		printf("%s\n\n", Fabricare::Copyright::fullCopyright());

		printf("%s",
		       "options:\n"
		       "    --usage             this info\n"
		       "    --license           show license\n"
		       "    --version           show version\n"
		       "    --run-script=file   run script\n"
		       "    --config=file       use config file\n");
		printf("\n");
	};

	void Application::showLicense() {
		printf("%s%s", Fabricare::License::licenseHeader(), Fabricare::License::licenseBody());
	};

	void Application::showVersion() {
		printf("version %s build %s [%s]\n", Fabricare::Version::version(), Fabricare::Version::build(), Fabricare::Version::datetime());
	};

	void Application::initMemory() {
		String::initMemory();
		TDynamicArray<String>::initMemory();
		XYO::QuantumScript::Executive::initMemory();
	};

	int Application::main(int cmdN, char *cmdS[]) {
		int i;
		String opt;
		size_t optIndex;
		String optValue;
		TDynamicArray<String> cmdLine;

		// ---

		String applicationFile;

		// ---

		for (i = 1; i < cmdN; ++i) {
			if (StringCore::beginWith(cmdS[i], "@")) {
				String content;
				if (Shell::fileGetContents(&cmdS[i][1], content)) {
					int cmdNX;
					char **cmdSX;
					int m;
					Shell::mainArgsSet(content, cmdNX, cmdSX);
					for (m = 0; m < cmdNX; ++m) {
						cmdLine.push(cmdSX[m]);
					};
					Shell::mainArgsDelete(cmdNX, cmdSX);
					continue;
				};
				printf("Error: file not found - %s\n", &cmdS[i][1]);
				return 1;
			};
			cmdLine.push(cmdS[i]);
		};

		for (i = 0; i < cmdLine.length(); ++i) {
			if (StringCore::beginWith(cmdLine[i], "--")) {
				opt = cmdLine[i].index(2);
				optValue = "";
				if (String::indexOf(opt, "=", 0, optIndex)) {
					optValue = String::substring(opt, optIndex + 1);
					opt = String::substring(opt, 0, optIndex);
				};
				if (opt == "usage") {
					showUsage();
					return 0;
				};
				if (opt == "license") {
					showLicense();
					return 0;
				};
				if (opt == "version") {
					showVersion();
					return 0;
				};

				// ---
				if (opt == "run-script") {
					if (optValue.length() == 0) {
						printf("Error: script file is empty\n");
						return 1;
					};
					applicationFile = optValue;
				};
				// ---

				continue;
			};
		};

		// ---

		int appCmdN;
		char **appCmdS;
		int k;

		appCmdN = cmdLine.length() + 1;
		appCmdS = new char *[cmdLine.length() + 1];
		appCmdS[0] = cmdS[0];
		for (k = 0; k < cmdLine.length(); ++k) {
			appCmdS[k + 1] = const_cast<char *>(cmdLine[k].value());
		};

		// ---

		if (Shell::fileExists("fabricare/fabricare.js")) {
			applicationFile = "fabricare/fabricare.js";
		};

		// ---

		int exitCode = 0;

		if (ExecutiveX::initExecutive(appCmdN, appCmdS, initExecutive)) {
			if (applicationFile.length()) {

				ExecutiveX::includePath(Shell::getFilePath(applicationFile));
				if (ExecutiveX::executeFile(applicationFile)) {
					exitCode = ExecutiveX::getExitCode();
					ExecutiveX::endProcessing();
					return exitCode;
				};

			} else {

				exitCode = ExecutiveX::getExitCode();
				ExecutiveX::endProcessing();
				return exitCode;
			};
		};

		printf("%s\n", (ExecutiveX::getError()).value());
		printf("%s", (ExecutiveX::getStackTrace()).value());
		ExecutiveX::endProcessing();
		return 1;
	};
};

#ifndef XYO_FABRICARE_LIBRARY
XYO_APPLICATION_MAIN(XYO::Fabricare::Application);
#endif
