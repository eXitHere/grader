const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const { fork }   = require('child_process');
const { init }   = require('./init.js');
const chalk      = require('chalk');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/compiler', compile);
const process = fork('./grader.js');

/*
TODO: -> req : {submitionId, userId, input, output, scorePerCase, sourceCode}
*/

function compile(req, res, next) {
    //console.log("new request");
    process.send(req.body);
    res.send({"status": "ok"});
}

async function start() {
    await init();
    app.listen(3456, () => {
        console.log(chalk.blueBright('CompilerServer at port 4906.\nGraderServer at port 3456.'));
    })
}

start();