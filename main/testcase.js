const fetch = require('node-fetch');
const { json } = require('express');

module.exports = {
  fetchToBackend,
}
async function fetchToBackend() {
        //await fetch('http://10.148.0.2:5000/api/v1/grader_check/', {
    const response = await fetch('http://localhost:5000/api/v1/admin/2sacsacmk231/', {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
		},
    })
    console.log('json updated!');
    return await response.json();
}
