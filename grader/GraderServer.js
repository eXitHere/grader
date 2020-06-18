const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
	check,
	validationResult
} = require('express-validator');
const {
	fork
} = require('child_process');
const {
	init
} = require('../main/init.js');

const chalk = require('chalk');

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

app.post('/compiler', [
	check('questionId').exists(),
	check('userId').exists(),
	check('input').exists(),
	check('output').exists(),
	check('scorePerCase').exists(),
	check('sourceCode').exists(),
], compile);
const process = fork('./grader/grader.js');

/*
TODO: -> req : {submitionId, userId, input, output, scorePerCase, sourceCode}
*/

function compile(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			//errors: errors.array()
			'status': "err",
			'error': 'Reject, json wrong'
		})
	}
	console.log("new request");
	process.send(req.body);
	res.send({
		status: 'ok',
	});
}

async function start() {
	await init();
	app.listen(3456, () => {
		console.log(
			chalk.blueBright(
				'CompilerServer at port 4906.\nGraderServer at port 3456.'
			)
		);
	});
}

start();