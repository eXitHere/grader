const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { process_ } = require('./compile_run');

module.exports = {
    init
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
        input: "Hello$.$World$.$HAHA$.$TEST$.$TEST$.$Whoami$.$bibi$.$eiei$.$thisisbug$.$lol",
        output: "Hello$.$World$.$HAHA$.$TEST$.$TEST$.$Whoami$.$bibi$.$eiei$.$thisisbug$.$lol",
        scorePerCase: 10,
        sourceCode: code,
    }

    return new Promise(async function(resolve, reject) {
        clear();
        console.log(
            chalk.yellow(
                figlet.textSync('         Grader', { horizontalLayout: 'full' })
            )
        );
        console.log(
            chalk.green(
                figlet.textSync('[ eXit - Guy ]', { horizontalLayout: 'full' })
            )
        );
    
        const {result, score} = await process_ (
            dummyJson.sourceCode,
            dummyJson.input,
            dummyJson.output,
            dummyJson.scorePerCase
        );
        
        console.log(
            chalk.gray(
                '\n\nTesting compiler ...'
            )
        );

        if(score != -1) {
            console.log( "result dummy : ",
                {result,
                score}
            );

            console.log(
                chalk.green(
                    `\n\nStarting server...\n\n`
                )
            );
            resolve();
        }
        else {
            console.log(
                chalk.red(
                    `\n\nSomething wrong,`,
                    `missing compile_run or MinGW folder or everything else..\n\n`
                )
            );
            process.exit(-1);
        }

        
    });
}
