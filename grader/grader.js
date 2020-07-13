const {
	process_
} = require('./worker.js');

const fetch = require('node-fetch');
var tress = require('tress');

var Q_process = tress(function (body, next) {
	run(body).then(() => next());
}, 1);

process.on('message', async (body) => {
	Q_process.push(body);
});

async function run({
	questionId,
	userId,
	input,
	output,
	scorePerCase,
	sourceCode,
}) {
	console.log('new compiler!');
	const {
		result,
		score,
		time
	} = await process_(
		sourceCode,
		input,
		output,
		scorePerCase
	);
	//TODO : -> json return {questionId,userId,result,score,time}
	const body = {
		questionId,
		userId,
		result,
		score,
		time,
	};
	console.log(body);
	try {
		await fetch('http://10.148.0.2:5000/api/v1/grader_check/', {
		//await fetch('http://localhost:5000/api/v1/grader_check/', {
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			res.json()
		});
	}
	catch (e) {
		console.log(e)
	}
}