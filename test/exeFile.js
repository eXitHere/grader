const { execFile, exec } = require('child_process');
const child = execFile(`./run.sh`,
    {
        timeout: 1000,
        maxBuffer: 1024 * 1024,
    },
    function (err, stdout, stderr) {
        if (err) {
            console.log(err)
            if (err.code && err.code == 3221225725) {
                console.log('M'); //* out of memory
            }
            else if (err.code && err.code == 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
                console.log('O'); //* out of buffer
            } 
            else if (err.signal && err.signal == 'SIGTERM') {
                console.log('T'); //* time out
            } 
            else {
                console.log('R'); //* runtime error
            }
        }
        if (stderr) {
            console.log('X');
        }
        console.log(stdout);
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