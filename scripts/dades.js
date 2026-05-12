// Aquest és el programa pseudo-definitiu (back-end)

const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
var minMax = require("dayjs/plugin/customParseFormat");
dayjs.extend(minMax);

var udpPort = new osc.UDPPort({
    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the socket.
udpPort.open(); 

// TODO: fer un programet que agafi la R2 d'anada i tornada
// TODO: fer un programet per poder seleccionar la línia que es vol monitoritzar, potser control·lable per OSC

// array on guardarem els trens de la R2 i la seva info 
r2 = [];

// obtenir els trens actius d'una línia concreta (R2) i enviar-los per OSC
getTrains();

setInterval(() => {
    getTrains();
}, 12345);

function getTrains() {
    console.log("Començant fetches...");
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=79104&destinationStationId=72400`) // R2
        .then(response => response.json())
        .then(data => {
            results = data.result;
            r2 = []; // reiniciem l'array de trens per omplir-lo amb la nova info

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                r2.push({
                    id: train
                })
            }

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
            for (train of data) {
                hores = []
                
                // TODO: gestionar què passa quan la RENFE ens retorna una resposta vàlida però sense dades
                if (!train || !train.train) {
                    continue;
                }

                for (station of train.train.stations) {
                    hores.push({
                        estacio: station.name,
                        estacioId: station.id,
                        horaArribada: dayjs(station.arrivalDateHour).format('DD/MM/YYYY HH:mm:ss')
                    })
                }

                properaParada = hores.sort(hora => hora.horaArribada)[0];
                
                r2[data.indexOf(train)].hora = properaParada.horaArribada;
                r2[data.indexOf(train)].properaEstacio = properaParada.estacio
                r2[data.indexOf(train)].properaEstacioId = properaParada.estacioId
            }

            // TODO: FER TOTS ELS TRENS (fet?)
            trenProva = r2[0]; 
            console.log(trenProva);

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
        
            /*  TODO: missatge a enviar per OSC

                /r2/id {
                    ara: UnixTimestamp,
                    horaSortida: UnixTimestamp,
                    horaArribada: UnixTimestamp,
                    retard: UnixTimestamp
                }
            */
            
            udpPort.send(msg);
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
            
            console.table(r2);
            
        })
}