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
trensGuardats = []; //TODO Canviar el nom

// obtenir els trens actius d'una línia concreta (R2) i enviar-los per OSC
//TODO Rebre per OSC la línia que volem
getTrainsId("R2");

setInterval(() => {
    getTrainsId("R2");
}, 12345);


function getTrainsId(linia) {
    trensGuardats = []

    console.log("Començant fetches...");
    var fetches = []

    fetches.push( //ANADES
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=${linies[linia].origen}&destinationStationId=${linies[linia].desti}`)
        .then(res => res.json())
        .then(data => {
            results = data.result;

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                trensGuardats.push({
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
                trensGuardats.push({
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

    for (let i = 0; i < trensGuardats.length; i++) {
        fetches.push(
            fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/${trensGuardats[i].id}`)
                .then(response => response.json())
                .catch(err => console.log(err))
        );
    }

    Promise.all(fetches)
        .then(trensNous => {

            for (trenNou of trensNous) {
                hores = []
                retard = 0

                // TODO: gestionar què passa quan la RENFE ens retorna una resposta vàlida però sense dades
                if (!trenNou || !trenNou.train) {
                    continue;
                }

                for (station of trenNou.train.stations) {
                    hores.push({
                        estacio: station.name,
                        estacioId: station.id,
                        horaArribada: dayjs(station.arrivalDateHour).unix()
                    })
                }

                properaParada = hores.sort(hora => hora.horaArribada)[0];

                //TODO: comprovar si el tren està a l'array trensGuardats[]
                trainId = 0
                
                for (trenGuardat of trensGuardats){
                    if (trenGuardat.hora == properaParada) trainId = trenGuardat.id
                }

                for (trenGuardat of trensGuardats){
                    if (trenGuardat.id == trainId){
                        if(trenGuardat.hora){
                            retard += trenGuardat.hora - properaParada.horaArribada
                            if(retard > 0) console.log("RETARD");
                        }
                    }
                }

                trensGuardats[trensNous.indexOf(trenNou)].hora = properaParada.horaArribada
                trensGuardats[trensNous.indexOf(trenNou)].properaEstacio = properaParada.estacio
                trensGuardats[trensNous.indexOf(trenNou)].properaEstacioId = properaParada.estacioId
                trensGuardats[trensNous.indexOf(trenNou)].retard = retard
            }

            // ara = dayjs().unix()
            // horaTren = trenProva.hora
            // retard = trenProva.retard

            // var msg = {
            //     address: "/r2",
            //     args: [
            //         {
            //             type: "i",
            //             value: ara
            //         },
            //         {
            //             type: "i",
            //             value: horaTren
            //         },
            //         {
            //             type: "i",
            //             value: retard
            //         }
            //     ]
            // };

            // TODO: missatge a enviar per OSC

            // udpPort.send(msg);
            //console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);

            trensGuardats.sort((trena, trenb) => trena.id - trenb.id);
            console.table(trensGuardats);
        })
}