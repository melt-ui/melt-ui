/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { writeFileSync } from 'fs';
import { glob } from 'glob';
import { type } from 'os';
import { join } from 'path';
import { ModuleResolutionKind, Project, Symbol, TypeChecker } from 'ts-morph';

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

interface Prop {
	type: string;
	description: string;
	defaultValue: string | null;
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
			props?: Record<string, Prop>;
			states?: Record<string, { type: string; description: string }>;
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

		result[builderName] = {
			props: {},
			states: {},
		};
		const typesPath = `${baseDir}/types.ts`;
		const glob = `${baseDir}/**/*.ts`;

		project.addSourceFilesAtPaths(glob);

		const contextSrc = project.getSourceFile(typesPath);
		const aliases = contextSrc?.getTypeAliases();

		/* Get Props */
		const propsType = aliases?.find((alias) => alias.getName().endsWith('Props'))?.getType();
		propsType?.getProperties().forEach((property) => {
			const name = property.getName();
			const type = property.getValueDeclaration()?.getType()?.getText();
			console.log(name, property.getValueDeclaration()?.getType());

			const defaultValue = getDefaultValue(property);
			const description = getDescription(property, typeChecker) || 'N/A';

			if (type) {
				result[builderName].props![name] = { type: trimType(type), description, defaultValue };
			}
		});

		/* Get States */
		const statesType = aliases?.find((alias) => alias.getName().endsWith('States'))?.getType();
		statesType?.getProperties().forEach((property) => {
			const name = property.getName();
			const type = property.getValueDeclaration()?.getType()?.getText();

			const description = getDescription(property, typeChecker) || 'N/A';

			if (type) {
				result[builderName].states![name] = { type: trimType(type), description };
			}
		});
	}

	console.log('result', JSON.stringify(result, null, 2));
	const outPath = join(process.cwd(), 'src', 'docs', 'api.json');
	writeFileSync(outPath, JSON.stringify(result, null, 2));
}

main();
