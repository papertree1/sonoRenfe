// open file horaris_teorics.json
const fs = require('fs');

const data = fs.readFile('./data/horaris_teorics.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const horarisTeorics = JSON.parse(data);
    newData = {};

    // create new array with only the fields: id, dia, hora, estacio, tren  
    for (let i = 0; i < horarisTeorics.length; i++) {
        const element = horarisTeorics[i];
        if (!newData[element.linia]) {
            newData[element.linia] = [];
        }

        newData[element.linia].push({
            parada: element.parada,
            arribada: element.arribada,
            sortida: element.sortida
        });
    }

    // write file horaris_teorics_format.json with the new array
    fs.writeFile('./data/horaris_teorics_format.json', JSON.stringify(newData), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
});