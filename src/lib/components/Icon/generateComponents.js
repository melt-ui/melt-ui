/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import glob from 'glob';
import fs from 'fs';
import path from 'path';

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Get all .svg files from icons folder
const svgs = glob.sync(`${__dirname}/icons/*.svg`);

svgs.forEach((svgPath) => {
	const text = fs.readFileSync(svgPath, 'utf8');
	const name = path.basename(svgPath, '.svg');

	const svelte_file = text;

	// write to file
	fs.writeFileSync(`${__dirname}/icons/${name}.svelte`, svelte_file);
});

function pascalCase(str) {
	// banana-pie => BananaPie
	return str
		.split('-')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join('');
}

const svg_names = svgs.map((svgPath) => path.basename(svgPath, '.svg'));

const index_file = svg_names
	.map((name) => `export { default as ${pascalCase(name)}Icon } from './icons/${name}.svelte';`)
	.join('\n');

// write to file
fs.writeFileSync(`${__dirname}/index.ts`, index_file);
