// Fabricare
// Copyright (c) 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include <XYO/Fabricare/Copyright.hpp>
#include <XYO/Fabricare/Copyright.rh>

namespace XYO::Fabricare::Copyright {

	static const char *copyright_ = XYO_FABRICARE_COPYRIGHT;
	static const char *publisher_ = XYO_FABRICARE_PUBLISHER;
	static const char *company_ = XYO_FABRICARE_COMPANY;
	static const char *contact_ = XYO_FABRICARE_CONTACT;

	std::string copyright() {
		return copyright_;
	};

	std::string publisher() {
		return publisher_;
	};

	std::string company() {
		return company_;
	};

	std::string contact() {
		return contact_;
	};

};
