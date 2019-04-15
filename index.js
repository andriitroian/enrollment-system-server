const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const app = express();
const port = 3000;

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', api);

app.get('/', (req, res) => {
	res.send('I\'m just an API').end();
});

app.listen(port, () => {
	console.log('Server is ready');
});
