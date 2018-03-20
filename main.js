var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
var path = require('path');
var express = require('express');
var app = express();

app.listen(80);
app.use(express.static('public'));
app.get('/parse', async function(req, res, next) {
  const response = await fetch('http://35.225.108.19:5000/parse', { method: 'POST', body: req.query.q });
  res.send(await response.json());
});

app.get('/', async function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

module.exports = router;
