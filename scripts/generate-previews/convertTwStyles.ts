export const convertTwStyles = async (inputFilePath: string, outputFilePath: string) => {
	const command = [
		'C:\\Program Files\\nodejs\\npx.cmd',
		// 'npx',
		'tailwindcss',
		'-i',
		inputFilePath,
		'-o',
		outputFilePath,
	];

	// new Deno.Command('C:\\Program Files\\nodejs\\npx.cmd', {
	// 	args: command,
	// 	stdin: 'piped',
	// 	stdout: 'piped',
	// });

	const process = Deno.run({
		cmd: command,
		stdout: 'piped',
		stderr: 'piped',
	});

	const { code } = await process.status();

	if (code === 0) {
		const rawOutput = await process.output();
		const output = new TextDecoder().decode(rawOutput);
		console.log(output);
	} else {
		const rawError = await process.stderrOutput();
		const errorString = new TextDecoder().decode(rawError);
		console.error(errorString);
	}

	process.close();
};
