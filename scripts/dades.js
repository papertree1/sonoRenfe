// Aquest és el programa pseudo-definitiu (back-end)

const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
var minMax = require("dayjs/plugin/customParseFormat");
dayjs.extend(minMax);

linies = {
    "R1": {
        "origen": "72300",
        "desti": "79200"
    },
    "R2": {
        "origen": "71705",
        "desti": "79100"
    },
    "R2N": {
        "origen": "72400",
        "desti": "79200"
    },
    "R2S": {
        "origen": "71600",
        "desti": "79400"
    },
    "R3": {
        "origen": "72305",
        "desti": "77310"
    },
    "R4": {
        "origen": "71600",
        "desti": "78600"
    },
    "R7": {
        "origen": "78802",
        "desti": "72503"
    },
    "R8": {
        "origen": "72209",
        "desti": "79100"
    },
    "R11": {
        "origen": "71801",
        "desti": "79316"
    },
    "R13": {
        "origen": "79400",
        "desti": "78400"
    }
}

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
r2 = []; //TODO Canviar el nom

// obtenir els trens actius d'una línia concreta (R2) i enviar-los per OSC
//TODO Rebre per OSC la línia que volem
getTrainsId("R2");

setInterval(() => {
    getTrainsId("R2");
}, 12345);


function getTrainsId(linia) {
    r2 = []

    console.log("Començant fetches...");
    var fetches = []

    fetches.push( //ANADES
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=${linies[linia].origen}&destinationStationId=${linies[linia].desti}`)
        .then(res => res.json())
        .then(data => {
            results = data.result;

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                r2.push({
                    id: train
                })
            }
        })
    )
    fetches.push( // TORNADES
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=${linies[linia].desti}&destinationStationId=${linies[linia].origen}`)
        .then(res => res.json())
        .then(data => {
            results = data.result;

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                r2.push({
                    id: train
                })
            }
        })
    )

    Promise.all(fetches)
        .then(getTrainsInfo)
        .catch(err => {
            console.log("Tornant a fer els fetches...");
            getTrainsId(linia);
        })

}


async function getTrainsInfo() {
    var fetches = [];
    console.log("MIAUMIAU")

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
                console.log(train)
                //TODO: comprovar si el tren està a l'array r2[]
                trainId = r2[data.indexOf(train)].id // ??? està malament, segurament
                console.log(trainId)
                console.log(r2.includes(trainId)) // ??? també pot estar fallant aquí

                hores = []

                // TODO: gestionar què passa quan la RENFE ens retorna una resposta vàlida però sense dades
                if (!train || !train.train) {
                    continue;
                }

                for (station of train.train.stations) {
                    hores.push({
                        estacio: station.name,
                        estacioId: station.id,
                        horaArribada: dayjs(station.arrivalDateHour).unix()
                    })
                }

                properaParada = hores.sort(hora => hora.horaArribada)[0];

                r2[data.indexOf(train)].hora = properaParada.horaArribada
                r2[data.indexOf(train)].properaEstacio = properaParada.estacio
                r2[data.indexOf(train)].properaEstacioId = properaParada.estacioId
                r2[data.indexOf(train)].retard = properaParada.horaArribada - dayjs().unix() //TODO diu l'omar que això no és un retard, discutible
            }

            // TODO: FER TOTS ELS TRENS (fet?)
            trenProva = r2[0];
            //console.log(trenProva);

            ara = dayjs().unix()
            horaTren = trenProva.hora
            retard = trenProva.retard

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
                    {
                        type: "i",
                        value: retard
                    }
                ]
            };

            // TODO: missatge a enviar per OSC

            udpPort.send(msg);
            console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);

            console.table(r2);

        })
}