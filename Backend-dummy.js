const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

app.post('/api/v1/grader_check', test);

/*
TODO: -> req : {submitionId, userId, input, output, scorePerCase, sourceCode}
*/
function test(req, res, next) {
    console.log(req.body);
    res.json('(Dummy Server) returned ok');
}

app.listen(5000, () => {
    console.log('Server (Backend-Dummy) at port 5000.');
});