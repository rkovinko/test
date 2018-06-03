var example = document.getElementById("field"),
    ctx = example.getContext('2d');

var isFire, bulletDirY, bulletDirX, currentPlayer, sock;

let mask = {
    deg: 45,
    x: 150,
    y: 150,
    w: 100,
    h: 100,
    isForward: false,
    isBackward: false,
    isRotateRight: false,
    isRotateLeft: false
}

let players = [];


var tankImg = new Image();

tankImg.src = './img/man.png';

function init() {
    startLoop();
}


function startLoop() {
    loop();
}

function loop() {
    update();
    drow();
    window.requestAnimationFrame(loop);
}

function update() {
    players.map(function(player){
        if (player.isForward) {
            move(player,4);
        }
        if (player.isBackward) {
            move(player,-4);
        }
        if (player.isRotateRight) {
            rotate(player,3);
        }
        if (player.isRotateLeft) {
            rotate(player,-3);
        }
    })

}


function drow() {
    ctx.clearRect(0, 0, 800, 800);
    body();
}


function body() {
    players.map(function(player){
        ctx.translate(player.x, player.y);
        ctx.rotate(inRad(player.deg));
        ctx.drawImage(tankImg, 0, 0, 553, 439, -30, -24, 60, 48);
        ctx.rotate(inRad(-player.deg));
        ctx.translate(-player.x, -player.y);
    });

}

function inRad(num) {
    return num * Math.PI / 180;
}

function getAngle(x, y) {
    return Math.atan(y / x) / Math.PI * 180
}

function dirX(deg) {
    return Math.cos(Math.PI / 180 * deg)
}

function dirY(deg) {
    return Math.sin(Math.PI / 180 * deg)
}

function move(player,dir) {
    let stepX = dirX(player.deg) * dir * 1;
    let stepY = dirY(player.deg) * dir * 1;

    player.x = player.x + stepX;
    player.y = player.y + stepY;
}


function rotate(player,dir) {
    player.deg = player.deg + dir;
}

function checkDir(keyCode, action) {
    if (keyCode == 38) {
        players[currentPlayer].isForward = action;
    } else if (keyCode == 40) {
        players[currentPlayer].isBackward = action;
    } else if (keyCode == 39) {
        players[currentPlayer].isRotateRight = action;
    } else if (keyCode == 37) {
        players[currentPlayer].isRotateLeft = action;
    }
}

function colision() {
    if (bullet.positionX > 300) {
        isFire = false;
    }
}


$(document).ready(function () {
    $('body').on('keydown', function (event) {
        checkDir(event.keyCode, true);
        updateServerOlayers();
    })

    $('body').on('keyup', function (event) {
        checkDir(event.keyCode, false);
        updateServerOlayers();
    })

    init();


    sock = new WebSocket("ws://localhost:5001");
    sock.onopen = function (event) {
        console.log(event)
    }

    sock.onclose = function (event) {
        // var sendData = {
        //     'type' : 'close',
        //     'data': currentPlayer
        // }
        // sock.send(JSON.stringify(sendData));
    }

    sock.onmessage = function (event) {
        let data = JSON.parse(event.data)
        if(data.type == 'open') {
            let player = $.extend({},mask)
            player.id = data.message;
            currentPlayerId = data.message;
            var sendData = {
                'type' : 'newPlayer',
                'data': player
            }
            sock.send(JSON.stringify(sendData));
        }
        if(data.type == 'players') {
            players = data.message;
            getCurrentPlayer();
        }
        if (data.type == 'updatePlayers') {
            players = data.message;
            getCurrentPlayer();
        }
        console.log(players);
    }
});


function updateServerOlayers(){
    var sendData = {
        'type' : 'updatePlayers',
        'data': players
    }
    sock.send(JSON.stringify(sendData));
}

function getCurrentPlayer(){
    players.map(function(player,index){
        if(player.id == currentPlayerId){
            currentPlayer = index;
        }
    })
}