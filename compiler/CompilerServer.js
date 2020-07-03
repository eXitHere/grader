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
const {
	fetchToBackend
} = require('../main/testcase')
var jsonQuery = require('json-query');

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'https://grader.everythink.dev');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use(bodyParser.urlencoded({limit:'1mb', extended: false}));
app.use(bodyParser.json({limit:'1mb'}));
app.use(queueList);

app.post(
	'/compiler',
	[check('sourceCode').exists()],
	compiler
);

app.get(
	'/restarttestcasebecausetestcaseisupdate',
	updateCasetest
)

let workerActive = [true, true];

async function updateCasetest(req, res, next) {
	await updateJsonQuestion()
	res.json({
		'suscess': 'ok'
	})
}
/*update json question */
var jsonQuestion = {}
async function updateJsonQuestion() {
	jsonQuestion = await fetchToBackend();
}

//updateJsonQuestion();

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
	if (req.body.input) {
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
		const _testcase = jsonQuery(`data[id=${req.body.questionId}]`, {data: jsonQuestion }).value
		if (_testcase === null) {
			res.json({
				result:'W1',
				returnCode:'-1',
				timeUsage:'-1',
			});
			console.log('something wrong ' + 'id not found')
			workerActive[ID] = true;
			return;
		}
		//console.log(_testcase)
		compileWithSample(
			req.body.sourceCode,
			_testcase.input,
			ID,
			_testcase.output
		)
		.then((result) => {
			workerActive[ID] = true;
			console.log(ID + ' result: ' + JSON.stringify(result));
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
