import * as pagefind from 'pagefind';

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
	path: 'build',
});

// Or, write the index to disk
await index.writeFiles({
	outputPath: 'src/pagefind',
});
