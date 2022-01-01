//
// Fabricare
//
// Copyright (c) 2021-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef FABRICARE_VERSION_HPP
#define FABRICARE_VERSION_HPP

#define FABRICARE_VERSION_ABCD                1,2,0,6
#define FABRICARE_VERSION_STR                 "1.2.0"
#define FABRICARE_VERSION_STR_BUILD           "6"
#define FABRICARE_VERSION_STR_DATETIME        "2022-01-01 21:19:10"

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

