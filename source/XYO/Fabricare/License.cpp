// Fabricare
// Copyright (c) 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include <XYO/Fabricare/License.hpp>
#include <XYO/Fabricare/Copyright.hpp>

namespace XYO::Fabricare::License {

	std::string license() {
		std::string retV;
		retV += Platform::License::licenseMITHeader();
		retV += Copyright::copyright();
		retV += "\r\n";
		retV += Platform::License::licenseMITContent();
		return retV;
	};

	std::string shortLicense() {
		std::string retV;
		retV += Copyright::copyright();
		retV += "\r\n";
		retV += Platform::License::licenseMITShort();
		return retV;
	};

};
