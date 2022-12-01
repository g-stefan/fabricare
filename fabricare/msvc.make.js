// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// ---

var sourceInternal="";
var sourceInternalFunction="";
var list=Shell.getFileList("source/fabricare/*.js");
for(var file of list){
	var filename=Shell.getFileName(file);	
	var filenameCPP=filename.replace(".js",".cpp");
	var filenameSource="source_"+filename.replace(".js","").replace("-","_").replace(".","_");

	var cmd="file-to-cs --touch=Library.cpp";
	cmd+=" --file-in="+file;
	cmd+=" --file-out=source/XYO/Fabricare/Internal/"+filenameCPP;
	cmd+=" --is-string";
	cmd+=" --name="+filenameSource;

	Console.writeLn(cmd);
	exitIf(Shell.system(cmd));

	sourceInternal+="#include <XYO/Fabricare/Internal/"+filenameCPP+">\r\n";
	sourceInternalFunction+="\texecutive->setIncludeSource(\"fabricare://"+filename+"\", "+filenameSource+");\r\n";
};

var source=sourceInternal;
source+="\r\n";
source+="static void internalInitExecutive(Executive *executive){\r\n";
source+=sourceInternalFunction;
source+="};\r\n";
source+="\r\n";

exitIf(!Shell.filePutContents("source/XYO/Fabricare/Internal.Source.cpp",source));

// ---

runInPath("source/XYO/Fabricare",function(){                             
	exitIf(Shell.system("file-to-cs --touch=Library.cpp --file-in=Library.js --file-out=Library.Source.cpp --is-string --name=librarySource"));
});

if(!Fabricare.include("msvc.make."+Project.make)){
	messageError("Don't know how to make '"+Project.make+"'!");
	exit(1);
};
