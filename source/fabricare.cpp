//
// Fabricare
//
// Copyright (c) 2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef BUILD_WINDOWS_GUI
#include <windows.h>
#endif

#include "xyo-pixel32.hpp"
#include "quantum-script.hpp"
#include "quantum-script-extension-openssl.hpp"
#include "quantum-script-extension-magnet.hpp"

#include "fabricare-license.hpp"
#include "fabricare-copyright.hpp"
#include "fabricare-version.hpp"


#include "fabricare.src"

namespace Main {

	using namespace XYO;
	using namespace Quantum::Script;

	class Application :
		public virtual IMain {
			XYO_DISALLOW_COPY_ASSIGN_MOVE(Application);
		protected:

			static void initExecutive(Executive *);

			void showUsage();
			void showLicense();

		public:

			inline Application() {};

			int main(int cmdN, char *cmdS[]);
	};

	void Application::initExecutive(Executive *executive) {
		Extension::Magnet::registerInternalExtension(executive);
		executive->compileString("Script.requireInternalExtension(\"Magnet\");");
		executive->compileStringX(fabricareSource);
	};

	void Application::showUsage() {
		printf("Fabricare\n");
		printf("version %s build %s [%s]\n", Fabricare::Version::version(), Fabricare::Version::build(), Fabricare::Version::datetime());
		printf("%s\n\n", Fabricare::Copyright::fullCopyright());

		printf("%s",
			"options:\n"
			"    --license              show license\n"
			"    --cmd script           execute script, skip first 2 lines, to be used on shell scripts\n"
			"    script.js              execute script\n"
			"    --run \"code\"         run code\n"
			"    --execution-time       show execution time\n"
			"    --execution-time-cmd   --execution-time + --cmd\n"
			"\n"
			"by default will execute fabricare.js\n"
		);
		printf("\n");
	};

	void Application::showLicense() {
		printf("%s", Fabricare::License::content());
		printf("%s", Extension::OpenSSL::License::content());
		printf("%s", XYO::Pixel32::License::content());
	};

	int Application::main(int cmdN, char *cmdS[]) {
		int i;
		char *opt;
		const char *fileIn;
		bool executionTime = false;
		uint64_t beginTimestampInMilliseconds;
		uint64_t endTimestampInMilliseconds;
		uint64_t intervalTimestampInMilliseconds;
		fileIn = nullptr;
		bool isCmd = false;
		bool runCode = false;
		String code;

		for (i = 1; i < cmdN; ++i) {
			if (strncmp(cmdS[i], "--", 2) == 0) {
				opt = &cmdS[i][2];
				if (strcmp(opt, "license") == 0) {
					showLicense();
					if (cmdN == 2) {
						return 0;
					};
				};
				if (strcmp(opt, "execution-time") == 0) {
					executionTime = true;
					continue;
				};
				if (strcmp(opt, "cmd") == 0) {
					isCmd = true;
					continue;
				};
				if (strcmp(opt, "execution-time-cmd") == 0) {
					executionTime = true;
					isCmd = true;
					continue;
				};
				if (strcmp(opt, "run") == 0) {
					runCode = true;
					++i;
					if(i < cmdN) {
						code=cmdS[i];
						continue;
					};
					break;
				};
				continue;
			};
			if (!fileIn) {
				fileIn = cmdS[i];
			};
		};


		if(!runCode) {
			if(fileIn == nullptr) {
				if(Shell::fileExists("fabricare.js")) {
					fileIn = "fabricare.js";
				} else {
					showUsage();
					return 0;
				};
			};
		} else {
			if(code.length()==0) {
				printf("Error: No code specified!");
				return 1;
			};
		};

		if(executionTime) {
			beginTimestampInMilliseconds = DateTime::timestampInMilliseconds();
		};

		if(ExecutiveX::initExecutive(cmdN, cmdS, initExecutive)) {
			if(runCode) {
				if(ExecutiveX::executeString(code)) {
					ExecutiveX::endProcessing();
					if(executionTime) {
						endTimestampInMilliseconds = DateTime::timestampInMilliseconds();
						intervalTimestampInMilliseconds = endTimestampInMilliseconds - beginTimestampInMilliseconds;
						printf("Execution time: " XYO_FORMAT_SIZET " ms\n", (size_t)intervalTimestampInMilliseconds);
					};
					return 0;
				};
			} else {
				if(isCmd) {
					if(ExecutiveX::executeFileSkipLines(fileIn, 2)) {
						ExecutiveX::endProcessing();
						if(executionTime) {
							endTimestampInMilliseconds = DateTime::timestampInMilliseconds();
							intervalTimestampInMilliseconds = endTimestampInMilliseconds - beginTimestampInMilliseconds;
							printf("Execution time: " XYO_FORMAT_SIZET " ms\n", (size_t)intervalTimestampInMilliseconds);
						};
						return 0;
					};

					fflush(stdout);
					printf("%s\n", (ExecutiveX::getError()).value());
					printf("%s", (ExecutiveX::getStackTrace()).value());
					fflush(stdout);

					ExecutiveX::endProcessing();
					return 1;
				};

				if(ExecutiveX::executeFile(fileIn)) {
					ExecutiveX::endProcessing();
					if(executionTime) {
						endTimestampInMilliseconds = DateTime::timestampInMilliseconds();
						intervalTimestampInMilliseconds = endTimestampInMilliseconds - beginTimestampInMilliseconds;
						printf("Execution time: " XYO_FORMAT_SIZET " ms\n", (size_t)intervalTimestampInMilliseconds);
					};
					return 0;
				};
			};
		};

		fflush(stdout);
		printf("%s\n", (ExecutiveX::getError()).value());
		printf("%s", (ExecutiveX::getStackTrace()).value());
		fflush(stdout);

		ExecutiveX::endProcessing();
		return 1;
	};

};

#ifdef BUILD_WINDOWS_GUI
XYO_APPLICATION_WINMAIN_STD(Main::Application);
#else
XYO_APPLICATION_MAIN_STD(Main::Application);
#endif

