const osc = require("osc");

var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
    metadata: true
});

oscPort.open();

oscPort.on("ready", function () {
    setInterval(function () {

        oscPort.send({
            address: "/carrier/frequency",
            args: [
                {
                    type: "f",
                    value: 440
                }
            ]
        });

        console.log("Message sent via OSC!");
        
    }, 3000);
});