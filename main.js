var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
var path = require('path');
var express = require('express');
var app = express();

app.listen(8888);
app.use(express.static('public'));
app.get('/parse', async function(req, res, next) {
  const response = await fetch('http://35.225.108.19:5000/parse', { method: 'POST', body: req.query.q });
  res.send(await response.json());
});

app.get('/geo', async function(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const response = await fetch('http://ip-api.com/json/' + ip);
  const jsonResponse = await response.json()
  res.send(await jsonResponse.city);
});



app.get('/', async function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

module.exports = router;
