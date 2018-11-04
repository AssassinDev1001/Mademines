var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var sha256 = require('js-sha256');

var counter = 0;
var bet_amount = 30;
var bomb_counter = 1;
var gameState = new Array(25).fill(0);
var isPressed = new Array(25).fill(0);
var str_secret = "";
var isPlay = 0;

app.use('/js', express.static(__dirname + '/js'));
app.use('/external', express.static(__dirname + '/external'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function(){
	console.log('Listening on' + server.address().port);	
})

io.on('connection', function(socket){
	
    socket.on('new_state', function(bet, bomb_counter){
        socket.state = {
            state : strHash(bet, bomb_counter),
            stake : profit_stake(counter),
            next_bonus : next_profit(-1),
            bet_cnt : bet_amount,
        };

        socket.emit('new_state', socket.state);
    });

    socket.on('game_over', function(){
        socket.end = {
            state: str_secret
        };

        socket.emit('game_over', socket.end);
    });

    socket.on('click', function(noID){        

        socket.state = {            
            isBomb : isBomb(noID),
            stake : profit_stake(counter),
            next_bonus : next_profit(noID),            
            isEnable : getPressedState(noID),
            no : noID,
        };

        socket.emit('click', socket.state);
    });

    socket.on('bet_enable', function(bet, bomb_count, g_bet, firstPlay){
        socket.state = {
            isBetEnable : getBetState(bet, bomb_count, g_bet, firstPlay)
        }

        socket.emit('bet_enable', socket.state);
    });

});

function getBetState(bet, bomb_counter, g_bet, firstPlay){
    var rlt = bet;
    if(bet < 30) rlt = -1;
    if(bomb_counter < 24 && bet > 1000000) rlt = -2;
    if(bomb_counter == 24 && bet > 100000) rlt = -3;
    
    return rlt;
}

function getPressedState(no){

    //console.log(counter);
    if(bomb_counter + counter > 26){
        return 0;
    }

    if(isPressed[no] == 0){
        isPressed[no] = 1;
        return 1;
    }    
    return 0;
}


function isBomb(no){
    return gameState[no];
}

function profit_stake(cur_cnt) {
  
//    if(gameState[no] == 1) return 0;
    
    if(cur_cnt == 0){
        return bet_amount;
    }
    
    if(bomb_counter == 24){
        return (bet_amount * 24.04);
    }
    
    var result = 1.0;
        
    for(var i = 0; i < cur_cnt; i++){
        result = result * (25 - i) / (25 - i - bomb_counter);
    }
    
    result = (result - 1.0) * bet_amount;
    
    //float min_pcnt = 0.96 - (0.8885 - 0.1816 * 900.0 / (float)(Bet * Bet));
    var min_pcnt = 0.0715 + 163.44 / (bet_amount * bet_amount);
            
    result = result * (0.96 - min_pcnt * ((cur_cnt - 1) / (24 - bomb_counter)));
    
    var R = Math.floor(result) + parseInt(bet_amount);
    
    //alert(R);
    return (R);
}

function next_profit(noID){

    if((bomb_counter + counter) == 25){
        if(noID == -1 || isPressed[noID] == 0) counter++;        
        return 0;
    } 

    var cur_p = profit_stake(counter + 1) - profit_stake(counter);

    if(noID == -1 || isPressed[noID] == 0) counter++;
    return cur_p;
}

function getRandState(bomb_counter){    

    str_secret = "";

    var isSelect = new Array(25).fill(0);
    for(var i = 0; i < 25; i++){
        gameState[i] = 0;
    }

    for(var i = 0; i < bomb_counter; i++){
        var id = Math.floor(Math.random() * 25);
        if(isSelect[id] == 1){
            i--;
            continue;  
        }
        isSelect[id] = 1;
        str_secret = str_secret + (id+1).toString() + '-';
        gameState[id] = 1;
    }

    for(var i = 0; i < 12; i++){
        var ascii_chr = Math.floor(Math.random() * 62) + 48;
        if(ascii_chr > 57) ascii_chr = ascii_chr + 7;
        if(ascii_chr > 90) ascii_chr = ascii_chr + 6;
        str_secret = str_secret + String.fromCharCode(ascii_chr);
    }

   /* for(var i = 0; i < 25; i++){
        console.log((i + 1) + " " + gameState[i]);
    }*/
}

function strHash(bet, bomb_count){

    for(var i = 0; i < 25; i++) isPressed[i] = 0;

    getRandState(bomb_count);

    counter = 0;
    bomb_counter = bomb_count;
    bet_amount = bet;
    isPlay = 1;

    var hash = sha256.create();
    hash.update(str_secret);
    var str_hash = hash.hex();
    
    return str_hash;
}
