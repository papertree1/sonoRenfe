const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('data/horaris.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push({
        linia: data.trip_id.slice(10),
        parada: data.stop_id,
        arribada: data.arrival_time,
        sortida: data.departure_time
    })
  })
  .on('end', () => {
     fs.writeFile('data/horaris_teorics.json', JSON.stringify(results), (err) => {
                if (err) throw err;
                console.log(`Results saved to ${fileName}`);
            });
  });