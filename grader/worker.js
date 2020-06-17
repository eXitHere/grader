const {
    create,
    build,
    run
} = require('../main/compile_run.js');

module.exports = {
    process_
}

async function process_(sourceCode, input, output, scorePerCase) {

    var result;
    var score;
    var time;

    return new Promise(async function (resolve, reject) {
        await create(sourceCode, 'master', async function (err, filePathCpp) {
            // create cpp file
            if (err) {
                result = 'C';
                if (err.toString().includes('_is_a_banned_library'))
                    result = 'B';
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
                        result = 'B';
                    else
                        result = 'b';
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
                    var result_ = [];
                    var result = '';
                    var score = 0;
                    var index = 0;
                    var time = -1;
                    const processX = inputSplit.map(async (inputX, idx) => {
                        result_[idx] = await run(filePathExe, inputX);
                        if (result_[idx].timeUsage > time) time = result_[idx].timeUsage;
                    });
                    await Promise.all(processX);
                    outputSplit.forEach(output_test => {
                        if (output_test == result_[index++].result) {
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
                    });
                    resolve({
                        result,
                        score,
                        time,
                    });
                }
            });
        });
    });
}