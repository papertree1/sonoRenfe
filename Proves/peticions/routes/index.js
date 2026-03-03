var express = require('express');
var router = express.Router();

const fs = require('fs');
const { get } = require('http');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// script per fer proves de peticions a la API de Renfe
getTrains();

function getTrains() {
  results = { data: [] };
  counter = 0;

  console.log("Starting fetches...");

  for (let i = 25000; i < 26000; i++) {
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/${i}`)
      .then(response => response.json())
      .then(data => {
        // add results to a string

        if (!JSON.stringify(data).includes(`"target":null`)) {
          results.data.push({ id: i, data: data });
        }

        counter++;
        console.log(counter);

        if (counter == 1000) {
          results.data.sort((a, b) => a.id - b.id);

          fs.writeFile('resultsNet2.json', JSON.stringify(results), (err) => {
            if (err) throw err;
            console.log('Results saved to resultsNet.json');
          });
        }
      })
      .catch(error => {
        console.error(`Error fetching train ${i}:`, error.message);
        getTrains();
      });
  }
}

module.exports = router;