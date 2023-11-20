import * as pagefind from 'pagefind';

const IS_VERCEL = process.env.VERCEL === '1';

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
	path: IS_VERCEL ? '.vercel/output/static' : 'build',
});

await index.writeFiles({
	outputPath: 'src/pagefind',
});

await index.writeFiles({
	outputPath: 'static/pagefind',
});

// Write ts-nocheck to the top of the file
import fs from 'fs';
const file = 'src/pagefind/pagefind.js';
const data = fs.readFileSync(file);
fs.writeFileSync(file, '// @ts-nocheck\n' + data);
