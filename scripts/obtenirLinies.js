const fs = require('fs');

// request per obtenir originStationId i destinationStationId de totes les linies
getLines();

function getLines() {
    results = { data: [] };
    counter = 0;
    fileName = 'linies.json';

    console.log("Starting fetches...");
    fetch(`https://serveisgrs.rodalies.gencat.cat/api/lines`)
        .then(response => response.json())
        .then(data => {
            data = getLinesInfo(data)
            fs.writeFile(fileName, JSON.stringify(data), (err) => {
                if (err) throw err;
                console.log(`Results saved to ${fileName}`);
            });
        })
        .catch(error => {
            console.error(`Error fetching lines`, error.message);
            getLines();
        });
}

// info que necessitem: included -> id línia, originStation, destinationStation -> id, stations -> id, name
function getLinesInfo(data){
    console.log(data)
    info = {}   
    info.results = []   // cada línia
    for (i = 0; i < data.included.length; i++) {
        info.results.push({
            id: data.included[i].id,
            originStation: data.included[i].originStation.id,
            destinationStation: data.included[i].destinationStation.id
        });
    }
    
    return info;
}