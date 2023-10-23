import * as pagefind from 'pagefind';

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

// Index all HTML files in a directory
await index.addDirectory({
	path: 'build',
});

await index.writeFiles({
	outputPath: 'src/pagefind',
});

await index.writeFiles({
	outputPath: 'static/pagefind',
});
