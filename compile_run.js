//const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const {execFile, exec} = require('child_process');
var fs = require('fs');

let pathCompiler = `MinGW/bin/`;

module.exports = {
    process_
};

/*
* input source code
* output path of file .cpp
*/
async function create(Source, callback) {
    let fileName = `master`;
    await fs.writeFile(`./compile_run/${fileName}.cpp`, `${Source}`, function(err) {
        if(err) {
            callback(err, null);
            return;
        }
        //console.log(`created file ${fileName}.cpp`);
        callback(null, `compile_run/${fileName}.cpp`);
    })
}

async function build(filePathCpp, callback) {
    await exec(`cd ${__dirname}/${pathCompiler} & g++ -std=c++14 ${__dirname}/${filePathCpp} -o ${__dirname}/compile_run/master`, (err, stdout, stderr) => {
        if( err ) {
            //console.log(`error: ${err.message} `);
            callback(`${err.message.split('error: ')[1]}`, null);
            return;
        }
        if( stderr ) {
            callback(`${stderr}`, null);
            //console.log(`stderr: ${stderr}`);
            return;
        }
        //error(`${err.message}`);
        callback(null, `${__dirname}/compile_run/master`);
    });
}

async function run(filePathExe, input) {
    return new Promise(function (resolve, reject) {
        const child = execFile(`${filePathExe}`, {timeout: 1000} , function (err, stdout, stderr) {
            if(err) {
                resolve('T');
                return;
            }
            if(stderr) {
                resolve('X');
                return;
            }
            resolve(stdout);
        });
        child.stdin.setEncoding('utf-8');
        child.stdin.write(input);
        child.stdin.end();
    });
}

async function process_ (sourceCode, input, output, scorePerCase) {
    //console.log(sourceCode);
    return new Promise(async function (resolve, reject) {
        await create(sourceCode, async function(err, filePathCpp) {          // create cpp file               
            if ( err ) {
                //console.log(`Error in create : ${error}`);  
                var result       = "E";
                var score        = -1;
                resolve({result,score});
            }
            else {
                //console.log(`Create success : ${filePathCpp}`);  
            }
            await build(filePathCpp, async function(err, filePathExe) {      // create exe file
                if( err ){                                                   //
                    //console.log(`Error in build : ` + err);                            // ex error `No such file or directory` .. `was no declared in this scope`
                    var result       = "E";
                    var score        = -1;
                    resolve({result,score});
                }
                else {
                    //console.log(`Build success ` + filePathExe);
                    var inputSplit   = input.split('$.$');
                    var outputSplit  = output.split('$.$');
                    var result_      = [];
                    var result       = "";
                    var score        = 0;
                    //console.log(inputSplit);
                    //console.log(outputSplit);
                    const processX = inputSplit.map(async (inputX, idx) => {
                        result_[idx] = await run(filePathExe, inputX);
                    });
                    await Promise.all(processX);
                    for(let i=0;i<10;i++){
                        //console.log(" output " + outputSplit[i] + " result "+ result_[i]);
                        if (outputSplit[i] == result_[i]) {
                            result  += 'P';
                            score   += parseInt(scorePerCase);
                        }
                        else {
                            result += result_[i]=='T' || result_ =='X'?result_[i]:'-';
                        }
                    }
                    //console.log({result,score});
                    resolve ({result,score});
                }
            });
        });
    });
}