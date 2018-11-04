BasicGame.Game = function (game,counter, strHash, nextBonus, profitStake) {
    bomb_counter = counter;
    str_hash = strHash;
    g_next_bonus = nextBonus;
    g_stake = profitStake;
};

var profit = 0; 
var next = 0;
var repeat_num = 0;

function isValid(str){


    if(str.length == 0) return -1;

    for(var i = 0; i < str.length; i++){
        if(str[i] < '0' || str[i] > '9') return 0;
    }

    var rlt = parseInt(str);

    return rlt;
}

var sprite2;
var sprite1;

BasicGame.Game.prototype = {

	create: function (game,counter, strHash, nextBonus, profitStake) {

        this.toggle = true;
        this.level = 4;

        this.shapes = [];
        this.solution = [];
        this.shapeindex = 0;

        this.shape1 = null;
        this.shape2 = null;

        this.add.sprite(0,0,'gray_back');
        this.add.sprite(3,this.world.height - 300,'current_situation');
        this.placeBoxes('5x5');

        this.totaltime = 0;
        this.totalclicks = 0;

        this.music = this.add.audio('music',1,true);

        if(firstPlay == true){
            if(playmusic==true){
                 this.music.play('',0,1,true);
            }
        }

        this.blipsound = this.add.audio('blip');

        //------------------------------- upper rectangle for bet number -----------------------------
        var bar1 = this.add.graphics();
            bar1.beginFill(0x000000, 0.9);
            bar1.drawRect(0, 0, this.world.width, 70);           

        //---------------------------------Showing bet value ---------------------------------
        var bet_style = { font: " 24px gothic", fill: "#00ff00", align: "left",boundsAlignH: "left", boundsAlignV: "middle" };
        
        bet_number = this.add.text(360, 20, "BET:", bet_style);
        
        //---------------------------------Showing bet value ---------------------------------
        if(firstPlay == true){
            bet_number1 = this.add.inputField(410, 15, {
                font: '35px gothic',
                fill: '#00ff00',
                backgroundColor: '#000000',
                width: 180,
                borderWidth:1,
                borderColor:'#ffffff',//'#4caf50',
                placeHolder:'',
            });
        }else{
            bet_number1 = this.add.inputField(410, 15, {
                font: '35px gothic',
                fill: '#00ff00',
                backgroundColor: '#000000',
                width: 180,
                borderWidth:1,
                borderColor:'#ffffff',//'#4caf50',
                placeHolder:' ' + g_bet,
            });
        }

        balance_number = this.add.text(35, 20, "BALANCE: 0", bet_style);
        //---------------------------------Showing balance value ---------------------------------
        //balance_num = this.add.text(155, 15, '0',style);

        //------------------------------- Next: current value  -----------------------------
        var style = { font: " 24px gothic", fill: "#00ff00", align: "left",boundsAlignH: "left", boundsAlignV: "middle" };
        if(firstPlay == true){
            pay_value = this.add.text(30, this.world.height - 272, "", style);
        }else{
            pay_value = this.add.text(30, this.world.height - 272, g_next_bonus, style);
        }
        
       
       //------------------------------- Stake: current value  -----------------------------
        if(firstPlay == true){
            stake_value = this.add.text(195, this.world.height - 272, "", style);
        }else{
            stake_value = this.add.text(195, this.world.height - 272, g_stake, style);
        }

        //------------------------------- Bottom rectangle for hash key -----------------------------
        var bar1 = this.add.graphics();
            bar1.beginFill(0x000000, 0.9);
            bar1.drawRect(180, this.world.height - 130, 600, this.world.height-600);         

        //------------------------------- Hash value  -----------------------------
        var hash_value_style = { font: " 15px gothic", fill: "#ffffff", align: "left",boundsAlignH: "left", boundsAlignV: "middle" };
        this.add.text(195, this.world.height - 120, "Hashcode : ", style);        
        hash_value = this.add.text(195, this.world.height - 90, "", hash_value_style);
        if(firstPlay == false){
            var len = str_hash.length/2;
            var res = str_hash.substring(0, len) + '\n' + str_hash.substring(len);
            hash_value.setText(res); 
        }
        

        //------------------------------- Bomb location  -----------------------------
        var bomb_font_style = { font: " 24px gothic", fill: "#ffff00", align: "left",boundsAlignH: "left", boundsAlignV: "middle" };
        this.add.text(195, this.world.height - 60, "Bomb_location : ", style);
        bomb_location_value = this.add.text(195, this.world.height - 30, "", hash_value_style);        

        //------------------------------- cash button  -----------------------------
        if(firstPlay == true){            
            this.cashButton = this.add.button(3, this.world.height - 230, 'button', this.cashclick, this, 2,1,0);
        }else{
            this.cashButton = this.add.button(3, this.world.height - 230, 'cash', this.cashclick, this, 2,1,0);
        }
        // this.cashButton.onInputOver.add(over, this);
        // this.cashButton.onInputOut.add(out, this);
        // this.cashButton.onInputUp.add(up, this);
        //------------------------------- back, music button -----------------------------        
        this.backButton = this.add.button(10, this.world.height - 10, 'back', this.startGame, this, 1,0,2);
        this.backButton.scale.setTo(0.4,0.4);
        this.backButton.anchor.setTo(0,1);

        this.musicButton = this.add.button(170, this.world.height - 70, 'musicbutton', this.changemusic, this, 1,0,2);
        this.musicButton.scale.setTo(0.4,0.4);
        this.musicButton.anchor.setTo(1,1);
       
        
        if(firstPlay == true){
            firstPlay = false;
            bomb_counter = 1;
        }

        if(bomb_counter == 1){
            this.bomb_1_btn = this.add.button(400-10, this.world.height - 300, 'bom-1', this.bomb_1_clicking, this);
        }else{
            this.bomb_1_btn = this.add.button(400-10, this.world.height - 300, 'bom-1-a', this.bomb_1_clicking, this);
        }

        if(bomb_counter == 3){
            this.bomb_2_btn = this.add.button(460-10, this.world.height - 300, 'bom-2', this.bomb_2_clicking, this);
        }else{
            this.bomb_2_btn = this.add.button(460-10, this.world.height - 300, 'bom-2-a', this.bomb_2_clicking, this);
        }

        if(bomb_counter == 5){
            this.bomb_3_btn = this.add.button(520-10, this.world.height - 300, 'bom-3', this.bomb_3_clicking, this);
        }else{
            this.bomb_3_btn = this.add.button(520-10, this.world.height - 300, 'bom-3-a', this.bomb_3_clicking, this);
        }
        
        if(bomb_counter == 24){
            this.bomb_4_btn = this.add.button(580-10, this.world.height - 300, 'bom-4', this.bomb_4_clicking, this);            
        }else{
            this.bomb_4_btn = this.add.button(580-10, this.world.height - 300, 'bom-4-a', this.bomb_4_clicking, this);            
        }

        //-------------------------------- Animation effect when clicking cells ----------------------
        this.physics.startSystem(Phaser.Physics.ARCADE);
        emitter = this.add.emitter(0, 0, 100);

        emitter.makeParticles('diamond');
        emitter.gravity = 900;
       
    },

    // up: function(){
    //     this.cashButton.
    // }


    bomb_1_clicking: function (pointer) {

        temp_counter = 1;
        // console.log("bomb_1_clicking");
        this.add.sprite(400-10, this.world.height - 300,'bom-1');
        this.add.sprite(460-10, this.world.height - 300,'bom-2-a');
        this.add.sprite(520-10, this.world.height - 300,'bom-3-a');
        this.add.sprite(580-10, this.world.height - 300,'bom-4-a');
    },

    bomb_2_clicking: function (pointer) {

        temp_counter = 3;

        this.add.sprite(400-10, this.world.height - 300,'bom-1-a');
        this.add.sprite(460-10, this.world.height - 300,'bom-2');
        this.add.sprite(520-10, this.world.height - 300,'bom-3-a');
        this.add.sprite(580-10, this.world.height - 300,'bom-4-a');
    },

    bomb_3_clicking: function (pointer) {

        temp_counter = 5;

        this.add.sprite(400-10, this.world.height - 300,'bom-1-a');
        this.add.sprite(460-10, this.world.height - 300,'bom-2-a');
        this.add.sprite(520-10, this.world.height - 300,'bom-3');
        this.add.sprite(580-10, this.world.height - 300,'bom-4-a');
    },

    bomb_4_clicking: function (pointer) {

        temp_counter = 24;

        this.add.sprite(400-10, this.world.height - 300,'bom-1-a');
        this.add.sprite(460-10, this.world.height - 300,'bom-2-a');
        this.add.sprite(520-10, this.world.height - 300,'bom-3-a');
        this.add.sprite(580-10, this.world.height - 300,'bom-4');
    },


    cashclick: function (pointer) {

        // When we press the button "Cash Out" .....
        if(isPlay == true){

            //-----------------------fade animation effect------------------------

            sprite2 = this.add.sprite(game.world.centerX, game.world.centerY - 100, 'success');

            sprite2.anchor.setTo(0.5, 0.5);
            sprite2.alpha = 0;

            this.add.tween(sprite2).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

            isPlay = false;
            Client.askEnd();
            this.cashButton = this.add.button(3, this.world.height - 230, 'button', this.cashclick, this, 2,1,0);
            return;
        }

        // When we press the button "Play" .....
        if(isPlay == false){

            bet_amount = isValid(bet_number1.value);

            bomb_counter = temp_counter;

            if(bet_amount == 0){                
                bomb_location_value.fill = '#ff0000';
                bomb_location_value.setText("you check bet number?");
                return;
            }

            if(bet_amount == -1 && firstPlay == false){
                bet_amount = g_bet;
            }

            Client.askBetEnable(bet_amount, bomb_counter, g_bet, firstPlay);

        }
    },

    changemusic : function(){
        if(playmusic==true){
            this.music.stop();
            playmusic = false;
        }
        else{
            this.music.play();
            playmusic = true;
        }
    },

    startGame: function (pointer) {

        this.music.stop();
        this.state.start('MainMenu');

    },

    updateScore : function(){
        this.totaltime++;
        this.timetext.setText(this.totaltime.toString());
        this.timetext.x = this.world.centerX - this.timetext.textWidth/2;
    },

    openShape : function(a,pointer){

        if(isPlay == false) return;

        Client.askClick(a.no);                    
        
    },

    placeBoxes : function(type){
        this.shapes.length = 0;
        this.shapeindex = 0;
        this.solution.length = 0;

        switch(type){
            case '5x5':   
                for(var i=0;i<5;i++){
                    for(var j=0;j<5;j++){
                        this.shapes[this.shapeindex] = this.add.sprite(this.world.centerX-240+120*j,this.world.centerY-360+120*i,'spriteset');
                        this.shapes[this.shapeindex].frameName = 'covershape.png';
                        this.shapes[this.shapeindex].anchor.setTo(0.5,0.5);
                        this.shapeindex++;                        
                    }
                }
                console.log("--------------------------------------");
                break;
            default     :   break;
        }

        for(var i=0;i<this.shapes.length;i++){
            this.shapes[i].frameName = 'covershape.png';
            // this.shapes[i].scale.setTo(0.5,0.5);
            this.shapes[i].anchor.setTo(0.5,0.5);
            this.shapes[i].no = i;

            // ******** name property represents the value of whether it is bomb or no.
            this.shapes[i].name = Math.floor(Math.random() + 1);
            this.shapes[i].inputEnabled = true;

            // the method for mouse clicking-----------------------------------------------------

            this.shapes[i].events.onInputDown.add(this.openShape, this);

            this.shapes[i].alpha = 0;
            this.add.tween(this.shapes[i]).to({alpha:1}, 10, Phaser.Easing.Sinusoidal.Out, true);

        }
    },

    getBetEnable : function(isBetEnable){
        if(isBetEnable < 0){
            bomb_location_value.fill = '#ff0000';
            bomb_location_value.setText("you check bet number?");
            return;
        }
        bomb_location_value.fill = '#ffffff';
        bomb_location_value.setText("");
        isPlay = true;
        this.cashButton = this.add.button(3, this.world.height - 230, 'cash', this.cashclick, this, 2,1,0);
        Client.askNewState(isBetEnable, bomb_counter);
    },

    getNewState : function(state1, next_bonus, stake, bet_cnt){        
        
        str_hash = state1;
        g_stake = stake;
        g_next_bonus = next_bonus;
        g_bet = bet_cnt;        
      //  sprite2.destroy();
        this.state.start('Game', bomb_counter);
    },

    endState : function(state){
        str_secret = state;
//        console.log(str_secret);
        hash_value.anchor.setTo(0, 0);

        var len = str_hash.length/2;
        var res = str_hash.substring(0, len) + '\n' + str_hash.substring(len);

        hash_value.setText(res); 
        bomb_location_value.anchor.setTo(0, 0);
        bomb_location_value.setText(str_secret);

        //----------------------- failure animation effect-------------


        bet_number1 = this.add.inputField(410, 15, {
            font: '35px gothic',
            fill: '#00ff00',
            backgroundColor: '#000000',
            width: 180,
            borderWidth:1,
            borderColor:'#ffffff',//'#4caf50',
            placeHolder:' ' + g_bet,
        });

//        console.log("EXIT : " + bet_number1.value);// = g_bet;*/
        //bet_number1.placeHolder = g_bet;
    },

    click : function(isEnable, isBomb, next_bonus, stake, no){

        if(isEnable == 0) return;
//        console.log(isBomb + " " + next_bonus + " " + stake + " " + no);
        profit = stake;
        next = next_bonus;

        
        pay_value.anchor.setTo(0, 0);
        pay_value.setText(next);

        stake_value.anchor.setTo(0, 0);
        stake_value.setText(profit);           

        var cur_cell = this.shapes[no];


        emitter.x = cur_cell.x;
        emitter.y = cur_cell.y;
        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        emitter.start(true, 4000, null, 10);


        this.blipsound.play();
        this.totalclicks++;
        var win = false;
        var out_tween = this.add.tween(cur_cell).to({alpha:0}, 100, Phaser.Easing.Sinusoidal.Out, true);

        show_next += 1000;

        var in_tween = function(){

            if (isBomb == 0) {
                cur_cell.frameName = 'shape'+2+'.png';
            }else{
                cur_cell.frameName = 'shape'+1+'.png';
            }

            //---------------------------- checking whether bomb or no ----------------------------
            if(isBomb == 1){
                
                var emitter1 = this.add.emitter(cur_cell.x, cur_cell.y, 50);
                emitter1.makeParticles('balls', [0, 1, 2, 3, 4, 5]);

                pay_value.anchor.setTo(0, 0);
                pay_value.setText(0);

                stake_value.anchor.setTo(0, 0);
                stake_value.setText(0);                   

                emitter1.minParticleSpeed.setTo(-70, -100);
                emitter1.maxParticleSpeed.setTo(100, 70);
                emitter1.gravity = -20;
                emitter1.start(false, 800, 1);
                //Game over if bomb is appeared
                isPlay = false;

                sprite1 = this.add.sprite(game.world.centerX, game.world.centerY - 100, 'failure');

                sprite1.anchor.setTo(0.5, 0.5);
                sprite1.alpha = 0;

                this.add.tween(sprite1).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

                Client.askEnd();
                this.cashButton = this.add.button(3, this.world.height - 230, 'button', this.cashclick, this, 2,1,0);
                // this.placeBoxes('5x5');
            }

            //--------------------------- Routing for showing pay value-----------------------------               

            this.add.tween(cur_cell).to({alpha:1}, 10, Phaser.Easing.Sinusoidal.In, true);

        }
        out_tween.onComplete.add(in_tween,this);

    } 
};
