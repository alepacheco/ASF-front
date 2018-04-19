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
  const response = await fetch('http://flightassistant.epqm6t53rt.eu-west-1.elasticbeanstalk.com/parse', { method: 'POST', body: req.query.q });
  res.send(await response.json());
});

app.get('/geo', async function(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const response = await fetch('http://ip-api.com/json/' + ip);
  const jsonResponse = await response.json();
  try {
    getIata(await jsonResponse.city, res);
  } catch (e) {
    res.send('');
  }

});



const getIata = (cityname, callback) => {
  var http = require("https");

  var options = {
    "method": "GET",
    "hostname": "clients1.google.com",
    "port": null,
    "path": "/complete/search?client=flights&q=" + cityname,
    "headers": {
      "cache-control": "no-cache",
    }
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      let json = '';
      try {
        json = JSON.parse(body.toString().substr(19,body.length - 20))[1][0][3]['a']
      } catch (e) {

      }
      console.log(json);

      callback.send(json)
    });
  });

  req.end();

}


app.get('/', async function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

module.exports = router;
