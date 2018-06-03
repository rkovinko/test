let server = require('ws').Server;
let connect = require('connect');
let serveStatic = require('serve-static');

const uuidv1 = require('uuid/v1');

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5001 });

let connectionsCount = 0;
let connectionId = 1000000;

let players = [];

let connections = {};

wss.on('connection', function(ws){
    connectionsCount++;
    ws.id = uuidv1();
    connections[ws.id] = ws;

    ws.on('message', function incoming(message) {
        let response = JSON.parse(message);
        if (response.type == 'newPlayer') {
            response.data.connectionId = ws.id;
            players.push(response.data);
            let sendData = {
                type   : 'players',
                message: players
            }
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(sendData));
                }
            });
        }

        if (response.type == 'updatePlayers') {
            players = response.data;
            let sendData = {
                type   : 'updatePlayers',
                message: players
            }
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(sendData));
                }
            });
        }


    });


    wss.clients.forEach(function each(client) {
        client.on('close', function close(evt) {
            players.map(function(player, index){
                if(player.connectionId == client.id){
                    players.splice(index, 1)
                }
            })
            let sendData = {
                type   : 'updatePlayers',
                message: players
            }
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(sendData));
                }
            });
        });
    });

    let open = {
        type: 'open',
        message: connectionId++
    }
    ws.send(JSON.stringify(open));
})



connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});