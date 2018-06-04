var APP = {};
var sock, initialData;



$(document).ready(function () {
    sock = new WebSocket("ws://192.168.1.104:5001");
    sock.onopen = function (event) {
        APP.player.init([]);
    }
    sock.onmessage = function (event) {
        let data = JSON.parse(event.data)
        if(data.type == 'open') {
            initialData = data;
        }
        if(data.type == 'players') {
            var players = data.message;
            APP.player.updatePlayers(players);
            getCurrentPlayer();
            
        }
        if (data.type == 'updatePlayers') {
            var players = data.message;
            console.log('asdasd',players)
            APP.player.updatePlayers(players);
            getCurrentPlayer();
        }
    }

    sock.onclose = function (event) {
        clearInterval(myInterval);
    }
    $('#start').on('click', function(){
        startConnection($('#name').val());
    })

});


function startConnection(name){

    let player = $.extend({},APP.player.playerMask)
    player.id = initialData.message;
    player.name = name;
    APP.player.storage.currentPlayerId = initialData.message;
    var sendData = {
        'type' : 'newPlayer',
        'data': player
    }
    sock.send(JSON.stringify(sendData));
    APP.player.addPlayer();

}

function updateServerOlayers(){
    if(APP.player.storage.players.length){
        var sendData = {
            'type' : 'updatePlayers',
            'data': APP.player.storage.players
        }
        sock.send(JSON.stringify(sendData));
    }
}

function getCurrentPlayer(){
    APP.player.storage.players.map(function(player,index){
        if(player && player.id == APP.player.storage.currentPlayerId){
            APP.player.storage.currentPlayer = index;
        }
    })
}