
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		this.add.sprite(0,0,'gray_back');
		this.music = this.add.audio('music',1,true);
		if(playmusic==true){
			this.music.play('',0,1,true);
		}
		score = 0;
		clicks = 0;

		//--------------------------------- Tile in first page ----------------------------------
		// this.titleimage = this.add.sprite(this.world.centerX,190, 'title');
		// this.titleimage.anchor.setTo(0.5,0.5);
		// this.titleimage.scale.setTo(0.5,0.5);
	    var item;

	    for (var i = 0; i < 7; i++)
	    {
	        item = this.add.sprite(170 + 50 * i, -100, 'ani_title1', i);
	        item.anchor.setTo(0.5,0.5);

	        // Add a simple bounce tween to each character's position.
	        this.add.tween(item).to({y: 240}, 400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, 0);

	        // Add another rotation tween to the same character.
	        // this.add.tween(item).to({angle: 360}, 400, Phaser.Easing.Cubic.In, true, 1000 + 400 * i, 0);
	    }

	    var item1;

	    for (var i = 0; i < 8; i++)
	    {
	        item1 = this.add.sprite(150 + 50 * i, -100, 'made_mine', i);
	        item1.anchor.setTo(0.5,0.5);

	        // Add a simple bounce tween to each character's position.
	        this.add.tween(item1).to({y: 320}, 400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, 0);

	        // Add another rotation tween to the same character.
	        // this.add.tween(item1).to({angle: 360}, 400, Phaser.Easing.Cubic.In, true, 1000 + 400 * i, 0);
	    }


		//---------------------------------- Play button in first page --------------------------
		this.playButton = this.add.button(this.world.centerX, this.world.height - 150, 'play', this.startGame, this, 1,0,2);
		this.playButton.scale.setTo(0.5,0.5);
		this.playButton.anchor.setTo(0.5,0.5);

		//---------------------------------- Music button in first page -------------------------
		this.musicButton = this.add.button(this.world.centerX, this.world.height - 25, 'musicbutton', this.changemusic, this, 1,0,2);
        this.musicButton.scale.setTo(0.5,0.5);
        this.musicButton.anchor.setTo(0.5,1);

        //---------------------------------- Animation effect in first page ---------------------
		this.shapes1 = this.add.sprite(this.world.centerX,this.world.centerY+10,'spriteset');
		this.shapes1.frameName = 'shape1.png';
		this.shapes1.anchor.setTo(0.5,0.5);
		this.shapes1.alpha = 0;
		// this.shapes2 = this.add.sprite(this.world.centerX+80,this.world.centerY+10,'spriteset');
		// this.shapes2.frameName = 'shape2.png';
		// this.shapes2.anchor.setTo(0.5,0.5);

		this.frameNo = 1;
		this.shapetween = this.add.tween(this.shapes1).to({ alpha: 1 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);
		//this.frameSwitch = this.time.events.loop(150, this.updateFrame, this);

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

	updateFrame : function(){
		this.frameNo = this.rnd.integerInRange(1,6);
		this.shapes1.frameName = 'shape'+this.frameNo+'.png';
		// this.frameNo = this.rnd.integerInRange(1,6);
		// this.shapes2.frameName = 'shape'+this.frameNo+'.png';

	},

	update: function () {

		if(this.shapes1.alpha==0){
			this.updateFrame();
		}
	 	//this.shapes1.angle++;		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		firstPlay = true;
		this.music.stop();

		this.state.start('Game', 1);

	}

};

BasicGame.EndScreen = function (game) {

};


BasicGame.EndScreen.prototype = {

	create: function () {

		this.music = this.add.audio('music',1,true);
		if(playmusic==true){
			this.music.play('',0,1,true);
		}
		this.scoretext = this.add.bitmapText(this.world.centerX,40,'font','Y O U   T O O K',30);
		this.scoretext.x = this.world.centerX - this.scoretext.textWidth/2;
		this.timetext = this.add.bitmapText(this.world.centerX,100,'font',score+'  S E C O N D S',30);
		this.timetext.x = this.world.centerX - this.timetext.textWidth/2;

		this.clicktext = this.add.bitmapText(this.world.centerX,160,'font','A N D  C L I C K E D',30);
		this.clicktext.x = this.world.centerX - this.clicktext.textWidth/2;
		this.totalclickstext = this.add.bitmapText(this.world.centerX,220,'font',clicks+'  T I M E S',30);
		this.totalclickstext.x = this.world.centerX - this.totalclickstext.textWidth/2;

		this.backButton = this.add.button(10, this.world.height - 5, 'back', this.startGame, this, 1,0,2);
        this.backButton.scale.setTo(0.4,0.4);
        this.backButton.anchor.setTo(0,1);

        this.musicButton = this.add.button(this.world.width-10, this.world.height - 5, 'musicbutton', this.changemusic, this, 1,0,2);
        this.musicButton.scale.setTo(0.4,0.4);
        this.musicButton.anchor.setTo(1,1);
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

    }
}