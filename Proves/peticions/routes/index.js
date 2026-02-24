var express = require('express');
var router = express.Router();

const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

results = "";
// script per fer proves de peticions a la API de Renfe
for (let i = 25000; i < 26000; i++) {
  fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/${i}`)
    .then(response => response.json())
    .then(data => {
      // add results to a string
      results += `Train ${i}: ${JSON.stringify(data)}\n`;
    });
}

// wait for all fetches to finish and then write results to a file
setTimeout(() => {
  fs.writeFile('results.txt', results, (err) => {
    if (err) throw err;
    console.log('Results saved to results.txt');
  });
}, 10000);