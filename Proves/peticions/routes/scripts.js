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
const { response } = require('../app');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// script per fer proves de peticions a la API de Renfe
getStations();

function getStations() {
  results = { data: [] };

  console.log("Starting fetches...");

  for (let i = 1; i < 11; i++) {
    var originStationId, destinationStationId;
    switch (i) {
      case 1:
        //R1
        originStationId = 72300;
        destinationStationId = 79200;
        break;
      case 2:
        //R2
        originStationId = 71705;
        destinationStationId = 79100;
        break;
      case 3:
        //R2N
        originStationId = 72400;
        destinationStationId = 79200;
        break;
      case 4:
        //R2S
        originStationId = 71600;
        destinationStationId = 79400;
        break;
      case 5:
        //R3
        originStationId = 72305;
        destinationStationId = 77310;
        break;
      case 6:
        //R4
        originStationId = 71600;
        destinationStationId = 78600;
        break;
      case 7:
        //R7
        originStationId = 78802;
        destinationStationId = 72503;
        break;
      case 8:
        //R8
        originStationId = 72209;
        destinationStationId = 79100;
        break;
      case 9:
        //R11
        originStationId = 71801;
        destinationStationId = 79316;
        break;
      case 10:
        //R13
        originStationId = 79400;
        destinationStationId = 78400;
        break;
    }
    
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=${originStationId}&destinationStationId=${destinationStationId}`)
    .then(response => response.json())
    .then(data => {
      fs.writeFile("timetables.json", JSON.stringify(data), (err) => {
            if (err) throw err;
            console.log(`Results saved to timetables.json`);
          });
    })
    .catch(error => console.error(`Error fetching API`, error.message));
  }
}

module.exports = router;