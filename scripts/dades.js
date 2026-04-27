const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
const { log } = require("console");
dayjs.extend(minMax);

var udpPort = new osc.UDPPort({
    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the socket.
// udpPort.open(); // TODO: open port

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
                .then(response => response.json())
                .catch(err => console.log(err))
        );
    }

    Promise.all(fetches)
        .then(data => {
            // console.table(data.train.id, data.train.stations)

            for (train of data) {
                hores = []
                
                for (station of train.train.stations) {
                    hores.push({
                        estacio: station.name,
                        horaArribada: dayjs(station.arrivalDateHour).format('DD/MM HH:mm:ss')
                    })
                }

                properaParada = hores.sort(hora => hora.horaArribada)[0];

                console.log(properaParada);
                
                r2[data.indexOf(train)].hora = properaParada.horaArribada;
                r2[data.indexOf(train)].properaEstacio = properaParada.estacio
            }

            console.log(r2);
        })
}

