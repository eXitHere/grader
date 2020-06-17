const {
	exec
} = require('child_process');
var fs = require('fs');
const {
	NodeVM
} = require('vm2');
var addBanned = require('../module/addBanned.js');
const remove_comment = require('strip-comments');

module.exports = {
	create,
	build,
	run
};

const vm = new NodeVM({
	sandbox: {},
	require: {
		context: 'sandbox',
		builtin: ['child_process'],
	},
});

/*
 * input source code
 * output path of file .cpp
 * compare with test case and return score any...
 */

async function create(Source, fileName, callback) {
	let newSource = addBanned(remove_comment(Source));
	//console.log(newSource);
	if (newSource[0] == -1) callback(newSource[1], null); // -2: banned lib
	await fs.writeFile(
		`./compile_run/${fileName}.cpp`,
		`${newSource[1]}`,
		function (err) {
			if (err) {
				callback(err, null);
				return;
			}
			callback(null, `compile_run/${fileName}.cpp`);
		}
	);
}

async function build(filePathCpp, callback) {
	let exeName = filePathCpp.split('/')[1].split('.')[0];
	//console.log(`${pathCompiler}/g++.exe -w -std=c++14 ${filePathCpp} -o compile_run/${exeName}`)
	await exec(
		`g++ -w -std=c++14 ${filePathCpp} -o compile_run/${exeName}`,
		(err, stdout, stderr) => {
			if (err) {
				callback(`${err.message.split('error: ')[1]}`, null);
				return;
			}
			if (stderr) {
				callback(`${stderr}`, null);
				return;
			}
			callback(null, `compile_run/${exeName}`);
		}
	);
}

async function run(filePathExe, input) {
	return new Promise(function (resolve, reject) {
		const time_stamp = Date.now();
		const vm_run = vm.run(command);
		vm_run(filePathExe, input, (result) => {
			const timeUsage = (Date.now() - time_stamp) / 1000;
			resolve({
				result,
				timeUsage,
			});
		});
	});
}

const command = `
    module.exports = function(filePathExe,input , callback) {
      const { execFile } = require('child_process');
      const child = execFile(filePathExe,
        {
          timeout: 1000,
          maxBuffer: 1024 * 1024 * 64,
        },
        function (err, stdout, stderr) {
          if (err) {
            if (err.code && err.code == 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
              callback('M'); //* out of memory
            } else if (err.signal && err.signal == 'SIGTERM') {
              callback('T'); //* time out
            } else {
              callback('R'); //* runtime error
            }
          }
          if (stderr) {
            callback('X');
          }
          callback(stdout);
        }
      );
      child.stdin.setEncoding('utf-8');
      child.stdin.write(input);
      child.stdin.end();
    };
    `;