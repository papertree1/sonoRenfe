// open file
const fs = require('fs');
const csv = require('csv-parser')

const file = 'data/horaris.csv'

const results = [];

fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => {
        console.log(data);
        data.
        
        results.push(data)
    })
    .on('end', () => {
        console.log(results);
    });

// console.log(results);
