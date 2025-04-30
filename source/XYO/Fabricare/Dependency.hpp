// Quantum Script
// Copyright (c) 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#ifndef XYO_FABRICARE_DEPENDENCY_HPP
#define XYO_FABRICARE_DEPENDENCY_HPP

#ifndef XYO_QUANTUMSCRIPT_HPP
#	include <XYO/QuantumScript.hpp>
#endif

// -- Export

#ifdef XYO_FABRICARE_INTERNAL
#	define XYO_FABRICARE_EXPORT XYO_PLATFORM_LIBRARY_EXPORT
#else
#	define XYO_FABRICARE_EXPORT XYO_PLATFORM_LIBRARY_IMPORT
#endif
#ifdef XYO_FABRICARE_LIBRARY
#	undef XYO_FABRICARE_EXPORT
#	define XYO_FABRICARE_EXPORT
#endif

namespace XYO::Fabricare {
	using namespace XYO::System;
	using namespace XYO::QuantumScript;
};

#endif
