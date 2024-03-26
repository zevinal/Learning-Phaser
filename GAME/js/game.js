var BootScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize:

	function BootScene ()
	{
		Phaser.Scene.call(this, { key: 'BootScene' });
	},

	preload: function ()
	{
		// Load resources
		
		// Map Tiles
		this.load.image('tiles', 'assets/map/spritesheet.png');

		// JSON map
		this.load.tilemapTiledJSON('map', 'assets/map/map.json');

		// Characters
		this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });

		// Enemies
		this.load.image('dragonblue', 'assets/dragonblue.png');
        this.load.image('dragonorange', 'assets/dragonorange.png');
	},

	create: function ()
	{
		this.scene.start('WorldScene');
	}
});

var BattleScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function BattleScene ()
	{
		Phaser.Scene.call(this, { key: 'BattleScene' });
	},
	create: function ()
	{
		// Set the scene background
		this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
		// Run the UI scene
		this.scene.run('UIScene');
		var timeEvent = this.time.addEvent({delay: 2000, callback: this.exitBattle, callbackScope: this});
		this.sys.events.on('wake', this.wake, this);
	},
	exitBattle: function ()
	{
		this.scene.sleep('UIScene');
		this.scene.switch('WorldScene');
	},
	wake: function ()
	{
		this.scene.run('UIScene');
		this.time.addEvent({delay: 2000, callback: this.exitBattle, callbackScope: this});
	}
});

var UIScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function UIScene ()
	{
		Phaser.Scene.call(this, { key: 'UIScene' });
	},
	create: function ()
	{
		this.graphics = this.add.graphics();
		this.graphics.lineStyle(1, 0xffffff);
		this.graphics.fillStyle(0x031f4c, 1);
		this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);
	}
});

var WorldScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function WorldScene ()
	{
		Phaser.Scene.call(this, { key: 'WorldScene' });
	},

	preload: function ()
	{

	},

	create: function ()
	{
		// Create world
		var map = this.make.tilemap({ key: 'map' });
		
		var tiles = map.addTilesetImage('spritesheet', 'tiles');

		var grass = map.createLayer('Grass', tiles, 0, 0);
        var obstacles = map.createLayer('Obstacles', tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);

		// Create player character
		this.player = this.physics.add.sprite(50, 100, 'player', 0)

		// Apply physics boundaries
		this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
		this.physics.add.collider(this.player, obstacles);

		// Process user input
		this.cursors = this.input.keyboard.createCursorKeys();

		// Camera follow
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.roundPixels = true;

		// Player character animations
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('player', { frames: [0, 6, 0, 12]}),
			frameRate: 10,
			repeat: -1
		});

		// // Enemy battle zones
		this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
		for(var i = 0; i < 30; i++) {
			var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
			
		// 	// Parameters x, y, width, height
			this.spawns.create(x, y, 20, 20);
		}

		// // If the player character enters a battle zone, a battle will initiate
		this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
	},

	update: function (time, delta)
	{
		this.player.body.setVelocity(0);

		//  Horizontal movement
		if (this.cursors.left.isDown)
		{
			this.player.body.setVelocityX(-80);
			this.player.anims.play('left', true);
			this.player.flipX=true;
		}
		else if (this.cursors.right.isDown)
		{
			this.player.body.setVelocityX(80);
			this.player.anims.play('right', true);
			this.player.flipX=false;
		}

		// Vertical movement
		else if (this.cursors.up.isDown)
		{
			this.player.body.setVelocityY(-80);
			this.player.anims.play('up', true);
		}
		else if (this.cursors.down.isDown)
		{
			this.player.body.setVelocityY(80);
			this.player.anims.play('down', true);
		}
		else {
			this.player.anims.stop();
		}
	},

	onMeetEnemy: function(player, zone) {
		// Move the zone to another randomised location
		zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
		zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

		// Start the battle
		this.cameras.main.shake(300);
		this.scene.switch('BattleScene');
	}
});

var config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 320,
	height: 240,
	zoom: 2,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [
		BootScene,
		WorldScene,
		BattleScene,
		UIScene
	]
};
var game = new Phaser.Game(config);