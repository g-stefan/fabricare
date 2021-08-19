//
// Fabricare
//
// Copyright (c) 2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef FABRICARE_VERSION_HPP
#define FABRICARE_VERSION_HPP

#define FABRICARE_VERSION_ABCD                1,0,0,2
#define FABRICARE_VERSION_STR                 "1.0.0"
#define FABRICARE_VERSION_STR_BUILD           "2"
#define FABRICARE_VERSION_STR_DATETIME        "2021-08-19 12:59:50"

#ifndef XYO_RC

namespace Fabricare {
	namespace Version {
		const char *version();
		const char *build();
		const char *versionWithBuild();
		const char *datetime();
	};
};

#endif
#endif

