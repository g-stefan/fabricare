//
// Fabricare
//
// Copyright (c) 2021-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef FABRICARE_HPP
#define FABRICARE_HPP

namespace Fabricare {

	using namespace XYO;
	using namespace Quantum::Script;

	class Application :
		public virtual IMain {
			XYO_DISALLOW_COPY_ASSIGN_MOVE(Application);
		protected:

			static void initExecutive(Executive *);

			void showUsage();
			void showLicense();
			void showVersion();

		public:

			inline Application() {};

			int main(int cmdN, char *cmdS[]);

			static TPointer<Variable> internalXYOCC(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalFileToCS(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalFileToJS(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalFileToRC(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalHTMLToRC(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalTimeCmd(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalXYOVersion(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalFileCrypt(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalPNGToIcon(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> internalExecCGI(VariableFunction *function, Variable *this_, VariableArray *arguments);

			static TPointer<Variable> isXYOConfigDefined(VariableFunction *function, Variable *this_, VariableArray *arguments);
			static TPointer<Variable> getXYOPlatform(VariableFunction *function, Variable *this_, VariableArray *arguments);
	};
};

#endif
