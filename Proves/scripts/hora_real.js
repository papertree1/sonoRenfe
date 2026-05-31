getHores();

function getHores() {
    fileName = 'data/hora_real.json';

    console.log("Starting fetches...");
    fetch(`https://epe.api.renfe.es/epe/catalogo-pro/hcr-cercanias-vav/HorariosCercanias/get`, {
        method: "POST",
        // headers: myHeaders,
        body: JSON.stringify({
            "origen": "72400",
            "destino": "79104",
            "fechaViaje": "20260421",
            "horaInicioRango": "12:00",
            "horaFinRango": "13:00"
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);


            // fs.writeFile(fileName, JSON.stringify(results), (err) => {
            //     if (err) throw err;
            //     console.log(`Results saved to ${fileName}`);
            // });
        })
        .catch(e => console.error("Error fetching data:", e));
}

// ! RETORNA UNAUTHORISED