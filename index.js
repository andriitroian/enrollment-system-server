const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api');
const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use('/api', api);

app.get('/', (req, res) => {
	res.send('I\'m just an API').end();
});

app.listen(port, () => {
	console.log('Server is ready');
});
