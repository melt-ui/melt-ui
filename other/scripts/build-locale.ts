import { z } from 'zod';
import { writeFileSync } from 'fs';

const rawLocaleSchema = z.array(
	z
		.object({
			key: z.string(),
			name: z.string(),
		})
		.transform(({ key }) => key)
);

/**
 * Code generation for the locale module to support
 * dynamic imports of dayjs locales and type safety.
 *
 * This script is run as a prebuild step.
 */
async function buildLocale() {
	const disclaimer = `// This file is generated by other/scripts/build-locale.ts\n\n// Do not edit this file directly\n\n// prettier-ignore`;

	const locales = await getLocaleArray();
	const localeArrStr = generateLocaleArray(locales);
	const localeTypeStr = `export type Locale = (typeof locales)[number];`;
	const localeImportMapStr = generateLocaleImportMap(locales);
	const localeGetterStr = generateLocaleGetter();
	const strs = [disclaimer, localeArrStr, localeTypeStr, localeImportMapStr, localeGetterStr];
	writeLocaleFile(strs.join('\n\n'));
}

async function getLocaleArray() {
	const res = await fetch('https://cdn.jsdelivr.net/npm/dayjs@1/locale.json');
	return rawLocaleSchema.parse(await res.json());
}

function generateLocaleArray(locales: string[]) {
	return `export const locales = ${JSON.stringify(locales)} as const;`;
}

function generateLocaleImportMap(locales: string[]) {
	return `export const localeImportMap = {
	${locales.map((locale) => {
		return `'${locale}': () => import('dayjs/locale/${locale}')`;
	})}
};`;
}

function generateLocaleGetter() {
	return `export function getLocale(locale: Locale) {
	return localeImportMap[locale]();
}`;
}

function writeLocaleFile(contents: string) {
	const destPath = './src/lib/internal/locale.ts';
	writeFileSync(destPath, contents);
}

buildLocale();
