// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Script.requireExtension("Console");
Script.requireExtension("ShellFind");
Script.requireExtension("Shell");

function pad2(x){
	if(x<10){
		return "0"+x;
	};
	return x;
};

var sourceInternal="";
var sourceInternalFunction="";
var list=Shell.getFileList("source/XYO/Fabricare/Internal/*.js");
var index=0;
var infoMap=["|","/","-","\\"];
for(var file of list){
	var filename=Shell.getFileName(file);	
	var filenameCPP=filename.replace(".js",".cpp");
	var filenameSource="source_"+filename.replace(".js","").replace("-","_").replace(".","_");

	var cmd="file-to-cs";
	cmd+=" \"--touch=source/XYO/Fabricare/Library.cpp\"";
	cmd+=" \"--file-in="+file+"\"";
	cmd+=" \"--file-out=source/XYO/Fabricare/Internal.Source/"+filenameCPP+"\"";
	cmd+=" \"--is-string\"";
	cmd+=" \"--name="+filenameSource+"\"";

	//Console.writeLn(cmd);
	if(Shell.system(cmd)!=0){
		throw("command");
	};

	sourceInternal+="#include <XYO/Fabricare/Internal.Source/"+filenameCPP+">\r\n";
	sourceInternalFunction+="\texecutive->setIncludeSource(\"fabricare://"+filename+"\", "+filenameSource+");\r\n";

	//---
	++index;
	Console.write(infoMap[index%infoMap.length]+" ["+pad2(index)+"/"+list.length+"]\r");
};
Console.writeLn("- ["+pad2(index)+"/"+list.length+"]");

var source=sourceInternal;
source+="\r\n";
source+="static void internalInitExecutive(Executive *executive){\r\n";
source+=sourceInternalFunction;
source+="};\r\n";
source+="\r\n";

Shell.filePutContents("source/XYO/Fabricare/Internal.Source.cpp",source);
