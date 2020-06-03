const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/backend', test);

/*
TODO: -> req : {submitionId, userId, input, output, scorePerCase, sourceCode}
*/
function test(req, res, next) {
    console.log(req.body);
}

app.listen(6666, () => {
    console.log('Server (Backend-Dummy) at port 6666.');
})