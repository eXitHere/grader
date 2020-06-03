const {process_} = require('./compile_run'); 
const fetch = require('node-fetch');

var tress = require('tress');

var Q_process = tress(function (body, next) {
    run(body)
    .then(() => next());
},1);

process.on('message', async (body) => {
    Q_process.push(body);
});
    
async function run({submitionId, userId, input, output, scorePerCase, sourceCode}){
    console.log("new compiler!");
    const result = await process_(sourceCode,input,output,scorePerCase);
    //TODO : -> json return {submitionId,userId,result,score,time}
    const body = {
        submitionId: submitionId,
        userId:      userId,
        result:      result.result,
        score:       result.score,
        time:        0
    }
    fetch('http://localhost:6666/api/v1/grader_check/', {
            method:  'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'applicatio/json'},
        }).then(res => res.json())
        .then(json  => console.log(json));
    console.log(result);
}