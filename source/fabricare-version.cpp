//
// Fabricare
//
// Copyright (c) 2021-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include "fabricare-version.hpp"

namespace Fabricare {
	namespace Version {

		static const char *version_ = "1.3.0";
		static const char *build_ = "14";
		static const char *versionWithBuild_ = "1.3.0.14";
		static const char *datetime_ = "2022-01-23 21:43:01";

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


