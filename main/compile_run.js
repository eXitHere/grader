const {exec} = require('child_process');
var fs = require('fs');
var addBanned = require('../module/addBanned.js');
const remove_comment = require('strip-comments');

module.exports = {
	create,
	build,
	run,
	checkAnswer
};

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
		`g++ -w -std=c++14 ${filePathCpp} -o /var/local/lib/isolate/0/box/${exeName}`,
		(err, stdout, stderr) => {
			if (err) {
				callback(`${err.message.split('error: ')[1]}`, null);
				return;
			}
			if (stderr) {
				callback(`${stderr}`, null);
				return;
			}
			callback(null, `/var/local/lib/isolate/0/box//${exeName}`);
		}
	); 
} 

async function run(filePathExe, input) {
	return new Promise(function (resolve, reject) {
		try {
			exec('./run.sh')
			result = "Hello";
			timeUsage = 10;
			resolve({
				result,
				timeUsage,
			});
		}
		catch(e) {
			console.log(e);
		}
	});
}


function checkAnswer(master, ans) {
    var masterSplit = master.trimEnd().split(/\r?\n/);
    var ansSplit = ans.trimEnd().split(/\r?\n/);
    if (masterSplit.length != ansSplit.length) {
        return false;
    }
    else {
        for(var index = 0; index < masterSplit.length; index++) {
            if (masterSplit[index].trimEnd() != ansSplit[index].trimEnd()) {
                return false;
            }
        }
    }
    return true;
}

const command = `
    module.exports = function(filePathExe,input , callback) {
		try{
      const { execFile } = require('child_process');
      const child = execFile(filePathExe,
        {
          timeout: 1000,
          maxBuffer: 1024 * 1024,
        },
        function (err, stdout, stderr) {
          if (err) {
			if (err.code && err.code == 134) {
				callback('M') //? out of memory 
			}
            else if (err.code && err.code == 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
              	callback('O'); //* out of buffer
			} 
			else if (err.signal && err.signal == 'SIGTERM') {
              	callback('T'); //* time out
			} 
			else {
              	callback('R'); //* runtime error
            }
          }
          if (stderr) {
            callback('X');
          }
          callback(stdout);
        }
	  );
	  child.stdin.pipe(child.stdin);
	  child.stdin.setEncoding('utf-8');
      try{
		child.stdin.write(input);
	  }
	  catch(e){
		child.stdin.end();
	  }
	  child.stdin.end();
	  child.on('error', function(e){	
		console.log(e)
	  });
	}
	catch(e){
		callback('E');
	}
    };
    `;