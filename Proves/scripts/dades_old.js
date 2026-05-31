const osc = require("osc");
const fs = require('fs');

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

function getTrains() {
    fileName = 'data/r2.json';

    console.log("Starting fetches...");
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=79104&destinationStationId=72400`) // R2
        .then(response => response.json())
        .then(data => {
            results = data.result;
            // console.log(results);

            results = results.items.map(item => item.steps[0].train.id)

            for (train of results) {
                r2.push({
                    id: train
                })
            }

            // fs.writeFile(fileName, JSON.stringify(r2), (err) => {
            //     if (err) throw err;
            //     console.log(`Results saved to ${fileName}`);
            // });

            console.log(r2);
            
            getStations();
        });
}

function getStations() {
    for (let i = 0; i < r2.length; i++) {
        fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/${r2[i].id}`)
            .then(response => response.json())
            .then(data => {
                r2[i].info = data.train;

                fs.writeFile(fileName, JSON.stringify(r2), (err) => {
                    if (err) throw err;
                    console.log(`Results saved to ${fileName}`);
                });
            });
    }
}

// fer peticions recurrents i actualitza els trens actius cada 30 segons
// quan un tren deixi de tenir l'horari, posar-li l'hora definitiva d'arribada

// enviar per OSC la informació dels trens actius cada 30 segons