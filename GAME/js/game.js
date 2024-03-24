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
	},

	create: function ()
	{
		this.scene.start('WorldScene');
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

		var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);

		// Create player character
		this.player = this.physics.add.sprite(50, 100, 'player', 6)

		// Apply physics boundaries
		this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

		// Process user input
		this.cursors = this.input.keyboard.createCursorKeys();

		// Camera follow
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.roundPixels = true;
	},

	update: function (time, delta)
	{
		this.player.body.setVelocity(0);

		//  Horizontal movement
		if (this.cursors.left.isDown)
		{
			this.player.body.setVelocityX(-80);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.body.setVelocityX(80);
		}

		// Vertical movement
		if (this.cursors.up.isDown)
		{
			this.player.body.setVelocityY(-80);
		}
		else if (this.cursors.down.isDown)
		{
			this.player.body.setVelocityY(80);
		}
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
			gravity: { y: 0 }
		}
	},
	scene: [
		BootScene,
		WorldScene
	]
};
var game = new Phaser.Game(config);