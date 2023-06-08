export function uuid() {
	try {
		return crypto.randomUUID();
	} catch {
		let result = '';
		const hexcodes = '0123456789abcdef'.split('');

		for (let index = 0; index < 32; index++) {
			let value = Math.floor(Math.random() * 16);

			switch (index) {
				case 8:
					result += '-';
					break;
				case 12:
					value = 4;
					result += '-';
					break;
				case 16:
					value = (value & 3) | 8;
					result += '-';
					break;
				case 20:
					result += '-';
					break;
			}
			result += hexcodes[value];
		}
		return result;
	}
}
