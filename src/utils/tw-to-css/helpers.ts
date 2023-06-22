import { cheatsheet, type Category } from './cheatsheet';

const arbitrarySupportedClasses = {
	pt: 'padding-top',
	pb: 'padding-bottom',
	pl: 'padding-left',
	pr: 'padding-right',
	p: 'padding',
	mb: 'margin-bottom',
	m: 'margin',
	mt: 'margin-top',
	ml: 'margin-left',
	mr: 'margin-right',
	w: 'width',
	h: 'height',
	top: 'top',
	bottom: 'bottom',
	left: 'left',
	right: 'right',
	bg: 'background',
	text: 'color',
};

type SupportedClassKey = keyof typeof arbitrarySupportedClasses;

const convertToCss = (classNames: string[]) => {
	let cssCode = ``;
	cheatsheet.forEach((element: Category) => {
		element.content.forEach((content) => {
			content.table.forEach((list) => {
				if (classNames.includes(list[0])) {
					const semicolon = list[1][list[1].length - 1] !== ';' ? ';' : '';
					if (list.length === 3) cssCode += `${list[1]}${semicolon} \n`;
					else cssCode += `${list[2]}${semicolon} \n`;
				}

				if (classNames.includes(list[1])) {
					const semicolon = list[2][list[2].length - 1] !== ';' ? ';' : '';
					cssCode += `${list[2]}${semicolon} \n`;
				}
			});
		});
	});

	// Check for arbitrary values

	const arbitraryClasses = classNames.filter((className) => className.includes('['));

	arbitraryClasses.forEach((className) => {
		const property = className.split('-[')[0].replace('.', '') as SupportedClassKey;
		const propertyValue = className.match(/(?<=\[)[^\][]*(?=])/g)?.[0];

		if (propertyValue) {
			if (arbitrarySupportedClasses[property]) {
				cssCode += `${arbitrarySupportedClasses[property]}: ${propertyValue};\n`;
			}
		}
	});

	return cssCode;
};

const getBreakPoints = (input: string, breakpoint: string) => {
	return input
		.split(' ')
		.filter((i: string) => i.startsWith(breakpoint + ':'))
		.map((i: string) => '.' + i.substring(3));
};

const getHoverClass = (input: string) => {
	return input
		.split(' ')
		.filter((i) => i.startsWith('hover:'))
		.map((i) => i.replace('hover:', '.'));
};

export const getConvertedClasses = (input: string) => {
	const classNames = input.split(/\s+/).map((i) => '.' + i.trim());
	const breakpoints = cheatsheet[0].content[3].table;

	const hoverClasses = getHoverClass(input);

	const smClasses = getBreakPoints(input, 'sm');
	const mdClasses = getBreakPoints(input, 'md');
	const lgClasses = getBreakPoints(input, 'lg');
	const xlClasses = getBreakPoints(input, 'xl');
	const _2xlClasses = getBreakPoints(input, '2xl');

	const classes = `${convertToCss(classNames)}
${smClasses.length !== 0 ? breakpoints[0][1].replace('...', '\n  ' + convertToCss(smClasses)) : ''}
${mdClasses.length !== 0 ? breakpoints[1][1].replace('...', '\n  ' + convertToCss(mdClasses)) : ''}
${lgClasses.length !== 0 ? breakpoints[2][1].replace('...', '\n  ' + convertToCss(lgClasses)) : ''}
${xlClasses.length !== 0 ? breakpoints[3][1].replace('...', '\n  ' + convertToCss(xlClasses)) : ''}
${
	_2xlClasses.length !== 0
		? breakpoints[4][1].replace('...', '\n  ' + convertToCss(_2xlClasses))
		: ''
}
${hoverClasses.length !== 0 ? `:hover {\n ${convertToCss(hoverClasses)} }` : ''}
`;
	return classes;
};

export const convertFromCssToJss = (input: string) => {
	const css = input.split(';');
	let jss = '';
	css.forEach((line) => {
		if (line.trim() !== '' && line) {
			const property = line.split(':')[0].trim();
			const value = line.split(':')[1] ? line.split(':')[1].trim() : null;

			if (value && property) {
				const camelCaseProperty = property.replace(/-([a-z])/g, function (g) {
					return g[1].toUpperCase();
				});

				jss += `${camelCaseProperty}: "${value}",\n`;
			}
		}
	});
	return jss;
};
