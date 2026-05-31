// Aquest és el programa pseudo-definitiu (back-end)

const osc = require("osc");
const fs = require('fs');
const dayjs = require('dayjs');

var minMax = require("dayjs/plugin/minMax");
var minMax = require("dayjs/plugin/customParseFormat");
const { log } = require("console");
dayjs.extend(minMax);

//Setup d'OSC
var sendPort = new osc.UDPPort({
    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var receivePort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57125
});

receivePort.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", receivePort.options.localPort);
    });
});

receivePort.on("message", function (oscMessage) {
    console.log(oscMessage);
    prefix = oscMessage.address
    args = oscMessage.args
    
    if(prefix == "/canviLinia"){
        seguentLinia = args[0]
        if (seguentLinia != liniaSeleccionada){
            canviDeLinia = true
            sendInfoMessage(`Preparant el canvi a la ${seguentLinia}...`);
        }
    }
});

receivePort.on("error", function (err) {
    console.log(err);
});

// Open the socket
receivePort.open();
sendPort.open();

// Demo RENFE in 4 min (240000 ms)
setTimeout(() => {
    sendInfoMessage("Iniciant demo RENFE de 4 minuts...");
}, 0);

setTimeout(() => {
sendOSCMessage(15, 0, 0, 0, 0)
}, 0);

setTimeout(() => {
    sendOSCTrigger("linia")
}, 12000);

setTimeout(() => {
    sendOSCMessage(15, 3, 900, 650, 300)
}, 40000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 46000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 76000);

setTimeout(() => {
    sendOSCTrigger("estació")
}, 84000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 100000);

setTimeout(() => {
    sendOSCMessage(18, 8, 3800, 800, 475)
}, 120000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 128000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 175000);

setTimeout(() => {
    sendInfoMessage("Sembla que ha caigut una catenària, estem treballant per solucionar-ho...");
}, 176000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 180000);

setTimeout(() => {
    sendOSCMessage(13, 13, 8700, 2900, 669)
}, 190000);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 192000);

setTimeout(() => {
    sendInfoMessage("Servei interromput a causa d'actes vandàlics a l'estació, disculpin les molèsties...");
}, 192500);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 193000);

setTimeout(() => {
    sendOSCTrigger("estació")
}, 193500);

setTimeout(() => {
    sendOSCTrigger("retard")
}, 195000);

setTimeout(() => {
    sendOSCMessage(15, 2, 400, 250, 200)
}, 220000);

setTimeout(() => {
    sendOSCTrigger("error")
}, 230000);

setTimeout(() => {
    sendInfoMessage("Demo finalitzada, gràcies per viatjar amb nosaltres!");
}, 240000);

// Envia un missatge d'informació per OSC i a la consola
function sendInfoMessage(message){
    console.log(message)

    var msg = {
        address: "/info",
        args: [
            {
                type: "s",
                value: message
            }
        ]
    };

    sendPort.send(msg);
}

function sendOSCMessage(t, tr, rt, rm, rmi){
    // quants trens hi ha
    // trens amb retard
    // retard total acumulat
    // retard màxim
    // retard mitjà

    var msg = {
        address: "/data",
        args: [
            {
                type: "s",
                value: `${t} ${tr} ${rt} ${rm} ${rmi}`
            }
        ]
    };

    sendPort.send(msg);
    console.log(`${t} ${tr} ${rt} ${rm} ${rmi}`);
}

// estacio, linia, retard, error
function sendOSCTrigger(message) {
    var msg = {
        address: "/trigger",
        args: [
            {
                type: "s",
                value: message
            }
        ]
    };

    sendPort.send(msg);
}