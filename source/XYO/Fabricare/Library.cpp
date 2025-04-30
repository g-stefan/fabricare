// Fabricare
// Copyright (c) 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include <XYO/Fabricare/Library.hpp>
#include <XYO/QuantumScript.Extension/Console.hpp>
#include <XYO/QuantumScript.Extension/Buffer.hpp>
#include <XYO/QuantumScript.Extension/DateTime.hpp>
#include <XYO/QuantumScript.Extension/JSON.hpp>
#include <XYO/QuantumScript.Extension/Application.hpp>
#include <XYO/QuantumScript.Extension/Shell.hpp>
#include <XYO/QuantumScript.Extension/ShellFind.hpp>
#include <XYO/QuantumScript.Extension/Math.hpp>
#include <XYO/QuantumScript.Extension/ProcessInteractive.hpp>
#include <XYO/QuantumScript.Extension/SHA512.hpp>
#include <XYO/QuantumScript.Extension/Thread.hpp>
#include <XYO/QuantumScript.Extension/Task.hpp>
#include <XYO/QuantumScript.Extension/Job.hpp>
#include <XYO/QuantumScript.Extension/Make.hpp>
#include <XYO/QuantumScript.Extension/CSV.hpp>
#include <XYO/QuantumScript.Extension/URL.hpp>
#include <XYO/FileToCS.Application.hpp>
#include <XYO/FileToRC.Application.hpp>
#include <XYO/HTMLToRC.Application.hpp>
#include <XYO/CPPCompilerCommandDriver.Application.hpp>
#include <XYO/Version.Application.hpp>
#include <XYO/Fabricare/Version.hpp>

namespace XYO::Fabricare {

	template <typename TApplication>
	TPointer<Variable> internalCall(const char *cmd0, VariableArray *arguments) {
		int k, cmdN;
		char **cmdS;
		TDynamicArray<String> cmdV;
		TPointer<Variable> retV;

		retV = VariableNumber::newVariable(0);
		cmdN = arguments->value->length() + 1;
		cmdS = new char *[cmdN];
		cmdV[0] = cmd0;
		for (k = 1; k < cmdN; ++k) {
			cmdV[k] = (arguments->index(k - 1))->toString();
		};
		for (k = 0; k < cmdN; ++k) {
			cmdS[k] = const_cast<char *>(cmdV[k].value());
		};
		try {
			TApplication application;
			((VariableNumber *)retV.value())->value = (Number)(application.main(cmdN, cmdS));
		} catch (...) {
			((VariableNumber *)retV.value())->value = -1;
			delete cmdS;
			throw;
		};
		delete cmdS;
		return retV;
	};

	TPointer<Variable> internalFileToCS(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef XYO_QUANTUMSCRIPT_DEBUG_RUNTIME
		printf("- internal-file-to-cs\n");
#endif
		return internalCall<FileToCS::Application::Application>("file-to-cs", arguments);
	};

	TPointer<Variable> internalFileToRC(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef XYO_QUANTUMSCRIPT_DEBUG_RUNTIME
		printf("- internal-file-to-rc\n");
#endif
		return internalCall<FileToRC::Application::Application>("file-to-rc", arguments);
	};

	TPointer<Variable> internalHTMLToRC(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef XYO_QUANTUMSCRIPT_DEBUG_RUNTIME
		printf("- internal-html-to-rc\n");
#endif
		return internalCall<HTMLToRC::Application::Application>("html-to-rc", arguments);
	};

	TPointer<Variable> internalXYOCC(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef XYO_QUANTUMSCRIPT_DEBUG_RUNTIME
		printf("- internal-xyo-cc\n");
#endif
		return internalCall<CPPCompilerCommandDriver::Application::Application>("xyo-cc", arguments);
	};

	TPointer<Variable> internalXYOVersion(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef XYO_QUANTUMSCRIPT_DEBUG_RUNTIME
		printf("- internal-xyo-version\n");
#endif
		return internalCall<::XYO::Version::Application::Application>("xyo-cc", arguments);
	};

	TPointer<Variable> xyoIsConfigDefined(VariableFunction *function, Variable *this_, VariableArray *arguments) {
		String isDefined((arguments->index(0))->toString());
// -- Operating System
#ifdef XYO_PLATFORM_OS_WINDOWS
		if (isDefined == "XYO_PLATFORM_OS_WINDOWS") {
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_PLATFORM_OS_LINUX
		if (isDefined == "XYO_PLATFORM_OS_LINUX") {
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_PLATFORM_OS_MINGW
		if (isDefined == "XYO_PLATFORM_OS_MINGW") {
			return VariableBoolean::newVariable(true);
		};
#endif

// -- Compiler
#ifdef XYO_PLATFORM_COMPILER_MSVC
		if (isDefined == "XYO_PLATFORM_COMPILER_MSVC") {
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_PLATFORM_COMPILER_GCC
		if (isDefined == "XYO_PLATFORM_COMPILER_GCC") {
			return VariableBoolean::newVariable(true);
		};
#endif

// -- Application
#ifdef XYO_PLATFORM_64BIT
		if (isDefined == "XYO_PLATFORM_64BIT") {
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_PLATFORM_32BIT
		if (isDefined == "XYO_PLATFORM_32BIT") {
			return VariableBoolean::newVariable(true);
		};
#endif

// -- Thread support
#ifdef XYO_PLATFORM_SINGLE_THREAD
		if (isDefined == "XYO_PLATFORM_SINGLE_THREAD") {
			return VariableBoolean::newVariable(true);
		};
#endif
#ifdef XYO_PLATFORM_MULTI_THREAD
		if (isDefined == "XYO_PLATFORM_MULTI_THREAD") {
			return VariableBoolean::newVariable(true);
		};
#endif
		return VariableBoolean::newVariable(false);
	};

	TPointer<Variable> xyoGetPlatform(VariableFunction *function, Variable *this_, VariableArray *arguments) {
		return VariableString::newVariable(XYO_PLATFORM_NAME);
	};

	TPointer<Variable> osIsWindows(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#if defined(XYO_PLATFORM_OS_WINDOWS) || defined(XYO_PLATFORM_OS_MINGW)
		return VariableBoolean::newVariable(true);
#else
		return VariableBoolean::newVariable(false);
#endif
	};

	TPointer<Variable> osIsLinux(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#if defined(XYO_PLATFORM_OS_LINUX)
		return VariableBoolean::newVariable(true);
#else
		return VariableBoolean::newVariable(false);
#endif
	};

	TPointer<Variable> osIsMinGW(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#if defined(XYO_PLATFORM_OS_MINGW)
		return VariableBoolean::newVariable(true);
#else
		return VariableBoolean::newVariable(false);
#endif
	};

	static TPointer<Variable> getVersion(VariableFunction *function, Variable *this_, VariableArray *arguments) {
#ifdef XYO_QUANTUMSCRIPT_DEBUG_RUNTIME
		printf("- fabricare-get-version\n");
#endif
		return VariableString::newVariable(XYO::Fabricare::Version::versionWithBuild());
	};

#include <XYO/Fabricare/Library.Source.cpp>
#include <XYO/Fabricare/Internal.Source.cpp>

	void initExecutive(Executive *executive) {
		Extension::Console::registerInternalExtension(executive);
		Extension::Buffer::registerInternalExtension(executive);
		Extension::DateTime::registerInternalExtension(executive);
		Extension::JSON::registerInternalExtension(executive);
		Extension::Application::registerInternalExtension(executive);
		Extension::Shell::registerInternalExtension(executive);
		Extension::ShellFind::registerInternalExtension(executive);
		Extension::Math::registerInternalExtension(executive);
		Extension::ProcessInteractive::registerInternalExtension(executive);
		Extension::SHA512::registerInternalExtension(executive);
		Extension::Thread::registerInternalExtension(executive);
		Extension::Task::registerInternalExtension(executive);
		Extension::Job::registerInternalExtension(executive);
		Extension::Make::registerInternalExtension(executive);
		Extension::CSV::registerInternalExtension(executive);
		Extension::URL::registerInternalExtension(executive);

		executive->compileString("Script.requireExtension=Script.requireInternalExtension;");

		executive->compileStringX("var Internal={};");
		executive->setFunction2("Internal.fileToCS", internalFileToCS);
		executive->setFunction2("Internal.fileToRC", internalFileToRC);
		executive->setFunction2("Internal.htmlToRC", internalHTMLToRC);
		executive->setFunction2("Internal.xyoCC", internalXYOCC);
		executive->setFunction2("Internal.xyoVersion", internalXYOVersion);

		executive->compileStringX("var XYO={};");
		executive->setFunction2("XYO.isConfigDefined(def);", xyoIsConfigDefined);
		executive->setFunction2("XYO.getPlatform", xyoGetPlatform);

		executive->compileStringX("var OS={};");
		executive->setFunction2("OS.isWindows", osIsWindows);
		executive->setFunction2("OS.isLinux", osIsLinux);
		executive->setFunction2("OS.isMinGW", osIsMinGW);

		internalInitExecutive(executive);

		executive->compileStringX("var Fabricare={};");
		executive->setFunction2("Fabricare.getVersion()", getVersion);

		executive->compileStringX(librarySource);
	};

};
