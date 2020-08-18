const net = require('net');
const port = 7071;
const host = '127.0.0.1';
const api_call = require('./utils/callmapapi');
const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function (sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function (data) {
        console.log(data);
        api_call.make_API_call(`*`)
        .then((response) => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          })

        console.log(data);
        sockets.forEach(function (sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said data updated" + '\n');
        });
    });


    sock.on('close', function (data) {
        let index = sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});