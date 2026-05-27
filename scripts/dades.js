// Aquest és el programa pseudo-definitiu (back-end)

const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
var minMax = require("dayjs/plugin/customParseFormat");
const { log } = require("console");
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

/** 
 * Array on guardarem els trens i la seva info
 * [
 *    {
 *       id
 *       hora
 *       properaEstacio
 *       properaEstacioId
 *       retard (s)
 *     },
 * ]
 */
trensGuardats = [];

// Obtenir els trens actius d'una línia concreta i enviar-los per OSC
//TODO: Rebre per OSC la línia que volem


getTrainsId("R4");

// Fem request a l'API cada 12345 segons
setInterval(() => {
    getTrainsId("R4");
}, 12345);


/**
 * Col·leciona les IDs de tots els trens actius en aquest moment de la línia seleccionada
 */
function getTrainsId(linia) {
    console.log("Començant fetches...")
    var fetches = []

    // // trensGuardats = []

    // ANADES
    fetches.push(
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=${linies[linia].origen}&destinationStationId=${linies[linia].desti}`)
        .then(res => res.json())
        .then(data => {
            results = data.result;

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                if(!trensGuardats.some(el => el.id == train)){ // Comprovar que el tren no estigui ja a l'array
                    trensGuardats.push({
                        id: train
                    })
                }
            }
        })
    )

    // TORNADES
    fetches.push(
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=${linies[linia].desti}&destinationStationId=${linies[linia].origen}`)
        .then(res => res.json())
        .then(data => {
            results = data.result;

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                if(!trensGuardats.some(el => el.id == train)){ // Comprovar que el tren no estigui ja a l'array
                    trensGuardats.push({
                        id: train
                    })
                }
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


/**
 * Col·lecciona la informació de cada tren que està actiu i 
 * emmagatzema a l'array trensGuardats[]
 * {
 *      
 * }
 */
async function getTrainsInfo() {
    var fetches = [];

    // Fer fetch de les dades de tots els trens.
    for (let i = 0; i < trensGuardats.length; i++) {
        fetches.push(
            fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/${trensGuardats[i].id}`)
                .then(response => response.json())
                .catch(err => console.log(err))
        );
    }

    Promise.all(fetches)
        .then(trensNous => {
            trensTrobats = 0

            for (trenNou of trensNous) {
                hores = []
                retard = 0

                // TODO: gestionar què passa quan la RENFE ens retorna una resposta vàlida però sense dades
                if (!trenNou || !trenNou.train) {
                    continue;
                }

                // Aconseguir l'hora de totes les parades que farà el tren
                for (station of trenNou.train.stations) {
                    hores.push({
                        estacio: station.name,
                        estacioId: station.id,
                        horaArribada: dayjs(station.arrivalDateHour).unix()
                    })
                }

                // Només ens interessa la següent parada
                properaParada = hores.sort(hora => hora.horaArribada)[0];

                trainId = 0
                // Comprovem si el trenNou ja està a l'array trensGuardats[]
                for (trenGuardat of trensGuardats){
                    if (Math.abs(trenGuardat.hora - properaParada.horaArribada) < 60){ // Ho hem de comprovar amb l'hora, ja que aquí no tenim l'id del tren
                        // ! No sempre entra aquí per tots els trens, tot i que estiguin repetits
                        trainId = trenGuardat.id
                        trensTrobats++

                        if(trenGuardat.hora != undefined){
                            retard = trenGuardat.hora - properaParada.horaArribada
                            if(retard > 0) {
                                // Aquest tren va amb retard
                                // * OSC MESSAGE
                            }
                            if(trenGuardat.properaEstacio != properaParada.estacio){
                                // Ha passat a la següent estació // ???
                                // * OSC MESSAGE
                                log(`El tren ${trainId} ha arribat a ${trenGuardat.properaEstacio} i va a ${properaParada.estacio}`)
                            }
                        }
                    }
                }

                // Escriure les noves dades a trensGuardats[]
                try {
                    trensGuardats[trensNous.indexOf(trenNou)].hora = properaParada.horaArribada
                    trensGuardats[trensNous.indexOf(trenNou)].properaEstacio = properaParada.estacio
                    trensGuardats[trensNous.indexOf(trenNou)].properaEstacioId = properaParada.estacioId
                    trensGuardats[trensNous.indexOf(trenNou)].retard = isNaN(trensGuardats[trensNous.indexOf(trenNou)].retard) ? retard : trensGuardats[trensNous.indexOf(trenNou)].retard + retard //Acumulació del retard
                } catch (e) {
                    // log(trenNou)
                    // log(e)
                }
                
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
            log('\n')
            log(dayjs().format("HH:mm:ss"))
            console.table(trensGuardats);
            log(`Trens repetits: ${trensTrobats}`)
        })
}