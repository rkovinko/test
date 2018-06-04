APP.player = {
    storage: {
        playerName: '',
        players: [],
        currentPlayer: null, //index
        currentPlayerId: null,
        canvas: {},
        playerImg: {}
    },
    playerMask: {
        deg: 45,
        x: 150,
        y: 150,
        w: 100,
        h: 100,
        isForward: false,
        isBackward: false,
        isRotateRight: false,
        isRotateLeft: false
    },
    init: function (players) {
        console.log('first init');
        APP.player.storage.players = players;

        var field = document.getElementById("field");

        APP.player.storage.canvas = field.getContext('2d');
        APP.player.storage.playerImg = new Image();
        APP.player.storage.playerImg.src = './img/man.png';
        
        APP.player.startLoop();
        window.myInterval = setInterval(function(){
            updateServerOlayers();
        },100)
    },
    updatePlayers: function(players){
        console.log(players)
        let tempPl = [];
        if(APP.player.storage.currentPlayerId && APP.player.storage.players.length && APP.player.storage.players[APP.player.storage.currentPlayer] ){
            tempPl.push(APP.player.storage.players[APP.player.storage.currentPlayer]);
            players.map(function(player){
                if(player.id != APP.player.storage.currentPlayerId){
                    tempPl.push(player) 
                }
            })
            APP.player.storage.players = tempPl;
        }else{
            console.log('asd')
            APP.player.storage.players = players;
        }
    },
    addPlayer: function(){

        APP.player.beandEvents();
    },
    startLoop: function () {
        APP.player.loop();
    },
    loop: function () {
        APP.player.update();
        APP.player.draw();
        window.requestAnimationFrame(APP.player.loop);
    },
    update: function () {
        var storage = APP.player.storage;
        var player = storage.players[storage.currentPlayer];
        if(player){
            if (player.isForward) {
                APP.player.move(player, 2);
            }
            if (player.isBackward) {
                APP.player.move(player, -2);
            }
            if (player.isRotateRight) {
                APP.player.rotate(player, 2);
            }
            if (player.isRotateLeft) {
                APP.player.rotate(player, -2);
            }
        }
    },
    draw: function(){
        APP.player.storage.canvas.clearRect(0, 0, 800, 800);
        APP.player.drawPlayer();
    },
    drawPlayer: function(){
        var storage = APP.player.storage;

        storage.players.map(function(player){
            if(player){
                storage.canvas.strokeText(player.name,player.x,player.y-70)
                storage.canvas.translate(player.x, player.y);
                storage.canvas.rotate(APP.player.inRad(player.deg));
                storage.canvas.drawImage(storage.playerImg, 0, 0, 553, 439, -138, -109, 276, 219);
                storage.canvas.rotate(APP.player.inRad(-player.deg));
                storage.canvas.translate(-player.x, -player.y);
            }
        });
    },
    inRad: function(num) {
        return num * Math.PI / 180;
    },
    
    getAngle: function(x, y) {
        return Math.atan(y / x) / Math.PI * 180
    },
    
    dirX: function(deg) {
        return Math.cos(Math.PI / 180 * deg)
    },
    
    dirY: function(deg) {
        return Math.sin(Math.PI / 180 * deg)
    },
    
    move: function(player,dir) {
        let stepX = APP.player.dirX(player.deg) * dir * 1;
        let stepY = APP.player.dirY(player.deg) * dir * 1;
    
        player.x = player.x + stepX;
        player.y = player.y + stepY;
    },
    
    
    rotate: function(player,dir) {
        player.deg = player.deg + dir;
    },
    
    checkDir: function(keyCode, action) {
        var storage = APP.player.storage;
        if (keyCode == 38) {
            storage.players[storage.currentPlayer].isForward = action;
        } else if (keyCode == 40) {
            storage.players[storage.currentPlayer].isBackward = action;
        } else if (keyCode == 39) {
            storage.players[storage.currentPlayer].isRotateRight = action;
        } else if (keyCode == 37) {
            storage.players[storage.currentPlayer].isRotateLeft = action;
        }
    },
    beandEvents: function(){
        $('body').on('keydown', function (event) {
            APP.player.checkDir(event.keyCode, true);
        })
    
        $('body').on('keyup', function (event) {
            APP.player.checkDir(event.keyCode, false);
        })
    }
}
