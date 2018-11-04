
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		
		this.bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
		this.bck.anchor.setTo(0.5,0.5);
		this.bck.scale.setTo(0.5,0.5);
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0,0.5);
		this.preloadBar.scale.setTo(0.5,1);
		this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;
		
		
		this.load.setPreloadSprite(this.preloadBar);

		//------------------------Bomb_counter_icon-----------------------
		this.load.image('bom-1-a','assets/1-a.png');
		this.load.image('bom-2-a','assets/3-a.png');
		this.load.image('bom-3-a','assets/5-a.png');
		this.load.image('bom-4-a','assets/24-a.png');	
		this.load.image('bom-1','assets/bomb-1.png');
		this.load.image('bom-2','assets/bomb-2.png');
		this.load.image('bom-3','assets/bomb-3.png');
		this.load.image('bom-4','assets/bomb-4.png');	

		this.load.image('success','assets/success.png');	
		this.load.image('failure','assets/failure.png');	

		this.load.image('diamond','assets/fire1.png');	

		this.load.image('gray_back','assets/gray1.png');
		this.load.image('current_situation','assets/cur_situation.png');
		// this.load.image('cash','assets/cash3.png');

		this.load.image('title', 'assets/title9.png');
		this.load.atlas('spriteset', 'assets/ic.png', 'assets/spritesheet.jsona');

		this.load.spritesheet('button', 'assets/play_gray.png', 630, 100);
		this.load.spritesheet('cash', 'assets/cash_out.png', 630, 100);
		this.load.spritesheet('ani_title1', 'assets/ani_title1.png', 50, 93);
		this.load.spritesheet('made_mine', 'assets/made_mine.png', 50, 90);		
		this.load.spritesheet('balls', 'assets/exp.png', 64, 64);	
		this.load.spritesheet('play','assets/gray_play_button.png',400,110);
		this.load.spritesheet('back','assets/BAC.png',400,110);
		this.load.spritesheet('musicbutton','assets/music1.png',400,110);
		this.load.bitmapFont('font', 'assets/fnt2_0.png', 'assets/fnt2.fnt');
		this.load.audio('music', ['assets/bensound-cute.mp3','assets/bensound-cute.wav','assets/bensound-cute.m4a']);
		this.load.audio('blip', ['assets/coin_falling.mp3','assets/coin_falling.wav','assets/coin_falling.m4a']);
		this.game.plugins.add(Fabrique.Plugins.InputField);	

	},

	create: function () {

		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		
		
		if (this.cache.isSoundDecoded('music') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
