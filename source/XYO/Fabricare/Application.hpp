// Fabricare
// Copyright (c) 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#ifndef XYO_FABRICARE_APPLICATION_HPP
#define XYO_FABRICARE_APPLICATION_HPP

#ifndef XYO_FABRICARE_DEPENDENCY_HPP
#	include <XYO/Fabricare/Dependency.hpp>
#endif

namespace XYO::Fabricare {

	class Application : public virtual IApplication {
			XYO_DISALLOW_COPY_ASSIGN_MOVE(Application);

		public:
			inline Application(){};

			void showUsage();
			void showLicense();
			void showVersion();

			int main(int cmdN, char *cmdS[]);

			static void initMemory();
	};

};

#endif
