const {
    exec
} = require('child_process');
var fs = require('fs');
const {
    NodeVM
} = require('vm2');
var addBanned = require('./addBanned');
const remove_comment = require('strip-comments');

let pathCompiler = `MinGW/bin/`;

module.exports = {
    process_,
    getResult,
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
    await fs.writeFile(`./compile_run/${fileName}.cpp`, `${newSource}`, function (
        err
    ) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, `compile_run/${fileName}.cpp`);
    });
}

async function build(filePathCpp, callback) {
    let exeName = filePathCpp.split('/')[1].split('.')[0];
    //console.log(`${pathCompiler}/g++.exe -w -std=c++14 ${filePathCpp} -o compile_run/${exeName}`)
    await exec(
        `${pathCompiler}/g++.exe -w -std=c++14 ${filePathCpp} -o compile_run/${exeName}`,
        (err, stdout, stderr) => {
            if (err) {
                callback(`${err.message.split('error: ')[1]}`, null);
                return;
            }
            if (stderr) {
                callback(`${stderr}`, null);
                return;
            }
            callback(null, `compile_run/${exeName}.exe`);
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

async function getResult(sourceCode, input) {
    return new Promise(async function (resolve, reject) {
        await create(sourceCode, 'compileOnly', async function (err, filePathCpp) {
            if (err) {
                var result = 'E';
                var returnedCode = -1;
                var timeUsage = -1;
                resolve({
                    result,
                    returnedCode,
                    timeUsage
                });
            } else {}
            await build(filePathCpp, async function (err, filePathExe) {
                // create exe file
                if (err) {
                    //console.log(`Error in build : ` + err); // ex error `No such file or directory` .. `was no declared in this scope`
                    var spilt_x = err;
                    //console.log(spilt_x);
                    var spilt_ = spilt_x.split(/\r?\n/);
                    if (spilt_.length >= 2) var result = spilt_[0] + '\r\n' + spilt_[1] + '\r\n' + spilt_[2];
                    else var result = spilt_[0];
                    var returnCode = -1;
                    var timeUsage = -1;
                    resolve({
                        result,
                        returnCode,
                        timeUsage
                    });
                } else {
                    var {
                        result,
                        timeUsage
                    } = await run(filePathExe, input);
                    var returnCode = 0;
                    if (result == 'X') {
                        returnCode = -1;
                        resolve({
                            result,
                            returnCode,
                            timeUsage,
                        });
                    } else {
                        resolve({
                            result,
                            returnCode,
                            timeUsage,
                        });
                    }
                }
            });
        });
    });
}

async function process_(sourceCode, input, output, scorePerCase) {
    return new Promise(async function (resolve, reject) {
        await create(sourceCode, 'master', async function (err, filePathCpp) {
            // create cpp file
            if (err) {
                //console.log(`Error in create : ${error}`);
                var result = 'E';
                var score = -1;

                resolve({
                    result,
                    score,
                });
            } else {
                //console.log(`Create success : ${filePathCpp}`);
            }
            await build(filePathCpp, async function (err, filePathExe) {
                // create exe file
                if (err) {
                    //
                    //console.log(`Error in build : ` + err); // ex error `No such file or directory` .. `was no declared in this scope`
                    //* spilt only two first line
                    var spilt_ = err.split(/\r?\n/);
                    if (spilt_.length > 2) var result = spilt_[0] + '\r\n' + spilt_[1];
                    else var result = spilt_[0];
                    var score = -1;
                    resolve({
                        result,
                        score,
                    });
                } else {
                    var inputSplit = input.split('$.$');
                    var outputSplit = output.split('$.$');
                    var result_ = [];
                    var result = '';
                    var score = 0;
                    const processX = inputSplit.map(async (inputX, idx) => {
                        result_[idx] = await run(filePathExe, inputX);
                    });
                    await Promise.all(processX);
                    var maxTime = Math.max(result.timeUsage);
                    for (let i = 0; i < inputSplit.length; i++) {
                        //console.log(" output " + outputSplit[i] + " result "+ result_[i]);
                        if (outputSplit[i] == result_[i].result) {
                            result += 'P';
                            score += parseInt(scorePerCase);
                        } else {
                            result +=
                                result_[i].result == 'T' ||
                                result_[i].result == 'M' ||
                                result_[i].result == 'X' ?
                                result_[i].result :
                                '-';
                        }
                    }
                    resolve({
                        result,
                        score,
                        maxTime,
                    });
                }
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
              callback('?');
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