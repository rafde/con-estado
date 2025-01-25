#!/usr/bin/env node

const fs = require( 'node:fs', );

const pkg = require( '../package.json', );
const jsr = require( '../jsr.json', );

jsr.version = pkg.version;

fs.writeFile(
	'jsr.json',
	JSON.stringify(
		jsr,
		null,
		2,
	),
	{
		encoding: 'utf8',
		flags: 'w',
	},
	( err, ) => {
		if ( err ) {
			console.error( 'error updating version', err, );
			return;
		}
		console.log( 'jsr.json version updated', );
	},
);
