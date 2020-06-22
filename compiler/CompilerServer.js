const express = require('express');
const queue = require('express-queue');
const { check, validationResult } = require('express-validator');
const queueList = queue({
	activeLimit: 2,
	queuedLimit: -1,
});
const app = express();
const bodyParser = require('body-parser');
const { getResult, compileWithSample } = require('../compiler/worker.js');
const clear = require('clear');

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'https://grader.everthink.dev');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Header', 'X-Requested-With, Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(bodyParser.urlencoded({limit:'1mb', extended: false}));
app.use(bodyParser.json({limit:'1mb'}));
app.use(queueList);

app.post(
	'/compiler',
	[check('input').exists(), check('sourceCode').exists()],
	compiler
); // Call for output only

let workerActive = [true, true];

function compiler(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			error: 'Reject, json wrong',
		});
	}
	let ID;
	if (workerActive[0]) {
		workerActive[0] = false;
		ID = 0;
	} else {
		workerActive[1] = false;
		ID = 1;
	}
	console.log('new request in ' + ID);
	if (!req.body.output) {
		getResult(req.body.sourceCode, req.body.input, ID)
			.then((result) => {
				workerActive[ID] = true;
				//console.log(ID + ' result: ' + JSON.stringify(result));
				res.json(result);
			})
			.catch((err) => {
				workerActive[ID] = true;
				res.json('something wrong' + err);
			});
	} else {
		compileWithSample(
			req.body.sourceCode,
			req.body.input,
			ID,
			req.body.output
		)
			.then((result) => {
				workerActive[ID] = true;
				//console.log(ID + ' result: ' + JSON.stringify(result));
				res.json(result);
			})
			.catch((err) => {
				workerActive[ID] = true;
				res.json('something wrong' + err);
			});
	}
}

app.listen(80, () => {
	clear();
	console.log();
	console.log('CompilerServer : Ready');
});
