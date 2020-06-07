const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
    getResult
} = require('./compile_run');
const clear = require('clear');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/compiler', compile);

async function compile(req, res, next) {
    getResult(
        req.body.sourceCode,
        req.body.input
    ).then(result => {
        console.log(`cpServer: ${JSON.stringify(result)}`);
        res.json(result)
    });
}

app.listen(4906, () => {
    clear();
    console.log();
    console.log('CompilerServer : Ready');
});