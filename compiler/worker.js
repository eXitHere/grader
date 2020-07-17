const {
    create,
    build,
    run,
    checkAnswer
} = require('../main/compile_run.js');

module.exports = {
    getResult,
    compileWithSample
}

async function getResult(sourceCode, input, workerNumber) {
    return await new Promise(async function (resolve, reject) {
        try {
        await create(sourceCode, 'compileOnly_' + workerNumber, async function (
            err,
            filePathCpp
        ) {
            if (err) {
                var result = 'C';
                if (err.toString().includes('_is_a_banned_library'))
                    result = 'L';
                var returnedCode = -1;
                var timeUsage = -1;
                resolve({
                    result,
                    returnedCode,
                    timeUsage,
                });
                return;
            } else {}
            await build(filePathCpp, async function (err, filePathExe) {
                // create exe file
                if (err) {
                    //console.log(`Error in build : ` + err); // ex error `No such file or directory` .. `was no declared in this scope`
                    var spilt_x = err;
                    //console.log(spilt_x);
                    var spilt_ = spilt_x.split(/\r?\n/);
                    if (spilt_.length >= 2)
                        var result =
                            spilt_[0] + '\r\n' + spilt_[1] + '\r\n' + spilt_[2];
                    else var result = spilt_[0];
                    var returnCode = -1;
                    var timeUsage = -1;
                    resolve({
                        result,
                        returnCode,
                        timeUsage,
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
    } catch {
        resolve({
            'result': '*',
            'returnCode': '-1',
            'timeUsage': '-1',
        });
    }
    });
}

async function compileWithSample(sourceCode, input, workerNumber, output) {

    var result = '';
    var returnCode;
    var timeUsage;
    return new Promise(async function (resolve, reject) {
        try {
            await create(sourceCode, 'compileOnly_' + workerNumber, async function (
                err,
                filePathCpp
            ) { // create cpp file
                if (err) {
                    result = 'C';
                    if (err.toString().includes('_is_a_banned_library'))
                        result = 'L';
                    returnCode = -1;
                    timeUsage = -1;
                    resolve({
                        result,
                        returnCode,
                        timeUsage,
                    });
                    return;
                } else {}
                await build(filePathCpp, async function (err, filePathExe) {
                    // create exe file
                    if (err) {
                        //
                        //console.log(`Error in build : ` + err); // ex error `No such file or directory` .. `was no declared in this scope`
                        //* spilt only two first line
                        var spilt_ = err.split(/\r?\n/);
                        console.log(err);
                        if (err.toString().includes('_is_a_banned_function'))
                        {
                            result = 'F';
                            //console.log("eiei");
                        }
                        else
                            result = 'B';
                        returnCode = -1;
                        timeUsage = -1;
                        resolve({
                            result,
                            returnCode,
                            timeUsage,
                        });
                    } else {
                        var inputSplit = input.split('$.$');
                        var outputSplit = output.split('$.$');
                        var result_ = [];
                        var index = 0;
                        timeUsage = -1; 
                        returnCode = 0;
                        if(inputSplit.length != outputSplit.length) {
                            result     = 'W'
                            returnCode = -1
                            resolve({
                                result,
                                returnCode,
                                timeUsage,
                            });
                            return;
                        }
                        const processX = inputSplit.map(async (inputX, idx) => {
                            // `main/run${workerNumber}.sh`
                            result_[idx] = await run(filePathExe, inputX);
                            if (result_[idx].timeUsage > timeUsage) timeUsage = result_[idx].timeUsage;
                        });
                        await Promise.all(processX);
                        outputSplit.forEach(output_test => {
                            if (checkAnswer(output_test, result_[index].result)) {
                                result += 'P';
                            } else {
                                result +=
                                    result_[index].result == 'T' ||
                                    result_[index].result == 'M' ||
                                    result_[index].result == 'X' ||
                                    result_[index].result == 'O' ?
                                    result_[index].result :
                                    '-';
                            }
                            index++;
                        });
                        resolve({
                            result,
                            returnCode,
                            timeUsage,
                        });
                    }
                });
            });
        } catch (e) {
            resolve({
                'result': '*',
                'returnCode': '-1',
                'timeUsage': '-1',
            });
        }
    });
}