const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
var minMax = require("dayjs/plugin/customParseFormat");
const { log } = require("console");
const { get } = require("http");
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
// TODO: fer un programet que agafi la R2 d'anada i tornada
// TODO: fer un programet per poder seleccionar la línia que es vol monitoritzar
r2 = [];

// obtenir els trens actius d'una línia concreta (R2) i enviar-los per OSC
setInterval(() => {
    getTrains();
}, 60000);

function getTrains() {
    console.log("Començant fetches...");
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
        })
        .catch(err => {
            console.log("Tornant a fer els fetches...");
            
            getTrains();
        });
}


async function getTrainInfo() {
    var fetches = [];


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
                        horaArribada: dayjs(station.arrivalDateHour).format('DD/MM/YYYY HH:mm:ss')
                    })
                }

                properaParada = hores.sort(hora => hora.horaArribada)[0];

                console.log(properaParada);
                
                r2[data.indexOf(train)].hora = properaParada.horaArribada;
                r2[data.indexOf(train)].properaEstacio = properaParada.estacio
            }

            console.log(r2);
            
            trenProva = r2[0];
            console.log(trenProva);
            console.log(dayjs(trenProva.hora, 'DD/MM/YYYY HH:mm:ss'))

            ara = dayjs().unix()
            horaTren = dayjs(trenProva.hora, 'DD/MM/YYYY HH:mm:ss').unix()

            var msg = {
                address: "/r2",
                args: [
                    {
                        type: "i",
                        value: ara
                    },
                    {
                        type: "i",
                        value: horaTren
                    },
                ]
            };
        
            
            udpPort.send(msg);
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
        })
}

