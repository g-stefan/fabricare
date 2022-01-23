//
// Fabricare
//
// Copyright (c) 2021-2022 Grigore Stefan <g_stefan@yahoo.com>
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

#include "xyo-cc.hpp"
#include "file-to-cs.hpp"
#include "file-to-js.hpp"
#include "file-to-rc.hpp"
#include "html-to-rc.hpp"
#include "time-cmd.hpp"
#include "xyo-version-application.hpp"
#include "file-crypt.hpp"
#include "png-to-icon.hpp"
#include "exec-cgi.hpp"

#include "fabricare.hpp"
#include "fabricare-license.hpp"
#include "fabricare-copyright.hpp"
#ifndef FABRICARE_NO_VERSION
#include "fabricare-version.hpp"
#endif

#include "fabricare.src"

namespace Fabricare {

	using namespace XYO;
	using namespace Quantum::Script;


	template<typename TApplication>
	TPointer<Variable> internalCall(const char *cmd0, VariableArray *arguments) {
		int k,cmdN;
		char **cmdS;
		TDynamicArray<String> cmdV;
		TPointer<Variable> retV;
		
		retV=VariableNumber::newVariable(0);
		cmdN=arguments->value->length()+1;
		cmdS=new char*[cmdN];
		cmdV[0]=cmd0;
		for(k=1;k<cmdN;++k) {
			cmdV[k]=(arguments->index(k-1))->toString();
		};
		for(k=0;k<cmdN;++k) {
			cmdS[k]=const_cast<char *>(cmdV[k].value());
		};
		try{
			TApplication application;
			((VariableNumber *) retV.value())->value=(Number)(application.main(cmdN,cmdS));
		}catch(...) {
			((VariableNumber *) retV.value())->value=-1;
			delete cmdS;
			throw;
		};
		delete cmdS;
		return retV;
	};

	TPointer<Variable> Application::internalXYOCC(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-xyo-cc\n");
#endif
		return internalCall<XYOCC::Application>("xyo-cc", arguments);
	};

	TPointer<Variable> Application::internalFileToCS(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-file-to-cs\n");
#endif
		return internalCall<FileToCS::Application>("file-to-cs", arguments);
	};

	TPointer<Variable> Application::internalFileToJS(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-file-to-js\n");
#endif
		return internalCall<FileToJS::Application>("file-to-js", arguments);
	};

	TPointer<Variable> Application::internalFileToRC(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-file-to-rc\n");
#endif
		return internalCall<FileToRC::Application>("file-to-rc", arguments);
	};

	TPointer<Variable> Application::internalHTMLToRC(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-html-to-rc\n");
#endif
		return internalCall<HTMLToRC::Application>("html-to-rc", arguments);
	};

	TPointer<Variable> Application::internalTimeCmd(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-time-cmd\n");
#endif
		return internalCall<TimeCmd::Application>("time-cmd", arguments);
	};

	TPointer<Variable> Application::internalXYOVersion(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-xyo-version\n");
#endif
		return internalCall<XYOVersion::Application>("xyo-version", arguments);
	};

	TPointer<Variable> Application::internalFileCrypt(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-file-crypt\n");
#endif                              
		return internalCall<FileCrypt::Application>("file-crypt", arguments);
	};

	TPointer<Variable> Application::internalPNGToIcon(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-png-to-icon\n");
#endif
		return internalCall<PNGToIcon::Application>("png-to-icon", arguments);
	};

	TPointer<Variable> Application::internalExecCGI(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef QUANTUM_SCRIPT_DEBUG_RUNTIME
		printf("- internal-exec-cgi\n");
#endif
		return internalCall<ExecCGI::Application>("exec-cgi", arguments);
	};

	TPointer<Variable> Application::isXYOConfigDefined(VariableFunction *function, Variable *this_, VariableArray *arguments){
		String isDefined((arguments->index(0))->toString());
// -- Operating System
#ifdef XYO_OS_WINDOWS
		if(isDefined=="XYO_OS_WINDOWS"){
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_OS_UNIX
		if(isDefined=="XYO_OS_UNIX"){
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_OS_MINGW
		if(isDefined=="XYO_OS_MINGW"){
			return VariableBoolean::newVariable(true);
		};
#endif

// -- Compiler
#ifdef XYO_COMPILER_MSVC
		if(isDefined=="XYO_COMPILER_MSVC"){
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_COMPILER_GCC
		if(isDefined=="XYO_COMPILER_GCC"){
			return VariableBoolean::newVariable(true);
		};
#endif

// -- Application
#ifdef XYO_APPLICATION_64BIT
		if(isDefined=="XYO_APPLICATION_64BIT"){
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_APPLICATION_32BIT
		if(isDefined=="XYO_APPLICATION_32BIT"){
			return VariableBoolean::newVariable(true);
		};
#endif

// -- Thread support
#ifdef XYO_SINGLE_THREAD
		if(isDefined=="XYO_SINGLE_THREAD"){
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_MULTI_THREAD
		if(isDefined=="XYO_MULTI_THREAD"){
			return VariableBoolean::newVariable(true);
		};
#endif		
		return VariableBoolean::newVariable(false);
	};

	TPointer<Variable> Application::getXYOPlatform(VariableFunction *function, Variable *this_, VariableArray *arguments){
		return VariableString::newVariable(XYO_PLATFORM);
	};

	void Application::initExecutive(Executive *executive) {
		Extension::Magnet::registerInternalExtension(executive);
		executive->compileString("Script.requireInternalExtension(\"Magnet\");");
		// 
		executive->compileStringX("var Internal={};");
		executive->setFunction2("Internal.xyoCC", internalXYOCC);
		executive->setFunction2("Internal.fileToCS", internalFileToCS);
		executive->setFunction2("Internal.fileToJS", internalFileToJS);
		executive->setFunction2("Internal.fileToRC", internalFileToRC);
		executive->setFunction2("Internal.htmlToRC", internalHTMLToRC);
		executive->setFunction2("Internal.timeCmd", internalTimeCmd);
		executive->setFunction2("Internal.xyoVersion", internalXYOVersion);
		executive->setFunction2("Internal.fileCrypt", internalFileCrypt);
		executive->setFunction2("Internal.pngToIcon", internalPNGToIcon);
		executive->setFunction2("Internal.execCGI", internalExecCGI);
		//
		executive->compileStringX("var Fabricare={};");
		executive->setFunction2("Fabricare.isXYOConfigDefined(def);", isXYOConfigDefined);
		executive->setFunction2("Fabricare.getXYOPlatform", getXYOPlatform);
		executive->compileStringX(fabricareSource);
	};

	void Application::showUsage() {
		printf("Fabricare\n");
		Application::showVersion();
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

	void Application::showVersion() {
#ifndef FABRICARE_NO_VERSION
		printf("version %s build %s [%s]\n", Fabricare::Version::version(), Fabricare::Version::build(), Fabricare::Version::datetime());
#endif
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

#ifndef FABRICARE_LIBRARY
#ifdef BUILD_WINDOWS_GUI
XYO_APPLICATION_WINMAIN_STD(Fabricare::Application);
#else
XYO_APPLICATION_MAIN_STD(Fabricare::Application);
#endif
#endif

