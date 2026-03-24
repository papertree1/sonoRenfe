var osc = require("osc");

var udpPort = new osc.UDPPort({
    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

// Open the socket.
udpPort.open();

// Every second, send an OSC message to SuperCollider
setInterval(function() {
    var msg = {
        address: "/renfe",
        args: [
            {
                type: "f",
                value: 208
            },
        ]
    };

    //console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
}, 1000);