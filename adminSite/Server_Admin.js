const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get(
    '/Itfeelslikenobodyeverknewmeuntilyouknewme',
    getData
)

function getData(req, res, next) {
    try {
        const libBan      = fs.readFileSync('./compile_run/libraryBanned.BAN').toString().split(/\r?\n/);
        const functionBan = fs.readFileSync('./compile_run/banned.h').toString().split(/\r?\n/);
        const functionBan_Select = [];
        for(let i=3;i<functionBan.length;i+=2) {
            if(functionBan[i].includes('#undef')) {
                console.log(functionBan[i]);
                functionBan_Select.push(functionBan[i].split(' ')[1]);
            }
        }
        res.json({
            'libban': libBan,
            'functionBan': functionBan_Select
        });
    }
    catch(e) {
        res.json('error')
    }
}

app.listen(1000, () => {
    console.log('Admin site at port 1000');
});