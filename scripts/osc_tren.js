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

getTrain();

function getTrain() {
    fileName = 'data/temps.json';
    results = {
        real: {},
        teoric: {}
    };

    console.log("Starting fetches...");
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/trains/28432`)
        .then(response => response.json())
        .then(data => {
            data = getTrainInfo(data)
            results.real = data;

            fetch(`https://serveisgrs.rodalies.gencat.cat/api/timetables?originStationId=79104&destinationStationId=72400`) // R2
            .then(response => response.json())
            .then(data => {
                // data = getTrainInfo(data)
                results.teoric = data.result;

                fs.writeFile(fileName, JSON.stringify(results), (err) => {
                if (err) throw err;
                console.log(`Results saved to ${fileName}`);
            });
            });
            
        })
        .catch(error => {
            console.error(`Error fetching lines`, error.message);
            getTrain();
        });
}

function getTrainInfo(data) {
    console.log(data)
    info = {}
    info.results = []  // cada estació

    for (i = 0; i < data.train.stations.length; i++) {
        info.results.push({
            id: data.train.stations[i].id,
            nom: data.train.stations[i].name,
            arribada: data.train.stations[i].arrivalDateHour,
            sortida: data.train.stations[i].departureDateHour
        });
        info.results.sort((a, b) => a.id - b.id);
    }

    return info;
}