// Fabricare
// Copyright (c) 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2021-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#ifndef XYO_FABRICARE_VERSION_HPP
#define XYO_FABRICARE_VERSION_HPP

#ifndef XYO_FABRICARE_DEPENDENCY_HPP
#	include <XYO/Fabricare/Dependency.hpp>
#endif

namespace XYO::Fabricare::Version {

	const char *version();
	const char *build();
	const char *versionWithBuild();
	const char *datetime();

};

#endif
