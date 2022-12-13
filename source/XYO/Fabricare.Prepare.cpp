// Quantum Script Extension ApplicationVersion Test
// Copyright (c) 2022 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include <XYO/QuantumScript.hpp>
#include <XYO/QuantumScript.Extension/Console.hpp>
#include <XYO/QuantumScript.Extension/Shell.hpp>
#include <XYO/QuantumScript.Extension/ShellFind.hpp>
#include <XYO/QuantumScript.Extension/Buffer.hpp>

using namespace XYO::QuantumScript;

void initExecutive(Executive *executive) {
	Extension::Console::registerInternalExtension(executive);
	Extension::Shell::registerInternalExtension(executive);
	Extension::ShellFind::registerInternalExtension(executive);
	Extension::Buffer::registerInternalExtension(executive);
};

void process(int cmdN, char *cmdS[]) {

	const char *codeFile = "fabricare/prepare.js";

	if (ExecutiveX::initExecutive(cmdN, cmdS, initExecutive)) {
		ExecutiveX::includePath(Shell::getFilePath(codeFile));
		if (ExecutiveX::executeFile(codeFile)) {
			ExecutiveX::endProcessing();
			return;
		};
		printf("%s\n", (ExecutiveX::getError()).value());
		printf("%s", (ExecutiveX::getStackTrace()).value());
		ExecutiveX::endProcessing();

		throw std::runtime_error("Code");
	};
};

int main(int cmdN, char *cmdS[]) {
	try {

		process(cmdN, cmdS);

		return 0;

	} catch (const std::exception &e) {
		printf("* Error: %s\n", e.what());
	} catch (...) {
		printf("* Error: Unknown\n");
	};

	return 1;
};
