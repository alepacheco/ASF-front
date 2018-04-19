var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");
var path = require('path');
var express = require('express');
var app = express();
var request = require("request");

app.listen(80);
app.use(express.static('public'));
app.get('/parse', async function(req, res, next) {
  const response = await fetch('http://localhost:5000/parse', { method: 'POST', body: req.query.q });
  res.send(await response.json());
});

app.get('/geo', async function(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const response = await fetch('http://ip-api.com/json/' + ip);
  const jsonResponse = await response.json()

  getIata(await jsonResponse.city, res.send);
});



const getIata = (cityname, callback) => {
  var options = { method: 'GET',
    url: 'https://clients1.google.com/complete/search',
    qs: { client: 'flights', q: cityname },
    headers: { 'cache-control': 'no-cache' }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    callback(JSON.parse(body.substr(19,body.length - 20))[1][0][3]['a'])
  });
}


app.get('/', async function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

module.exports = router;
