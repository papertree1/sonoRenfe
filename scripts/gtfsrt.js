const fs = require('fs');

getTrainData();

function getTrainData() {
    fileName = 'data/gtfsrt.json';

    console.log("Starting fetches...");
    fetch(`https://gtfsrt.renfe.com/vehicle_positions.json`)
        .then(response => response.json())
        .then(data => {
            data = data.entity.filter(train => train.id.includes("R"));
            data = data.sort((a, b) => a.id.localeCompare(b.id));
            data = data.map(train => train.vehicle.vehicle);

            fs.writeFile(fileName, JSON.stringify(data), (err) => {
                if (err) throw err;
                console.log(`Results saved to ${fileName}`);
            })
        })
}