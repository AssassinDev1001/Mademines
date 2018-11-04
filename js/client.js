var Client = {};
Client.socket = io.connect();

Client.askNewState = function(bet, bomb_counter){
	//console.log(bet + " " + bomb_counter);
	Client.socket.emit('new_state', bet, bomb_counter);
}

Client.askEnd = function(){
	Client.socket.emit('game_over');
}

Client.askClick = function(noID){
	Client.socket.emit('click', noID);
}

Client.askBetEnable = function(bet, bomb_count){
	Client.socket.emit('bet_enable', bet, bomb_count, g_bet, firstPlay);
}



Client.socket.on('new_state', function(data){
	game.state.states.Game.getNewState(data.state, data.next_bonus, data.stake, data.bet_cnt);
});

Client.socket.on('game_over', function(data){
	game.state.states.Game.endState(data.state);
});

Client.socket.on('click', function(data){	
	//console.log(data.isEnable);
	game.state.states.Game.click(data.isEnable, data.isBomb, data.next_bonus, data.stake, data.no);
});

Client.socket.on('bet_enable', function(data){
	//console.log(data.isBetEnable);
	game.state.states.Game.getBetEnable(data.isBetEnable);
})
