const express = require('express');
const queue = require('express-queue');
const queueList = queue({
	activeLimit: 2,
	queuedLimit: -1,
});
const app = express();
const bodyParser = require('body-parser');
const {
	getResult
} = require('../main/compile_run.js');
const clear = require('clear');
const {
	json
} = require('express');

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());
app.use(queueList);

/*
 *  API
 *  ONLY get result
 *  GET http://localhost:4906/compiler
 *	{
 *		"input":      "xx",
 *		"sourceCode": "yy"
 *	}
 *  RES
 *  {
 * 		"result":    "xx",
 * 		"returnCode": "yy" (not from program exit but for frontend only),
 * 		"timeUsage": 00
 *  }
 */
app.post('/compiler', compiler); // Call for output only

let workerActive = [true, true];

function compiler(req, res, next) {
	let ID;
	if (workerActive[0]) {
		workerActive[0] = false;
		ID = 0;
	} else {
		workerActive[1] = false;
		ID = 1;
	}
	//console.log('new request in ' + ID);
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
}

app.listen(4906, () => {
	clear();
	console.log();
	console.log('CompilerServer : Ready');
});