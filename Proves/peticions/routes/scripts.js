/* -------SCRAPE TRENS-------- */
/*
var express = require('express');
var router = express.Router();

const fs = require('fs');
const { get } = require('http');

// GET home page.
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// script per fer proves de peticions a la API de Renfe
getTrains();

function getTrains() {
  results = { data: [] };
  counter = 0;
  fileName = 'resultsNet4.json';

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

          fs.writeFile(fileName, JSON.stringify(results), (err) => {
            if (err) throw err;
            console.log(`Results saved to ${fileName}`);
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
*/

/* ------ SCRAPE TIMETABLES ------*/
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

  for (let i = 1; i < 13; i++) {
    var originStationId, destinationStationId;
    switch (i) {
      case 1:
        //R1
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 2:
        //R2
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 3:
        //R3
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 4:
        //R4
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 5:
        //R5
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 6:
        //R6
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 7:
        //R7
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 8:
        //R8
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 9:
        //R9
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 10:
        //R10
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 11:
        //R11
        originStationId = 44444;
        destinationStationId = 44444;
        break;
      case 12:
        //R12
        originStationId = 44444;
        destinationStationId = 44444;
        break;



    }
  }

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

          fs.writeFile(fileName, JSON.stringify(results), (err) => {
            if (err) throw err;
            console.log(`Results saved to ${fileName}`);
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