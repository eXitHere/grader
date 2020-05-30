const {hello, process_} = require('./compile_run'); 

var tress = require('tress');

var Q_process = tress(function (body, next) {
    run(body)
    .then(() => next());
},1);

process.on('message', async (body) => {
    Q_process.push(body);
    // TODO send to web hook
});


async function run({input, output, scorePerCase, sourceCode, userId}){
    console.log("new compiler!");
    const result = await process_(sourceCode,input,output,scorePerCase);
    console.log(result);
}