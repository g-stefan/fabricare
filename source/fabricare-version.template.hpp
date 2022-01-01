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

#define FABRICARE_VERSION_ABCD                $VERSION_ABCD
#define FABRICARE_VERSION_STR                 "$VERSION_VERSION"
#define FABRICARE_VERSION_STR_BUILD           "$VERSION_BUILD"
#define FABRICARE_VERSION_STR_DATETIME        "$VERSION_DATETIME"

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

