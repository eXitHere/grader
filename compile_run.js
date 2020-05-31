//const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const {execFile, exec} = require('child_process');
var fs = require('fs');

let pathCompiler = `MinGW/bin/`;

module.exports = {
    process_,
    hello
};

/*
* input source code
* output path of file .cpp
*/
async function create(Source, callback) {
    let fileName = `master`;
    await fs.writeFile(`./.compile_run/${fileName}.cpp`, `${Source}`, function(err) {
        if(err) {
            callback(err, null);
            return;
        }
        //console.log(`created file ${fileName}.cpp`);
        callback(null, `.compile_run/${fileName}.cpp`);
    })
}

async function build(filePathCpp, callback) {
    await exec(`cd ${__dirname}/${pathCompiler} & g++.exe -std=c++14 ${__dirname}/${filePathCpp} -o ${__dirname}/.compile_run/master`, (err, stdout, stderr) => {
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
        callback(null, `${__dirname}/.compile_run/master.exe`);
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

function hello(){
    console.log("Hello World!");
};

/*
* Driver for test only!
*/
const code   = ` #include<stdio.h>\r\nint main() { int a,b,i; scanf(\"%d%d\",&a,&b); printf(\"%d\",a+b); return 0;} `
const code1   = ` #include<stdio.h>\r\nint main() { printf("Hello World!"); return 0; } `
const input  = `1 2$.$2 3$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$1000000000 5$.$2 3`;
const output = `3$.$5$.$8$.$100$.$100$.$100$.$100$.$100$.$1000000005$.$5`;

//process(code, input, output, 10);

async function process_ (sourceCode, input, output, scorePerCase) {
    //console.log(sourceCode);
    return new Promise(async function (resolve, reject) {
        await create(sourceCode, async function(err, filePathCpp) {          // create cpp file               
            if ( err ) {
                //console.log(`Error in create : ${error}`);  
            }
            else {
                //console.log(`Create success : ${filePathCpp}`);  
            }
            await build(filePathCpp, async function(err, filePathExe) {      // create exe file
                if( err ){                                                   //
                    //console.log(`Error in build : ` + err);                            // ex error `No such file or directory` .. `was no declared in this scope`
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