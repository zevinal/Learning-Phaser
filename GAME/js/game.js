// Create a new scene
let gameScene = new Phaser.Scene('Game');

// Load assets
gameScene.preload = function(){
    //Load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('dragon', 'assets/dragon.png');
    this.load.image('loot', 'assets/treasure.png');
}

// Create assets
gameScene.create = function(){
    // Create background sprite
    let background = this.add.sprite(320, 180, 'background');

    // Create PC sprite
    let player = this.add.sprite(320, 180, 'player');

    // Creating enemies
    let enemy1 = this.add.sprite(150, 220, 'dragon');
    let enemy2 = this.add.sprite(490, 220, 'dragon');
    enemy2.flipX = true;

    // Creating the loot
    let loot1 = this.add.sprite(130, 250, 'loot');
    let loot2 = this.add.sprite(510, 250, 'loot');
    loot2.flipX = true;
    loot1.scale = 0.5;
    loot2.scale = 0.5;
    loot1.angle = -20;
    loot2.angle = 20;

    // Organising depths
    background.depth = -9999;
    player.depth = 9999;
}

// Set config
let config = {
    type: Phaser.AUTO, // This setting will auto-detect if the browser is capable of suppporting WebGL. If it is, it will use the WebGL Renderer. If not, it will fall back to the Canvas Renderer.
    width: 640,
    height: 360,
    scene: gameScene
};

// Create new game
let game = new Phaser.Game(config);