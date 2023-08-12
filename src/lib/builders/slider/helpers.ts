// reinterpretation of https://github.com/guipn/sinful.js/blob/master/sinful.js
// to fix floating point arithmetic

function multiplier(x: number) {
	const parts = x.toString().split('.');
	if (parts.length < 2) {
		return 1;
	}
	return Math.pow(10, parts[1].length);
}

// Given a variable number of arguments, returns the maximum
// multiplier that must be used to normalize an operation involving
// all of them.

function correctionFactor(...args: number[]) {
	return Math.max(...args.map(multiplier));
}

export function add(...args: number[]) {
	const factor = correctionFactor(...args);
	let sum = 0;
	for (const number of args) {
		sum += number * factor;
	}
	return sum / factor;
}

export function sub(...[first, ...args]: number[]) {
	const factor = correctionFactor(...args);
	let sum = first * factor;

	for (const number of args) {
		sum -= number * factor;
	}
	return sum / factor;
}

export function mul(...args: number[]) {
	let total = 1;
	for (const number of args) {
		const factor = correctionFactor(total, number);
		total = (total * factor * (number * factor)) / (factor * factor);
	}
	return total;
}

export function div(...[first, ...args]: number[]) {
	let total = first;
	for (const number of args) {
		const factor = correctionFactor(total, number);
		total = (total * factor) / (number * factor);
	}
	return total;
}
