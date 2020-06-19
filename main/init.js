const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {
	process_
} = require('../grader/worker.js');
const os = require('os');
module.exports = {
	init,
};

async function init() {
	const code = `
        #include<iostream>
        using namespace std;
        int main() {
            string input;
            cin >> input;
            cout << input;
            return 0;
        }
    `;
	const dummyJson = {
		input: 'Hello$.$World$.$HAHA$.$TEST$.$TEST$.$Whoami$.$bibi$.$eiei$.$thisisbug$.$lol',
		output: 'Hello$.$World$.$HAHA$.$TEST$.$TEST$.$Whoami$.$bibi$.$eiei$.$thisisbug$.$lol',
		scorePerCase: 10,
		sourceCode: code,
	};

	return new Promise(async function (resolve, reject) {
		if (os.type() != 'Linux') {
			console.log('Support only linux os.');
			process.exit(-1);
		}
		//clear();
		console.log(
			chalk.yellow(
				figlet.textSync('         Grader', {
					horizontalLayout: 'full',
				})
			)
		);
		console.log(
			chalk.green(
				figlet.textSync('[ eXit - Guy ]', {
					horizontalLayout: 'full',
				})
			)
		);
		console.log("V1.0.1");
		const {
			result,
			score
		} = await process_(
			dummyJson.sourceCode,
			dummyJson.input,
			dummyJson.output,
			dummyJson.scorePerCase
		);

		console.log(chalk.gray('\n\nTesting compiler ...'));

		if (score != -1) {
			console.log({
				result,
				score,
			});

			console.log(chalk.green(`\n\nStarting server...\n\n`));
			resolve();
		} else {
			console.log(
				chalk.red(
					`\n\nSomething wrong,`,
					`missing g++ or compile_run or everything else..\n\n`
				)
			);
			process.exit(-1);
		}
	});
}