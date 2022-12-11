#!/bin/sh
# Created by Grigore Stefan <g_stefan@yahoo.com>
# Public domain (Unlicense) <http://unlicense.org>
# SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
# SPDX-License-Identifier: Unlicense

echo "- $project: vendor"

SOURCE_HOST=https://github.com/g-stefan

cmdVendor() {
	if ! [ -d "./$1" ]; then
		if ! git clone --depth 1 "$SOURCE_HOST/$1" ; then
			echo "* Error: vendor"
			exit 1
		fi
	fi
}

[ -d vendor ] || mkdir -p vendor

cd vendor

cmdVendor quantum-script
cmdVendor quantum-script--application
cmdVendor quantum-script--applicationversion
cmdVendor quantum-script--buffer
cmdVendor quantum-script--datetime
cmdVendor quantum-script--json
cmdVendor quantum-script--make
cmdVendor quantum-script--shell
cmdVendor quantum-script--shellfind
cmdVendor quantum-script--thread
cmdVendor quantum-script--job
cmdVendor quantum-script--task
cmdVendor quantum-script--math
cmdVendor quantum-script--processinteractive
cmdVendor quantum-script--file
cmdVendor quantum-script--base16
cmdVendor quantum-script--base32
cmdVendor quantum-script--base64
cmdVendor quantum-script--sha256
cmdVendor quantum-script--sha512
cmdVendor quantum-script--random
cmdVendor file-json
cmdVendor file-to-cs
cmdVendor file-to-rc
cmdVendor html-to-rc
cmdVendor file-to-js
cmdVendor xyo-cc
cmdVendor xyo-version
cmdVendor xyo-system
cmdVendor xyo-encoding
cmdVendor xyo-data-structures
cmdVendor xyo-managed-memory
cmdVendor xyo-multithreading
cmdVendor xyo-cryptography

cd "./.."
