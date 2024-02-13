/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { writeFileSync } from 'fs';
import { glob } from 'glob';
import { type } from 'os';
import { join } from 'path';
import { ModuleResolutionKind, Project, Symbol, TypeChecker, TypeAliasDeclaration } from 'ts-morph';

function trimType(value: string) {
	return value
		.split('=>')
		.map((t) => t.replace(/import\(".*"\)\./, ''))
		.join('=>');
}

function getDefaultValue(property: Symbol) {
	const tags = property.getJsDocTags();
	const [defaultValue] = tags.find((tag) => tag.getName() === 'default')?.getText() ?? [];
	return defaultValue?.text;
}

function getDescription(property: Symbol, typeChecker?: TypeChecker) {
	// @ts-expect-error - ts-morph types are inconsistent
	const [description] = property.compilerSymbol.getDocumentationComment(typeChecker);
	return description?.text;
}

interface Entity {
	type: string;
	description: string;
	defaultValue?: string | null;
}

type GetEntityArgs = {
	name: string;
	aliases?: TypeAliasDeclaration[];
	typeChecker: TypeChecker;
};

function getEntity({ name, aliases, typeChecker }: GetEntityArgs) {
	const result: Record<string, Entity> = {};

	const entityType = aliases?.find((alias) => alias.getName().endsWith(name))?.getType();
	entityType?.getProperties().forEach((property) => {
		const name = property.getName();
		const type = property.getValueDeclaration()?.getType()?.getText();
		console.log(name, property.getValueDeclaration()?.getType());

		const defaultValue = getDefaultValue(property);
		const description = getDescription(property, typeChecker) || 'N/A';

		if (type) {
			result[name] = { type: trimType(type), description, defaultValue };
		}
	});

	return result;
}

async function main() {
	const project = new Project({
		compilerOptions: {
			moduleResolution: ModuleResolutionKind.NodeNext,
		},
	});

	project.addSourceFilesAtPaths('src/**/*.ts');

	const typeChecker = project.getTypeChecker();

	const result: Record<
		string,
		{
			props?: Record<string, Entity>;
			states?: Record<string, Entity>;
			helpers?: Record<string, Entity>;
			// elements?: Record<string, { type: string; description: string; }>;
		}
	> = {};

	const builders = await glob('src/lib/builders/*/types.ts');
	console.log('builders', builders);

	for (const path of builders.slice(0, 1)) {
		// for (const path of builders) {
		const baseDir = path.replace('/types.ts', '');
		const builderName = baseDir.split('/').pop()!;
		console.log(`Inspecting ${builderName}...`);

		const typesPath = `${baseDir}/types.ts`;
		const glob = `${baseDir}/**/*.ts`;

		project.addSourceFilesAtPaths(glob);

		const contextSrc = project.getSourceFile(typesPath);
		const aliases = contextSrc?.getTypeAliases();

		result[builderName] = {
			props: getEntity({ name: 'Props', aliases, typeChecker }),
			states: getEntity({ name: 'States', aliases, typeChecker }),
			helpers: getEntity({ name: 'Helpers', aliases, typeChecker }),
		};
	}

	console.log('result', JSON.stringify(result, null, 2));
	const outPath = join(process.cwd(), 'src', 'docs', 'api.json');
	writeFileSync(outPath, JSON.stringify(result, null, 2));
}

main();
