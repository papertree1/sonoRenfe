const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
dayjs.extend(minMax);

var udpPort = new osc.UDPPort({
    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the socket.
udpPort.open();

// crear un array/json buit que contrindrà la info dels trens
r2 = [];

// obtenir els trens actius d'una línia concreta (R2) i guardar-los a l'array
getTrains();
fileName = 'data/dades.json';

function getTrains() {
    console.log("Starting fetches...");
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=79104&destinationStationId=72400`) // R2
        .then(response => response.json())
        .then(data => {
            results = data.result;

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                r2.push({
                    id: train
                })
            }

            // console.log(r2);

            getTrainInfo();
        });
}

var fetches = []; // TODO: això s'hauria de moure d'aquí perquè es buidi (o no?) abans de cada execució de la funció

async function getTrainInfo() {
    for (let i = 0; i < r2.length; i++) {
        fetches.push(
            fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/${r2[i].id}`)
                .then(response => { return response.json(); })
                .catch(err => { return console.log(err) })
        );
    }

    Promise.all(fetches)
        .then(data => {
            for (train of data) {
                hores = []

                for (station of train.train.stations) {
                    hores.push(dayjs(station.arrivalDateHour));
                }

                minTime = dayjs.min(hores);
                r2[data.indexOf(train)].properaParada = minTime.format('DD/MM HH:mm:ss'); // TODO: canviar per for normal (simplifica sintaxi)

                //TODO: POSAR NOMS DE LES PARADES

                //TODO: COMPROVAR QUE LES HORES CORRESPONGUIN AMB ELS TRENS
            }

            console.log(r2);
        })
}