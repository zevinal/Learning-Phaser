var BootScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialise:

	function BootScene ()
	{
		Phaser.Scene.call(this, { key: 'BootScene' });
	},

	preload: function ()
	{
		// Load resources
	},

	create: function ()
	{
		this.scene.start('WorldScene');
	}
});

var WorldScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialise:

	function WorldScene ()
	{
		Phaser.Scene.call(this, { key: 'WorldScene' });
	},
	preload: function ()
	{
		// Create world
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
	scene: {
		BootScene,
		WorldScene
	}
};
var game = new Phaser.Game(config);