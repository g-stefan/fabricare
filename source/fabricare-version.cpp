//
// Fabricare
//
// Copyright (c) 2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include "fabricare-version.hpp"

namespace Fabricare {
	namespace Version {

		static const char *version_ = "1.0.0";
		static const char *build_ = "4";
		static const char *versionWithBuild_ = "1.0.0.4";
		static const char *datetime_ = "2021-09-06 14:01:59";

		const char *version() {
			return version_;
		};
		const char *build() {
			return build_;
		};
		const char *versionWithBuild() {
			return versionWithBuild_;
		};
		const char *datetime() {
			return datetime_;
		};

	};
};


