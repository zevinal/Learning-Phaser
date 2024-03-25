var Unit = new Phaser.Class({
	Extends: Phaser.GameObjects.Sprite,

	initialize:

	function Unit(scene, x, y, texture, frame, type, hp, damage) {
		Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
		this.type = type;
		this.maxHp = this.hp = hp;
		// Default damage
		this.damage = damage;
	},
	attack: function(target) {
		target.takeDamage(this.damage);
	},
	takeDamage: function(damage) {
		this.hp -= damage;
	}
});
var Enemy = new Phaser.Class({
	Extends: Unit,

	initialize:
	function Enemy(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
	}
});
var PlayerCharacter = new Phaser.Class({
	Extends: Unit,

	initialize:
	function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
		Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
		this.flipX = true;
		this.setScale(2);
	}
});
// Menu selector
var MenuItem = new Phaser.Class({
	Extends: Phaser.GameObjects.Text,

	initialize:

	function MenuItem(x, y, text, scene) {
		Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', frontSize: 15});
	},

	select: function() {
		this.setColor('#f8ff38');
	},

	deselect: function() {
		this.setColor('#ffffff');
	}
	
});
// Menu creation
var Menu = new Phaser.Class({
	Extends: Phaser.GameObjects.Container,

	initialize:

	function Menu(x, y, scene, heroes) {
		Phaser.GameObjects.Container.call(this, scene, x, y);
		this.menuItems = [];
		this.menuItemIndex = 0;
		this.heroes = heroes;
		this.x = x;
		this.y = y;
	},
	addMenuItem: function(unit) {
		var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
		this.menuItems.push(menuItem);
		this.add(menuItem);
	},
	moveSelectionUp: function() {
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex--;
		if(this.menuItem < 0)
		this.menuItemIndex = this.menuItems.length - 1;
	this.menuItems[this.menuItemIndex].select();
	},
	moveSelectionDown: function() {
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex++;
		if(this.menuItemIndex >= this.menuItems.length)
		this.menuItemIndex = 0;
	this.menuItems[this.menuItemIndex].select();
	},
	// Select a menu
	select: function(index) {
		if(!index)
		index = 0;
	this.menuItems[this.menuItemIndex].deselect();
	this.menuItemIndex = index;
	this.menuItems[this.menuItemIndex].select();
	},
	// Deselect the menu
	deselect: function() {
		this.menuItems[this.menuItemIndex].deselect();
		this.menuItemIndex = 0;
	},
	confirm: function() {
		// Menu select confirmation
	},
	// Function to clear all the menu items
	clear: function() {
		for(var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].destroy();
		}
		this.menuItems.length = 0;
		this.menuItemIndex = 0;
	},
	// Function to add menu items
	remap: function(units) {
		this.clear();
		for(var i = 0; i < units.length; i++) {
			var unit = units[i];
			this.addMenuItem(unit.type);
		}
	}
})
// Menu for the player character
var HeroesMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

	function HeroesMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
	}
});
// Menu for actions
var ActionsMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

	function ActionsMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
		this.addMenuItem('Attack');
	},
	confirm: function() {
		// Action select confirmation
		this.scene.events.emit('SelectEnemies');
	}
});
// Menu for enemy selection
var EnemiesMenu = new Phaser.Class({
	Extends: Menu,

	initialize:

	function EnemiesMenu(x, y, scene) {
		Menu.call(this, x, y, scene);
	},
	confirm: function() {
		// Enemy select confirmation
		this.scene.events.emit('Enemy', this.menuItemIndex);
	}
})
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
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('dragonblue', 'assets/dragonblue.png');
        this.load.image('dragonorange', 'assets/dragonorange.png');
    },
    create: function ()
    {
        this.scene.start('BattleScene');
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
		this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
		
		// Player character - Warrior
		var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, 'Warrior', 100, 20);
		this.add.existing(warrior);

		// Player character - Mage
		var mage = new PlayerCharacter(this, 250, 100, 'player', 4, 'Mage', 80, 8);
		this.add.existing(mage);

		// Enemies
		var dragonBlue = new Enemy(this, 50, 50, 'dragonblue', null, 'Dragon', 50, 3);
		this.add.existing(dragonBlue);
		var dragonOrange = new Enemy(this, 50, 100, 'dragonorange', null, 'Dragon2', 50, 3);
		this.add.existing(dragonOrange);

		// Heroes array
		this.heroes = [ warrior, mage ];
		
		// Enemies array
		this.enemies = [ dragonBlue, dragonOrange ];

		// Party array
		this.units = this.heroes.concat(this.enemies);

		// Run UI Scene at the same time
		this.scene.launch('UIScene');

		// Turn order
		this.index = -1;
    },
	// Function for turn order
	nextTurn: function() {
		this.index++;
		// Cycle back to the top of turn orde
		if(this.index >= this.units.length) {
			this.index = 0;
		}
		if(this.units[this.index]) {
			// If it's the players turn
			if(this.units[this.index] instanceof PlayerCharacter) {
				this.events.emit('PlayerSelect', this.index);
			} else {
				// If it's the enemies turn, attack a random hero
				var r = Math.floor(Math.random() * this.heroes.length);
				// Call the enemy attack function
				this.units[this.index].attack(this.heroes[r]);
				// Add turn timer
				this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
			}
		}
	},
	// Add player input
	receivePlayerSelection: function(action, target) {
		if(action == 'attack') {
			this.units[this.index].attack(this.enemies[target]);
		}
		this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
	},
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
		// Menu container
		this.menus = this.add.container();
		this.heroesMenu = new HeroesMenu(195, 153, this);
		this.actionsMenu = new ActionsMenu(100, 153, this);
		this.enemiesMenu = new EnemiesMenu(8, 153, this);
		// Currently selected menu
		this.currentMenu = this.actionsMenu;
		// Populate container
		this.menus.add(this.heroesMenu);
		this.menus.add(this.actionsMenu);
		this.menus.add(this.enemiesMenu);
		// Access the Battle Scene
		this.battleScene = this.scene.get('BattleScene');
		this.remapHeroes();
		this.remapEnemies();
		// Add user input to the menus
		this.input.keyboard.on('keydown', this.onKeyInput, this);
		// Listen for player's turn
		this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);
		// Confirm enemy selection
		this.events.on('SelectEnemies', this.onSelectEnemies, this);
		this.events.on('Enemy', this.onEnemy, this);
		// Load the first turn
		this.battleScene.nextTurn();
    },
	// Functions to populate the heroes and enemy menus
	remapHeroes: function() {
		var heroes = this.battleScene.heroes;
		this.heroesMenu.remap(heroes);
	},
	remapEnemies: function() {
		var enemies = this.battleScene.enemies;
		this.enemiesMenu.remap(enemies);
	},
	// Function for keyboard inputs
	onKeyInput: function(event) {
		if(this.currentMenu) {
			if(event.code === 'ArrowUp') {
				this.currentMenu.moveSelectionUp();
			} else if(event.code === 'ArrowDown') {
				this.currentMenu.moveSelectionDown();
			} else if(event.code === 'ArrowRight' || event.code === 'Shift') {

			} else if(event.code === 'Space' || event.code === 'ArrowLeft') {
				this.currentMenu.confirm();
			}
		}
	},
	// Player select function
	onPlayerSelect: function(id) {
		this.heroesMenu.select(id);
		this.actionsMenu.select(0);
		this.currentMenu = this.actionsMenu;
	},
	// Function to select enemies
	onSelectEnemies: function() {
		// Activate enemies menu
		this.currentMenu = this.enemiesMenu;
		// Select the first enemy
		this.enemiesMenu.select(0);
	},
	// Send attack data to battle scene
	onEnemy: function(index) {
		this.heroesMenu.deselect();
		this.actionsMenu.deselect();
		this.enemiesMenu.deselect();
		this.currentMenu = null;
		this.battleScene.receivePlayerSelection('attack', index);
	},
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
    scene: [ BootScene, BattleScene, UIScene ]
};
var game = new Phaser.Game(config);