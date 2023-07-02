// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2021-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Script.requireExtension("Console");
Script.requireExtension("ShellFind");
Script.requireExtension("Shell");

Shell.mkdirRecursivelyIfNotExists("source/XYO/Fabricare/Internal.Source");
Shell.mkdirRecursivelyIfNotExists("source/XYO/Fabricare/Internal.Source/platform");
Shell.mkdirRecursivelyIfNotExists("source/XYO/Fabricare/Internal.Source/solution");

function pad2(x){
	if(x<10){
		return "0"+x;
	};
	return x;
};

var sourceInternal="";
var sourceInternalFunction="";
var pathBase = "source/XYO/Fabricare/Internal";

var infoMap=["|","/","-","\\"];

function processFolder(folder){
	if(folder.length) {
		folder+="/";
	};
	var index=0;
	var list=Shell.getFileList(pathBase+"/"+folder+"*.js");
	for(var file of list){
		var filename=Shell.getFileName(file);	
		var filenameCPP=filename.replace(".js",".cpp");
		var filenameSource="source_"+folder.replace("/","__")+filename.replace(".js","").replace("-","_").replace(".","_");
	
		var cmd="file-to-cs";
		cmd+=" \"--touch=source/XYO/Fabricare/Library.cpp\"";
		cmd+=" \"--file-in="+file+"\"";
		cmd+=" \"--file-out=source/XYO/Fabricare/Internal.Source/"+folder+filenameCPP+"\"";
		cmd+=" \"--is-string\"";
		cmd+=" \"--name="+filenameSource+"\"";
	
		//Console.writeLn(cmd);
		if(Shell.system(cmd)!=0){
			throw("command");
		};
	
		sourceInternal+="#include <XYO/Fabricare/Internal.Source/"+folder+filenameCPP+">\r\n";
		sourceInternalFunction+="\texecutive->setIncludeSource(\"fabricare://"+folder+filename+"\", "+filenameSource+");\r\n";
	
		//---
		++index;
		Console.write(infoMap[index%infoMap.length]+" ["+pad2(index)+"/"+pad2(list.length)+"] internal/"+folder+"\r");
	};
	Console.writeLn("- ["+pad2(index)+"/"+pad2(list.length)+"] internal/"+folder);
};

processFolder("platform");
processFolder("solution");
processFolder("");

var source=sourceInternal;
source+="\r\n";
source+="static void internalInitExecutive(Executive *executive){\r\n";
source+=sourceInternalFunction;
source+="};\r\n";
source+="\r\n";

Shell.filePutContents("source/XYO/Fabricare/Internal.Source.cpp",source);
