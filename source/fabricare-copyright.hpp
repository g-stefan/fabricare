//
// Fabricare
//
// Copyright (c) 2021-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef FABRICARE_COPYRIGHT_HPP
#define FABRICARE_COPYRIGHT_HPP

#define FABRICARE_COPYRIGHT            "Copyright (c) Grigore Stefan."
#define FABRICARE_PUBLISHER            "Grigore Stefan"
#define FABRICARE_COMPANY              FABRICARE_PUBLISHER
#define FABRICARE_CONTACT              "g_stefan@yahoo.com"
#define FABRICARE_FULL_COPYRIGHT       FABRICARE_COPYRIGHT " <" FABRICARE_CONTACT ">"

#ifndef XYO_RC

namespace Fabricare {
	namespace Copyright {
		const char *copyright();
		const char *publisher();
		const char *company();
		const char *contact();
		const char *fullCopyright();
	};
};

#endif
#endif
