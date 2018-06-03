$( document ).ready(function() {
    var sock = new WebSocket("ws://localhost:5001");
    sock.onopen = function(event){
        $('body').on('keydown', function(event) {
            let data = {
                code: event.keyCode,
                action: true
            }
            sock.send(JSON.stringify(data));
        })
    
        $('body').on('keyup', function(event) {
            let data = {
                code: event.keyCode,
                action: false
            }
            sock.send( JSON.stringify(data));
        })
    }


})