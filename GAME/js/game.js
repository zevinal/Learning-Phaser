// Create a new scene
let gameScene = new Phaser.Scene('Game');

// Set config
let config = {
    type: Phaser.AUTO, // This setting will auto-detect if the browser is capable of suppporting WebGL. If it is, it will use the WebGL Renderer. If not, it will fall back to the Canvas Renderer.
    width: 640,
    height: 360,
    scene: gameScene
};

// Create new game
let game = new Phaser.Game(config);