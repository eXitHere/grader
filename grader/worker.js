const {
    create,
    build,
    run,
    checkAnswer
} = require('../main/compile_run.js');

module.exports = {
    process_
}

async function process_(sourceCode, input, output, scorePerCase) {

    var result = '';
    var score;
    var time;
    //console.log(sourceCode, input, output, scorePerCase);
    return new Promise(async function (resolve, reject) {
        try {
            await create(sourceCode, 'master', async function (err, filePathCpp) {
                // create cpp file
                if (err) {

                    result = 'C';
                    if (err.toString().includes('_is_a_banned_library'))
                        result = 'L';
                    score = -1;
                    time = -1;
                    resolve({
                        result,
                        score,
                        time,
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
                        if (err.toString().includes('_is_a_banned_function'))
                            result = 'F';
                        else
                            result = 'B';
                        score = -1;
                        time = -1;
                        resolve({
                            result,
                            score,
                            time
                        });
                    } else {

                        var inputSplit = input.split('$.$');
                        var outputSplit = output.split('$.$');
                        //console.log(inputSplit, outputSplit);
                        var result_ = [];
                        var score = 0;
                        var index = 0;
                        var time = -1;
                        if(inputSplit.length != outputSplit.length) {
                            result     = 'W'
                            returnCode = -1
                            resolve({
                                result,
                                score,
                                time
                            });
                            return;
                        }

                        const processX = inputSplit.map(async (inputX, index) => {
                            //console.log(inputX);     filePathExe
                            result_[index] = await run('main/run.sh', inputX);
                            if (result_[index].timeUsage > time) time = result_[index].timeUsage;
                            //console.log(index, result_[index].timeUsage);
                        });

                        await Promise.all(processX);
                        //console.log(result_);
                        outputSplit.forEach(output_test => {
                            if (checkAnswer(output_test, result_[index].result)) {
                                result += 'P';
                                score += parseInt(scorePerCase);
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
                        //console.log(result);
                        resolve({
                            result,
                            score,
                            time,
                        });
                    }
                });
            });
        } catch (e) {
            resolve({
                'result': '*',
                'returnCode': '-1',
                'timeUsage': '*',
            });
        }
    });
}