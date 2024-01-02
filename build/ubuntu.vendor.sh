#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2021-2024 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: vendor"

if [ "$FABRICARE_SOURCE_GIT" = "" ]; then
	FABRICARE_SOURCE_GIT=https://gitea.xyosecurity.ro/g-stefan
fi

cmdVendor() {
	if ! [ -d "./$1" ]; then
		echo "$FABRICARE_SOURCE_GIT/$1"
		if ! git clone --depth 1 "$FABRICARE_SOURCE_GIT/$1" ; then
			echo "* Error: vendor"
			exit 1
		fi
	fi
}

[ -d vendor ] || mkdir -p vendor

cd vendor

echo "Using $FABRICARE_SOURCE_GIT"
cmdVendor quantum-script
cmdVendor quantum-script--application
cmdVendor quantum-script--buffer
cmdVendor quantum-script--datetime
cmdVendor quantum-script--json
cmdVendor quantum-script--shell
cmdVendor quantum-script--shellfind
cmdVendor quantum-script--math
cmdVendor quantum-script--processinteractive
cmdVendor quantum-script--sha512
cmdVendor quantum-script--thread
cmdVendor quantum-script--task
cmdVendor quantum-script--job
cmdVendor quantum-script--make
cmdVendor quantum-script--csv
cmdVendor quantum-script--url
cmdVendor file-json
cmdVendor file-to-cs
cmdVendor file-to-rc
cmdVendor html-to-rc
cmdVendor xyo-cc
cmdVendor xyo-version
cmdVendor xyo-system
cmdVendor xyo-encoding
cmdVendor xyo-data-structures
cmdVendor xyo-managed-memory
cmdVendor xyo-multithreading
cmdVendor xyo-cryptography

cd "./.."
